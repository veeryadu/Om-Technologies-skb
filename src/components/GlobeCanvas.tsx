import React, { useEffect, useRef } from 'react';

interface GlobeCanvasProps {
  interactive?: boolean;
  className?: string;
}

export const GlobeCanvas: React.FC<GlobeCanvasProps> = ({ interactive = true, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Globe parameters
    const globeRadius = Math.min(width, height) * 0.32;
    let rotationY = 0;
    let rotationX = 0.25;
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    // Generate surface particles (latitude & longitude grid points)
    const points: Array<{
      phi: number;
      theta: number;
      size: number;
      intensity: number;
      isHotspot: boolean;
      pulse: number;
    }> = [];

    const numLatitudes = 24;
    for (let i = 0; i <= numLatitudes; i++) {
      const lat = (i / numLatitudes) * Math.PI - Math.PI / 2;
      const radiusAtLat = Math.cos(lat);
      const pointsInRing = Math.max(6, Math.floor(48 * radiusAtLat));

      for (let j = 0; j < pointsInRing; j++) {
        const lon = (j / pointsInRing) * 2 * Math.PI;
        // Seed some organic continents/clusters
        const continentNoise = Math.sin(lat * 3 + lon * 2) * Math.cos(lon * 4 - lat);
        const isContinent = continentNoise > -0.2;

        if (isContinent || Math.random() > 0.6) {
          const isHotspot = Math.random() > 0.94;
          points.push({
            phi: lat,
            theta: lon,
            size: isHotspot ? 2.5 : Math.random() * 1.4 + 0.8,
            intensity: isHotspot ? 1 : Math.random() * 0.6 + 0.4,
            isHotspot,
            pulse: Math.random() * Math.PI * 2,
          });
        }
      }
    }

    // Generate orbital rings particles (representing AI neural data rings)
    const rings = [
      { radius: globeRadius * 1.35, tilt: 0.45, rotationSpeed: 0.008, particles: 60 },
      { radius: globeRadius * 1.55, tilt: -0.38, rotationSpeed: -0.006, particles: 80 },
      { radius: globeRadius * 1.22, tilt: 0.75, rotationSpeed: 0.012, particles: 45 },
    ];

    const ringParticles: Array<{
      ringIndex: number;
      angle: number;
      size: number;
      speed: number;
      alpha: number;
    }> = [];

    rings.forEach((ring, rIdx) => {
      for (let p = 0; p < ring.particles; p++) {
        ringParticles.push({
          ringIndex: rIdx,
          angle: (p / ring.particles) * Math.PI * 2 + Math.random() * 0.1,
          size: Math.random() * 1.8 + 0.6,
          speed: ring.rotationSpeed + (Math.random() - 0.5) * 0.002,
          alpha: Math.random() * 0.7 + 0.3,
        });
      }
    });

    // Mouse drag controls
    const onMouseDown = (e: MouseEvent) => {
      if (!interactive) return;
      isDragging = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!interactive || !isDragging) return;
      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      rotationY += dx * 0.005;
      rotationX = Math.max(-0.6, Math.min(0.6, rotationX + dy * 0.005));
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    let time = 0;

    const render = () => {
      time += 0.02;
      if (!isDragging) {
        rotationY += 0.004; // smooth constant spin
      }

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height * 0.52;

      // 1. Core Atmosphere Outer Glow
      const glowGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        globeRadius * 0.4,
        centerX,
        centerY,
        globeRadius * 1.8
      );
      glowGrad.addColorStop(0, 'rgba(255, 30, 50, 0.28)');
      glowGrad.addColorStop(0.5, 'rgba(200, 15, 30, 0.12)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, globeRadius * 1.8, 0, Math.PI * 2);
      ctx.fill();

      // 2. Inner sphere dark core with crimson rim
      const sphereGrad = ctx.createRadialGradient(
        centerX - globeRadius * 0.3,
        centerY - globeRadius * 0.3,
        globeRadius * 0.1,
        centerX,
        centerY,
        globeRadius
      );
      sphereGrad.addColorStop(0, 'rgba(25, 6, 9, 0.95)');
      sphereGrad.addColorStop(0.7, 'rgba(12, 3, 5, 0.98)');
      sphereGrad.addColorStop(0.95, 'rgba(80, 10, 20, 0.9)');
      sphereGrad.addColorStop(1, 'rgba(255, 45, 65, 0.8)');

      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, globeRadius, 0, Math.PI * 2);
      ctx.fill();

      // 3. Draw Back Half of Orbital Rings
      ringParticles.forEach((rp) => {
        rp.angle += rp.speed;
        const ring = rings[rp.ringIndex];
        const r = ring.radius;

        // 3D coordinates on tilted plane
        const px = r * Math.cos(rp.angle);
        const py = r * Math.sin(rp.angle) * Math.sin(ring.tilt);
        const pz = r * Math.sin(rp.angle) * Math.cos(ring.tilt);

        // Project with rotationY
        const cosY = Math.cos(rotationY * 0.5);
        const sinY = Math.sin(rotationY * 0.5);
        const rotX = px * cosY - pz * sinY;
        const rotZ = px * sinY + pz * cosY;

        if (rotZ < 0) {
          // Behind globe
          const screenX = centerX + rotX;
          const screenY = centerY + py;
          ctx.beginPath();
          ctx.arc(screenX, screenY, rp.size * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 60, 80, ${rp.alpha * 0.35})`;
          ctx.fill();
        }
      });

      // 4. Draw Projected Surface Points & Network Lines
      const projectedPoints: Array<{
        x: number;
        y: number;
        z: number;
        size: number;
        intensity: number;
        isHotspot: boolean;
        pulse: number;
      }> = [];

      points.forEach((pt) => {
        // Spherical to 3D Cartesian
        const cosLat = Math.cos(pt.phi);
        const sinLat = Math.sin(pt.phi);
        const cosLon = Math.cos(pt.theta + rotationY);
        const sinLon = Math.sin(pt.theta + rotationY);

        let x = globeRadius * cosLat * sinLon;
        let y = globeRadius * sinLat;
        let z = globeRadius * cosLat * cosLon;

        // Apply X rotation (tilt)
        const cosX = Math.cos(rotationX);
        const sinX = Math.sin(rotationX);
        const y2 = y * cosX - z * sinX;
        const z2 = y * sinX + z * cosX;

        if (z2 > -globeRadius * 0.25) {
          // Visible front hemisphere
          const scale = (z2 + globeRadius) / (2 * globeRadius); // 0 to 1 depth
          projectedPoints.push({
            x: centerX + x,
            y: centerY + y2,
            z: z2,
            size: pt.size * (0.6 + scale * 0.6),
            intensity: pt.intensity * (0.3 + scale * 0.7),
            isHotspot: pt.isHotspot,
            pulse: pt.pulse,
          });
        }
      });

      // Draw subtle neural connection lines between nearby hotspots
      const hotspots = projectedPoints.filter((p) => p.isHotspot && p.z > 0);
      ctx.lineWidth = 0.8;
      for (let a = 0; a < hotspots.length; a++) {
        for (let b = a + 1; b < hotspots.length; b++) {
          const dx = hotspots[a].x - hotspots[b].x;
          const dy = hotspots[a].y - hotspots[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < globeRadius * 0.5) {
            const alpha = (1 - dist / (globeRadius * 0.5)) * 0.45;
            ctx.strokeStyle = `rgba(255, 50, 70, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(hotspots[a].x, hotspots[a].y);
            ctx.lineTo(hotspots[b].x, hotspots[b].y);
            ctx.stroke();
          }
        }
      }

      // Draw surface points
      projectedPoints.forEach((pt) => {
        const pulseEffect = pt.isHotspot ? Math.sin(time * 3 + pt.pulse) * 0.5 + 0.5 : 0;
        const currentSize = pt.size + pulseEffect * 1.5;

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, currentSize, 0, Math.PI * 2);

        if (pt.isHotspot) {
          // Hotspot glow
          ctx.fillStyle = `rgba(255, 230, 230, ${0.9 + pulseEffect * 0.1})`;
          ctx.shadowColor = '#ff2a3a';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        } else {
          ctx.fillStyle = `rgba(255, 60, 80, ${pt.intensity * 0.85})`;
          ctx.fill();
        }
      });

      // 5. Draw Front Half of Orbital Rings
      ringParticles.forEach((rp) => {
        const ring = rings[rp.ringIndex];
        const r = ring.radius;

        const px = r * Math.cos(rp.angle);
        const py = r * Math.sin(rp.angle) * Math.sin(ring.tilt);
        const pz = r * Math.sin(rp.angle) * Math.cos(ring.tilt);

        const cosY = Math.cos(rotationY * 0.5);
        const sinY = Math.sin(rotationY * 0.5);
        const rotX = px * cosY - pz * sinY;
        const rotZ = px * sinY + pz * cosY;

        if (rotZ >= 0) {
          // Front of globe
          const screenX = centerX + rotX;
          const screenY = centerY + py;
          ctx.beginPath();
          ctx.arc(screenX, screenY, rp.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 90, 110, ${rp.alpha * 0.9})`;
          ctx.shadowColor = '#ff2b3e';
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // 6. Draw glowing orbital ring lines (faint continuous tracks)
      rings.forEach((ring) => {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.scale(1, Math.sin(ring.tilt));
        ctx.beginPath();
        ctx.arc(0, 0, ring.radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 45, 65, 0.18)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      });

      // 7. Edge Rim Light
      ctx.beginPath();
      ctx.arc(centerX, centerY, globeRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 80, 100, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [interactive]);

  return (
    <div className={`relative w-full h-full cursor-grab active:cursor-grabbing select-none ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
