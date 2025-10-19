import '../App.css';
import SplitText from '../components/SplitText';
import { useState,useEffect } from 'react';
import {
  Navbar,
  NavbarButton,
  NavbarLogo,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  NavBody,
  MobileNavToggle,
  NavItems
} from '../components/ui/resizable-navbar';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CardSwap, { Card } from '../components/CardSwap';
import Threads from '../components/Threads';
import CardDemo from '../components/cards-demo-1';
import Footer2 from '../components/Footer';
import RotatingText from '../components/RotatingText';
import {X} from "lucide-react"
import {useNavigate} from 'react-router-dom'

function Landing() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCard, setActiveCard] = useState(null); // Track active card for modal view
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Features", link: "#features" },
    { name: "Pricing", link: "#pricing" },
    { name: "About", link: "#about" },
    { name: "Contact", link: "#contact" },
  ];

  useEffect(() => {
  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') setActiveCard(null);
  };
  window.addEventListener('keydown', handleEsc);
  return () => window.removeEventListener('keydown', handleEsc);
}, []);


  return (
    <div className="dark bg-[#040212] w-full text-white overflow-x-hidden">
      {/* HERO SECTION */}
      <section
        id="home"
        className="relative flex flex-col justify-center items-center min-h-screen overflow-hidden"
      >
        {/* Navbar */}
        <div className="absolute top-5 w-full z-50">
          <Navbar>
            <NavBody>
              <NavbarLogo />
              <NavItems items={navItems} />
              <div className="flex items-center gap-2">
                <NavbarButton variant="secondary" href="/login">Login</NavbarButton>
                <NavbarButton variant="gradient" href="/signup">Sign Up</NavbarButton>
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
                  <NavbarButton variant="secondary"onClick={(e:React.MouseEvent<HTMLButtonElement>)=>{
                    e.preventDefault();
                    navigate('/login')
                  }} className="w-full">Login</NavbarButton>
                  <NavbarButton variant="gradient" onClick={(e:React.MouseEvent<HTMLButtonElement>)=>{
                    e.preventDefault();
                    navigate('/signup')
                  }} className="w-full">Sign Up</NavbarButton>
                </div>
              </MobileNavMenu>
            </MobileNav>
          </Navbar>
        </div>

        {/* Hero Illustration */}
        <img
          src="/asset.png"
          alt="hero illustration"
          className="absolute top-10 right-10 w-[450px] md:w-[650px] lg:w-[750px] rounded-full object-cover opacity-80 select-none pointer-events-none"
        />

        {/* Hero Text */}
        <div className="flex flex-col gap-1 z-10 lg:absolute lg:left-24 lg:top-1/3 text-center lg:text-left px-6" style={{ fontFamily: "Quicksand, sans-serif" }}>
          <SplitText text="Build smarter." className="text-4xl md:text-6xl lg:text-7xl font-semibold" delay={100} duration={1} ease="power3.out" splitType="chars" from={{ opacity: 0, y: 40 }} to={{ opacity: 1, y: 0 }} />
          <SplitText text="Code faster." className="text-4xl md:text-6xl lg:text-7xl font-semibold" delay={100} duration={1.4} ease="power3.out" splitType="chars" from={{ opacity: 0, y: 40 }} to={{ opacity: 1, y: 0 }} />
          <SplitText text="Learn deeper." className="text-4xl md:text-6xl lg:text-7xl font-semibold" delay={100} duration={1.8} ease="power3.out" splitType="chars" from={{ opacity: 0, y: 40 }} to={{ opacity: 1, y: 0 }} />
        </div>

        {/* Trusted Users */}
        <div className="absolute bottom-16 w-full flex justify-center z-20">
          <div className="bg-black/70 backdrop-blur-md flex items-center px-4 py-2 rounded-full gap-3 border border-white/10 shadow-[0_0_10px_rgba(255,255,255,0.1)]" style={{ fontFamily: "Quicksand" }}>
            <div className="flex -space-x-2">
              <Avatar><AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /><AvatarFallback>CN</AvatarFallback></Avatar>
              <Avatar><AvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" /><AvatarFallback>LR</AvatarFallback></Avatar>
              <Avatar><AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" /><AvatarFallback>ER</AvatarFallback></Avatar>
            </div>
            Trusted by more than 10K Users
          </div>
        </div>
      </section>

      {/* PROJECT SECTION */}
      <section id="projects" className="relative flex flex-col items-center justify-center min-h-screen py-12 px-6 overflow-hidden">
        {/* Gradient Divider */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-60 blur-3xl" />

        <h2 className="text-center text-4xl md:text-5xl font-semibold mb-6 z-20" style={{ fontFamily: "Quicksand" }}>
          Explore Featured Projects
        </h2>

        {/* Threads Background */}
        <div className="absolute inset-0 z-0 opacity-40">
          <Threads color={[0.4, 0.6, 1.0]} amplitude={6} distance={0.35} enableMouseInteraction={true} />
        </div>

        <div className='absolute left-10 right-100 z-100 text-5xl md:left-10 md:text-7xl lg:text-8xl lg:top-100'>
          <RotatingText
            texts={[
              [
                { text: "Build ", highlight: false },
                { text: "smarter.", highlight: true },
              ],
              [
                { text: "Code ", highlight: false },
                { text: "faster.", highlight: true },
              ],
              [
                { text: "Learn ", highlight: false },
                { text: "deeper.", highlight: true },
              ],
            ]}
            rotationInterval={6000}
            staggerDuration={0.05}
            highlightClassName="bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent font-bold"
          />

        </div>

        {/* Card Swap Centered */}
        <div className="relative z-10 w-full flex justify-center items-center mr-20">
          <div className="max-w-5xl w-full flex justify-center gap-6 pt-80 sm:pt-100  md:pt-100">
            <CardSwap cardDistance={70} verticalDistance={90} delay={6000} pauseOnHover={true}>
              {[1,2,3].map((c, idx) => (
                <Card key={idx} onClick={() => setActiveCard(idx)}>
                  <CardDemo />
                </Card>
              ))}
            </CardSwap>
          </div>
        </div>

        {/* Modal for Card View */}
        {activeCard !== null && (
          <div
            className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
            onClick={() => setActiveCard(null)} // click outside closes
          >
            <div
              onClick={(e) => e.stopPropagation()} // stops inside clicks
              className="max-w-md w-full"
            >
              <div className="relative">
                <CardDemo />

                {/* Close Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // stop the outer click handler
                    setActiveCard(null);
                  }}
                  className="w-6 h-6 rounded-full bg-white absolute top-2 right-2 flex items-center justify-center text-black hover:bg-gray-200 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
      <div className='pt-20'>
        <div className='w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-60 blur-sm'></div>
        <Footer2/>
      </div>
    </div>
  );
}

export default Landing;
