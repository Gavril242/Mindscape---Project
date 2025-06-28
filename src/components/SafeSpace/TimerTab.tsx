
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TimerTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Focus Timer</CardTitle>
        <CardDescription>Set a timer for your mindfulness or focus session</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="text-6xl font-bold mb-8">
          25:00
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Button variant="outline">5 min</Button>
          <Button variant="outline">10 min</Button>
          <Button variant="outline">15 min</Button>
          <Button variant="outline">20 min</Button>
          <Button variant="secondary">25 min</Button>
          <Button variant="outline">30 min</Button>
        </div>
        
        <div className="flex gap-4">
          <Button variant="outline" className="w-32">Reset</Button>
          <Button className="w-32">Start</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimerTab;
