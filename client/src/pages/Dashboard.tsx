import type React from "react"
import {useEffect,useState} from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/new-chat-area-interactive.tsx"
import { SectionCards } from "@/components/new-section-cards"
import { SiteHeader } from "@/components/site-header"
import { RecentSessions } from "@/components/recent-sessions"
import { TopProjects } from "@/components/top-projects"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getDashboardInfo } from "@/services/projectService"
import { type sessionsSchema } from "./Sessions"
import { type ProjectProps } from "@/components/top-projects"

export default function Dashboard() {

    type DashboardProps = {
      totalProjects:number,
      beginnerProject:number,
      intermediateProject:number,
      advancedProject:number,
      recentSessions : sessionsSchema[],
      topProjects:ProjectProps[]
    }


    const [data,setData] = useState<DashboardProps|null>(null)
    useEffect(() => {
    const fetchData = async () => {
      try {
        // This endpoint should return:
        // - recentProjects: array of projects created in last 30 days grouped by date
        // - topProjects: array of top 5 projects by usage/saves
        // - sessionActivity: array of session activity grouped by date for last 30 days

        const response = await getDashboardInfo()
          setData(response.data)

        } catch (error) {
        console.error("Failed to fetch chart data:", error)
    }
  }

    fetchData()
  }, [])
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards
              totalProjects={data?.totalProjects ?? 0}
              beginnerProject={data?.beginnerProject ?? 0}
              intermediateProject={data?.intermediateProject ?? 0}
              advancedProject={data?.advancedProject ?? 0}
            />


              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>

              <div className="grid gap-4 px-4 lg:px-6 md:grid-cols-2">
                <RecentSessions recentSessions={data?.recentSessions ?? []}/>
                <TopProjects projectsList = {data?.topProjects ?? []}/>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
