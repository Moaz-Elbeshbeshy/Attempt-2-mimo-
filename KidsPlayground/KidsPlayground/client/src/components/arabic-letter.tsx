import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { parseExamples, playAudio } from "@/lib/arabic-utils";
import { type ArabicLetter } from "@shared/schema";
import { Volume2 } from "lucide-react";

interface ArabicLetterCardProps {
  letter: ArabicLetter;
  showExamples?: boolean;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  interactive?: boolean;
}

const ArabicLetterCard: React.FC<ArabicLetterCardProps> = ({
  letter,
  showExamples = false,
  size = "md",
  onClick,
  interactive = true,
}) => {
  const [playing, setPlaying] = useState(false);
  const examples = parseExamples(letter.examples);
  
  const sizeClasses = {
    sm: {
      container: "max-w-[100px]",
      letter: "text-4xl",
      name: "text-sm",
    },
    md: {
      container: "max-w-[150px]",
      letter: "text-6xl",
      name: "text-base",
    },
    lg: {
      container: "max-w-[200px]",
      letter: "text-8xl",
      name: "text-xl",
    },
  }[size];
  
  const handlePlaySound = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playing || !letter.soundUrl) return;
    
    setPlaying(true);
    try {
      await playAudio(letter.soundUrl);
    } catch (error) {
      console.error("Error playing audio:", error);
    } finally {
      setPlaying(false);
    }
  };
  
  return (
    <Card 
      className={`${sizeClasses.container} transition-all duration-300 ${
        interactive ? "hover:shadow-lg cursor-pointer transform hover:-translate-y-1" : ""
      }`}
      onClick={interactive ? onClick : undefined}
    >
      <CardContent className="flex flex-col items-center justify-center p-4">
        <div className="mb-2 text-center">
          <span className={`${sizeClasses.letter} font-bold text-primary-700`}>
            {letter.letter}
          </span>
        </div>
        
        <div className="flex items-center justify-center mb-2">
          <h3 className={`${sizeClasses.name} font-medium text-gray-700 ml-2`}>
            {letter.name}
          </h3>
          {letter.soundUrl && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-primary-500 hover:text-primary-700"
              onClick={handlePlaySound}
              disabled={playing}
            >
              <Volume2 size={size === "sm" ? 16 : 20} />
            </Button>
          )}
        </div>
        
        {showExamples && examples.length > 0 && (
          <div className="text-sm mt-2 w-full">
            <h4 className="font-medium text-gray-700 mb-1 text-center">أمثلة:</h4>
            <ul className="divide-y divide-gray-100">
              {examples.map((example, idx) => (
                <li key={idx} className="py-1">
                  <p className="text-right font-medium">{example.word}</p>
                  <p className="text-gray-500 text-xs text-left">{example.translation}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {showExamples && (
          <div className="mt-3 w-full">
            <h4 className="font-medium text-gray-700 mb-1 text-center">أشكال الحرف:</h4>
            <div className="grid grid-cols-4 gap-1 text-center">
              <div className="border rounded p-1">
                <p className="text-xs text-gray-500">منفصل</p>
                <p className="text-lg">{letter.isolated}</p>
              </div>
              <div className="border rounded p-1">
                <p className="text-xs text-gray-500">أول</p>
                <p className="text-lg">{letter.initial}</p>
              </div>
              <div className="border rounded p-1">
                <p className="text-xs text-gray-500">وسط</p>
                <p className="text-lg">{letter.medial}</p>
              </div>
              <div className="border rounded p-1">
                <p className="text-xs text-gray-500">آخر</p>
                <p className="text-lg">{letter.final}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ArabicLetterCard;
