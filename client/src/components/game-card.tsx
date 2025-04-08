import React from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { type Game } from "@shared/schema";

interface GameCardProps {
  game: Game;
  featured?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ game, featured = false }) => {
  const {
    id,
    title,
    description,
    imageUrl,
    ageRange,
    gameType,
    route
  } = game;

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full">
      <div className="relative h-48">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover" 
        />
        {featured && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-accent-500 hover:bg-accent-600">مميز</Badge>
          </div>
        )}
      </div>
      <CardContent className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-primary-600">
            للأعمار {ageRange}
          </span>
          <Link href={route}>
            <a className="inline-flex items-center text-accent-600 hover:text-accent-800">
              جرّب اللعبة
              <ArrowRight className="mr-1 h-4 w-4 rtl:rotate-180" />
            </a>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameCard;
