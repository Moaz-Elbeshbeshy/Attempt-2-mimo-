import React from "react";
import { Button } from "@/components/ui/button";

interface ArabicKeyboardProps {
  onLetterClick: (letter: string) => void;
  size?: "sm" | "md" | "lg";
  disabledKeys?: string[];
  className?: string;
}

const ArabicKeyboard: React.FC<ArabicKeyboardProps> = ({
  onLetterClick,
  size = "md",
  disabledKeys = [],
  className = "",
}) => {
  // Arabic keyboard layout by rows
  const keyboardRows = [
    ["ض", "ص", "ث", "ق", "ف", "غ", "ع", "ه", "خ", "ح", "ج"],
    ["ش", "س", "ي", "ب", "ل", "ا", "ت", "ن", "م", "ك", "ط"],
    ["ئ", "ء", "ؤ", "ر", "لا", "ى", "ة", "و", "ز", "ظ", "د", "ذ"],
  ];

  // Size classes for different keyboard sizes
  const sizeClasses = {
    sm: {
      button: "h-8 w-8 text-sm",
      container: "gap-1",
    },
    md: {
      button: "h-10 w-10 text-base",
      container: "gap-1.5",
    },
    lg: {
      button: "h-12 w-12 text-lg",
      container: "gap-2",
    },
  }[size];

  return (
    <div className={`flex flex-col ${sizeClasses.container} ${className}`}>
      {keyboardRows.map((row, rowIndex) => (
        <div 
          key={rowIndex} 
          className={`flex justify-center ${sizeClasses.container}`}
        >
          {row.map((letter) => (
            <Button
              key={letter}
              variant="outline"
              className={`${sizeClasses.button} font-bold`}
              onClick={() => onLetterClick(letter)}
              disabled={disabledKeys.includes(letter)}
            >
              {letter}
            </Button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ArabicKeyboard;
