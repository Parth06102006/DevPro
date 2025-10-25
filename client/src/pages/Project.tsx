import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import SpotlightCard from "@/components/SpotlightCard"
import { Code2, Send, Lightbulb } from "lucide-react"
import { useParams, useSearchParams } from "react-router-dom"
import { generateProjectInfo, getProjectInfo } from "@/services/projectService"
import { createSuggestion, createAnswer, getChats } from "@/services/aiService"
import toast from "react-hot-toast"
import {TimelineHorizontal} from "@/components/TimelineHorizontal"

export interface ProjectData {
  title?: string
  description?: string
  difficulty?: string
  techStack?: string[]
  programmingLanguage?: string[]
  implementationSteps?: Array<{
    stepNumber: number
    title: string
    details: string
  }>
}

interface Message {
  role: "user" | "assistant"
  text: string
}

export default function Project() {
  const params = useParams()
  const [searchParams] = useSearchParams()
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "👋 Hi! I’m your DevPro Assistant. How can I help you with your project today?" },
  ])
  const [input, setInput] = useState("")
  const [data, setData] = useState<ProjectData | null>(null)
  const [loading, setLoading] = useState(true)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [hasShownError, setHasShownError] = useState(false)

  useEffect(() => {
    async function generateInfo(sessionId: string, projectId: string) {
      const generatePromise = generateProjectInfo(sessionId, projectId)
      
      toast.promise(
        generatePromise,
        {
          loading: 'Generating project details...',
          success: 'Generated project details!',
          error: 'Failed to generate project details',
        },
        { id: 'generate-project' }
      )

      try {
        const response = await generatePromise
        setData(response?.data)
      } catch (error) {
        console.error(error)
      }
    }

    async function getInfo() {
      const sessionId = params?.sessionId as string
      const projectId = searchParams.get("projectId")
      if (!sessionId || !projectId) {
        if (!hasShownError) {
          toast.error("Invalid session or project ID", { id: 'invalid-ids' })
          setHasShownError(true)
        }
        setLoading(false)
        return
      }

      try {
        const response = await getProjectInfo(sessionId, projectId)
        if (response?.data) {
          setData(response.data)
        } else {
          await generateInfo(sessionId, projectId)
        }
      } catch (error) {
        console.error(error)
        if (!hasShownError) {
          toast.error("Error fetching project info", { id: 'fetch-project-error' })
          setHasShownError(true)
        }
      } finally {
        setLoading(false)
      }
    }

    async function loadChats() {
      const sessionId = params?.sessionId as string
      const projectId = searchParams.get("projectId")
      if (!sessionId || !projectId) {
        return
      }

      try {
        const response = await getChats(sessionId,projectId)
        if (response?.data && Array.isArray(response.data)) {
          const formattedMessages: Message[] = response.data.map((msg: any) => ({
            role: msg.role || (msg.sender === 'user' ? 'user' : 'assistant'),
            text: msg.text || msg.message || msg.content || ''
          }))
          setMessages([
            { role: "assistant", text: "👋 Hi! I'm your DevPro Assistant. How can I help you with your project today?" },
            ...formattedMessages
          ])
        }
      } catch (error) {
        console.error(error)
      }
    }

    getInfo()
    loadChats()
  }, [params, searchParams])

  const handleSend = async () => {
    if (!input.trim() || sendingMessage) return

    const sessionId = params?.sessionId as string
    const projectId = searchParams.get("projectId")
    if (!sessionId || !projectId) {
      return
    }

    const userMessage = input
    const messageId = Date.now()
    setInput("")
    setSendingMessage(true)

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userMessage },
    ])

    try {
      const response = await createAnswer(sessionId, userMessage, projectId)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: response?.data?.answer || response?.data?.message || "I received your question!" },
      ])
    } catch (error) {
      console.error(error)
      toast.error("Failed to send message", { id: `send-error-${messageId}` })
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, I encountered an error processing your request." },
      ])
    } finally {
      setSendingMessage(false)
    }
  }

  const handleSuggestion = async () => {
    const sessionId = params?.sessionId as string
    const projectId = searchParams.get("projectId")
    if (!sessionId || !projectId) {
      return
    }

    const suggestionPromise = createSuggestion(sessionId, projectId)
    
    toast.promise(
      suggestionPromise,
      {
        loading: 'Generating suggestion...',
        success: 'Generated suggestion!',
        error: 'Failed to generate suggestion',
      },
      { id: 'create-suggestion' }
    )

    try {
      const response = await suggestionPromise
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: response?.data?.suggestion || "💡 Here's a new project suggestion based on your interests!" },
      ])
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex flex-col gap-8 p-6 w-full min-h-screen bg-gradient-to-br from-[#040212] to-[#1b1b1b] text-white" style={{fontFamily:"Quicksand"}}>
      {/* Project Info Card */}
      <div className="flex justify-between">
        {loading ? (<Skeleton className="w-full h-5"/>) : (<div>
                <p className="text-4xl font-semibold mt-1">{data?.title}</p>
              </div>)}
        <Button>Save</Button>
      </div>
      {loading ? (
        <Skeleton className="h-40 w-full" />
      ) : (
        <SpotlightCard className="w-full bg-gradient-to-br from-[#0a0a1f] to-[#232323] p-8 rounded-2xl border border-white/10 shadow-lg">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-semibold mb-6">
              <Code2 className="text-blue-400" /> Project Info
            </h2>
            <div className="space-y-5">
              <div>
                <p className="text-xs text-white/60 uppercase">Description</p>
                <p className="text-white/80 leading-relaxed">{data?.description}</p>
              </div>
              <div>
                <p className="text-xs text-white/60 uppercase">Difficulty</p>
                <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-400/30">
                  {data?.difficulty}
                </span>
              </div>
              <div>
                <p className="text-xs text-white/60 uppercase">Tech Stack</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {data?.techStack?.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500/20 to-teal-500/20 text-white border border-green-400/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SpotlightCard>
      )}

      {/* Horizontal Timeline */}
      {data?.implementationSteps && (
        <div>
            <h3 className="pb-10 text-4xl" style={{fontFamily:"Quicksand"}}>Implementation Steps</h3>
            <TimelineHorizontal data={data.implementationSteps} />
        </div>
      )}

      {/* Chat Section */}
      <div className="flex flex-col gap-6 w-full">
        <ScrollArea className="max-h-[60vh] w-full border border-white/10 rounded-xl p-6 bg-[#0a0a0a]/40 overflow-y-auto">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex my-2 ${
                msg.role === "assistant" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-lg text-sm animate-fadeIn ${
                  msg.role === "assistant"
                    ? "bg-[#1e293b] text-blue-100"
                    : "bg-blue-600 text-white"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </ScrollArea>

        {/* Input Section */}
        <div className="flex items-center gap-3 w-full border-t border-white/10 pt-4">
          <div className="relative group">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSuggestion}
              className="text-yellow-400 hover:text-yellow-300 transition-all"
            >
              <Lightbulb className="w-6 h-6 text-white hover:text-amber-600" />
              <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition bg-black/70 text-white px-2 py-1 rounded-md ml-10">
                Get Project Suggestions
              </span>
            </Button>
          </div>

          <Input
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 bg-[#111] text-white border border-white/20 rounded-full px-4 py-2"
          />

          <Button
            onClick={handleSend}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-2 flex items-center gap-2"
          >
            <Send size={16} />
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}
