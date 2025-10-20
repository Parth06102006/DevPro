import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/new-chat-area-interactive.tsx"
import { SectionCards } from "@/components/new-section-cards"
import { SiteHeader } from "@/components/site-header"
import { RecentSessions } from "@/components/recent-sessions"
import { TopProjects } from "@/components/top-projects"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function Dashboard() {
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
              <SectionCards />

              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>

              <div className="grid gap-4 px-4 lg:px-6 md:grid-cols-2">
                <RecentSessions />
                <TopProjects />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
