import { createContext, useContext, useEffect, useRef, useState } from "react";

type TimerState = {
  total: number;        // seconds originally set
  left: number;         // seconds remaining
  running: boolean;
  start: (mins: number) => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
};

const TimerCtx = createContext<TimerState | null>(null);

export const TimerProvider = ({ children }: { children: React.ReactNode }) => {
  const [total, setTotal]   = useState(0);
  const [left,  setLeft]    = useState(0);
  const [running, setRun]   = useState(false);
  const ref = useRef<NodeJS.Timeout | null>(null);

  /* ticker */
  useEffect(() => {
    if (!running) return;
    ref.current = setInterval(() => {
      setLeft((prev) => {
        if (prev <= 1) {
          clearInterval(ref.current!);
          setRun(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current!);
  }, [running]);

  /* api */
  const start = (mins: number) => {
    clearInterval(ref.current!);
    const secs = mins * 60;
    setTotal(secs);
    setLeft(secs);
    setRun(true);
  };
  const pause  = () => setRun(false);
  const resume = () => left > 0 && setRun(true);
/* inside TimerProvider */

const reset = () => {
  clearInterval(ref.current!);
  setRun(false);
  setLeft(0);    // nothing left
  setTotal(0);   // clear total so UI shows Start
};


  return (
    <TimerCtx.Provider value={{ total, left, running, start, pause, resume, reset }}>
      {children}
    </TimerCtx.Provider>
  );
};

export const useTimer = () => {
  const ctx = useContext(TimerCtx);
  if (!ctx) throw new Error("useTimer must be used inside TimerProvider");
  return ctx;
};
