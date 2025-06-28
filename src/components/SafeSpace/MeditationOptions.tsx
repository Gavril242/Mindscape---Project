
import React from "react";
import { Badge } from "@/components/ui/badge";

interface MeditationOption {
  title: string;
  duration: number;
  description: string;
}

interface MeditationOptionsProps {
  selectedTitle: string;
  onSelectMeditation: (title: string, duration: number) => void;
}

const MeditationOptions: React.FC<MeditationOptionsProps> = ({ 
  selectedTitle, 
  onSelectMeditation 
}) => {
  const options: MeditationOption[] = [
    {
      title: 'Mindful Morning',
      duration: 10,
      description: 'Start your day with clarity and intention'
    },
    {
      title: 'Deep Relaxation',
      duration: 15,
      description: 'Release tension and find calm'
    },
    {
      title: 'Stress Relief',
      duration: 8,
      description: 'Quick practice for moments of stress'
    },
    {
      title: 'Bedtime Relaxation',
      duration: 12,
      description: 'Prepare your mind for restful sleep'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {options.map((option) => (
        <div 
          key={option.title}
          className={`bg-muted/50 rounded-lg p-4 cursor-pointer ${
            selectedTitle === option.title ? 'border-2 border-primary' : 'hover:bg-muted'
          }`}
          onClick={() => onSelectMeditation(option.title, option.duration)}
        >
          <div className="flex justify-between">
            <h3 className="font-medium">{option.title}</h3>
            <Badge>{option.duration} min</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {option.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MeditationOptions;
