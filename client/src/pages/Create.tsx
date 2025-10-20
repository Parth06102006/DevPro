import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import {
  InputGroup,
  InputGroupTextarea,
  InputGroupButton
} from "@/components/ui/input-group"
import {ArrowUpIcon} from 'lucide-react'

function Create() {
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
            <div className="align-bottom">
                <div className="flex gap-2 w-full justify-center text-white m-2 items-center">
                <div className="grid w-full max-w-sm gap-6">
                <InputGroup>
                    <InputGroupTextarea placeholder={"Programming Languages ...\nE.g : Python , C++ , Javascript "} />
                </InputGroup>
                </div>
                    <div className="grid w-full max-w-sm gap-6">
                <InputGroup>
                    <InputGroupTextarea placeholder={"Tech Stack ...\nE.g : MERN , Django , FastAPI"} />
                </InputGroup>
                </div>
                          <InputGroupButton
            variant="default"
            className="rounded-full"
            size="icon-xs"
            disabled
          >
            <ArrowUpIcon />
            <span className="sr-only">Send</span>
          </InputGroupButton>
            </div>
            </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Create


