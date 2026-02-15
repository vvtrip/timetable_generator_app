"use client"

import { useState, useCallback, useRef } from "react"
import type { Course, Venue, GeneratedTimetable } from "@/lib/data"
import { DEFAULT_COURSES, DEFAULT_VENUES } from "@/lib/data"
import CourseInput from "@/components/course-input"
import VenueManager from "@/components/venue-manager"
import TimetableGrid from "@/components/timetable-grid"
import { CalendarDays, BookOpen, Building2, Zap, ChevronDown, ChevronUp, RotateCcw, Printer } from "lucide-react"

async function callPythonEngine(courses: Course[], venues: Venue[]): Promise<GeneratedTimetable> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courses, venues }),
  })
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }
  return res.json()
}

export default function Page() {
  const [courses, setCourses] = useState<Course[]>(DEFAULT_COURSES)
  const [venues, setVenues] = useState<Venue[]>(DEFAULT_VENUES)
  const [timetable, setTimetable] = useState<GeneratedTimetable | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCourses, setShowCourses] = useState(true)
  const [showVenues, setShowVenues] = useState(false)
  const [semesterTitle, setSemesterTitle] = useState("B.Tech. 3rd & 4th Year, M.Tech. 1st & 2nd Year, Ph.D.")
  const [semesterLabel, setSemesterLabel] = useState("Winter Semester 2026 AY 2025-26")
  const timetableRef = useRef<HTMLDivElement>(null)

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true)
    setError(null)
    try {
      const result = await callPythonEngine(courses, venues)
      setTimetable(result)
      setTimeout(() => {
        timetableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate timetable")
    } finally {
      setIsGenerating(false)
    }
  }, [courses, venues])

  const handleRegenerate = useCallback(async () => {
    setIsGenerating(true)
    setError(null)
    try {
      const result = await callPythonEngine(courses, venues)
      setTimetable(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate timetable")
    } finally {
      setIsGenerating(false)
    }
  }, [courses, venues])

  const stats = {
    totalCourses: courses.length,
    totalVenues: venues.length,
    labCourses: courses.filter((c) => c.hasLab).length,
    eveningCourses: courses.filter((c) => c.isEvening).length,
    departments: [...new Set(courses.map((c) => c.department))].length,
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <CalendarDays className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Institute Timetable Generator</h1>
              <p className="text-xs text-muted-foreground">Automated scheduling with conflict resolution</p>
            </div>
          </div>
          <div className="hidden items-center gap-3 text-xs text-muted-foreground sm:flex">
            <span className="flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 font-medium text-foreground">
              <BookOpen className="h-3.5 w-3.5" />
              {stats.totalCourses} Courses
            </span>
            <span className="flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 font-medium text-foreground">
              <Building2 className="h-3.5 w-3.5" />
              {stats.totalVenues} Venues
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
        {/* Semester Info */}
        <section className="mb-6 rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold text-foreground">Semester Information</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="sem-title" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Program Title
              </label>
              <input
                id="sem-title"
                type="text"
                value={semesterTitle}
                onChange={(e) => setSemesterTitle(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label htmlFor="sem-label" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Semester / Academic Year
              </label>
              <input
                id="sem-label"
                type="text"
                value={semesterLabel}
                onChange={(e) => setSemesterLabel(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </section>

        {/* Course Management */}
        <section className="mb-6 rounded-xl border border-border bg-card">
          <button
            type="button"
            onClick={() => setShowCourses(!showCourses)}
            className="flex w-full items-center justify-between px-5 py-4 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">Course Catalog</h2>
                <p className="text-xs text-muted-foreground">
                  {stats.totalCourses} courses across {stats.departments} departments
                  {stats.labCourses > 0 ? ` | ${stats.labCourses} with labs` : ""}
                  {stats.eveningCourses > 0 ? ` | ${stats.eveningCourses} evening` : ""}
                </p>
              </div>
            </div>
            {showCourses ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          {showCourses && (
            <div className="border-t border-border px-5 pb-5 pt-4">
              <CourseInput courses={courses} onCoursesChange={setCourses} />
            </div>
          )}
        </section>

        {/* Venue Management */}
        <section className="mb-6 rounded-xl border border-border bg-card">
          <button
            type="button"
            onClick={() => setShowVenues(!showVenues)}
            className="flex w-full items-center justify-between px-5 py-4 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20">
                <Building2 className="h-4 w-4 text-accent" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">Venue & Room Management</h2>
                <p className="text-xs text-muted-foreground">
                  {venues.filter((v) => !v.isLab).length} classrooms | {venues.filter((v) => v.isLab).length} labs
                </p>
              </div>
            </div>
            {showVenues ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          {showVenues && (
            <div className="border-t border-border px-5 pb-5 pt-4">
              <VenueManager venues={venues} onVenuesChange={setVenues} />
            </div>
          )}
        </section>

        {/* Generate Button */}
        <section className="mb-8 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || courses.length === 0}
            className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Generating Timetable...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Generate Institute Timetable
              </>
            )}
          </button>
          <p className="text-xs text-muted-foreground">
            Schedules {courses.length} courses across {venues.length} venues with constraint optimization
          </p>
        </section>

        {/* Error Display */}
        {error && (
          <section className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-center">
            <p className="text-sm font-medium text-destructive">{error}</p>
            <p className="mt-1 text-xs text-muted-foreground">Please try again or check the console for details.</p>
          </section>
        )}

        {/* Generated Timetable */}
        {timetable && (
          <div ref={timetableRef}>
            <section className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Generated Timetable</h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRegenerate}
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Regenerate
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Print
                </button>
              </div>
            </section>
            <div id="timetable-print-area">
              <TimetableGrid
                entries={timetable.entries}
                courses={courses}
                venues={venues}
                unscheduled={timetable.unscheduled}
                semesterTitle={semesterTitle}
                semesterLabel={semesterLabel}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
