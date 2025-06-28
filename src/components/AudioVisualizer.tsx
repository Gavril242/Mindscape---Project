
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
    if (youtubeId) {
      // Create hidden YouTube iframe for audio extraction
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = `https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&autoplay=1&controls=0`;
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      document.body.appendChild(iframe);
      
      // Set up audio context
      const context = new AudioContext();
      const analyzer = context.createAnalyser();
      analyzer.fftSize = 256;
      const bufferLength = analyzer.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      setAudioContext(context);
      setAnalyser(analyzer);
      setDataArray(dataArray);
      
      // Set isPlaying to true when audio starts
      setIsPlaying(true);
      
      // Extract duration from YouTube
      if (audioRef.current) {
        audioRef.current.onloadedmetadata = () => {
          if (audioRef.current) {
            onDurationChange(audioRef.current.duration);
          }
        };
        
        audioRef.current.onended = () => {
          onEnd();
        };
      }
      
      return () => {
        // Clean up
        if (audioContext) {
          audioContext.close();
        }
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        document.body.removeChild(iframe);
      };
    }
  }, [youtubeId]);

  // Animation function
  const animate = () => {
    if (!canvasRef.current || !analyser || !dataArray) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Get canvas dimensions
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Get frequency data
    analyser.getByteFrequencyData(dataArray);
    
    // Draw visualization
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 4;
    
    // Base circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(100, 100, 255, 0.2)';
    ctx.fill();
    
    // Draw waveform
    for (let i = 0; i < dataArray.length; i++) {
      const amplitude = dataArray[i] / 255;
      const angle = (i / dataArray.length) * 2 * Math.PI;
      const x = centerX + (radius + amplitude * 50) * Math.cos(angle);
      const y = centerY + (radius + amplitude * 50) * Math.sin(angle);
      
      if (i === 0) {
        ctx.beginPath();
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    // Close the path and style it
    ctx.closePath();
    ctx.strokeStyle = 'rgba(100, 100, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = 'rgba(100, 100, 255, 0.2)';
    ctx.fill();
    
    // Pulsating inner circle based on low frequencies
    const bassSum = dataArray.slice(0, 10).reduce((sum, value) => sum + value, 0) / 2550;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * (0.5 + bassSum * 0.3), 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(100, 200, 255, 0.4)';
    ctx.fill();
    
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
      <audio ref={audioRef} src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1`} className="hidden" />
    </div>
  );
};

export default AudioVisualizer;
