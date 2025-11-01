// Button.tsx
import React from "react";

interface ButtonProps {
  label?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ label = "Button", onClick }) => {
  return (
    <div className="flex items-center rounded-lg">
      <button
        onClick={onClick}
        className="w-full relative inline-flex items-center justify-center border select-none font-sans font-medium text-center px-4 py-2 text-white text-sm rounded-lg bg-white/2.5 border-white/50 backdrop-blur-sm shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] hover:bg-white/30 transition-all duration-300 antialiased before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none"
      >
        {label}
      </button>
    </div>
  );
};

export default Button;
