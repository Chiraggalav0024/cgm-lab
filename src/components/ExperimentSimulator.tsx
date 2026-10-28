import React, { useRef, useEffect, useState } from 'react';
import { Experiment } from '../data/experimentsData.ts';
import {
  computeDdaLine,
  computeBresenhamLine,
  computeMidpointCircle,
  computeMidpointEllipse,
  transform2DTriangle,
  cohenSutherlandClip,
  project3DTo2D,
  generateSierpinski,
  Point2D,
  Point3D,
} from '../utils/cg-algorithms.ts';
import { Play, RotateCcw, Sliders, Monitor, Sparkles } from 'lucide-react';

interface SimulatorProps {
  experiment: Experiment;
  crtMode: boolean;
}

export const ExperimentSimulator: React.FC<SimulatorProps> = ({ experiment, crtMode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Exp 7 state
  const [exp7Type, setExp7Type] = useState<'translate' | 'rotate' | 'scale' | 'reflect' | 'shear'>('rotate');
  const [exp7Angle, setExp7Angle] = useState<number>(45);
  const [exp7Tx, setExp7Tx] = useState<number>(60);
  const [exp7Ty, setExp7Ty] = useState<number>(30);
  const [exp7Scale, setExp7Scale] = useState<number>(1.4);
  const [exp7Shear, setExp7Shear] = useState<number>(0.6);

  // Exp 8 state (Cohen-Sutherland)
  const [showClippingStep, setShowClippingStep] = useState<boolean>(true);
  const [exp8X1, setExp8X1] = useState<number>(80);
  const [exp8Y1, setExp8Y1] = useState<number>(180);
  const [exp8X2, setExp8X2] = useState<number>(520);
  const [exp8Y2, setExp8Y2] = useState<number>(300);

  // Exp 9 state (3D Transforms)
  const [exp9Choice, setExp9Choice] = useState<'translate' | 'rotate' | 'scale'>('rotate');
  const [exp9Angle, setExp9Angle] = useState<number>(35);
  const [exp9Tx, setExp9Tx] = useState<number>(40);
  const [exp9Ty, setExp9Ty] = useState<number>(20);
  const [exp9Tz, setExp9Tz] = useState<number>(30);
  const [exp9Scale, setExp9Scale] = useState<number>(1.25);

  // Exp 10 state (Composite 3D)
  const [exp10Angle, setExp10Angle] = useState<number>(30);
  const [exp10Scale, setExp10Scale] = useState<number>(0.85);
  const [exp10Tx, setExp10Tx] = useState<number>(70);
  const [exp10Ty, setExp10Ty] = useState<number>(30);

  // Exp 12 state (Fractal depth)
  const [fractalDepth, setFractalDepth] = useState<number>(3);

  // Exp 2 state (putpixel)
  const [pixelX, setPixelX] = useState<number>(320);
  const [pixelY, setPixelY] = useState<number>(240);
  const [pixelColor, setPixelColor] = useState<string>('#ffffff');

  // Animation toggle for continuous demo
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    let animId: number;
    if (isAnimating) {
      const step = () => {
        if (experiment.id === 7) {
          setExp7Angle((prev) => (prev + 1) % 360);
        } else if (experiment.id === 9) {
          setExp9Angle((prev) => (prev + 1) % 360);
        } else if (experiment.id === 10) {
          setExp10Angle((prev) => (prev + 1) % 360);
        }
        animId = requestAnimationFrame(step);
      };
      animId = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animId);
  }, [isAnimating, experiment.id]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Standard BGI VGA Resolution: 640 x 480
    const w = canvas.width;
    const h = canvas.height;

    // Background color: classic Turbo C deep black or dark slate
    ctx.fillStyle = crtMode ? '#050b05' : '#090d16';
    ctx.fillRect(0, 0, w, h);

    // Subtle grid
    ctx.strokeStyle = crtMode ? 'rgba(34, 197, 94, 0.08)' : 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Header HUD bar inside canvas
    ctx.fillStyle = crtMode ? '#15803d' : '#1e293b';
    ctx.fillRect(0, 0, w, 28);
    ctx.fillStyle = crtMode ? '#4ade80' : '#cbd5e1';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(`TURBO C 3.0 BGI MODE (640x480 VGA) - EXP ${experiment.number}: ${experiment.title.toUpperCase()}`, 12, 18);

    const white = crtMode ? '#4ade80' : '#ffffff';
    const yellow = crtMode ? '#fde047' : '#facc15';
    const red = '#ef4444';
    const green = '#22c55e';
    const blue = '#3b82f6';

    switch (experiment.id) {
      case 1: {
        // Exp 1: Primitives & Flood Fill
        // Circle (250, 200, 50)
        // Line (150, 200, 450, 150)
        // Ellipse (250, 200, 100, 50)
        // Screen midpoint floodfill
        const midX = w / 2;
        const midY = h / 2;

        // Flood fill background area representation
        ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
        ctx.fillRect(50, 60, w - 100, h - 120);

        ctx.strokeStyle = white;
        ctx.lineWidth = 2;

        // Circle
        ctx.beginPath();
        ctx.arc(250, 200, 50, 0, Math.PI * 2);
        ctx.stroke();

        // Line
        ctx.beginPath();
        ctx.moveTo(150, 200);
        ctx.lineTo(450, 150);
        ctx.stroke();

        // Ellipse
        ctx.beginPath();
        ctx.ellipse(250, 200, 100, 50, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Center markers & legends
        ctx.fillStyle = yellow;
        ctx.font = '12px monospace';
        ctx.fillText(`Midpoint (${midX}, ${midY}) - Floodfill Seed`, midX - 100, midY + 40);
        ctx.beginPath();
        ctx.arc(midX, midY, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = white;
        ctx.fillText('circle(250, 200, 50)', 260, 140);
        ctx.fillText('line(150, 200, 450, 150)', 400, 180);
        ctx.fillText('ellipse(250, 200, 0, 360, 100, 50)', 180, 270);
        break;
      }

      case 2: {
        // Exp 2: putpixel
        ctx.fillStyle = white;
        ctx.font = '12px monospace';
        ctx.fillText(`putpixel(${pixelX}, ${pixelY}, COLOR)`, 20, 55);

        // Crosshairs
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(pixelX, 30);
        ctx.lineTo(pixelX, h);
        ctx.moveTo(0, pixelY);
        ctx.lineTo(w, pixelY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Magnified pixel view
        ctx.fillStyle = pixelColor;
        ctx.beginPath();
        ctx.arc(pixelX, pixelY, 6, 0, Math.PI * 2);
        ctx.fill();

        // Zoomed in window on bottom right
        ctx.strokeStyle = '#38bdf8';
        ctx.strokeRect(w - 180, h - 180, 160, 160);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(w - 180, h - 180, 160, 160);

        ctx.fillStyle = '#38bdf8';
        ctx.font = '11px monospace';
        ctx.fillText('PIXEL INSPECTOR 8x', w - 170, h - 160);

        ctx.fillStyle = pixelColor;
        ctx.fillRect(w - 110, h - 100, 30, 30);
        ctx.strokeStyle = white;
        ctx.strokeRect(w - 110, h - 100, 30, 30);
        break;
      }

      case 3: {
        // Exp 3: DDA Line (120, 250) to (500, 400)
        const ddaPoints = computeDdaLine(120, 250, 500, 400);
        ctx.fillStyle = white;
        ctx.font = '12px monospace';
        ctx.fillText(`DDA Line: (120, 250) to (500, 400) | Steps = ${ddaPoints.length}`, 20, 55);

        // Draw points calculated by DDA
        ctx.fillStyle = '#38bdf8';
        ddaPoints.forEach((pt) => {
          ctx.fillRect(pt.x, pt.y, 2, 2);
        });

        // Endpoints labels
        ctx.fillStyle = yellow;
        ctx.beginPath();
        ctx.arc(120, 250, 4, 0, Math.PI * 2);
        ctx.arc(500, 400, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillText('(120, 250)', 100, 240);
        ctx.fillText('(500, 400)', 480, 420);
        break;
      }

      case 4: {
        // Exp 4: Bresenham Line (120, 250) to (500, 400)
        const bresPoints = computeBresenhamLine(120, 250, 500, 400);
        ctx.fillStyle = white;
        ctx.font = '12px monospace';
        ctx.fillText(`Bresenham Integer Line: dx=${500 - 120}, dy=${400 - 250} | Points = ${bresPoints.length}`, 20, 55);

        ctx.fillStyle = '#4ade80';
        bresPoints.forEach((pt) => {
          ctx.fillRect(pt.x, pt.y, 2, 2);
        });

        ctx.fillStyle = yellow;
        ctx.beginPath();
        ctx.arc(120, 250, 4, 0, Math.PI * 2);
        ctx.arc(500, 400, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillText('Start: (120, 250)', 90, 240);
        ctx.fillText('End: (500, 400)', 480, 420);
        break;
      }

      case 5: {
        // Exp 5: Midpoint Circle with 8 Octants distinct colors
        // Center (200, 200), Radius 70
        const cx = 320;
        const cy = 240;
        const r = 110;
        const circlePoints = computeMidpointCircle(cx, cy, r);

        ctx.fillStyle = white;
        ctx.font = '12px monospace';
        ctx.fillText(`Mid-Point Circle: Center (${cx}, ${cy}), Radius = ${r}`, 20, 55);

        circlePoints.forEach((pt) => {
          ctx.fillStyle = pt.color || white;
          ctx.fillRect(pt.x, pt.y, 2.5, 2.5);
        });

        // Center dot
        ctx.fillStyle = white;
        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        ctx.fill();

        // Octant Color Legend matching lab notebook:
        const legend = [
          { color: '#ef4444', label: 'Octant 1 (RED): (a+x, b+y)' },
          { color: '#ffffff', label: 'Octant 2/3/6/7 (WHITE)' },
          { color: '#3b82f6', label: 'Octant 4 (BLUE): (a-x, b-y)' },
          { color: '#22c55e', label: 'Octant 5 (GREEN): (a+y, b+x)' },
          { color: '#eab308', label: 'Octant 8 (YELLOW): (a-y, b-x)' },
        ];
        let legY = 90;
        ctx.font = '11px monospace';
        legend.forEach((item) => {
          ctx.fillStyle = item.color;
          ctx.fillRect(20, legY - 8, 10, 10);
          ctx.fillStyle = '#cbd5e1';
          ctx.fillText(item.label, 36, legY);
          legY += 20;
        });
        break;
      }

      case 6: {
        // Exp 6: Midpoint Ellipse
        const xc = 320;
        const yc = 240;
        const rx = 180;
        const ry = 100;
        const ellipsePoints = computeMidpointEllipse(xc, yc, rx, ry);

        ctx.fillStyle = white;
        ctx.font = '12px monospace';
        ctx.fillText(`Mid-Point Ellipse: Center (${xc}, ${yc}), rx = ${rx}, ry = ${ry}`, 20, 55);

        ctx.fillStyle = '#38bdf8';
        ellipsePoints.forEach((pt) => {
          ctx.fillRect(pt.x, pt.y, 2, 2);
        });

        // Major & Minor axis indicators
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(xc - rx, yc);
        ctx.lineTo(xc + rx, yc);
        ctx.moveTo(xc, yc - ry);
        ctx.lineTo(xc, yc + ry);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = yellow;
        ctx.fillText('Region 1 (dx < dy)', xc + 100, yc - 40);
        ctx.fillText('Region 2 (dy >= dx)', xc + 50, yc + 120);
        break;
      }

      case 7: {
        // Exp 7: 2D Transformations on Triangle
        const origTriangle: [Point2D, Point2D, Point2D] = [
          { x: 260, y: 170 },
          { x: 190, y: 290 },
          { x: 330, y: 290 },
        ];

        const transformedTriangle = transform2DTriangle(origTriangle, exp7Type, {
          tx: exp7Tx,
          ty: exp7Ty,
          angleDeg: exp7Angle,
          sx: exp7Scale,
          sy: exp7Scale,
          shx: exp7Shear,
        });

        // Draw Original Triangle in WHITE
        ctx.strokeStyle = white;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(origTriangle[0].x, origTriangle[0].y);
        ctx.lineTo(origTriangle[1].x, origTriangle[1].y);
        ctx.lineTo(origTriangle[2].x, origTriangle[2].y);
        ctx.closePath();
        ctx.stroke();

        // Draw Transformed Triangle in YELLOW
        ctx.strokeStyle = yellow;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(transformedTriangle[0].x, transformedTriangle[0].y);
        ctx.lineTo(transformedTriangle[1].x, transformedTriangle[1].y);
        ctx.lineTo(transformedTriangle[2].x, transformedTriangle[2].y);
        ctx.closePath();
        ctx.stroke();

        // Legends
        ctx.fillStyle = white;
        ctx.font = '12px monospace';
        ctx.fillText('WHITE: Original Triangle', 20, 55);
        ctx.fillStyle = yellow;
        ctx.fillText(`YELLOW: Transformed [${exp7Type.toUpperCase()}]`, 20, 75);
        break;
      }

      case 8: {
        // Exp 8: Cohen-Sutherland Line Clipping
        const xmin = 160, ymin = 120, xmax = 480, ymax = 360;

        // Draw Clipping Window Rectangle
        ctx.strokeStyle = white;
        ctx.lineWidth = 2;
        ctx.strokeRect(xmin, ymin, xmax - xmin, ymax - ymin);

        // Window Region code annotations
        ctx.font = '10px monospace';
        ctx.fillStyle = '#64748b';
        ctx.fillText('TOP (1000)', 290, ymin - 10);
        ctx.fillText('BOTTOM (0100)', 280, ymax + 18);
        ctx.fillText('LEFT (0001)', xmin - 75, 240);
        ctx.fillText('RIGHT (0010)', xmax + 10, 240);
        ctx.fillText('INSIDE (0000)', 280, 240);

        // Original Unclipped Line in dim red / gray
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(exp8X1, exp8Y1);
        ctx.lineTo(exp8X2, exp8Y2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Perform Cohen-Sutherland Clipping
        const clipResult = cohenSutherlandClip(exp8X1, exp8Y1, exp8X2, exp8Y2, xmin, ymin, xmax, ymax);

        if (showClippingStep && clipResult.accepted) {
          // Clipped segment in bright GREEN / YELLOW
          ctx.strokeStyle = '#22c55e';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(clipResult.x1, clipResult.y1);
          ctx.lineTo(clipResult.x2, clipResult.y2);
          ctx.stroke();

          // Intersections markers
          ctx.fillStyle = yellow;
          ctx.beginPath();
          ctx.arc(clipResult.x1, clipResult.y1, 4, 0, Math.PI * 2);
          ctx.arc(clipResult.x2, clipResult.y2, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Status text
        ctx.font = '12px monospace';
        ctx.fillStyle = '#ef4444';
        ctx.fillText('RED DASHED: Original Line Segment', 20, 55);
        ctx.fillStyle = clipResult.accepted ? '#22c55e' : '#ef4444';
        ctx.fillText(
          clipResult.accepted
            ? `GREEN: Clipped Segment from (${clipResult.x1}, ${clipResult.y1}) to (${clipResult.x2}, ${clipResult.y2})`
            : 'LINE REJECTED (Entirely Outside Window)',
          20,
          75
        );
        break;
      }

      case 9: {
        // Exp 9: 3D Transformations on Cube
        const x = [200, 300, 300, 200, 200, 300, 300, 200];
        const y = [180, 180, 280, 280, 180, 180, 280, 280];
        const z = [0, 0, 0, 0, 80, 80, 80, 80];

        const cx = 250, cy = 230, cz = 40;
        const rad = (exp9Angle * Math.PI) / 180.0;

        const nx: number[] = [];
        const ny: number[] = [];
        const nz: number[] = [];

        for (let i = 0; i < 8; i++) {
          if (exp9Choice === 'translate') {
            nx.push(x[i] + exp9Tx);
            ny.push(y[i] + exp9Ty);
            nz.push(z[i] + exp9Tz);
          } else if (exp9Choice === 'rotate') {
            nx.push(cx + (x[i] - cx) * Math.cos(rad) - (y[i] - cy) * Math.sin(rad));
            ny.push(cy + (x[i] - cx) * Math.sin(rad) + (y[i] - cy) * Math.cos(rad));
            nz.push(z[i]);
          } else {
            nx.push(cx + (x[i] - cx) * exp9Scale);
            ny.push(cy + (y[i] - cy) * exp9Scale);
            nz.push(cz + (z[i] - cz) * exp9Scale);
          }
        }

        const renderWireframeCube = (vx: number[], vy: number[], vz: number[], strokeColor: string) => {
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 1.8;
          const p = vx.map((val, i) => project3DTo2D({ x: val, y: vy[i], z: vz[i] }));

          // Front face
          ctx.beginPath();
          ctx.moveTo(p[0].x, p[0].y);
          ctx.lineTo(p[1].x, p[1].y);
          ctx.lineTo(p[2].x, p[2].y);
          ctx.lineTo(p[3].x, p[3].y);
          ctx.closePath();
          ctx.stroke();

          // Back face
          ctx.beginPath();
          ctx.moveTo(p[4].x, p[4].y);
          ctx.lineTo(p[5].x, p[5].y);
          ctx.lineTo(p[6].x, p[6].y);
          ctx.lineTo(p[7].x, p[7].y);
          ctx.closePath();
          ctx.stroke();

          // Connecting depth edges
          for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(p[i].x, p[i].y);
            ctx.lineTo(p[i + 4].x, p[i + 4].y);
            ctx.stroke();
          }
        };

        // Draw original cube in WHITE
        renderWireframeCube(x, y, z, white);

        // Draw transformed cube in YELLOW
        renderWireframeCube(nx, ny, nz, yellow);

        ctx.fillStyle = white;
        ctx.font = '12px monospace';
        ctx.fillText('WHITE: Original 3D Cube', 20, 55);
        ctx.fillStyle = yellow;
        ctx.fillText(`YELLOW: Transformed [${exp9Choice.toUpperCase()}]`, 20, 75);
        break;
      }

      case 10: {
        // Exp 10: Composite 3D Transformations
        const x = [200, 300, 300, 200, 200, 300, 300, 200];
        const y = [180, 180, 280, 280, 180, 180, 280, 280];
        const z = [0, 0, 0, 0, 80, 80, 80, 80];

        const cx = 250, cy = 230, cz = 40;
        const rad = (exp10Angle * Math.PI) / 180.0;

        const nx: number[] = [];
        const ny: number[] = [];
        const nz: number[] = [];

        for (let i = 0; i < 8; i++) {
          const a = (x[i] - cx) * exp10Scale;
          const b = (y[i] - cy) * exp10Scale;

          const rx = cx + a * Math.cos(rad) - b * Math.sin(rad);
          const ry = cy + a * Math.sin(rad) + b * Math.cos(rad);
          const rz = cz + (z[i] - cz) * exp10Scale;

          nx.push(rx + exp10Tx);
          ny.push(ry + exp10Ty);
          nz.push(rz);
        }

        const renderWireframeCube = (vx: number[], vy: number[], vz: number[], strokeColor: string) => {
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 1.8;
          const p = vx.map((val, i) => project3DTo2D({ x: val, y: vy[i], z: vz[i] }));

          for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(p[i].x, p[i].y);
            ctx.lineTo(p[(i + 1) % 4].x, p[(i + 1) % 4].y);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(p[i + 4].x, p[i + 4].y);
            ctx.lineTo(p[((i + 1) % 4) + 4].x, p[((i + 1) % 4) + 4].y);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(p[i].x, p[i].y);
            ctx.lineTo(p[i + 4].x, p[i + 4].y);
            ctx.stroke();
          }
        };

        renderWireframeCube(x, y, z, white);
        renderWireframeCube(nx, ny, nz, yellow);

        ctx.fillStyle = white;
        ctx.font = '12px monospace';
        ctx.fillText('WHITE: Original 3D Cube', 20, 55);
        ctx.fillStyle = yellow;
        ctx.fillText('YELLOW: Composite 3D Transformation (Scale + Rotate + Translate)', 20, 75);
        break;
      }

      case 11: {
        // Exp 11: 3D Scene with Cube, Cuboid, and Pyramid
        // Cube
        ctx.strokeStyle = white;
        ctx.lineWidth = 1.8;
        ctx.strokeRect(80, 150, 100, 100);
        ctx.strokeRect(120, 110, 100, 100);
        ctx.beginPath();
        ctx.moveTo(80, 150); ctx.lineTo(120, 110);
        ctx.moveTo(180, 150); ctx.lineTo(220, 110);
        ctx.moveTo(180, 250); ctx.lineTo(220, 210);
        ctx.moveTo(80, 250); ctx.lineTo(120, 210);
        ctx.stroke();

        // Cuboid
        ctx.strokeStyle = yellow;
        ctx.strokeRect(280, 160, 170, 80);
        ctx.strokeRect(320, 120, 170, 80);
        ctx.beginPath();
        ctx.moveTo(280, 160); ctx.lineTo(320, 120);
        ctx.moveTo(450, 160); ctx.lineTo(490, 120);
        ctx.moveTo(450, 240); ctx.lineTo(490, 200);
        ctx.moveTo(280, 240); ctx.lineTo(320, 200);
        ctx.stroke();

        // Pyramid
        ctx.strokeStyle = '#86efac'; // Light green
        ctx.beginPath();
        // Base
        ctx.moveTo(200, 350);
        ctx.lineTo(320, 350);
        ctx.lineTo(370, 310);
        ctx.lineTo(250, 310);
        ctx.closePath();
        ctx.stroke();

        // Apex connections to (285, 230)
        ctx.beginPath();
        ctx.moveTo(285, 230); ctx.lineTo(200, 350);
        ctx.moveTo(285, 230); ctx.lineTo(320, 350);
        ctx.moveTo(285, 230); ctx.lineTo(370, 310);
        ctx.moveTo(285, 230); ctx.lineTo(250, 310);
        ctx.stroke();

        // Labels matching original outtextxy
        ctx.fillStyle = white;
        ctx.font = '12px monospace';
        ctx.fillText('3D CUBE', 120, 270);
        ctx.fillStyle = yellow;
        ctx.fillText('3D CUBOID', 340, 270);
        ctx.fillStyle = '#86efac';
        ctx.fillText('3D PYRAMID', 240, 380);
        break;
      }

      case 12: {
        // Exp 12: Sierpinski Triangle Fractal
        const p1 = { x: 320, y: 70 };
        const p2 = { x: 100, y: 430 };
        const p3 = { x: 540, y: 430 };

        const triangles = generateSierpinski(p1, p2, p3, fractalDepth);

        ctx.fillStyle = white;
        ctx.font = '12px monospace';
        ctx.fillText(`Sierpinski Triangle Fractal | Recursion Depth = ${fractalDepth} (${triangles.length} triangles)`, 20, 55);

        ctx.strokeStyle = crtMode ? '#4ade80' : '#38bdf8';
        ctx.lineWidth = 1.2;

        triangles.forEach((t) => {
          ctx.beginPath();
          ctx.moveTo(t.p1.x, t.p1.y);
          ctx.lineTo(t.p2.x, t.p2.y);
          ctx.lineTo(t.p3.x, t.p3.y);
          ctx.closePath();
          ctx.stroke();
        });
        break;
      }

      default:
        break;
    }
  }, [
    experiment,
    crtMode,
    exp7Type,
    exp7Angle,
    exp7Tx,
    exp7Ty,
    exp7Scale,
    exp7Shear,
    showClippingStep,
    exp8X1,
    exp8Y1,
    exp8X2,
    exp8Y2,
    exp9Choice,
    exp9Angle,
    exp9Tx,
    exp9Ty,
    exp9Tz,
    exp9Scale,
    exp10Angle,
    exp10Scale,
    exp10Tx,
    exp10Ty,
    fractalDepth,
    pixelX,
    pixelY,
    pixelColor,
  ]);

  return (
    <div className="flex flex-col gap-3">
      {/* Simulation Controls Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-medium text-slate-200">
          <Sliders className="w-4 h-4 text-blue-400" />
          <span>Interactive Parameters & Simulation Controls</span>
        </div>

        {/* Experiment specific interactive controls */}
        {experiment.id === 7 && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded">
              {(['translate', 'rotate', 'scale', 'reflect', 'shear'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setExp7Type(t)}
                  className={`px-2 py-0.5 rounded capitalize text-[11px] font-medium transition ${
                    exp7Type === t ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {exp7Type === 'rotate' && (
              <div className="flex items-center gap-2">
                <span>Angle: {exp7Angle}°</span>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={exp7Angle}
                  onChange={(e) => setExp7Angle(Number(e.target.value))}
                  className="w-24 accent-blue-500 cursor-pointer"
                />
              </div>
            )}
            {exp7Type === 'translate' && (
              <div className="flex items-center gap-2">
                <span>Tx:</span>
                <input
                  type="number"
                  value={exp7Tx}
                  onChange={(e) => setExp7Tx(Number(e.target.value))}
                  className="w-14 bg-slate-800 border border-slate-700 px-1 py-0.5 rounded text-white"
                />
                <span>Ty:</span>
                <input
                  type="number"
                  value={exp7Ty}
                  onChange={(e) => setExp7Ty(Number(e.target.value))}
                  className="w-14 bg-slate-800 border border-slate-700 px-1 py-0.5 rounded text-white"
                />
              </div>
            )}
            {exp7Type === 'scale' && (
              <div className="flex items-center gap-2">
                <span>Scale: {exp7Scale}x</span>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.1"
                  value={exp7Scale}
                  onChange={(e) => setExp7Scale(Number(e.target.value))}
                  className="w-24 accent-blue-500 cursor-pointer"
                />
              </div>
            )}
            {exp7Type === 'shear' && (
              <div className="flex items-center gap-2">
                <span>Shear Factor: {exp7Shear}</span>
                <input
                  type="range"
                  min="-1"
                  max="2"
                  step="0.1"
                  value={exp7Shear}
                  onChange={(e) => setExp7Shear(Number(e.target.value))}
                  className="w-24 accent-blue-500 cursor-pointer"
                />
              </div>
            )}

            <button
              onClick={() => setIsAnimating(!isAnimating)}
              className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 ${
                isAnimating ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Play className="w-3 h-3" />
              {isAnimating ? 'Pause' : 'Animate'}
            </button>
          </div>
        )}

        {experiment.id === 8 && (
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowClippingStep(!showClippingStep)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                showClippingStep ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {showClippingStep ? 'Showing Clipped Segment' : 'Show Unclipped Line'}
            </button>
            <div className="flex items-center gap-1">
              <span>P1(x,y):</span>
              <input
                type="number"
                value={exp8X1}
                onChange={(e) => setExp8X1(Number(e.target.value))}
                className="w-12 bg-slate-800 border border-slate-700 px-1 py-0.5 rounded text-white"
              />
              <input
                type="number"
                value={exp8Y1}
                onChange={(e) => setExp8Y1(Number(e.target.value))}
                className="w-12 bg-slate-800 border border-slate-700 px-1 py-0.5 rounded text-white"
              />
            </div>
            <div className="flex items-center gap-1">
              <span>P2(x,y):</span>
              <input
                type="number"
                value={exp8X2}
                onChange={(e) => setExp8X2(Number(e.target.value))}
                className="w-12 bg-slate-800 border border-slate-700 px-1 py-0.5 rounded text-white"
              />
              <input
                type="number"
                value={exp8Y2}
                onChange={(e) => setExp8Y2(Number(e.target.value))}
                className="w-12 bg-slate-800 border border-slate-700 px-1 py-0.5 rounded text-white"
              />
            </div>
            <button
              onClick={() => {
                setExp8X1(80);
                setExp8Y1(180);
                setExp8X2(520);
                setExp8Y2(300);
              }}
              className="text-slate-400 hover:text-white p-1"
              title="Reset default line"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {experiment.id === 9 && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded">
              {(['rotate', 'scale', 'translate'] as const).map((ch) => (
                <button
                  key={ch}
                  onClick={() => setExp9Choice(ch)}
                  className={`px-2 py-0.5 rounded capitalize text-[11px] font-medium transition ${
                    exp9Choice === ch ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>

            {exp9Choice === 'rotate' && (
              <div className="flex items-center gap-2">
                <span>Z-Angle: {exp9Angle}°</span>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={exp9Angle}
                  onChange={(e) => setExp9Angle(Number(e.target.value))}
                  className="w-24 accent-blue-500 cursor-pointer"
                />
              </div>
            )}
            {exp9Choice === 'scale' && (
              <div className="flex items-center gap-2">
                <span>Scale: {exp9Scale}x</span>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.05"
                  value={exp9Scale}
                  onChange={(e) => setExp9Scale(Number(e.target.value))}
                  className="w-24 accent-blue-500 cursor-pointer"
                />
              </div>
            )}
            <button
              onClick={() => setIsAnimating(!isAnimating)}
              className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 ${
                isAnimating ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Play className="w-3 h-3" />
              {isAnimating ? 'Stop' : 'Spin 3D'}
            </button>
          </div>
        )}

        {experiment.id === 10 && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span>Rotate: {exp10Angle}°</span>
              <input
                type="range"
                min="0"
                max="360"
                value={exp10Angle}
                onChange={(e) => setExp10Angle(Number(e.target.value))}
                className="w-20 accent-blue-500 cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-2">
              <span>Scale: {exp10Scale}x</span>
              <input
                type="range"
                min="0.4"
                max="1.6"
                step="0.05"
                value={exp10Scale}
                onChange={(e) => setExp10Scale(Number(e.target.value))}
                className="w-20 accent-blue-500 cursor-pointer"
              />
            </div>
            <button
              onClick={() => setIsAnimating(!isAnimating)}
              className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 ${
                isAnimating ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Play className="w-3 h-3" />
              {isAnimating ? 'Stop' : 'Live Spin'}
            </button>
          </div>
        )}

        {experiment.id === 12 && (
          <div className="flex items-center gap-3">
            <span>Recursion Depth Level (1 to 5):</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setFractalDepth(lvl)}
                  className={`w-7 h-7 rounded text-xs font-bold transition ${
                    fractalDepth === lvl
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        )}

        {experiment.id === 2 && (
          <div className="flex items-center gap-2">
            <span>X:</span>
            <input
              type="number"
              value={pixelX}
              onChange={(e) => setPixelX(Number(e.target.value))}
              className="w-14 bg-slate-800 border border-slate-700 px-1 py-0.5 rounded text-white"
            />
            <span>Y:</span>
            <input
              type="number"
              value={pixelY}
              onChange={(e) => setPixelY(Number(e.target.value))}
              className="w-14 bg-slate-800 border border-slate-700 px-1 py-0.5 rounded text-white"
            />
            <input
              type="color"
              value={pixelColor}
              onChange={(e) => setPixelColor(e.target.value)}
              className="w-7 h-7 bg-transparent border-0 cursor-pointer rounded"
            />
          </div>
        )}
      </div>

      {/* Canvas Screen */}
      <div className="relative border border-slate-800 rounded-lg overflow-hidden shadow-2xl bg-black">
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className={`w-full max-h-[500px] object-contain mx-auto block ${
            crtMode ? 'filter contrast-125 brightness-110' : ''
          }`}
        />
        {crtMode && (
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] scanlines opacity-40" />
        )}
      </div>
    </div>
  );
};
