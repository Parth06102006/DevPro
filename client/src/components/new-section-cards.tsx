"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"

interface DashboardStats {
  totalProjects: number
  beginnerProject: number
  intermediateProject: number
  advancedProject: number
}

export function SectionCards(props:DashboardStats) {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    setStats({
      totalProjects: props.totalProjects,
      beginnerProject: props.beginnerProject,
      intermediateProject: props.intermediateProject,
      advancedProject: props.advancedProject,
    })

    setLoading(false)
  }, [
    props.totalProjects,
    props.beginnerProject,
    props.intermediateProject,
    props.advancedProject,
  ])


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


      {/* Beginner Projects */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Beginner Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.beginnerProject || 0}</div>
          <p className="text-xs text-muted-foreground mt-1">Easy level</p>
        </CardContent>
      </Card>

      {/* Intermediate Projects */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Intermediate Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.intermediateProject || 0}</div>
          <p className="text-xs text-muted-foreground mt-1">Mid Level</p>
        </CardContent>
      </Card>

      {/* Advanced Projects */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Advanced Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.advancedProject || 0}</div>
          <p className="text-xs text-muted-foreground mt-1">Hard level</p>
        </CardContent>
      </Card>
    </div>
  )
}
