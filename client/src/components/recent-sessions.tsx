"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"

interface Session {
  id: string
  sessionToken: string
  createdAt: string
  projectCount: number
  inputLanguage?: string
  inputTechStack?: string
}

export function RecentSessions() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        // This endpoint should return:
        // - array of recent sessions (last 5-10) for the current user
        // - include: id, sessionToken, createdAt, projectCount, inputLanguage, inputTechStack

        const response = await fetch("/api/sessions/recent")
        if (response.ok) {
          const data = await response.json()
          setSessions(data.data || [])
        }
      } catch (error) {
        console.error("Failed to fetch sessions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSessions()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sessions</CardTitle>
        <CardDescription>Your latest project generation sessions</CardDescription>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground" style={{ fontFamily: "Quicksand" }}>
              No sessions yet. Start creating!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{session.inputLanguage || "Session"}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{session.projectCount} projects</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
