from http.server import BaseHTTPRequestHandler
import json
import random

# Valid day pairs with at least 1 day gap
DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"]
TIME_SLOT_IDS = ["slot1", "slot2", "slot3", "slot4", "slot5"]
REGULAR_SLOTS = ["slot1", "slot2", "slot3", "slot4"]

VALID_DAY_PAIRS = [
    ("Mon", "Wed"),
    ("Mon", "Thu"),
    ("Mon", "Fri"),
    ("Tue", "Thu"),
    ("Tue", "Fri"),
    ("Wed", "Fri"),
]


def generate_timetable(courses, venues):
    entries = []
    unscheduled = []

    # Track occupancy: day -> slotId -> list of { venueId, courseId }
    occupancy = {}
    for day in DAYS:
        occupancy[day] = {}
        for slot_id in TIME_SLOT_IDS:
            occupancy[day][slot_id] = []

    # Track instructor assignments: instructor -> set of "day_slotId"
    instructor_slots = {}

    # Track per-slot load for balancing
    slot_load = {s: 0 for s in TIME_SLOT_IDS}

    # Separate classrooms and labs
    classrooms = [v for v in venues if not v.get("isLab", False)]
    labs = [v for v in venues if v.get("isLab", False)]

    # Sort courses: prioritize lab courses, then seminars, then by credits desc
    sorted_courses = list(courses)
    random.shuffle(sorted_courses)
    sorted_courses.sort(
        key=lambda c: (
            -1 if c.get("hasLab") else 0,
            -1 if c.get("isSeminar") else 0,
            -c.get("credits", 4),
        )
    )

    def is_venue_available(venue_id, day, slot_id):
        return all(o["venueId"] != venue_id for o in occupancy[day][slot_id])

    def is_instructor_available(instructor, day, slot_id):
        key = f"{day}_{slot_id}"
        return key not in instructor_slots.get(instructor, set())

    def assign_slot(course_id, venue_id, day, slot_id, instructor, entry_type):
        occupancy[day][slot_id].append({"venueId": venue_id, "courseId": course_id})
        if instructor not in instructor_slots:
            instructor_slots[instructor] = set()
        instructor_slots[instructor].add(f"{day}_{slot_id}")
        slot_load[slot_id] += 1
        entries.append({
            "courseId": course_id,
            "venueId": venue_id,
            "day": day,
            "timeSlotId": slot_id,
            "type": entry_type,
        })

    def get_available_slots(course):
        if course.get("isEvening"):
            return ["slot5"]
        slots = list(REGULAR_SLOTS)
        slots.sort(key=lambda s: slot_load[s])
        return slots

    def get_sorted_day_pairs():
        day_load = {}
        for day in DAYS:
            day_load[day] = len([e for e in entries if e["day"] == day])
        pairs = list(VALID_DAY_PAIRS)
        pairs.sort(key=lambda p: day_load[p[0]] + day_load[p[1]])
        return pairs

    for course in sorted_courses:
        sessions_needed = 2 if course.get("credits", 4) >= 4 else 1
        scheduled = False
        instructor = course.get("instructor", "")

        available_slot_ids = get_available_slots(course)
        day_pairs = get_sorted_day_pairs()

        if sessions_needed == 2:
            # Try to find a day pair with same time slot (preferred for consistency)
            for slot_id in available_slot_ids:
                if scheduled:
                    break
                for day1, day2 in day_pairs:
                    if scheduled:
                        break
                    if not is_instructor_available(instructor, day1, slot_id):
                        continue
                    if not is_instructor_available(instructor, day2, slot_id):
                        continue

                    shuffled_classrooms = list(classrooms)
                    random.shuffle(shuffled_classrooms)
                    for venue in shuffled_classrooms:
                        if (is_venue_available(venue["id"], day1, slot_id)
                                and is_venue_available(venue["id"], day2, slot_id)):
                            assign_slot(course["id"], venue["id"], day1, slot_id, instructor, "lecture")
                            assign_slot(course["id"], venue["id"], day2, slot_id, instructor, "lecture")
                            scheduled = True
                            break

            # Fallback: try different slots for each day
            if not scheduled:
                for day1, day2 in day_pairs:
                    if scheduled:
                        break
                    for slot_id1 in available_slot_ids:
                        if scheduled:
                            break
                        if not is_instructor_available(instructor, day1, slot_id1):
                            continue
                        for slot_id2 in available_slot_ids:
                            if scheduled:
                                break
                            if not is_instructor_available(instructor, day2, slot_id2):
                                continue

                            shuffled_classrooms = list(classrooms)
                            random.shuffle(shuffled_classrooms)
                            for venue in shuffled_classrooms:
                                if (is_venue_available(venue["id"], day1, slot_id1)
                                        and is_venue_available(venue["id"], day2, slot_id2)):
                                    assign_slot(course["id"], venue["id"], day1, slot_id1, instructor, "lecture")
                                    assign_slot(course["id"], venue["id"], day2, slot_id2, instructor, "lecture")
                                    scheduled = True
                                    break
        else:
            # 1 session (2-credit course)
            sorted_days = list(DAYS)
            sorted_days.sort(key=lambda d: len([e for e in entries if e["day"] == d]))
            for slot_id in available_slot_ids:
                if scheduled:
                    break
                for day in sorted_days:
                    if scheduled:
                        break
                    if not is_instructor_available(instructor, day, slot_id):
                        continue

                    shuffled_classrooms = list(classrooms)
                    random.shuffle(shuffled_classrooms)
                    for venue in shuffled_classrooms:
                        if is_venue_available(venue["id"], day, slot_id):
                            assign_slot(course["id"], venue["id"], day, slot_id, instructor, "lecture")
                            scheduled = True
                            break

        # Schedule lab if needed
        if scheduled and course.get("hasLab"):
            lab_scheduled = False
            course_days = [e["day"] for e in entries if e["courseId"] == course["id"]]

            # Try to schedule lab on a different day
            lab_days = [d for d in DAYS if d not in course_days]
            random.shuffle(lab_days)
            lab_slots = ["slot3", "slot4"]  # Afternoon preferred for labs
            random.shuffle(lab_slots)

            for day in lab_days:
                if lab_scheduled:
                    break
                for slot_id in lab_slots:
                    if lab_scheduled:
                        break
                    if not is_instructor_available(instructor, day, slot_id):
                        continue
                    shuffled_labs = list(labs)
                    random.shuffle(shuffled_labs)
                    for lab in shuffled_labs:
                        if is_venue_available(lab["id"], day, slot_id):
                            assign_slot(course["id"], lab["id"], day, slot_id, instructor, "lab")
                            lab_scheduled = True
                            break

            # Fallback: lab on any available day
            if not lab_scheduled:
                for day in DAYS:
                    if lab_scheduled:
                        break
                    for slot_id in lab_slots:
                        if lab_scheduled:
                            break
                        if not is_instructor_available(instructor, day, slot_id):
                            continue
                        shuffled_labs = list(labs)
                        random.shuffle(shuffled_labs)
                        for lab in shuffled_labs:
                            if is_venue_available(lab["id"], day, slot_id):
                                assign_slot(course["id"], lab["id"], day, slot_id, instructor, "lab")
                                lab_scheduled = True
                                break

        # Schedule seminar slot
        if scheduled and course.get("isSeminar"):
            seminar_scheduled = False
            course_days = [e["day"] for e in entries if e["courseId"] == course["id"]]
            sem_days = [d for d in DAYS if d not in course_days]
            random.shuffle(sem_days)

            for day in sem_days:
                if seminar_scheduled:
                    break
                sem_slot = "slot5"
                if not is_instructor_available(instructor, day, sem_slot):
                    continue
                shuffled_classrooms = list(classrooms)
                random.shuffle(shuffled_classrooms)
                for venue in shuffled_classrooms:
                    if is_venue_available(venue["id"], day, sem_slot):
                        assign_slot(course["id"], venue["id"], day, sem_slot, instructor, "seminar")
                        seminar_scheduled = True
                        break

        if not scheduled:
            unscheduled.append(course["id"])

    return {"entries": entries, "unscheduled": unscheduled}


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(content_length))

            courses = body.get("courses", [])
            venues = body.get("venues", [])

            result = generate_timetable(courses, venues)

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps(result).encode("utf-8"))
        except Exception as e:
            self.send_response(500)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
