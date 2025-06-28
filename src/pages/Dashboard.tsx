
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, Target, TrendingUp } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { DailyQuote } from "@/components/dashboard/DailyQuote";
import { MinigameOfTheDay } from "@/components/dashboard/MinigameOfTheDay";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { data, loading } = useDashboardData();
  const navigate = useNavigate();

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {data.userName}</h1>
        <p className="text-muted-foreground">Here's an overview of your mindfulness journey.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/stats')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Current Streak
            </CardTitle>
            <CardDescription>Your consistency matters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{data.currentStreak} Days</div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              {data.currentStreak > 0 ? "Keep it going! You're doing great." : "Start your streak today!"}
            </p>
          </CardFooter>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/stats')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Total Focus Time
            </CardTitle>
            <CardDescription>All-time mindfulness</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{formatTime(data.totalTimeSeconds)}</div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">Across {data.totalSessions} sessions</p>
          </CardFooter>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/stats')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Today's Activities
            </CardTitle>
            <CardDescription>Progress today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{data.todayActivities}</div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">Activities completed</p>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Today's Goal</CardTitle>
            <CardDescription>15 minutes of mindfulness practice</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Progress</span>
                <span className="text-primary font-medium">
                  {Math.min(data.todayActivities * 5, 15)}/15 min
                </span>
              </div>
              <Progress value={Math.min((data.todayActivities * 5 / 15) * 100, 100)} />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate('/safe-space')}>Continue Practice</Button>
          </CardFooter>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recommended Sessions</CardTitle>
            <CardDescription>Based on your preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Morning Clarity</h4>
                  <p className="text-sm text-muted-foreground">10 min session</p>
                </div>
                <Badge>New</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Stress Relief</h4>
                  <p className="text-sm text-muted-foreground">15 min session</p>
                </div>
                <Badge variant="outline">Popular</Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate('/safe-space')}>
              <span>View All Sessions</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DailyQuote />
        <MinigameOfTheDay />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Active AI Model</CardTitle>
          <CardDescription>Currently using local processing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2 animate-pulse"></div>
            <div className="font-medium">MindHUB-3B running locally</div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Medium-sized model optimized for mindfulness coaching and personal insights.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={() => navigate('/models')}>
            Manage AI Models
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Dashboard;
