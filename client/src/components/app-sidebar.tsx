import * as React from "react"
import {
  IconCamera,
  IconDashboard,
  IconFileAi,
  IconFileDescription,
  IconFolder,
  IconListDetails,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Input from "@/components/Input"
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const {user} = useAuth();

  if(!user) return 

  const data = {
  user: {
    name: `${user.name || "User"}`,
    email: `${user.email || "user@mail.com"}`,
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Sessions",
      url: "/sessions",
      icon: IconListDetails,
    },
    {
      title: "Saved Projects",
      url: "/saved",
      icon: IconFolder,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
          {
            title: "Archived",
            url: "#",
          },
        ],
      },
    ],

  }
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="bg-slate-950 text-white rounded-t-md">
        <SidebarMenu className="m-1">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to='/' className="">
                <img src="/logo.png" alt="" className="w-8 h-8 object-cover border border-black rounded-xl"/>
                <span className="text-base font-bold">DevPro</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-gradient-to-b from-[#0a0f2d] via-[#081a3a] to-[#020617] border-r border-white/10 text-white shadow-[inset_0_0_30px_rgba(0,102,255,0.15)] p-3 text-sm">
        <NavMain items={data.navMain} />
        <Input text="Ask , Search or Chat..." />
        <div className="self-center pt-5 h-fit w-fit relative">
          <div className="absolute inset-0 bg-transparent bg-opacity-70 rounded-3xl mix-blend-saturation" />
        </div>
      </SidebarContent>
      <SidebarFooter className="bg-black rounded-b-2xl border-r border-white/10 text-white">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
