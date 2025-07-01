
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar } from 'recharts';
import { useStatsData } from "@/hooks/useStatsData";

const Stats = () => {
  const { data, loading } = useStatsData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your stats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">Your Stats</h1>
        <p className="text-muted-foreground">Track your mindfulness journey progress.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalSessions}</div>
            <p className="text-xs text-muted-foreground">Meditation sessions completed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Mindful Minutes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.mindfulMinutes}</div>
            <p className="text-xs text-muted-foreground">Total meditation time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Mood Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.moodScore}/10</div>
            <p className="text-xs text-muted-foreground">Current wellbeing level</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Minigame Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.minigameStreak}</div>
            <p className="text-xs text-muted-foreground">Highest level reached</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Time on App</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(data.timeSpentOnApp / 60)}h {data.timeSpentOnApp % 60}m</div>
            <p className="text-xs text-muted-foreground">Total time using the app</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.currentStreak} days</div>
            <p className="text-xs text-muted-foreground">Consecutive days of practice</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="activity" className="w-full">
        <TabsList className="grid grid-cols-1 md:grid-cols-2 mb-4">
          <TabsTrigger value="activity">
            <LineChart className="h-4 w-4 mr-2" /> Weekly Activity
          </TabsTrigger>
          <TabsTrigger value="mood">
            <BarChart className="h-4 w-4 mr-2" /> Mood Tracking
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
              <CardDescription>Your mindfulness minutes this week</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.weeklyData}>
                  <defs>
                    <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="minutes" 
                    stroke="#4CAF50" 
                    fillOpacity={1} 
                    fill="url(#colorMinutes)" 
                    name="Minutes"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="mood">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Mood</CardTitle>
              <CardDescription>Your mood tracking data (1-10 scale)</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={data.weeklyData}>
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 10]} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Bar 
                    dataKey="mood" 
                    fill="var(--primary)" 
                    radius={[4, 4, 0, 0]} 
                    name="Mood"
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Stats;
