
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { useSound } from "@/components/SoundContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { CircleCheck, Trophy, RotateCw } from "lucide-react";
import MatchCard from "@/components/minigames/MatchCard";
import { EmotionCard } from "@/components/minigames/types";
import { shuffle } from "@/lib/array-utils";

const GAME_TYPE = "mindful_match";

const MindfulMatch = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { playWaterDrop } = useSound();
  
  const [cards, setCards] = useState<EmotionCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [currentEmotion, setCurrentEmotion] = useState<string>("");
  const [reflection, setReflection] = useState<string>("");
  const [gameProgress, setGameProgress] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [levelCompleted, setLevelCompleted] = useState<boolean>(false);
  
  // Generate cards for the current level
  const generateCards = (level: number): EmotionCard[] => {
    const emotionPairs = [
      { id: "joy", name: "Joy", emoji: "😊", color: "bg-yellow-100" },
      { id: "calm", name: "Calm", emoji: "😌", color: "bg-blue-100" },
      { id: "hope", name: "Hope", emoji: "🌈", color: "bg-purple-100" }, 
      { id: "love", name: "Love", emoji: "❤️", color: "bg-red-100" },
      { id: "pride", name: "Pride", emoji: "🦚", color: "bg-indigo-100" },
      { id: "awe", name: "Awe", emoji: "✨", color: "bg-amber-100" },
      { id: "gratitude", name: "Gratitude", emoji: "🙏", color: "bg-green-100" },
      { id: "serenity", name: "Serenity", emoji: "🧘", color: "bg-teal-100" }
    ];
    
    // Determine how many pairs to use based on level
    const pairsCount = Math.min(level + 1, emotionPairs.length);
    const selectedPairs = emotionPairs.slice(0, pairsCount);
    
    // Create pairs of cards
    let cardPairs: EmotionCard[] = [];
    selectedPairs.forEach(emotion => {
      // Create two cards for each emotion
      const card1 = { ...emotion, isFlipped: false, isMatched: false, uniqueId: `${emotion.id}-1` };
      const card2 = { ...emotion, isFlipped: false, isMatched: false, uniqueId: `${emotion.id}-2` };
      cardPairs.push(card1, card2);
    });
    
    // Shuffle the cards
    return shuffle(cardPairs);
  };
  
  // Reset game for a new level
  const resetGame = (level: number) => {
    setCards(generateCards(level));
    setFlippedIndices([]);
    setMatchedPairs([]);
    setGameProgress(0);
    setLevelCompleted(false);
  };
  
  // Load user's current level from database
  const loadUserProgress = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("minigame_progress")
        .select("current_level")
        .eq("user_id", user.id)
        .eq("game_type", GAME_TYPE)
        .maybeSingle();
      
      if (error) {
        console.error("Error loading progress:", error);
        return;
      }
      
      if (data) {
        setCurrentLevel(data.current_level);
      } else {
        // Create new progress record for this user
        const { error: insertError } = await supabase
          .from("minigame_progress")
          .insert({ user_id: user.id, game_type: GAME_TYPE, current_level: 1 });
        
        if (insertError) {
          console.error("Error creating progress:", insertError);
        }
      }
    } catch (err) {
      console.error("Failed to load progress:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Save user's progress
  const saveUserProgress = async (level: number) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from("minigame_progress")
        .update({ current_level: level, updated_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .eq("game_type", GAME_TYPE);
      
      if (error) {
        console.error("Error saving progress:", error);
      }
    } catch (err) {
      console.error("Failed to save progress:", err);
    }
  };
  
  // Save user's reflection
  const saveReflection = async () => {
    if (!user || !currentEmotion) return;
    
    try {
      await supabase
        .from("match_game_reflections")
        .insert({
          user_id: user.id,
          emotion: currentEmotion,
          reflection: reflection.trim() || null
        });
      
      setReflection("");
      setDialogOpen(false);
      toast.success("Reflection saved");
      
      // Give bonus points for reflection
      setScore(prevScore => prevScore + 10);
      
    } catch (err) {
      console.error("Failed to save reflection:", err);
      toast.error("Failed to save reflection");
    }
  };
  
  // Handle card click
  const handleCardClick = (index: number) => {
    // Prevent clicking if two cards are already flipped or if the card is already matched
    if (flippedIndices.length === 2 || cards[index].isMatched || flippedIndices.includes(index)) return;
    
    playWaterDrop();
    
    // Flip the card
    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);
    
    // Update cards to show flipped state
    const updatedCards = [...cards];
    updatedCards[index].isFlipped = true;
    setCards(updatedCards);
    
    // If two cards are flipped, check for a match
    if (newFlippedIndices.length === 2) {
      const [firstIndex, secondIndex] = newFlippedIndices;
      
      setTimeout(() => {
        if (cards[firstIndex].id === cards[secondIndex].id) {
          // Match found
          const updatedCards = [...cards];
          updatedCards[firstIndex].isMatched = true;
          updatedCards[secondIndex].isMatched = true;
          setCards(updatedCards);
          
          // Add to matched pairs
          const newMatchedPairs = [...matchedPairs, cards[firstIndex].id];
          setMatchedPairs(newMatchedPairs);
          
          // Update score - award points for finding a match
          setScore(prevScore => prevScore + (currentLevel * 5));
          
          // Open reflection dialog
          setCurrentEmotion(cards[firstIndex].name);
          setDialogOpen(true);
          
          // Update progress
          const newProgress = ((newMatchedPairs.length) / (cards.length / 2)) * 100;
          setGameProgress(newProgress);
          
          // Check if level is complete
          if (newMatchedPairs.length === cards.length / 2) {
            setLevelCompleted(true);
            
            // Add bonus points for completing level
            setScore(prevScore => prevScore + (currentLevel * 20));
            
            // Display success toast
            toast.success(`Level ${currentLevel} complete!`);
            
            // Save progress
            const nextLevel = currentLevel + 1;
            saveUserProgress(nextLevel);
          }
          
          // Reset flipped indices
          setFlippedIndices([]);
        } else {
          // No match, flip cards back
          const updatedCards = [...cards];
          updatedCards[firstIndex].isFlipped = false;
          updatedCards[secondIndex].isFlipped = false;
          setCards(updatedCards);
          setFlippedIndices([]);
        }
      }, 1000);
    }
  };
  
  // Proceed to next level
  const handleNextLevel = () => {
    const nextLevel = currentLevel + 1;
    setCurrentLevel(nextLevel);
    resetGame(nextLevel);
  };
  
  // Reset current level
  const handleResetLevel = () => {
    resetGame(currentLevel);
  };
  
  // Initialize game
  useEffect(() => {
    loadUserProgress();
  }, [user]);
  
  // Reset game when level changes
  useEffect(() => {
    if (!isLoading) {
      resetGame(currentLevel);
    }
  }, [currentLevel, isLoading]);
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading game...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mindful Match</h1>
          <p className="text-muted-foreground">Level {currentLevel}</p>
        </div>
        <Button onClick={() => navigate("/minigames")}>Back to Games</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mb-4">
        <div>
          <Progress value={gameProgress} className="h-2 mb-2" />
          <p className="text-sm text-muted-foreground">Match Progress: {Math.round(gameProgress)}%</p>
        </div>
        <div className="flex justify-end items-center gap-2">
          <div className="bg-primary/10 rounded-lg px-4 py-2 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            <span className="font-bold">{score}</span>
            <span className="text-muted-foreground text-sm">points</span>
          </div>
          <Button variant="outline" size="icon" onClick={handleResetLevel} title="Reset level">
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="bg-card border rounded-lg shadow p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map((card, index) => (
            <MatchCard
              key={card.uniqueId}
              card={card}
              onClick={() => handleCardClick(index)}
            />
          ))}
        </div>
      </div>
      
      {/* Level Complete Dialog */}
      <Dialog open={levelCompleted} onOpenChange={setLevelCompleted}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CircleCheck className="h-6 w-6 text-primary" />
              Level {currentLevel} Complete!
            </DialogTitle>
            <DialogDescription>
              You've matched all the emotions! Ready for the next challenge?
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-primary/10 rounded-lg p-4 flex flex-col items-center justify-center">
            <Trophy className="h-10 w-10 text-primary mb-2 animate-pulse-light" />
            <p className="font-bold text-lg">{score} points</p>
            <p className="text-sm text-muted-foreground">Level {currentLevel} completed</p>
          </div>
          
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setLevelCompleted(false)}>
              Stay on this level
            </Button>
            <Button onClick={handleNextLevel} className="gap-2">
              <Trophy className="h-4 w-4" /> Next Level
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reflection Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reflect on {currentEmotion}</DialogTitle>
            <DialogDescription>
              When was the last time you felt {currentEmotion.toLowerCase()}? Take a moment to reflect on this emotion.
            </DialogDescription>
          </DialogHeader>
          
          <Textarea
            placeholder={`Write about a time you felt ${currentEmotion.toLowerCase()}...`}
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            className="min-h-[100px]"
          />
          
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Skip
            </Button>
            <Button onClick={saveReflection}>
              Save Reflection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MindfulMatch;
