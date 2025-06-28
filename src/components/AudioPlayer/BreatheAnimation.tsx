
import React, { useEffect, useState } from 'react';
import { useSound } from "@/components/SoundContext";

interface BreathingPattern {
  inhaleTime: number;
  holdInTime: number;
  exhaleTime: number;
  holdOutTime: number;
}

interface BreatheAnimationProps {
  isActive: boolean;
  pattern: BreathingPattern;
}

const BreatheAnimation: React.FC<BreatheAnimationProps> = ({ isActive, pattern }) => {
  const [phase, setPhase] = useState<'inhale' | 'holdIn' | 'exhale' | 'holdOut'>('inhale');
  const [timer, setTimer] = useState(0);
  const [instruction, setInstruction] = useState('Breathe in');
  const { playInhale, playExhale } = useSound();
  
  useEffect(() => {
    if (!isActive) {
      setPhase('inhale');
      setTimer(0);
      setInstruction('Breathe in');
      return;
    }
    
    const interval = setInterval(() => {
      setTimer(prev => {
        // Calculate next timer value
        const next = prev + 1;
        
        // Determine phase transitions
        switch (phase) {
          case 'inhale':
            if (next >= pattern.inhaleTime) {
              setPhase('holdIn');
              setInstruction('Hold');
              return 0;
            }
            return next;
          case 'holdIn':
            if (next >= pattern.holdInTime) {
              setPhase('exhale');
              setInstruction('Breathe out');
              try {
                playExhale(); // Play exhale sound when transitioning to exhale phase
              } catch (e) {
                console.error("Error playing exhale sound:", e);
              }
              return 0;
            }
            return next;
          case 'exhale':
            if (next >= pattern.exhaleTime) {
              setPhase('holdOut');
              setInstruction('Reset');
              return 0;
            }
            return next;
          case 'holdOut':
            if (next >= pattern.holdOutTime) {
              setPhase('inhale');
              setInstruction('Breathe in');
              try {
                playInhale(); // Play inhale sound when transitioning to inhale phase
              } catch (e) {
                console.error("Error playing inhale sound:", e);
              }
              return 0;
            }
            return next;
          default:
            return next;
        }
      });
    }, 1000);
    
    // Play inhale sound when starting the exercise
    if (phase === 'inhale' && timer === 0) {
      try {
        playInhale();
      } catch (e) {
        console.error("Error playing initial inhale sound:", e);
      }
    }
    
    return () => clearInterval(interval);
  }, [isActive, phase, pattern, timer]);
  
  const scaleValue = () => {
    switch (phase) {
      case 'inhale':
        return 1 + (timer / pattern.inhaleTime) * 0.5;
      case 'holdIn':
        return 1.5;
      case 'exhale':
        return 1.5 - (timer / pattern.exhaleTime) * 0.5;
      case 'holdOut':
        return 1;
      default:
        return 1;
    }
  };
  
  const opacityValue = () => {
    switch (phase) {
      case 'inhale':
        return 0.5 + (timer / pattern.inhaleTime) * 0.5;
      case 'holdIn':
        return 1;
      case 'exhale':
        return 1 - (timer / pattern.exhaleTime) * 0.5;
      case 'holdOut':
        return 0.5;
      default:
        return 0.5;
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex justify-center items-center h-60 w-60">
        {/* Outer circle */}
        <div className="absolute h-52 w-52 rounded-full border-2 border-primary/20"></div>
        
        {/* Animated circle */}
        <div 
          className={`absolute rounded-full bg-primary/20 transition-all duration-1000 ease-in-out flex items-center justify-center ${isActive ? '' : 'scale-100 opacity-50'}`}
          style={{ 
            height: '12rem', 
            width: '12rem', 
            transform: `scale(${isActive ? scaleValue() : 1})`,
            opacity: isActive ? opacityValue() : 0.5
          }}
        >
          <span className="text-lg font-medium">{instruction}</span>
        </div>
      </div>
      
      {/* Timer display */}
      {isActive && (
        <div className="mt-4 text-center space-y-2">
          <p className="text-3xl font-semibold">{timer}</p>
          <p className="text-sm text-muted-foreground">{phase}</p>
        </div>
      )}
    </div>
  );
};

export default BreatheAnimation;
