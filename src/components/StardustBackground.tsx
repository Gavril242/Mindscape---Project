import React, { useRef, useEffect, useCallback } from 'react';
import { useTheme } from '@/components/theme-provider';

interface Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  opacity: number;
  initialX: number;
  initialY: number;
  hue: number;
  twinkleSpeed: number;
  twinklePhase: number;
  update: (mouseX: number | null, mouseY: number | null, canvasWidth: number, canvasHeight: number) => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

const getParticleHueForTheme = (colorTheme: string): number => {
    switch (colorTheme) {
        case 'blue': return 210;
        case 'orange': return 30;
        case 'purple': return 270;
        case 'teal': return 180;
        case 'green':
        default: return 120;
    }
}

const createParticle = (
  canvasWidth: number,
  canvasHeight: number,
  hue: number
): Particle => {
  const x = Math.random() * canvasWidth;
  const y = Math.random() * canvasHeight;
  const size = Math.random() * 2 + 0.5;
  const vx = (Math.random() - 0.5) * 0.2;
  const vy = (Math.random() - 0.5) * 0.2;

  return {
    x,
    y,
    size,
    vx,
    vy,
    opacity: Math.random() * 0.5 + 0.3,
    initialX: x,
    initialY: y,
    hue,
    twinkleSpeed: Math.random() * 0.05 + 0.01,
    twinklePhase: Math.random() * Math.PI * 2,

    update(mouseX, mouseY, canvasWidth, canvasHeight) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvasWidth) this.vx *= -1;
        if (this.y < 0 || this.y > canvasHeight) this.vy *= -1;

        if (mouseX !== null && mouseY !== null) {
            const dx = this.x - mouseX;
            const dy = this.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const repulsionRadius = 150;

            if (distance < repulsionRadius) {
                const force = (repulsionRadius - distance) / repulsionRadius;
                this.x += (dx / distance) * force * 2;
                this.y += (dy / distance) * force * 2;
            }
        }
        
        this.vx += (this.initialX - this.x) * 0.0001;
        this.vy += (this.initialY - this.y) * 0.0001;
        
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        const maxSpeed = 0.6;
        if (speed > maxSpeed) {
            this.vx = (this.vx / speed) * maxSpeed;
            this.vy = (this.vy / speed) * maxSpeed;
        }

        this.twinklePhase += this.twinkleSpeed;
    },

    draw(ctx) {
        const currentOpacity = this.opacity * (Math.sin(this.twinklePhase) * 0.5 + 0.5);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        const lightness = 70 + Math.sin(this.twinklePhase) * 20; // from 50 to 90
        const saturation = 90;
        
        ctx.fillStyle = `hsla(${this.hue}, ${saturation}%, ${lightness}%, ${currentOpacity})`;
        
        ctx.shadowBlur = this.size * 2;
        ctx.shadowColor = `hsla(${this.hue}, ${saturation}%, ${lightness}%, 1)`;
        ctx.fill();
        ctx.shadowBlur = 0;
    },
  };
};

const StardustBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const mousePosRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
    const animationFrameId = useRef<number>();
    const { colorTheme } = useTheme();

    const particleHue = getParticleHueForTheme(colorTheme);

    const initCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const numParticles = Math.floor((canvas.width * canvas.height) / 9000);
        particlesRef.current = [];
        for (let i = 0; i < numParticles; i++) {
            particlesRef.current.push(createParticle(canvas.width, canvas.height, particleHue));
        }
    }, [particleHue]);

    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particlesRef.current.forEach(particle => {
            particle.update(mousePosRef.current.x, mousePosRef.current.y, canvas.width, canvas.height);
            particle.draw(ctx);
        });
        
        animationFrameId.current = requestAnimationFrame(animate);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
            initCanvas();
            if (canvasRef.current?.getContext('2d')) {
                animate();
            }
        };

        window.addEventListener('resize', handleResize);
        initCanvas();
        if (canvasRef.current?.getContext('2d')) {
            animate();
        }

        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [initCanvas, animate]);

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            mousePosRef.current = { x: e.clientX, y: e.clientY };
        };
        const onMouseLeave = () => {
            mousePosRef.current = { x: null, y: null };
        };
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseleave', onMouseLeave);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseleave', onMouseLeave);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full z-[-1] pointer-events-none"
            aria-hidden="true"
        />
    );
};

export default StardustBackground;
