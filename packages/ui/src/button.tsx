"use client";

import { ReactNode } from "react";

interface ButtonProps {
  size: "sm" | "md" |"lg";
  className?: string;
  variant: "primary" | "outlined";
  onClick: ()=> void;
  text:string;
  children?:ReactNode
}

const BtnSize = {
  "sm":"p-2",
  "md":"p-4",
  "lg":"p-6"
}

const BtnVariants = {
  "primary":"bg-[#FFD230]",
  "outlined":"border border-gray-300"
}

export const Button = ({size, variant, className, onClick, text, children}: ButtonProps) => {
  return (
    <button
      className={`${className} ${BtnSize[size]} ${BtnVariants[variant]}`} 
      onClick={onClick}
    >
      {text}
    </button>
  );
};
