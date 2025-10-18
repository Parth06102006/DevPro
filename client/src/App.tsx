import './App.css'
import SplitText from './components/SplitText'
import {useState} from 'react'
import { Navbar,NavbarButton,NavbarLogo,MobileNav,MobileNavHeader,MobileNavMenu,NavBody,MobileNavToggle,NavItems } from './components/ui/resizable-navbar'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function App() {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", link: "#home" },
    { name: "Features", link: "#features" },
    { name: "Pricing", link: "#pricing" },
    { name: "About", link: "#about" },
    { name: "Contact", link: "#contact" },
  ];

  return (
    <div className="dark bg-[#040212] h-screen w-full text-white">
      <div className='h-[600px] overflow-hidden w-full flex justify-center items-center relative'>
        <div className=' top-5 absolute'>
          <Navbar>
            <NavBody>
              <NavbarLogo />
              <NavItems items={navItems} />
              <div className="flex items-center gap-2">
                <NavbarButton variant="secondary" href="#login">
                  Login
                </NavbarButton>
                <NavbarButton variant="gradient" href="#signup">
                  Sign Up
                </NavbarButton>
              </div>
            </NavBody>

            {/* Mobile Navigation */}
            <MobileNav>
              <MobileNavHeader>
                <NavbarLogo />
                <MobileNavToggle
                  isOpen={isMobileMenuOpen}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                />
              </MobileNavHeader>
              <MobileNavMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
              >
                {navItems.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.link}
                    className="text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <div className="flex flex-col gap-2 w-full pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <NavbarButton variant="secondary" href="#login" className="w-full">
                    Login
                  </NavbarButton>
                  <NavbarButton variant="gradient" href="#signup" className="w-full">
                    Sign Up
                  </NavbarButton>
                </div>
              </MobileNavMenu>
            </MobileNav>
          </Navbar>
        </div>
        <div>
          <img src="/asset.png" alt="" className='rounded-full bg-blend-color  absolute top-5 right-0' />
        </div>
          <div className='flex flex-col gap-1 z-10 text-4xl lg:absolute lg:left-40 lg:top-50' style={{ fontFamily: "Quicksand, sans-serif" }}>
          <SplitText
          text="Build smarter."
          className="text-4xl md:text-6xl lg:text-7xl font-semibold text-center"
          delay={100}
          duration={1}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
        />
        <SplitText
          text="Code faster."
          className="text-4xl md:text-6xl lg:text-7xl  font-semibold text-center"
          delay={100}
          duration={1.4}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
        />
        <SplitText
          text="Learn deeper."
          className="text-4xl md:text-6xl lg:text-7xl  font-semibold text-center"
          delay={100}
          duration={1.8}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
        />
        </div>
        <div className="flex flex-row flex-wrap items-center gap-12 absolute top-120">
              <div className='bg-black flex max-h-fit amx-w-fit items-center px-3 rounded-full gap-3 inset-shadow-xs inset-shadow-white' style={{fontFamily:"Quicksand"}}>
                  <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/maxleiter.png"
                      alt="@maxleiter"
                    />
                    <AvatarFallback>LR</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/evilrabbit.png"
                      alt="@evilrabbit"
                    />
                    <AvatarFallback>ER</AvatarFallback>
                  </Avatar>
              </div>
                Trusted by more than 10K Users
              </div>
        </div>
        </div>
    </div>
  )
}

export default App
