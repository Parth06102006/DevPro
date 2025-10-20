"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

interface Project {
  id: string
  title: string
  description: string
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
  techStack: string[]
  createdAt: string
  savedCount?: number
}

const difficultyColors = {
  BEGINNER: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  INTERMEDIATE: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  ADVANCED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
}

export function TopProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTopProjects = async () => {
      try {
        // This endpoint should return:
        // - array of top 5 projects by saves/usage for the current user
        // - include: id, title, description, difficulty, techStack, createdAt, savedCount

        const response = await fetch("/api/projects/top")
        if (response.ok) {
          const data = await response.json()
          setProjects(data.data || [])
        }
      } catch (error) {
        console.error("Failed to fetch top projects:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTopProjects()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Projects</CardTitle>
        <CardDescription>Your most popular projects</CardDescription>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground" style={{ fontFamily: "Quicksand" }}>
              No projects yet. Create one to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm line-clamp-1">{project.title}</h4>
                  <Badge className={difficultyColors[project.difficulty]}>{project.difficulty}</Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{project.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {project.techStack.slice(0, 2).map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.techStack.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.techStack.length - 2}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{project.savedCount || 0} saves</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
