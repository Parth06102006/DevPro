import { motion } from "framer-motion";

// =================== Loader One ===================
export const LoaderOne = () => {
  const transition = (x: number) => ({
    duration: 1,
    repeat: Infinity,
    repeatType: "loop" as const,
    delay: x * 0.2,
    ease: "easeInOut" as const,
  });

  return (
    <div className="flex items-center gap-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          initial={{ y: 0 }}
          animate={{ y: [0, 10, 0] }}
          transition={transition(i)}
          className="h-4 w-4 rounded-full border border-neutral-300 bg-gradient-to-b from-neutral-400 to-neutral-300"
        />
      ))}
    </div>
  );
};

// =================== Loader Two ===================
export const LoaderTwo = () => {
  const transition = (x: number) => ({
    duration: 2,
    repeat: Infinity,
    repeatType: "loop" as const,
    delay: x * 0.2,
    ease: "easeInOut" as const,
  });

  return (
    <div className="flex items-center">
      {[0, 0.4, 0.8].map((delay, i) => (
        <motion.div
          key={i}
          initial={{ x: 0 }}
          animate={{ x: [0, 20, 0] }}
          transition={transition(delay)}
          className={`h-4 w-4 -translate-x-${i * 2} rounded-full bg-neutral-200 shadow-md dark:bg-neutral-500`}
        />
      ))}
    </div>
  );
};

// =================== Loader Three ===================
export const LoaderThree = () => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
        d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11"
      />
    </motion.svg>
  );
};

// =================== Loader Four ===================
export const LoaderFour = ({ text = "Loading..." }: { text?: string }) => {
  return (
    <div className="relative font-bold text-black dark:text-white">
      <motion.span
        animate={{
          transform: ["skew(0deg)", "skew(-40deg)", "skew(0deg)"],
          scaleX: [1, 2, 1],
        }}
        transition={{
          duration: 0.05,
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 2,
          ease: "linear",
          times: [0, 0.2, 0.5, 0.8, 1],
        }}
      >
        {text}
      </motion.span>

      <motion.span
        className="absolute inset-0 text-[#00e571]/50 blur-[0.5px]"
        animate={{
          x: [-2, 4, -3, 1.5, -2],
          y: [-2, 4, -3, 1.5, -2],
          opacity: [0.3, 0.9, 0.4, 0.8, 0.3],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
      >
        {text}
      </motion.span>
    </div>
  );
};

// =================== Loader Five ===================
export const LoaderFive = ({ text }: { text: string }) => {
  return (
    <div className="font-sans font-bold">
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "loop",
            delay: i * 0.05,
            ease: "easeInOut",
            repeatDelay: 2,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </div>
  );
};
