export default function Analyze() {
  const socialIcons = [
    {
      name: "X",
      href: `https://x.com/ParthGarg6509/`,
      svg: (
        <svg
          className="size-6 transition-transform duration-200 hover:scale-110"
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M10.488 14.651L15.25 21h7l-7.858-10.478L20.93 3h-2.65l-5.117 5.886L8.75 3h-7l7.51 10.015L2.32 21h2.65zM16.25 19L5.75 5h2l10.5 14z"
          ></path>
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/in/parth-garg-1761a531b`,
      svg: (
        <svg
          className="size-6 transition-transform duration-200 hover:scale-110"
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"
          ></path>
        </svg>
      ),
    },
    {
      name: "Github",
      href: `https://github.com/Parth06102006`,
      svg: (
        <svg
          className="size-6 transition-transform duration-200 hover:scale-110"
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.38 7.86 10.9c.57.1.78-.25.78-.55v-2.02c-3.2.7-3.87-1.38-3.87-1.38c-.52-1.32-1.28-1.67-1.28-1.67c-1.04-.71.08-.7.08-.7c1.15.08 1.75 1.18 1.75 1.18c1.02 1.75 2.68 1.25 3.33.95c.1-.74.4-1.25.73-1.54c-2.55-.29-5.23-1.28-5.23-5.68c0-1.26.45-2.3 1.18-3.11c-.12-.29-.51-1.46.11-3.05c0 0 .96-.31 3.15 1.18c.91-.25 1.88-.37 2.85-.38c.97.01 1.94.13 2.85.38c2.18-1.49 3.15-1.18 3.15-1.18c.62 1.59.23 2.76.11 3.05c.73.81 1.18 1.85 1.18 3.11c0 4.41-2.68 5.38-5.24 5.67c.41.35.77 1.04.77 2.1v3.11c0 .31.21.66.79.55A10.97 10.97 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5"
          ></path>
        </svg>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center space-y-8">
          {/* Logo/Brand */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-500 to-slate-600 mb-4">
            <img src="/logo.png" alt="" className="w-13 rounded-2xl h-13 object-cover" />
          </div>

          {/* Main heading */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-blue-200 to-slate-100 leading-tight">
              Coming Soon
            </h1>
            <p className="text-xl text-slate-400 max-w-xl mx-auto leading-relaxed">
              We're building something amazing. Get notified when we launch and be the first to experience what's next.
            </p>
          </div>

          {/* Footer text */}
          <div className="pt-8 border-t border-slate-800">
            <div className="my-6 flex flex-wrap justify-center gap-4 text-sm">
              {socialIcons.map((icon) => (
                <a
                  key={icon.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={icon.name}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
                  href={icon.href}
                >
                  {icon.svg}
                </a>
              ))}
            </div>

            <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-4 ml-4">
              &copy; {new Date().getFullYear()} Made By{" "}
              <span>
                <img src="/signature.svg" alt="Parth Garg signature" className="inline w-30" />
              </span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
