
import React from 'react';
import { motion } from 'motion/react';
import { soundManager } from '../services/soundManager';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  onClick,
  ...props 
}) => {
  // Pixel Art Button Style
  // Thick borders, inset highlight/shadow for pseudo-3D
  
  const baseStyles = "relative font-bold text-lg uppercase transition-all active:top-[4px] active:left-[4px] active:shadow-none font-mono tracking-wider py-3 px-6";
  
  // Box shadow creates the blocky 3D effect without using standard border-radius
  const shadowStyle = "shadow-[4px_4px_0_0_#000000]"; 
  const borderStyle = "border-2 border-black";

  const variants = {
    primary: "bg-cyan-500 text-black hover:bg-cyan-400 hover:text-white",
    secondary: "bg-gray-200 text-black hover:bg-white",
    danger: "bg-red-600 text-white hover:bg-red-500",
    success: "bg-green-500 text-black hover:bg-green-400"
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      soundManager.playButtonSound();
      if (onClick) onClick(e);
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseStyles} ${shadowStyle} ${borderStyle} ${variants[variant]} ${className}`}
      onClick={handleClick}
      {...props}
    >
        {/* Inner Border for extra retro feel */}
        <div className="absolute inset-0 border-2 border-white/20 pointer-events-none"></div>
      {children}
    </motion.button>
  );
};
