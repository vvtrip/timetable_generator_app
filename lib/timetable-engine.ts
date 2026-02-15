import type { Course, Venue, ScheduledEntry, GeneratedTimetable, Day } from "./data"
import { DAYS, TIME_SLOTS } from "./data"

// Valid day pairs with at least 1 day gap
const VALID_DAY_PAIRS: [Day, Day][] = [
  ["Mon", "Wed"],
  ["Mon", "Thu"],
  ["Mon", "Fri"],
  ["Tue", "Thu"],
  ["Tue", "Fri"],
  ["Wed", "Fri"],
]

// Shuffle array (Fisher-Yates)
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

interface SlotOccupancy {
  venueId: string
  courseId: string
}

export function generateTimetable(
  courses: Course[],
  venues: Venue[],
): GeneratedTimetable {
  const entries: ScheduledEntry[] = []
  const unscheduled: string[] = []

  // Track occupancy: day -> slotId -> list of occupancies
  const occupancy: Record<string, Record<string, SlotOccupancy[]>> = {}
  for (const day of DAYS) {
    occupancy[day] = {}
    for (const slot of TIME_SLOTS) {
      occupancy[day][slot.id] = []
    }
  }

  // Track instructor assignments: instructor -> set of (day+slotId)
  const instructorSlots: Record<string, Set<string>> = {}

  // Track per-slot load across all days for global balancing
  const slotLoad: Record<string, number> = {}
  for (const slot of TIME_SLOTS) {
    slotLoad[slot.id] = 0
  }

  // Track per day-slot load for fine-grained balancing
  const daySlotLoad: Record<string, number> = {}
  for (const day of DAYS) {
    for (const slot of TIME_SLOTS) {
      daySlotLoad[`${day}_${slot.id}`] = 0
    }
  }

  // Separate classrooms and labs
  const classrooms = venues.filter((v) => !v.isLab)
  const labs = venues.filter((v) => v.isLab)

  // Sort courses: 4-credit first (need 2 slots), then 2-credit (need 1 slot)
  // Prioritize courses with labs, then evening, then by credits
  const sortedCourses = shuffle([...courses]).sort((a, b) => {
    if (a.hasLab && !b.hasLab) return -1
    if (!a.hasLab && b.hasLab) return 1
    if (a.isSeminar && !b.isSeminar) return -1
    if (!a.isSeminar && b.isSeminar) return 1
    return b.credits - a.credits
  })

  function isVenueAvailable(
    venueId: string,
    day: string,
    slotId: string,
  ): boolean {
    return !occupancy[day][slotId].some((o) => o.venueId === venueId)
  }

  function isInstructorAvailable(
    instructor: string,
    day: string,
    slotId: string,
  ): boolean {
    const key = `${day}_${slotId}`
    return !instructorSlots[instructor]?.has(key)
  }

  function assignSlot(
    courseId: string,
    venueId: string,
    day: string,
    slotId: string,
    instructor: string,
    type: "lecture" | "lab" | "tutorial" | "seminar",
  ) {
    occupancy[day][slotId].push({ venueId, courseId })
    if (!instructorSlots[instructor]) {
      instructorSlots[instructor] = new Set()
    }
    instructorSlots[instructor].add(`${day}_${slotId}`)
    slotLoad[slotId]++
    daySlotLoad[`${day}_${slotId}`]++
    entries.push({ courseId, venueId, day, timeSlotId: slotId, type })
  }

  // Find the least loaded compatible slots for a course
  function getAvailableSlots(course: Course): string[] {
    if (course.isEvening) {
      return ["slot5"]
    }
    const regularSlots = ["slot1", "slot2", "slot3", "slot4"]
    // Sort by load (ascending) for balancing
    return [...regularSlots].sort((a, b) => slotLoad[a] - slotLoad[b])
  }

  // Sort day pairs by total load (prefer less loaded days)
  function getSortedDayPairs(): [Day, Day][] {
    const dayLoad: Record<string, number> = {}
    for (const day of DAYS) {
      dayLoad[day] = entries.filter((e) => e.day === day).length
    }
    return [...VALID_DAY_PAIRS].sort(
      (a, b) =>
        dayLoad[a[0]] + dayLoad[a[1]] - (dayLoad[b[0]] + dayLoad[b[1]]),
    )
  }

  for (const course of sortedCourses) {
    const sessionsNeeded = course.credits >= 4 ? 2 : 1
    let scheduled = false

    const availableSlotIds = getAvailableSlots(course)
    const dayPairs = getSortedDayPairs()

    if (sessionsNeeded === 2) {
      // Try to find a day pair with same time slot (preferred for consistency)
      for (const slotId of availableSlotIds) {
        if (scheduled) break
        for (const [day1, day2] of dayPairs) {
          if (scheduled) break
          if (
            !isInstructorAvailable(course.instructor, day1, slotId) ||
            !isInstructorAvailable(course.instructor, day2, slotId)
          ) {
            continue
          }

          const shuffledClassrooms = shuffle(classrooms)
          for (const venue of shuffledClassrooms) {
            if (
              isVenueAvailable(venue.id, day1, slotId) &&
              isVenueAvailable(venue.id, day2, slotId)
            ) {
              assignSlot(
                course.id,
                venue.id,
                day1,
                slotId,
                course.instructor,
                "lecture",
              )
              assignSlot(
                course.id,
                venue.id,
                day2,
                slotId,
                course.instructor,
                "lecture",
              )
              scheduled = true
              break
            }
          }
        }
      }

      // Fallback: try different slots for each day
      if (!scheduled) {
        for (const [day1, day2] of dayPairs) {
          if (scheduled) break
          for (const slotId1 of availableSlotIds) {
            if (scheduled) break
            if (!isInstructorAvailable(course.instructor, day1, slotId1))
              continue
            for (const slotId2 of availableSlotIds) {
              if (scheduled) break
              if (!isInstructorAvailable(course.instructor, day2, slotId2))
                continue

              const shuffledClassrooms = shuffle(classrooms)
              for (const venue of shuffledClassrooms) {
                if (
                  isVenueAvailable(venue.id, day1, slotId1) &&
                  isVenueAvailable(venue.id, day2, slotId2)
                ) {
                  assignSlot(
                    course.id,
                    venue.id,
                    day1,
                    slotId1,
                    course.instructor,
                    "lecture",
                  )
                  assignSlot(
                    course.id,
                    venue.id,
                    day2,
                    slotId2,
                    course.instructor,
                    "lecture",
                  )
                  scheduled = true
                  break
                }
              }
            }
          }
        }
      }
    } else {
      // 1 session (2-credit course)
      // Sort days by load for balancing
      const sortedDays = [...DAYS].sort(
        (a, b) =>
          entries.filter((e) => e.day === a).length -
          entries.filter((e) => e.day === b).length,
      )
      for (const slotId of availableSlotIds) {
        if (scheduled) break
        for (const day of sortedDays) {
          if (scheduled) break
          if (!isInstructorAvailable(course.instructor, day, slotId)) continue

          const shuffledClassrooms = shuffle(classrooms)
          for (const venue of shuffledClassrooms) {
            if (isVenueAvailable(venue.id, day, slotId)) {
              assignSlot(
                course.id,
                venue.id,
                day,
                slotId,
                course.instructor,
                "lecture",
              )
              scheduled = true
              break
            }
          }
        }
      }
    }

    // Schedule lab if needed
    if (scheduled && course.hasLab) {
      let labScheduled = false
      const courseDays = entries
        .filter((e) => e.courseId === course.id)
        .map((e) => e.day)

      // Try to schedule lab on a different day
      const labDays = shuffle(
        DAYS.filter((d) => !courseDays.includes(d)),
      )
      const labSlots = shuffle(["slot3", "slot4"]) // Afternoon preferred for labs

      for (const day of labDays) {
        if (labScheduled) break
        for (const slotId of labSlots) {
          if (labScheduled) break
          if (!isInstructorAvailable(course.instructor, day, slotId)) continue

          const shuffledLabs = shuffle(labs)
          for (const lab of shuffledLabs) {
            if (isVenueAvailable(lab.id, day, slotId)) {
              assignSlot(
                course.id,
                lab.id,
                day,
                slotId,
                course.instructor,
                "lab",
              )
              labScheduled = true
              break
            }
          }
        }
      }

      // Fallback: lab on same day as lecture
      if (!labScheduled) {
        for (const day of [...DAYS]) {
          if (labScheduled) break
          for (const slotId of labSlots) {
            if (labScheduled) break
            if (!isInstructorAvailable(course.instructor, day, slotId))
              continue
            const shuffledLabs = shuffle(labs)
            for (const lab of shuffledLabs) {
              if (isVenueAvailable(lab.id, day, slotId)) {
                assignSlot(
                  course.id,
                  lab.id,
                  day,
                  slotId,
                  course.instructor,
                  "lab",
                )
                labScheduled = true
                break
              }
            }
          }
        }
      }
    }

    // Schedule seminar slot
    if (scheduled && course.isSeminar) {
      let seminarScheduled = false
      const courseDays = entries
        .filter((e) => e.courseId === course.id)
        .map((e) => e.day)

      const semDays = shuffle(
        DAYS.filter((d) => !courseDays.includes(d)),
      )
      for (const day of semDays) {
        if (seminarScheduled) break
        const semSlot = "slot5"
        if (!isInstructorAvailable(course.instructor, day, semSlot)) continue
        const shuffledClassrooms = shuffle(classrooms)
        for (const venue of shuffledClassrooms) {
          if (isVenueAvailable(venue.id, day, semSlot)) {
            assignSlot(
              course.id,
              venue.id,
              day,
              semSlot,
              course.instructor,
              "seminar",
            )
            seminarScheduled = true
            break
          }
        }
      }
    }

    if (!scheduled) {
      unscheduled.push(course.id)
    }
  }

  return { entries, unscheduled }
}
