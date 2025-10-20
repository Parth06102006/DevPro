import type React from "react"
import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SavedProject {
  id: string
  title: string
  languages: string[]
  techStack: string[]
  createdAt: string
}

function SavedProjects() {
  const [projects, setProjects] = useState<SavedProject[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching saved projects from localStorage or API
    const timer = setTimeout(() => {
      const savedProjects = localStorage.getItem("projects")
      if (savedProjects) {
        setProjects(JSON.parse(savedProjects))
      }
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
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
        <div className="flex flex-col w-full h-full">
          {/* Empty State */}
          {!isLoading && projects.length === 0 && (
            <div className="flex-1 flex items-center justify-center px-4">
              <div
                style={{ fontFamily: "Quicksand" }}
                className="text-center text-muted-foreground text-lg md:text-2xl"
              >
                <p className="mb-2">No saved projects yet</p>
                <p className="text-sm md:text-base">Create your first project to get started!</p>
              </div>
            </div>
          )}

          {/* Projects Grid */}
          {!isLoading && projects.length > 0 && (
            <div className="flex-1 overflow-auto">
              <div className="p-4 md:p-6 lg:p-8">
                <h1 className="text-2xl md:text-3xl font-bold mb-6">Saved Projects</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {projects.map((project) => (
                    <Card key={project.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg md:text-xl">{project.title}</CardTitle>
                        <CardDescription>{new Date(project.createdAt).toLocaleDateString()}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-sm font-semibold mb-2">Languages</p>
                          <div className="flex flex-wrap gap-2">
                            {project.languages.map((lang, idx) => (
                              <Badge key={idx} variant="secondary">
                                {lang}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-semibold mb-2">Tech Stack</p>
                          <div className="flex flex-wrap gap-2">
                            {project.techStack.map((tech, idx) => (
                              <Badge key={idx} variant="outline">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-muted-foreground">Loading projects...</div>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default SavedProjects
