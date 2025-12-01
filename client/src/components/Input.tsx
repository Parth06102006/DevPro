import { ArrowUpIcon } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { useEffect, useState } from "react"
import { createResponse } from "@/services/aiService"
import toast from "react-hot-toast"
import { Card, CardContent } from "@/components/ui/card"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { LoaderOne } from "@/components/ui/loader";

type InputProps = {
    text:string
}

export default function Input(props:InputProps) {
  const [text,setText] = useState<string>('');
  const [response,setResponse] = useState<string>('');
const [isLoading, setIsLoading] = useState(true)

  useEffect(()=>{
    setIsLoading(true);
    setText(text)
    setIsLoading(false);
  },[text])

  async function handleResponse()
  {
    try {
      setIsLoading(true)
      const response = await createResponse(text);
      setResponse(response?.data?.content)
      setIsLoading(false)
    } catch {
      toast.error('Error Generating Response')
      setResponse("Sorry , not able to generate the response")
      setIsLoading(false)
    }
  }

  return (
    <div className="grid w-full max-w-sm gap-6">
      <InputGroup>
        <InputGroupTextarea placeholder={props.text} value={text} onChange={(e)=>setText(e.target.value)}/>
        <InputGroupAddon align={"block-end"}  className="justify-end cursor-pointer">
          <InputGroupButton
            variant="default"
            className="rounded-full"
            size="icon-xs"
            onClick={()=>{handleResponse()}}
          >
            <ArrowUpIcon />
            <span className="sr-only">Send</span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      {
        (response || isLoading ) &&
         <Card className="bg-slate-500 border-slate-800 text-slate-900">
        <CardContent className="p-4 max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center">
              <LoaderOne />
            </div>
          ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {response}
                </ReactMarkdown>
            )}
          </CardContent>
      </Card>
      }
    </div>
  )
}
