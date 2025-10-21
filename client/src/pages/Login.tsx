import GradientText from "@/components/GradientText"
import { Link } from "react-router-dom"
import Threads from "@/components/Threads"

import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="dark grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to="/" className="text-white flex gap-3 items-center cursor-pointer">
                <img src="/logo.png" alt="Logo" className="w-10 h-10 object-cover rounded-2xl"/>
              <span className="text-lg font-semibold">DevPro</span></Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs z-2">
            <LoginForm className="text-white bg-[]"/>
          </div>
        </div>
      </div>
        <div className="absolute inset-0 z-1 opacity-40 overflow-hidden">
          <Threads color={[0.4, 0.6, 1.0]} amplitude={6} distance={0.35} enableMouseInteraction={true} />
        </div>
        <div className="relative h-screen bg-[#0b0b1a] overflow-hidden backdrop-blur-sm border border-white/10 rounded-xl  hidden lg:block z-4">
        <div className="h-screen w-1 bg-[#0b0b1a] absolute z-10"></div>
        <img
            src="/asset2.png"
            alt="Image"
            className="absolute inset-0 h-full w-full brightness-[0.8] mix-blend-difference "
        />
        <p className="absolute top-25 left-40  text-7xl text-white" style={{fontFamily:"Quicksand"}}>
            <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={3}
                showBorder={false}
                className="custom-class"
                >
                Build Better
            </GradientText>
        </p>
        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#0b0b1a] to-transparent" />
        </div>
    </div>
  )
}

