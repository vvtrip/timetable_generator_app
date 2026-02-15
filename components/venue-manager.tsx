"use client"

import { useState } from "react"
import type { Venue } from "@/lib/data"
import { Plus, Trash2, Check, X, Building2, FlaskConical } from "lucide-react"

interface VenueManagerProps {
  venues: Venue[]
  onVenuesChange: (venues: Venue[]) => void
}

let venueCounter = 500

export default function VenueManager({ venues, onVenuesChange }: VenueManagerProps) {
  const [showAdd, setShowAdd] = useState(false)
  const [newVenue, setNewVenue] = useState<Partial<Venue>>({
    room: "",
    building: "",
    floor: "",
    isLab: false,
  })
  const [filter, setFilter] = useState<"all" | "classroom" | "lab">("all")

  const buildings = [...new Set(venues.map((v) => v.building))]
  const filtered =
    filter === "all" ? venues : filter === "lab" ? venues.filter((v) => v.isLab) : venues.filter((v) => !v.isLab)

  const grouped = filtered.reduce(
    (acc, v) => {
      if (!acc[v.building]) acc[v.building] = []
      acc[v.building].push(v)
      return acc
    },
    {} as Record<string, Venue[]>,
  )

  function handleAdd() {
    if (!newVenue.room || !newVenue.building || !newVenue.floor) return
    const id = `venue_${venueCounter++}`
    onVenuesChange([...venues, { ...newVenue, id } as Venue])
    setNewVenue({ room: "", building: "", floor: "", isLab: false })
    setShowAdd(false)
  }

  function handleDelete(id: string) {
    onVenuesChange(venues.filter((v) => v.id !== id))
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            filter === "all"
              ? "bg-foreground text-background"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          All ({venues.length})
        </button>
        <button
          onClick={() => setFilter("classroom")}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            filter === "classroom"
              ? "bg-foreground text-background"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          Classrooms ({venues.filter((v) => !v.isLab).length})
        </button>
        <button
          onClick={() => setFilter("lab")}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            filter === "lab"
              ? "bg-foreground text-background"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          Labs ({venues.filter((v) => v.isLab).length})
        </button>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="ml-auto flex items-center gap-1 rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Venue
        </button>
      </div>

      {showAdd && (
        <div className="rounded-lg border border-border bg-card p-4">
          <h4 className="mb-3 text-sm font-semibold text-foreground">Add New Venue</h4>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Room Number</label>
              <input
                type="text"
                value={newVenue.room || ""}
                onChange={(e) => setNewVenue({ ...newVenue, room: e.target.value })}
                placeholder="C01"
                className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Building</label>
              <input
                type="text"
                value={newVenue.building || ""}
                onChange={(e) => setNewVenue({ ...newVenue, building: e.target.value })}
                placeholder="Old Academic Building"
                className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground"
                list="building-list"
              />
              <datalist id="building-list">
                {buildings.map((b) => (
                  <option key={b} value={b} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Floor</label>
              <input
                type="text"
                value={newVenue.floor || ""}
                onChange={(e) => setNewVenue({ ...newVenue, floor: e.target.value })}
                placeholder="Ground Floor"
                className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex items-end gap-3">
              <label className="flex items-center gap-1.5 text-xs text-foreground">
                <input
                  type="checkbox"
                  checked={newVenue.isLab || false}
                  onChange={(e) => setNewVenue({ ...newVenue, isLab: e.target.checked })}
                />
                Lab
              </label>
              <button
                onClick={handleAdd}
                className="flex items-center gap-1 rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background"
              >
                <Check className="h-3 w-3" /> Add
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="flex items-center gap-1 rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground"
              >
                <X className="h-3 w-3" /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Venue Grid */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(grouped).map(([building, buildingVenues]) => (
          <div key={building} className="rounded-lg border border-border bg-card">
            <div className="flex items-center gap-2 border-b border-border px-3 py-2">
              <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold text-foreground">{building}</span>
              <span className="text-[10px] text-muted-foreground">({buildingVenues.length})</span>
            </div>
            <div className="divide-y divide-border/50">
              {buildingVenues.map((venue) => (
                <div key={venue.id} className="flex items-center gap-2 px-3 py-1.5">
                  {venue.isLab ? (
                    <FlaskConical className="h-3 w-3 text-chart-2" />
                  ) : (
                    <div className="h-3 w-3 rounded-sm bg-muted" />
                  )}
                  <span className="text-xs font-medium text-foreground">{venue.room}</span>
                  <span className="text-[10px] text-muted-foreground">{venue.floor}</span>
                  <button
                    onClick={() => handleDelete(venue.id)}
                    className="ml-auto rounded p-0.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
