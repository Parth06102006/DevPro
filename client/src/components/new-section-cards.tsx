"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"

interface DashboardStats {
  totalProjects: number
  recentSessions: number
  topProjects: Array<{
    id: string
    title: string
    difficulty: string
    projectCount: number
  }>
  projectsByDifficulty: {
    BEGINNER: number
    INTERMEDIATE: number
    ADVANCED: number
  }
}

export function SectionCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // This endpoint should return:
        // - totalProjects: number (count of all projects created by user)
        // - recentSessions: number (count of sessions in last 7 days)
        // - topProjects: array of top 3 projects by usage/views
        // - projectsByDifficulty: breakdown of projects by difficulty level

        const response = await fetch("/api/dashboard/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data.data)
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardStats()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 px-4 lg:px-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 px-4 lg:px-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Projects Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalProjects || 0}</div>
          <p className="text-xs text-muted-foreground mt-1">Projects created</p>
        </CardContent>
      </Card>

      {/* Recent Sessions Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.recentSessions || 0}</div>
          <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
        </CardContent>
      </Card>

      {/* Beginner Projects */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Beginner Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.projectsByDifficulty.BEGINNER || 0}</div>
          <p className="text-xs text-muted-foreground mt-1">Easy level</p>
        </CardContent>
      </Card>

      {/* Advanced Projects */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Advanced Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.projectsByDifficulty.ADVANCED || 0}</div>
          <p className="text-xs text-muted-foreground mt-1">Hard level</p>
        </CardContent>
      </Card>
    </div>
  )
}
