"use client"

import type { Course, Venue, ScheduledEntry } from "@/lib/data"
import { DAYS, TIME_SLOTS, DEPT_COLORS } from "@/lib/data"
import { MapPin, User, BookOpen, FlaskConical, Presentation, AlertTriangle, Clock } from "lucide-react"

interface TimetableGridProps {
  entries: ScheduledEntry[]
  courses: Course[]
  venues: Venue[]
  unscheduled: string[]
  semesterTitle: string
  semesterLabel: string
}

export default function TimetableGrid({
  entries,
  courses,
  venues,
  unscheduled,
  semesterTitle,
  semesterLabel,
}: TimetableGridProps) {
  const courseMap = new Map(courses.map((c) => [c.id, c]))
  const venueMap = new Map(venues.map((v) => [v.id, v]))

  function getEntries(day: string, slotId: string) {
    return entries.filter((e) => e.day === day && e.timeSlotId === slotId)
  }

  function getTypeLabel(type: string) {
    switch (type) {
      case "lab":
        return "LAB"
      case "tutorial":
        return "TUT"
      case "seminar":
        return "SEM"
      default:
        return ""
    }
  }

  // Compute stats per slot for balancing info
  const slotStats: Record<string, number> = {}
  for (const slot of TIME_SLOTS) {
    slotStats[slot.id] = entries.filter((e) => e.timeSlotId === slot.id).length
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Title */}
      <div className="rounded-lg border border-border bg-card p-4 text-center">
        <h2 className="text-balance text-base font-bold text-foreground">{semesterTitle}</h2>
        <p className="mt-1 text-xs text-muted-foreground">{semesterLabel} | Institute-Wide Timetable</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5">
        <span className="text-xs font-medium text-muted-foreground">Departments:</span>
        {Object.entries(DEPT_COLORS).map(([dept, colors]) => (
          <div key={dept} className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: colors.bg }} />
            <span className="text-xs text-foreground">{dept}</span>
          </div>
        ))}
        <span className="mx-1 text-border">|</span>
        <div className="flex items-center gap-1">
          <FlaskConical className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Lab</span>
        </div>
        <div className="flex items-center gap-1">
          <Presentation className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Seminar</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Evening</span>
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full border-collapse" style={{ minWidth: "1100px" }}>
          <thead>
            <tr>
              <th className="sticky left-0 z-10 border-b border-r border-border bg-primary px-4 py-3 text-left text-xs font-semibold text-primary-foreground" style={{ width: "70px" }}>
                Day
              </th>
              {TIME_SLOTS.map((slot) => (
                <th
                  key={slot.id}
                  className="border-b border-r border-border bg-primary px-2 py-3 text-center text-xs font-semibold text-primary-foreground last:border-r-0"
                >
                  <div>{slot.label}</div>
                  {slot.isEvening && <span className="text-[10px] font-normal opacity-75">(Evening)</span>}
                  <div className="mt-0.5 text-[10px] font-normal opacity-60">{slotStats[slot.id]} classes</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS.map((day, dayIdx) => (
              <tr key={day} className={dayIdx % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                <td className="sticky left-0 z-10 border-b border-r border-border px-4 py-2 text-sm font-bold text-foreground" style={{ backgroundColor: dayIdx % 2 === 0 ? "hsl(var(--card))" : "hsl(var(--muted) / 0.3)" }}>
                  <div className="flex flex-col">
                    <span>{day}</span>
                    <span className="text-[10px] font-normal text-muted-foreground">
                      {entries.filter((e) => e.day === day).length} classes
                    </span>
                  </div>
                </td>
                {TIME_SLOTS.map((slot) => {
                  const cellEntries = getEntries(day, slot.id)
                  return (
                    <td key={slot.id} className="border-b border-r border-border p-1 align-top last:border-r-0" style={{ minWidth: "200px" }}>
                      <div className="flex flex-col gap-1">
                        {cellEntries.length === 0 && (
                          <div className="flex h-16 items-center justify-center">
                            <span className="text-[10px] text-muted-foreground/30">--</span>
                          </div>
                        )}
                        {cellEntries.map((entry, i) => {
                          const course = courseMap.get(entry.courseId)
                          const venue = venueMap.get(entry.venueId)
                          if (!course) return null
                          const colors = DEPT_COLORS[course.department] || { bg: "#666", text: "#fff", border: "#555" }
                          const isLab = entry.type === "lab"
                          const isSeminar = entry.type === "seminar"
                          const isTut = entry.type === "tutorial"

                          return (
                            <div
                              key={`${entry.courseId}-${entry.venueId}-${i}`}
                              className="group/card relative rounded-md px-2 py-1.5 transition-shadow hover:shadow-md"
                              style={{
                                backgroundColor: isLab || isSeminar || isTut ? `${colors.bg}25` : colors.bg,
                                color: isLab || isSeminar || isTut ? colors.bg : colors.text,
                                borderLeft: `3px solid ${colors.bg}`,
                              }}
                            >
                              {/* Top row: Acronym + Type */}
                              <div className="flex items-start justify-between gap-1">
                                <span className="text-xs font-bold leading-tight">{course.acronym}</span>
                                <div className="flex items-center gap-0.5 shrink-0">
                                  {isLab && <FlaskConical className="h-2.5 w-2.5 opacity-70" />}
                                  {isSeminar && <Presentation className="h-2.5 w-2.5 opacity-70" />}
                                  {entry.type !== "lecture" && (
                                    <span className="text-[9px] font-semibold uppercase opacity-70">{getTypeLabel(entry.type)}</span>
                                  )}
                                </div>
                              </div>

                              {/* Venue info */}
                              {venue && (
                                <div className="mt-0.5 flex items-center gap-1">
                                  <MapPin className="h-2.5 w-2.5 shrink-0 opacity-60" />
                                  <span className="text-[10px] font-medium leading-tight opacity-85">{venue.room}</span>
                                  {venue.isLab && <span className="text-[8px] opacity-50">(Lab)</span>}
                                </div>
                              )}

                              {/* Hover tooltip */}
                              <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden w-56 -translate-x-1/2 rounded-lg border border-border bg-popover p-3 shadow-xl group-hover/card:block">
                                <div className="text-[11px] font-bold text-popover-foreground">{course.name}</div>
                                <div className="mt-1 font-mono text-[10px] text-muted-foreground">{course.code}</div>
                                <div className="mt-1.5 flex flex-col gap-1">
                                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                    <User className="h-2.5 w-2.5 shrink-0" />
                                    <span>{course.instructor}</span>
                                  </div>
                                  {venue && (
                                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                      <MapPin className="h-2.5 w-2.5 shrink-0" />
                                      <span>{venue.room} - {venue.building}, {venue.floor}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                    <BookOpen className="h-2.5 w-2.5 shrink-0" />
                                    <span>{course.credits} Credits | {course.ugPg}</span>
                                  </div>
                                </div>
                                {entry.type !== "lecture" && (
                                  <div className="mt-1.5 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase" style={{ backgroundColor: `${colors.bg}20`, color: colors.bg }}>
                                    {entry.type} session
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Unscheduled courses warning */}
      {unscheduled.length > 0 && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <h3 className="text-sm font-semibold text-destructive">Unscheduled Courses ({unscheduled.length})</h3>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            These courses could not be scheduled due to venue/instructor conflicts. Consider adding more venues or adjusting constraints.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {unscheduled.map((id) => {
              const course = courseMap.get(id)
              if (!course) return null
              const colors = DEPT_COLORS[course.department] || { bg: "#666", text: "#fff", border: "#555" }
              return (
                <span
                  key={id}
                  className="rounded-md border px-2 py-1 text-xs font-medium"
                  style={{ borderColor: `${colors.bg}40`, backgroundColor: `${colors.bg}10`, color: colors.bg }}
                >
                  {course.acronym} - {course.name}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* Day-wise Statistics */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {DAYS.map((day) => {
          const dayEntries = entries.filter((e) => e.day === day)
          const lectures = dayEntries.filter((e) => e.type === "lecture").length
          const labCount = dayEntries.filter((e) => e.type === "lab").length
          const seminars = dayEntries.filter((e) => e.type === "seminar").length
          return (
            <div key={day} className="rounded-lg border border-border bg-card p-3 text-center">
              <div className="text-xs font-semibold text-foreground">{day}</div>
              <div className="mt-1 text-xl font-bold text-foreground">{dayEntries.length}</div>
              <div className="text-[10px] text-muted-foreground">
                {lectures} lec{labCount > 0 ? `, ${labCount} lab` : ""}{seminars > 0 ? `, ${seminars} sem` : ""}
              </div>
            </div>
          )
        })}
      </div>

      {/* Slot Balance */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-3 text-xs font-semibold text-foreground">Slot Distribution Balance</h3>
        <div className="flex flex-wrap gap-4">
          {TIME_SLOTS.map((slot) => {
            const count = slotStats[slot.id]
            const maxCount = Math.max(...Object.values(slotStats), 1)
            const pct = Math.round((count / maxCount) * 100)
            return (
              <div key={slot.id} className="flex flex-1 flex-col gap-1" style={{ minWidth: "120px" }}>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-medium text-foreground">{slot.label}</span>
                  <span className="text-muted-foreground">{count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
