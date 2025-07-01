
import React, { useRef, useEffect, useState } from 'react';

interface AudioVisualizerProps {
  youtubeId: string;
  onDurationChange: (duration: number) => void;
  onEnd: () => void;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ 
  youtubeId, 
  onDurationChange,
  onEnd
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [dataArray, setDataArray] = useState<Uint8Array | null>(null);
  const animationRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Set up audio context and analyzer when component mounts
  useEffect(() => {
   
  }, [youtubeId]);

  // Animation function
  const animate = () => {
    if (!analyser || !dataArray || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    analyser.getByteFrequencyData(dataArray);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const barWidth = (canvas.width / dataArray.length) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < dataArray.length; i++) {
      barHeight = dataArray[i];
      ctx.fillStyle = `rgb(${barHeight + 100},50,50)`;
      ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
      x += barWidth + 1;
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  // Start animation when analyser is ready
  useEffect(() => {
    if (analyser && dataArray && isPlaying) {
      animate();
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [analyser, dataArray, isPlaying]);

  return (
    <div className="relative w-full h-full flex justify-center items-center bg-black/10 rounded-lg overflow-hidden">
      <canvas 
        ref={canvasRef} 
        width={400} 
        height={400}
        className="w-full h-full max-h-[400px]" 
      />
      <audio ref={audioRef} src={`-`} className="hidden" />
    </div>
  );
};

export default AudioVisualizer;
