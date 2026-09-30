import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Brain, Cpu, Zap, Activity } from 'lucide-react';

interface NeuralNetworkBackgroundProps {
  className?: string;
  onNodeClick?: (nodeName: string) => void;
}

interface NeuralNode {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  xPercent: number; // 0 to 100
  yPercent: number; // 0 to 100
  pulseSpeed: number;
  color: string;
  iconName: 'voice' | 'website' | 'app' | 'sales' | 'support' | 'marketing' | 'automation';
}

export const NeuralNetworkBackground: React.FC<NeuralNetworkBackgroundProps> = ({
  className = '',
  onNodeClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Floating nodes matching exactly the uploaded video's branching architecture
  const nodes: NeuralNode[] = [
    {
      id: 'voice-ai',
      title: 'Voice AI Agent',
      subtitle: 'Real-time Hindi & English speech synthesis',
      category: 'Voice AI',
      xPercent: 50,
      yPercent: 18,
      pulseSpeed: 1.8,
      color: '#38bdf8',
      iconName: 'voice',
    },
    {
      id: 'websites',
      title: 'Custom Websites',
      subtitle: 'Sub-second SaaS & 3D Interactive UI',
      category: 'Websites',
      xPercent: 24,
      yPercent: 78,
      pulseSpeed: 1.4,
      color: '#60a5fa',
      iconName: 'website',
    },
    {
      id: 'mobile-apps',
      title: 'Mobile Apps',
      subtitle: 'Native Android & iOS offline sync',
      category: 'Apps',
      xPercent: 20,
      yPercent: 32,
      pulseSpeed: 1.6,
      color: '#c084fc',
      iconName: 'app',
    },
    {
      id: 'sales-ai',
      title: 'Sales AI Engine',
      subtitle: 'WhatsApp instant 3s lead conversion',
      category: 'Sales AI',
      xPercent: 76,
      yPercent: 24,
      pulseSpeed: 2.0,
      color: '#f43f5e',
      iconName: 'sales',
    },
    {
      id: 'customer-support',
      title: 'Customer Support',
      subtitle: '24/7 Contextual multi-turn bot',
      category: 'Customer Support',
      xPercent: 80,
      yPercent: 75,
      pulseSpeed: 1.5,
      color: '#34d399',
      iconName: 'support',
    },
    {
      id: 'marketing-automation',
      title: 'Marketing Automation',
      subtitle: 'Cross-platform AI social distribution',
      category: 'Marketing',
      xPercent: 50,
      yPercent: 88,
      pulseSpeed: 1.7,
      color: '#fbbf24',
      iconName: 'marketing',
    },
  ];

  // 3D Parallax Tilt calculation on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Canvas animation for glowing synaptic pulses, organic dendritic branches & particle sparks
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    const onResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', onResize);

    // Particle network
    interface PulseParticle {
      nodeIndex: number;
      progress: number;
      speed: number;
      size: number;
    }

    const pulses: PulseParticle[] = [];
    for (let i = 0; i < 24; i++) {
      pulses.push({
        nodeIndex: Math.floor(Math.random() * nodes.length),
        progress: Math.random(),
        speed: 0.004 + Math.random() * 0.007,
        size: 1.5 + Math.random() * 2,
      });
    }

    // Ambient floating cyber dust particles
    const sparks = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 1.8 + 0.6,
      alpha: Math.random() * 0.6 + 0.2,
    }));

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.5 + mousePos.x * 25;
      const centerY = height * 0.5 + mousePos.y * 25;

      // 1. Draw glowing neural core halo (Brain Center)
      const coreGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        10,
        centerX,
        centerY,
        Math.min(width, height) * 0.38
      );
      coreGradient.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
      coreGradient.addColorStop(0.3, 'rgba(255, 42, 58, 0.2)');
      coreGradient.addColorStop(0.7, 'rgba(14, 165, 233, 0.08)');
      coreGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, Math.min(width, height) * 0.4, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw organic synaptic branching lines from AI Brain center to each node
      nodes.forEach((node) => {
        const targetX = (node.xPercent / 100) * width + mousePos.x * 40;
        const targetY = (node.yPercent / 100) * height + mousePos.y * 40;

        // Curved branching dendrite Bezier curve
        const midX = (centerX + targetX) / 2 + Math.sin(time + targetX * 0.01) * 20;
        const midY = (centerY + targetY) / 2 + Math.cos(time + targetY * 0.01) * 20;

        // Faint base synoptic tract
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.quadraticCurveTo(midX, midY, targetX, targetY);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.22)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Secondary glowing energetic strand
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.quadraticCurveTo(midX + 6, midY - 6, targetX, targetY);
        ctx.strokeStyle = 'rgba(255, 60, 80, 0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Radiating pulse rings around target nodes
        const pulseRadius = 14 + Math.sin(time * node.pulseSpeed) * 4;
        ctx.beginPath();
        ctx.arc(targetX, targetY, pulseRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `${node.color}55`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // 3. Render moving signal action potential pulses travelling along synaptic dendrites
      pulses.forEach((p) => {
        p.progress += p.speed;
        if (p.progress > 1) {
          p.progress = 0;
          p.nodeIndex = Math.floor(Math.random() * nodes.length);
        }

        const targetNode = nodes[p.nodeIndex];
        const targetX = (targetNode.xPercent / 100) * width + mousePos.x * 40;
        const targetY = (targetNode.yPercent / 100) * height + mousePos.y * 40;

        const midX = (centerX + targetX) / 2 + Math.sin(time + targetX * 0.01) * 20;
        const midY = (centerY + targetY) / 2 + Math.cos(time + targetY * 0.01) * 20;

        // Quadratic bezier position
        const t = p.progress;
        const px = (1 - t) * (1 - t) * centerX + 2 * (1 - t) * t * midX + t * t * targetX;
        const py = (1 - t) * (1 - t) * centerY + 2 * (1 - t) * t * midY + t * t * targetY;

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = '#67e8f9';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 4. Ambient cyber dust sparks
      sparks.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;
        if (s.y < 0) s.y = height;
        if (s.y > height) s.y = 0;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 197, 253, ${s.alpha * (0.6 + Math.sin(time + s.x) * 0.4)})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, [mousePos]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full h-full min-h-[380px] sm:min-h-[460px] md:min-h-[520px] overflow-hidden rounded-2xl select-none flex items-center justify-center perspective-[1200px] ${className}`}
    >
      {/* 1. Underlying 3D Photorealistic Holographic AI Brain Canvas Background */}
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out pointer-events-none"
        style={{
          transform: `scale(1.08) translate3d(${mousePos.x * 35}px, ${mousePos.y * 35}px, 0) rotateX(${-mousePos.y * 12}deg) rotateY(${mousePos.x * 12}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        <img
          src="/assets/ai_neural_brain_3d.jpg"
          alt="3D Holographic AI Neural Network Brain"
          className="w-full h-full object-cover object-center opacity-75 filter contrast-125 saturate-110"
        />

        {/* Cinematic Vignette & Cyber Radial Mask */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070506] via-transparent to-[#070506]/90" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#070506]/50 to-[#070506]" />
      </div>

      {/* 2. Interactive Real-Time Canvas overlay for neural synapse pulses */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-10 pointer-events-none"
      />

      {/* 3. Central 3D Glowing AI Core Floating Badge */}
      <div
        className="relative z-20 flex flex-col items-center justify-center transition-transform duration-200"
        style={{
          transform: `translate3d(${mousePos.x * 15}px, ${mousePos.y * 15}px, 30px)`,
        }}
      >
        <div className="relative group cursor-pointer">
          {/* Pulsing Core Rings */}
          <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-cyan-500/40 via-blue-600/30 to-[#ff2a3a]/40 blur-xl animate-pulse" />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#12080d]/90 via-[#0a0507]/95 to-[#1c0c14] border-2 border-cyan-400/60 shadow-[0_0_35px_rgba(56,189,248,0.7)] flex flex-col items-center justify-center text-white backdrop-blur-xl hover:scale-105 transition-all">
            <span className="text-[#38bdf8] text-3xl font-black drop-shadow-[0_0_12px_#38bdf8]">
              ॐ
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-200">
              AI CORE
            </span>
          </div>
        </div>
      </div>

      {/* 4. Sleek Holographic HUD Cards positioned on each branching synoptic node */}
      {nodes.map((node) => {
        const isHovered = hoveredNode === node.id;
        return (
          <div
            key={node.id}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
            onClick={() => onNodeClick && onNodeClick(node.title)}
            className="absolute z-20 transition-all duration-300 cursor-pointer"
            style={{
              left: `${node.xPercent}%`,
              top: `${node.yPercent}%`,
              transform: `translate(-50%, -50%) translate3d(${mousePos.x * 45}px, ${mousePos.y * 45}px, 20px) scale(${isHovered ? 1.08 : 1})`,
            }}
          >
            {/* Holographic Glowing Card */}
            <div
              className={`p-2.5 sm:p-3 rounded-2xl backdrop-blur-xl border transition-all duration-300 shadow-2xl flex items-center gap-2.5 max-w-[170px] sm:max-w-[200px] ${
                isHovered
                  ? 'bg-[#1b0b14]/95 border-cyan-400 shadow-[0_0_28px_rgba(56,189,248,0.6)]'
                  : 'bg-[#11070c]/80 border-white/15 hover:border-cyan-400/50 shadow-[0_8px_24px_rgba(0,0,0,0.7)]'
              }`}
              style={{
                boxShadow: isHovered ? `0 0 25px ${node.color}88` : undefined,
              }}
            >
              {/* Category Dot */}
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white shrink-0 shadow-md"
                style={{
                  backgroundColor: `${node.color}25`,
                  border: `1px solid ${node.color}80`,
                  color: node.color,
                }}
              >
                {node.iconName === 'voice' && <Activity className="w-4 h-4" />}
                {node.iconName === 'website' && <Zap className="w-4 h-4" />}
                {node.iconName === 'app' && <Cpu className="w-4 h-4" />}
                {node.iconName === 'sales' && <Sparkles className="w-4 h-4" />}
                {node.iconName === 'support' && <Brain className="w-4 h-4" />}
                {node.iconName === 'marketing' && <Cpu className="w-4 h-4" />}
              </div>

              <div className="overflow-hidden text-left">
                <div className="flex items-center gap-1">
                  <span className="font-extrabold text-[11px] sm:text-xs text-white truncate">
                    {node.title}
                  </span>
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0 animate-ping"
                    style={{ backgroundColor: node.color }}
                  />
                </div>
                <p className="text-[9.5px] sm:text-[10px] text-neutral-300 truncate mt-0.5">
                  {node.subtitle}
                </p>
              </div>
            </div>
          </div>
        );
      })}

      {/* 5. 3D Spatial Grid Floor Plane at bottom */}
      <div
        className="absolute bottom-0 inset-x-0 h-32 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(56, 189, 248, 0.25) 1px, transparent 1px),
            linear-gradient(to top, rgba(56, 189, 248, 0.25) 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px',
          transform: 'perspective(300px) rotateX(60deg)',
          transformOrigin: 'bottom center',
        }}
      />
    </div>
  );
};
