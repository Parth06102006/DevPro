import type React from "react"
import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { InputGroup, InputGroupTextarea, InputGroupButton } from "@/components/ui/input-group"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUpIcon, ChevronDown, ChevronRight } from "lucide-react"
import { generateProject,getGeneratedProjectsList } from "@/services/projectService"
import { useParams } from "react-router-dom"
import toast from "react-hot-toast"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import SpotlightCard from '@/components/SpotlightCard';
import { Eye } from "lucide-react"
import { useNavigate } from "react-router-dom"

export type generatedProjectProps = {
  id:string ,
  sessionId:string,
  difficulty : string,
  title : string,
  description:string,
  techStack:string[],
  programmingLanguage:string[],
  createdAt:Date
}
function Create() {
const navigate = useNavigate();
const [languagesText, setLanguagesText] = useState("")
const [techStackText, setTechStackText] = useState("")
const [languages, setLanguages] = useState<string[]>([])
const [techStack, setTechStack] = useState<string[]>([])
const [currentPage, setCurrentPage] = useState(1)
const [genProjects, setGenProjects] = useState<generatedProjectProps[]>([])
  const [difficulty, setDifficulty] = useState<string>("BEGINNER")
  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(true)
  const params = useParams()

  const isFormValid = languagesText.trim() !== ""  && techStackText.trim() !== ""

const handleSubmit = async () => {
  const languagesArray = languagesText
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t !== "")
  const techStackArray = techStackText
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t !== "")

  setLanguages(languagesArray)
  setTechStack(techStackArray)

  if (languagesArray.length === 0 || techStackArray.length === 0) {
    toast.error("Please fill in all required fields")
    return
  }

  const sessionId = params.sessionId
  if (!sessionId) {
    toast.error("Error Generating Projects")
    return
  }

  const projectData = {
    programmingLanguage: languagesArray,
    techStack: techStackArray,
    title: title || "Untitled",
    difficulty: difficulty || "BEGINNER",
    description: description || "No Description",
  }

  try {
    setGenProjects([])
    setIsLoading(true)

    const response = await generateProject(projectData, sessionId)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsOpen(false)
    setGenProjects(response?.data)
    toast.success("Project Generated Successfully!")
  } catch (error) {
    console.error("Error generating project:", error)
  } finally {
    setIsLoading(false)
  }
}


  //The Function for redirecting to Project URL
  const redirectProject = async(id:string)=>{
    const sessionId = params.sessionId
    if (!sessionId) {
      toast.error("Error Generating Project")
      return
    }

    navigate(`/${sessionId}/project?projectId=${id}`)

  }

  const handleLanguagesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLanguagesText(e.target.value)
  }

  const handleTechStackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTechStackText(e.target.value)
  }

  useEffect(()=>{
    async function getList()
    {
        try {
          const sessionId = params.sessionId
          if (!sessionId) {
            toast.error("Error Generating Projects")
            return
          }

        setIsLoading(true)

        const response = await getGeneratedProjectsList(sessionId)
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setIsOpen(false)
        setGenProjects(response?.data)
        toast.success("List Generated Successfully!")
      } catch (error) {
        console.error("Error generating project:", error)
      } finally {
        setIsLoading(false)
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
        <div className="flex flex-col h-full w-full">
          <div className="flex-1 flex items-center justify-center px-4">
            {!isLoading && genProjects.length == 0 && (
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
{genProjects.length > 0 && (
  <div className="w-full px-6 pb-10 flex flex-col items-center">
<div className="flex flex-col gap-6 px-4 md:px-10 py-6 w-full max-w-5xl mx-auto">
  {genProjects
    .slice((currentPage - 1) * 5, currentPage * 5)
    .map((project: generatedProjectProps, index: number) => (
      <SpotlightCard
        key={project.id || index}
        className="w-full bg-gradient-to-br from-[#040212] to-[#2a2a2a] hover:from-[#222] hover:to-[#333]
                   p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/10"
      >
        {/* Title */}
        <h3 className="text-2xl md:text-3xl font-semibold text-white mb-3 tracking-wide">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-sm md:text-base text-white/80 leading-relaxed mb-5">
          {project.description}
        </p>

        {/* Labels / Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-400/30">
            {project.difficulty}
          </span>
          {project.techStack.map((tech, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500/20 to-teal-500/20 text-white border border-green-400/30"
            >
              {tech}
            </span>
          ))}
          {project.programmingLanguage.map((lang, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white border border-blue-400/30"
            >
              {lang}
            </span>
          ))}
        </div>

        {/* Footer: Date + Button */}
        <div className="flex justify-between items-center mt-4">
          <p className="text-[12px] text-white/50">
            {new Date(project.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>

          <button
            className="flex items-center gap-2 bg-gradient-to-r from-blue-800 to-slate-600 
                       hover:from-indigo-900 hover:to-blue-500 text-white text-sm 
                       px-4 py-2 rounded-full transition-all duration-300"
            onClick={()=>{redirectProject(project.id)}}
          >
            <Eye size={16} />
            View Project
          </button>
        </div>
      </SpotlightCard>
    ))}
</div>


    {/* Pagination Controls */}
    <div className="flex items-center justify-center mt-6 gap-4">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-lg font-medium transition-all ${
          currentPage === 1
            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
            : "bg-white/10 hover:bg-white/20 text-white"
        }`}
      >
        Previous
      </button>

      <span className="text-white/80">
        Page {currentPage} of {Math.ceil(genProjects.length / 5)}
      </span>

      <button
        onClick={() =>
          setCurrentPage((prev) =>
            prev < Math.ceil(genProjects.length / 5) ? prev + 1 : prev
          )
        }
        disabled={currentPage === Math.ceil(genProjects.length / 5)}
        className={`px-4 py-2 rounded-lg font-medium transition-all ${
          currentPage === Math.ceil(genProjects.length / 5)
            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
            : "bg-white/10 hover:bg-white/20 text-white"
        }`}
      >
        Next
      </button>
    </div>
  </div>
)}


          <div className="w-full px-4 pb-8">
            {/* Collapsible Section */}
            <div className="max-w-4xl mx-auto text-white w-full border border-white/20 rounded-lg overflow-hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white/10 hover:bg-white/20 transition-all duration-200"
              >
                <span className="text-lg font-semibold">Project Details</span>
                {isOpen ? <ChevronDown /> : <ChevronRight />}
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="p-4 space-y-4 bg-white/5"
                  >
                    <div
                      className="grid w-full gap-3 items-center"
                      style={{ gridTemplateColumns: "3fr 1fr" }}
                    >
                      <InputGroup>
                        <InputGroupTextarea
                          placeholder={"Title ..."}
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="resize-none"
                        />
                      </InputGroup>
                      <Select onValueChange={(v) => setDifficulty(v)}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select Difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Difficulty</SelectLabel>
                            <SelectItem value="BEGINNER">Beginner</SelectItem>
                            <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                            <SelectItem value="ADVANCED">Advanced</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <InputGroup>
                      <InputGroupTextarea
                        placeholder={"Programming Languages ...\nE.g : Python , C++ , Javascript"}
                        value={languagesText}
                        onChange={handleLanguagesChange}
                        className="resize-none"
                      />
                    </InputGroup>

                    <InputGroup>
                      <InputGroupTextarea
                        placeholder={"Tech Stack ...\nE.g : MERN , Django , FastAPI"}
                        value={techStackText}
                        onChange={handleTechStackChange}
                        className="resize-none"
                      />
                    </InputGroup>

                    <InputGroup>
                      <InputGroupTextarea
                        placeholder={"Description ... (Optional)"}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="resize-none"
                      />
                    </InputGroup>

                    <div className="flex justify-end">
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Create
