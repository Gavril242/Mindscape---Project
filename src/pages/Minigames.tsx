
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Minigames = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">Minigames</h1>
        <p className="text-muted-foreground">
          Enjoy these mindfulness games designed to help you connect with your emotions.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="overflow-hidden">
          <CardHeader className="bg-primary/10">
            <CardTitle>Mindful Match</CardTitle>
            <CardDescription>Memory game with an emotional twist</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p>Match pairs of cards while reflecting on the emotions they represent. 
            Progress through levels of increasing difficulty and save your reflections.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/mindful-match")} className="w-full">
              Play Now
            </Button>
          </CardFooter>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="bg-secondary/10">
            <CardTitle>Mindful Labyrinth</CardTitle>
            <CardDescription>Navigate through wisdom and inspiration</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p>Journey through a mystical labyrinth while discovering motivational quotes and helpful hints. 
            Find your path to inner peace and collect wisdom along the way.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/mindful-labyrinth")} className="w-full">
              Explore Now
            </Button>
          </CardFooter>
        </Card>
        
        {/* Placeholder for future games */}
        <Card className="overflow-hidden opacity-50">
          <CardHeader className="bg-muted/50">
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>More mindfulness games</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p>More mindfulness games are being developed to help you on your wellness journey.</p>
          </CardContent>
          <CardFooter>
            <Button disabled className="w-full">
              Stay Tuned
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Minigames;
