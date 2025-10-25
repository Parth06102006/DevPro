"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

export interface ProjectProps {
  id:string,
  title: string
  description: string
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
  techStack: string[]
  programmingLanguage: string[]
  _count:{
    implementationSteps:number,
    savedByUsers:number,
    recommendationByAI:number
  }
}

const difficultyColors = {
  BEGINNER: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  INTERMEDIATE: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  ADVANCED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
}

export function TopProjects({ projectsList = [] }: { projectsList: ProjectProps[] }) {
  const [projects, setProjects] = useState<ProjectProps[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    setProjects(projectsList)

    setLoading(false)
  }, [
    projectsList
  ])

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
    <Card className="border border-slate-700 bg-gradient-to-br from-slate-950 to-slate-900 shadow-2xl">
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
            {projects && projects.map((project) => (
              <div key={project?.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm line-clamp-1">{project.title}</h4>
                  <Badge className={difficultyColors[project?.difficulty]}>{project.difficulty}</Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{project.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {project?.techStack.slice(0, 2).map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project?.techStack.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{project?.techStack.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
