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
import type { ProjectProps } from "./top-projects"

interface ChartData {
  recentProjects: Array<{
    date: string
    count: number
  }>
  topProjects: ProjectProps[]
  recentSessions: Array<{
    date: string
    count: number
  }>
}

const COLORS = [
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#f59e0b", // amber
  "#10b981", // emerald
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950 border border-slate-600 rounded-lg p-3 shadow-2xl backdrop-blur-sm">
        <p className="text-slate-200 text-sm font-semibold">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm font-medium mt-1" style={{ color: entry.color }}>
            {entry.name}: <span className="font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function ChartAreaInteractive(props: ChartData) {
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    setChartData({
      recentProjects: props.recentProjects,
      topProjects: props.topProjects,
      recentSessions: props.recentSessions,
    })

    setLoading(false)
  }, [props.recentProjects, props.topProjects, props.recentSessions])

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
    <Card className="border border-slate-700 bg-gradient-to-br from-slate-950 to-slate-900 shadow-2xl">
      <CardHeader className="border-b border-slate-700/50 pb-6">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-50 to-slate-200 bg-clip-text text-transparent">
          Analytics Overview
        </CardTitle>
        <CardDescription className="text-slate-400 mt-2 text-base">Your project and session activity</CardDescription>
      </CardHeader>
      <CardContent className="pt-8">
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-900/50 border border-slate-700/50 p-1 rounded-lg gap-1 mb-6">
            <TabsTrigger
              value="projects"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-400 hover:text-slate-300 transition-all duration-200 rounded-md"
            >
              Projects
            </TabsTrigger>
            <TabsTrigger
              value="sessions"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-400 hover:text-slate-300 transition-all duration-200 rounded-md"
            >
              Sessions
            </TabsTrigger>
            <TabsTrigger
              value="top"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-600 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-400 hover:text-slate-300 transition-all duration-200 rounded-md"
            >
              Top Projects
            </TabsTrigger>
          </TabsList>

          {/* Projects Chart */}
          <TabsContent value="projects" className="mt-6">
            <div className="bg-slate-900/30 rounded-xl p-6 border border-slate-700/30 backdrop-blur-sm hover:border-slate-600/50 transition-all duration-300">
              <ResponsiveContainer width="100%" height={340}>
                <BarChart data={chartData?.recentProjects || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#64748b" style={{ fontSize: "12px" }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(59, 130, 246, 0.1)" }} />
                  <Bar dataKey="count" fill="#3b82f6" name="Projects Created" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          {/* Sessions Chart */}
          <TabsContent value="sessions" className="mt-6">
            <div className="bg-slate-900/30 rounded-xl p-6 border border-slate-700/30 backdrop-blur-sm hover:border-slate-600/50 transition-all duration-300">
              <ResponsiveContainer width="100%" height={340}>
                <LineChart data={chartData?.recentSessions || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#64748b" style={{ fontSize: "12px" }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#8b5cf6", strokeWidth: 2 }} />
                  <Legend wrapperStyle={{ paddingTop: "20px", color: "#cbd5e1" }} iconType="line" />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#8b5cf6"
                    name="Sessions"
                    strokeWidth={3}
                    dot={false}
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          {/* Top Projects Chart */}
          <TabsContent value="top" className="mt-6">
            <div className="bg-slate-900/30 rounded-xl p-6 border border-slate-700/30 backdrop-blur-sm hover:border-slate-600/50 transition-all duration-300 flex justify-center">
              <ResponsiveContainer width="100%" height={340}>
                <PieChart>
                  <Pie
                    data={(chartData?.topProjects || []).map((p) => ({
                      name: p.title,
                      value: p._count.implementationSteps ?? 0,
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                  >
                    {(chartData?.topProjects || []).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
