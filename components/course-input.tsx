"use client"

import { useState } from "react"
import type { Course } from "@/lib/data"
import { DEPARTMENTS, DEPT_COLORS } from "@/lib/data"
import { Plus, Trash2, Edit2, Check, X, FlaskConical, Presentation, Moon, ChevronDown, ChevronUp } from "lucide-react"

interface CourseInputProps {
  courses: Course[]
  onCoursesChange: (courses: Course[]) => void
}

let addCounter = 1000

export default function CourseInput({ courses, onCoursesChange }: CourseInputProps) {
  const [filterDept, setFilterDept] = useState<string>("ALL")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Course>>({})
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    department: "CSE",
    code: "",
    name: "",
    acronym: "",
    instructor: "",
    ugPg: "UG/PG",
    credits: 4,
    hasLab: false,
    isSeminar: false,
    isEvening: false,
  })
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set(["CSE"]))

  const filtered = filterDept === "ALL" ? courses : courses.filter((c) => c.department === filterDept)

  // Group by department
  const grouped = filtered.reduce(
    (acc, c) => {
      if (!acc[c.department]) acc[c.department] = []
      acc[c.department].push(c)
      return acc
    },
    {} as Record<string, Course[]>,
  )

  function toggleDept(dept: string) {
    const next = new Set(expandedDepts)
    if (next.has(dept)) next.delete(dept)
    else next.add(dept)
    setExpandedDepts(next)
  }

  function handleDelete(id: string) {
    onCoursesChange(courses.filter((c) => c.id !== id))
  }

  function handleEditStart(course: Course) {
    setEditingId(course.id)
    setEditForm({ ...course })
  }

  function handleEditSave() {
    if (!editingId) return
    onCoursesChange(courses.map((c) => (c.id === editingId ? ({ ...c, ...editForm } as Course) : c)))
    setEditingId(null)
    setEditForm({})
  }

  function handleEditCancel() {
    setEditingId(null)
    setEditForm({})
  }

  function handleAddCourse() {
    if (!newCourse.code || !newCourse.name || !newCourse.acronym || !newCourse.instructor) return
    const id = `course_add_${addCounter++}`
    onCoursesChange([...courses, { ...newCourse, id } as Course])
    setNewCourse({
      department: "CSE",
      code: "",
      name: "",
      acronym: "",
      instructor: "",
      ugPg: "UG/PG",
      credits: 4,
      hasLab: false,
      isSeminar: false,
      isEvening: false,
    })
    setShowAddForm(false)
  }

  function handleToggleFlag(id: string, flag: "hasLab" | "isSeminar" | "isEvening") {
    onCoursesChange(courses.map((c) => (c.id === id ? { ...c, [flag]: !c[flag] } : c)))
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Filter and Add Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilterDept("ALL")}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            filterDept === "ALL"
              ? "bg-foreground text-background"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          All ({courses.length})
        </button>
        {DEPARTMENTS.map((dept) => {
          const count = courses.filter((c) => c.department === dept).length
          const colors = DEPT_COLORS[dept]
          return (
            <button
              key={dept}
              onClick={() => setFilterDept(dept)}
              className="rounded-md px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-90"
              style={{
                backgroundColor: filterDept === dept ? colors.bg : `${colors.bg}33`,
                color: filterDept === dept ? colors.text : colors.bg,
              }}
            >
              {dept} ({count})
            </button>
          )
        })}
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="ml-auto flex items-center gap-1 rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-90"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Course
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="rounded-lg border border-border bg-card p-4">
          <h4 className="mb-3 text-sm font-semibold text-foreground">Add New Course</h4>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Department</label>
              <select
                value={newCourse.department}
                onChange={(e) => setNewCourse({ ...newCourse, department: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs text-foreground"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Course Code</label>
              <input
                type="text"
                value={newCourse.code || ""}
                onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                placeholder="CSE556"
                className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Course Name</label>
              <input
                type="text"
                value={newCourse.name || ""}
                onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                placeholder="Natural Language Processing"
                className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Acronym</label>
              <input
                type="text"
                value={newCourse.acronym || ""}
                onChange={(e) => setNewCourse({ ...newCourse, acronym: e.target.value })}
                placeholder="NLP"
                className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Instructor</label>
              <input
                type="text"
                value={newCourse.instructor || ""}
                onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
                placeholder="Dr. Name"
                className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">UG/PG</label>
              <select
                value={newCourse.ugPg}
                onChange={(e) => setNewCourse({ ...newCourse, ugPg: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs text-foreground"
              >
                <option value="UG">UG</option>
                <option value="PG">PG</option>
                <option value="UG/PG">UG/PG</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Credits</label>
              <select
                value={newCourse.credits}
                onChange={(e) => setNewCourse({ ...newCourse, credits: Number(e.target.value) })}
                className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs text-foreground"
              >
                <option value={2}>2</option>
                <option value={4}>4</option>
              </select>
            </div>
            <div className="flex items-end gap-3">
              <label className="flex items-center gap-1.5 text-xs text-foreground">
                <input
                  type="checkbox"
                  checked={newCourse.hasLab || false}
                  onChange={(e) => setNewCourse({ ...newCourse, hasLab: e.target.checked })}
                  className="rounded"
                />
                Lab
              </label>
              <label className="flex items-center gap-1.5 text-xs text-foreground">
                <input
                  type="checkbox"
                  checked={newCourse.isSeminar || false}
                  onChange={(e) => setNewCourse({ ...newCourse, isSeminar: e.target.checked })}
                  className="rounded"
                />
                Seminar
              </label>
              <label className="flex items-center gap-1.5 text-xs text-foreground">
                <input
                  type="checkbox"
                  checked={newCourse.isEvening || false}
                  onChange={(e) => setNewCourse({ ...newCourse, isEvening: e.target.checked })}
                  className="rounded"
                />
                Evening
              </label>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleAddCourse}
              className="flex items-center gap-1 rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background"
            >
              <Check className="h-3 w-3" /> Add
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="flex items-center gap-1 rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground"
            >
              <X className="h-3 w-3" /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Course List */}
      <div className="flex flex-col gap-2">
        {Object.entries(grouped).map(([dept, deptCourses]) => {
          const colors = DEPT_COLORS[dept] || { bg: "#666", text: "#fff", border: "#555" }
          const isExpanded = expandedDepts.has(dept)
          return (
            <div key={dept} className="overflow-hidden rounded-lg border border-border">
              <button
                onClick={() => toggleDept(dept)}
                className="flex w-full items-center justify-between px-4 py-2.5 text-left"
                style={{ backgroundColor: `${colors.bg}15` }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-sm"
                    style={{ backgroundColor: colors.bg }}
                  />
                  <span className="text-sm font-semibold text-foreground">
                    {dept}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({deptCourses.length} courses)
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
              {isExpanded && (
                <div className="divide-y divide-border">
                  {deptCourses.map((course) => (
                    <div key={course.id} className="flex items-center gap-3 px-4 py-2 hover:bg-muted/50">
                      {editingId === course.id ? (
                        <div className="flex flex-1 flex-wrap items-center gap-2">
                          <input
                            value={editForm.acronym || ""}
                            onChange={(e) => setEditForm({ ...editForm, acronym: e.target.value })}
                            className="w-16 rounded border border-input bg-background px-1.5 py-1 text-xs text-foreground"
                          />
                          <input
                            value={editForm.name || ""}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-48 rounded border border-input bg-background px-1.5 py-1 text-xs text-foreground"
                          />
                          <input
                            value={editForm.instructor || ""}
                            onChange={(e) => setEditForm({ ...editForm, instructor: e.target.value })}
                            className="w-36 rounded border border-input bg-background px-1.5 py-1 text-xs text-foreground"
                          />
                          <select
                            value={editForm.credits}
                            onChange={(e) => setEditForm({ ...editForm, credits: Number(e.target.value) })}
                            className="rounded border border-input bg-background px-1.5 py-1 text-xs text-foreground"
                          >
                            <option value={2}>2 cr</option>
                            <option value={4}>4 cr</option>
                          </select>
                          <button
                            onClick={handleEditSave}
                            className="rounded bg-foreground p-1 text-background"
                          >
                            <Check className="h-3 w-3" />
                          </button>
                          <button
                            onClick={handleEditCancel}
                            className="rounded bg-secondary p-1 text-secondary-foreground"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span
                            className="inline-flex min-w-[56px] items-center justify-center rounded px-2 py-0.5 text-[10px] font-bold"
                            style={{ backgroundColor: colors.bg, color: colors.text }}
                          >
                            {course.acronym}
                          </span>
                          <div className="flex flex-1 flex-col">
                            <span className="text-xs font-medium text-foreground">
                              {course.code} - {course.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {course.instructor} | {course.ugPg} | {course.credits} credits
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {course.hasLab && (
                              <span title="Has Lab" className="rounded bg-accent p-1">
                                <FlaskConical className="h-3 w-3 text-muted-foreground" />
                              </span>
                            )}
                            {course.isSeminar && (
                              <span title="Seminar" className="rounded bg-accent p-1">
                                <Presentation className="h-3 w-3 text-muted-foreground" />
                              </span>
                            )}
                            {course.isEvening && (
                              <span title="Evening" className="rounded bg-accent p-1">
                                <Moon className="h-3 w-3 text-muted-foreground" />
                              </span>
                            )}
                            <button
                              title="Toggle Lab"
                              onClick={() => handleToggleFlag(course.id, "hasLab")}
                              className={`rounded p-1 text-xs ${course.hasLab ? "bg-chart-2/20 text-chart-2" : "text-muted-foreground hover:bg-muted"}`}
                            >
                              <FlaskConical className="h-3 w-3" />
                            </button>
                            <button
                              title="Toggle Seminar"
                              onClick={() => handleToggleFlag(course.id, "isSeminar")}
                              className={`rounded p-1 text-xs ${course.isSeminar ? "bg-chart-4/20 text-chart-4" : "text-muted-foreground hover:bg-muted"}`}
                            >
                              <Presentation className="h-3 w-3" />
                            </button>
                            <button
                              title="Toggle Evening"
                              onClick={() => handleToggleFlag(course.id, "isEvening")}
                              className={`rounded p-1 text-xs ${course.isEvening ? "bg-chart-1/20 text-chart-1" : "text-muted-foreground hover:bg-muted"}`}
                            >
                              <Moon className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleEditStart(course)}
                              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleDelete(course.id)}
                              className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
