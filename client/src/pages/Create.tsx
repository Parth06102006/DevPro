"use client"

import type React from "react"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { InputGroup, InputGroupTextarea, InputGroupButton } from "@/components/ui/input-group"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUpIcon } from "lucide-react"

function Create() {
  const [languages, setLanguages] = useState("")
  const [techStack, setTechStack] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const isFormValid = languages.trim() !== "" && techStack.trim() !== ""

  const handleSubmit = async () => {
    if (!isFormValid) return

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

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
        <div className="flex flex-col h-full w-full">
          <div className="flex-1 flex items-center justify-center px-4">
            {!isLoading && (
              <div
                style={{ fontFamily: "Quicksand" }}
                className="text-center text-white text-2xl md:text-4xl font-bold animate-pulse"
              >
                Generate your Next Project !!!
              </div>
            )}
            {isLoading && (
              <div className="space-y-4 w-full max-w-md">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-3/4 rounded-lg mx-auto" />
              </div>
            )}
          </div>

          <div className="w-full px-4 pb-8">
            <div className="flex flex-col md:flex-row gap-4 w-full justify-center items-end max-w-4xl mx-auto text-white">
              <div className="w-full md:flex-1">
                <InputGroup>
                  <InputGroupTextarea
                    placeholder={"Programming Languages ...\nE.g : Python , C++ , Javascript"}
                    value={languages}
                    onChange={(e) => setLanguages(e.target.value)}
                    className="resize-none"
                  />
                </InputGroup>
              </div>

              <div className="w-full md:flex-1">
                <InputGroup>
                  <InputGroupTextarea
                    placeholder={"Tech Stack ...\nE.g : MERN , Django , FastAPI"}
                    value={techStack}
                    onChange={(e) => setTechStack(e.target.value)}
                    className="resize-none"
                  />
                </InputGroup>
              </div>

              <InputGroupButton
                variant="default"
                className="rounded-full"
                size="icon-xs"
                disabled={!isFormValid || isLoading}
                onClick={handleSubmit}
              >
                <ArrowUpIcon />
                <span className="sr-only">Send</span>
              </InputGroupButton>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Create
