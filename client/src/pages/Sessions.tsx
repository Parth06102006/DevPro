import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { DataTable } from "@/components/data-table";
import { useEffect,useState } from "react";
import { sessionList } from "@/services/sessionService";
import {type generatedProjectProps} from '@/pages/Create'

export type sessionsSchema = {
  id: string,
  userId: string,
  sessionToken: string,
  inputLanguage: string[],
  inputTechStack: string[],
  createdAt: string | Date,
  updatedAt: string | Date,
  generatedProjects: generatedProjectProps[],
}

function Sessions() {

  
  const [data,setData] = useState<sessionsSchema[]>([]);
  useEffect(()=>{ 
    async function getList()
    {
      try {
        const response = await sessionList();
        console.log(response?.data)
        setData(response?.data)
      } catch (error) {
        console.error(error)
      }
    }
    getList();
  },[])

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
            <div className="pt-6 dark text-white">
                <DataTable data={data}/>
            </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Sessions