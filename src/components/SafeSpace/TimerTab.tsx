import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input }  from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Play, Pause, RefreshCcw } from "lucide-react";
import { useTimer } from "@/context/TimerContext";
import { cn } from "@/lib/utils";

const pad = (n: number) => n.toString().padStart(2, "0");

export default function TimerTab() {
  const { total, left, running, start, pause, resume, reset } = useTimer();
  const [mins, setMins] = useState(Math.max(5, total / 60 || 5));
  const presets = [5, 10, 20];

  /* sync input when timer stops */
  useEffect(() => {
    if (!running) setMins(Math.max(5, total / 60 || 5));
  }, [total, running]);

  const minutes  = Math.floor(left / 60);
  const seconds  = left % 60;
  const finished = total > 0 && left === 0;

  return (
    <div className="flex items-center justify-center w-full h-full">
      <Card className="w-[320px]">
        <CardHeader className="text-center font-semibold">Mindful Timer</CardHeader>

        <CardContent className="grid gap-6">
          {/* quick presets */}
          <div className="flex justify-center gap-3">
            {presets.map((m) => (
              <Button
                key={m}
                size="sm"
                variant={mins === m && !running ? "secondary" : "outline"}
                disabled={running}
                onClick={() => setMins(m)}
              >
                {m} min
              </Button>
            ))}
          </div>

          {/* custom input */}
          <div className="flex flex-col items-center gap-1">
            <label className="text-xs text-muted-foreground">Custom (min)</label>
            <Input
              type="number"
              min={1}
              value={mins}
              onChange={(e) => setMins(Math.max(1, Number(e.target.value) || 1))}
              disabled={running}
              className="w-20 text-center"
            />
          </div>

          {/* countdown */}
          <div
            className={cn(
              "text-center text-6xl font-bold tabular-nums tracking-widest",
              finished && "text-red-600",
            )}
          >
            {pad(minutes)}:{pad(seconds)}
          </div>

          {/* controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="secondary"
              onClick={() => {
                if (!total) start(mins);
                else running ? pause() : resume();
              }}
            >
              {running ? (
                <>
                  <Pause className="h-4 w-4 mr-2" /> Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" /> {left === 0 || !total ? "Start" : "Resume"}
                </>
              )}
            </Button>

            <Button variant="outline" onClick={reset}>
              <RefreshCcw className="h-4 w-4 mr-2" /> Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
