"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface ChartData {
  recentProjects: Array<{
    date: string
    count: number
  }>
  topProjects: Array<{
    name: string
    value: number
  }>
  sessionActivity: Array<{
    date: string
    sessions: number
  }>
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

export function ChartAreaInteractive() {
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        // This endpoint should return:
        // - recentProjects: array of projects created in last 30 days grouped by date
        // - topProjects: array of top 5 projects by usage/saves
        // - sessionActivity: array of session activity grouped by date for last 30 days

        const response = await fetch("/api/dashboard/charts")
        if (response.ok) {
          const data = await response.json()
          setChartData(data.data)
        }
      } catch (error) {
        console.error("Failed to fetch chart data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchChartData()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Overview</CardTitle>
        <CardDescription>Your project and session activity</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="top">Top Projects</TabsTrigger>
          </TabsList>

          {/* Projects Chart */}
          <TabsContent value="projects" className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData?.recentProjects || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--chart-1))" name="Projects Created" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          {/* Sessions Chart */}
          <TabsContent value="sessions" className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData?.sessionActivity || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sessions" stroke="hsl(var(--chart-2))" name="Sessions" />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          {/* Top Projects Chart */}
          <TabsContent value="top" className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData?.topProjects || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(chartData?.topProjects || []).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
