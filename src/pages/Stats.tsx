
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart, Calendar } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar } from 'recharts';

// Sample data for charts
const weeklyData = [
  { name: 'Mon', minutes: 15, mood: 7 },
  { name: 'Tue', minutes: 22, mood: 8 },
  { name: 'Wed', minutes: 18, mood: 6 },
  { name: 'Thu', minutes: 25, mood: 7 },
  { name: 'Fri', minutes: 30, mood: 9 },
  { name: 'Sat', minutes: 15, mood: 8 },
  { name: 'Sun', minutes: 20, mood: 8 },
];

const categoryData = [
  { name: 'Meditation', value: 45 },
  { name: 'Journaling', value: 25 },
  { name: 'Breathing', value: 15 },
  { name: 'Focus Time', value: 15 },
];

const moodData = [
  { name: '< 4', value: 2 },
  { name: '4-6', value: 7 },
  { name: '7-8', value: 12 },
  { name: '9-10', value: 9 },
];

const Stats = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">Your Stats</h1>
        <p className="text-muted-foreground">Track your mindfulness journey progress.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Mindful Minutes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,342</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Avg. Mood</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.8/10</div>
            <p className="text-xs text-muted-foreground">+0.5 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Longest Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14 days</div>
            <p className="text-xs text-muted-foreground">Current: 7 days</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="activity" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
          <TabsTrigger value="activity">
            <LineChart className="h-4 w-4 mr-2" /> Activity
          </TabsTrigger>
          <TabsTrigger value="mood">
            <BarChart className="h-4 w-4 mr-2" /> Mood
          </TabsTrigger>
          <TabsTrigger value="categories">
            <PieChart className="h-4 w-4 mr-2" /> Categories
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <Calendar className="h-4 w-4 mr-2" /> Calendar
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
                <AreaChart data={weeklyData}>
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
                <RechartsBarChart data={weeklyData}>
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
        
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Activity Breakdown</CardTitle>
              <CardDescription>How you spend your mindfulness time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex flex-col md:flex-row">
                <div className="flex-1 h-40 md:h-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={categoryData} layout="vertical">
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Bar 
                        dataKey="value" 
                        fill="var(--primary)" 
                        radius={4} 
                        name="Minutes"
                      />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="flex-1 h-40 md:h-auto mt-4 md:mt-0">
                  <div className="space-y-4">
                    <h3 className="font-medium">Top Activities</h3>
                    <div className="space-y-2">
                      {categoryData.map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2" 
                              style={{ backgroundColor: 'var(--primary)' }}
                            />
                            <span>{item.name}</span>
                          </div>
                          <span>{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Overview</CardTitle>
              <CardDescription>Your consistency and streaks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 30 }).map((_, i) => {
                  // Random activity level for demo purposes
                  const activity = Math.floor(Math.random() * 4);
                  let bgClass = "bg-muted/30";
                  
                  if (activity === 1) bgClass = "bg-green-200 dark:bg-green-900/30";
                  if (activity === 2) bgClass = "bg-green-300 dark:bg-green-800/40";
                  if (activity === 3) bgClass = "bg-green-400 dark:bg-green-700/50";
                  
                  return (
                    <div 
                      key={i} 
                      className={`aspect-square rounded ${bgClass} flex items-center justify-center text-xs`}
                    >
                      {i + 1}
                    </div>
                  );
                })}
              </div>
              
              <div className="flex justify-center mt-4">
                <div className="flex items-center space-x-8">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-muted/30 mr-2" />
                    <span className="text-xs">No activity</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-200 dark:bg-green-900/30 mr-2" />
                    <span className="text-xs">Low</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-300 dark:bg-green-800/40 mr-2" />
                    <span className="text-xs">Medium</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-400 dark:bg-green-700/50 mr-2" />
                    <span className="text-xs">High</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button variant="outline">Export Data</Button>
      </div>
    </div>
  );
};

export default Stats;
