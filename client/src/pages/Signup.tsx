import { Link } from "react-router-dom"
import Threads from "@/components/Threads"

import { SignupForm } from "@/components/signup-form"

export default function SignupPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 bg-[#040212]">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to="/" className="text-white flex gap-3 items-center">
                <img src="/logo.png" alt="Logo" className="w-10 h-10 object-cover rounded-2xl"/>
              <span className="text-lg font-semibold">DevPro</span></Link>
        </div>
        <SignupForm className="relative z-10"/>
        <div className="absolute inset-0 z-1 opacity-40 overflow-hidden">
          <Threads color={[0.4, 0.6, 1.0]} amplitude={6} distance={0.35} enableMouseInteraction={true} />
        </div>
      </div>
    </div>
  )
}
