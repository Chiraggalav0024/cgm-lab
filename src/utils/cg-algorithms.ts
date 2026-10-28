/**
 * Computer Graphics Core Algorithms (Pure Logic)
 * Decoupled from UI for testing and simulation
 */

export interface Point2D {
  x: number;
  y: number;
  color?: string;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

// Exp 3: DDA Line Algorithm
export function computeDdaLine(x1: number, y1: number, x2: number, y2: number): Point2D[] {
  const points: Point2D[] = [];
  const dx = x2 - x1;
  const dy = y2 - y1;
  const steps = Math.max(Math.abs(dx), Math.abs(dy));

  if (steps === 0) {
    return [{ x: Math.round(x1), y: Math.round(y1) }];
  }

  const xinc = dx / steps;
  const yinc = dy / steps;

  let x = x1;
  let y = y1;

  for (let i = 0; i <= steps; i++) {
    points.push({ x: Math.round(x), y: Math.round(y) });
    x += xinc;
    y += yinc;
  }

  return points;
}

// Exp 4: Bresenham's Line Algorithm (|m| < 1, positive dx)
export function computeBresenhamLine(x1: number, y1: number, x2: number, y2: number): Point2D[] {
  const points: Point2D[] = [];
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  const sx = x1 < x2 ? 1 : -1;
  const sy = y1 < y2 ? 1 : -1;

  let x = x1;
  let y = y1;

  if (dx >= dy) {
    let p = 2 * dy - dx;
    for (let i = 0; i <= dx; i++) {
      points.push({ x, y });
      x += sx;
      if (p < 0) {
        p += 2 * dy;
      } else {
        y += sy;
        p += 2 * dy - 2 * dx;
      }
    }
  } else {
    let p = 2 * dx - dy;
    for (let i = 0; i <= dy; i++) {
      points.push({ x, y });
      y += sy;
      if (p < 0) {
        p += 2 * dx;
      } else {
        x += sx;
        p += 2 * dx - 2 * dy;
      }
    }
  }

  return points;
}

// Exp 5: Midpoint Circle Algorithm (8-octant symmetry)
export function computeMidpointCircle(cx: number, cy: number, r: number): Point2D[] {
  const points: Point2D[] = [];
  let x = 0;
  let y = r;
  let p = 1 - r;

  const addOctants = (px: number, py: number) => {
    // Colors matching original lab notebook:
    // (a+x, b+y, RED), (a-x, b+y, WHITE), (a+x, b-y, WHITE), (a-x, b-y, BLUE),
    // (a+y, b+x, GREEN), (a-y, b+x, WHITE), (a+y, b-x, WHITE), (a-y, b-x, YELLOW)
    points.push({ x: cx + px, y: cy + py, color: '#ef4444' }); // RED
    points.push({ x: cx - px, y: cy + py, color: '#ffffff' }); // WHITE
    points.push({ x: cx + px, y: cy - py, color: '#ffffff' }); // WHITE
    points.push({ x: cx - px, y: cy - py, color: '#3b82f6' }); // BLUE
    points.push({ x: cx + py, y: cy + px, color: '#22c55e' }); // GREEN
    points.push({ x: cx - py, y: cy + px, color: '#ffffff' }); // WHITE
    points.push({ x: cx + py, y: cy - px, color: '#ffffff' }); // WHITE
    points.push({ x: cx - py, y: cy - px, color: '#eab308' }); // YELLOW
  };

  addOctants(x, y);

  while (x < y) {
    x++;
    if (p < 0) {
      p += 2 * x + 1;
    } else {
      y--;
      p += 2 * (x - y) + 1;
    }
    addOctants(x, y);
  }

  return points;
}

// Exp 6: Midpoint Ellipse Algorithm (Region 1 and Region 2)
export function computeMidpointEllipse(xc: number, yc: number, rx: number, ry: number): Point2D[] {
  const points: Point2D[] = [];
  let x = 0;
  let y = ry;
  const rx2 = rx * rx;
  const ry2 = ry * ry;
  let dx = 2 * ry2 * x;
  let dy = 2 * rx2 * y;

  const addQuadrants = (px: number, py: number) => {
    points.push({ x: xc + px, y: yc + py });
    points.push({ x: xc - px, y: yc + py });
    points.push({ x: xc + px, y: yc - py });
    points.push({ x: xc - px, y: yc - py });
  };

  // Region 1
  let p1 = ry2 - rx2 * ry + 0.25 * rx2;
  while (dx < dy) {
    addQuadrants(x, y);
    if (p1 < 0) {
      x++;
      dx += 2 * ry2;
      p1 += dx + ry2;
    } else {
      x++;
      y--;
      dx += 2 * ry2;
      dy -= 2 * rx2;
      p1 += dx - dy + ry2;
    }
  }

  // Region 2
  let p2 = ry2 * (x + 0.5) * (x + 0.5) + rx2 * (y - 1) * (y - 1) - rx2 * ry2;
  while (y >= 0) {
    addQuadrants(x, y);
    if (p2 > 0) {
      y--;
      dy -= 2 * rx2;
      p2 += rx2 - dy;
    } else {
      x++;
      y--;
      dx += 2 * ry2;
      dy -= 2 * rx2;
      p2 += dx - dy + rx2;
    }
  }

  return points;
}

// Exp 7: 2D Transformations on Triangle
export function transform2DTriangle(
  triangle: [Point2D, Point2D, Point2D],
  type: 'translate' | 'rotate' | 'scale' | 'reflect' | 'shear',
  params: { tx?: number; ty?: number; angleDeg?: number; sx?: number; sy?: number; shx?: number }
): [Point2D, Point2D, Point2D] {
  const [p1, p2, p3] = triangle;
  const cx = (p1.x + p2.x + p3.x) / 3.0;
  const cy = (p1.y + p2.y + p3.y) / 3.0;

  return triangle.map((pt) => {
    switch (type) {
      case 'translate': {
        const tx = params.tx ?? 0;
        const ty = params.ty ?? 0;
        return { x: pt.x + tx, y: pt.y + ty };
      }
      case 'rotate': {
        const angle = params.angleDeg ?? 0;
        const rad = (angle * Math.PI) / 180.0;
        const dx = pt.x - cx;
        const dy = pt.y - cy;
        return {
          x: cx + dx * Math.cos(rad) - dy * Math.sin(rad),
          y: cy + dx * Math.sin(rad) + dy * Math.cos(rad),
        };
      }
      case 'scale': {
        const sx = params.sx ?? 1;
        const sy = params.sy ?? 1;
        return {
          x: cx + (pt.x - cx) * sx,
          y: cy + (pt.y - cy) * sy,
        };
      }
      case 'reflect': {
        // Reflection about horizontal center line y = cy
        return {
          x: pt.x,
          y: 2 * cy - pt.y,
        };
      }
      case 'shear': {
        const shx = params.shx ?? 0;
        return {
          x: pt.x + shx * (pt.y - cy),
          y: pt.y,
        };
      }
      default:
        return { ...pt };
    }
  }) as [Point2D, Point2D, Point2D];
}

// Exp 8: Cohen-Sutherland 2D Line Clipping
export const REGION_INSIDE = 0; // 0000
export const REGION_LEFT = 1;   // 0001
export const REGION_RIGHT = 2;  // 0010
export const REGION_BOTTOM = 4; // 0100
export const REGION_TOP = 8;    // 1000

export function getCohenSutherlandCode(
  x: number,
  y: number,
  xmin: number,
  ymin: number,
  xmax: number,
  ymax: number
): number {
  let code = REGION_INSIDE;
  if (x < xmin) code |= REGION_LEFT;
  else if (x > xmax) code |= REGION_RIGHT;

  if (y > ymax) code |= REGION_BOTTOM;
  else if (y < ymin) code |= REGION_TOP;

  return code;
}

export interface ClipResult {
  accepted: boolean;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  initialCode1: number;
  initialCode2: number;
}

export function cohenSutherlandClip(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  xmin: number,
  ymin: number,
  xmax: number,
  ymax: number
): ClipResult {
  let code1 = getCohenSutherlandCode(x1, y1, xmin, ymin, xmax, ymax);
  let code2 = getCohenSutherlandCode(x2, y2, xmin, ymin, xmax, ymax);
  const initialCode1 = code1;
  const initialCode2 = code2;

  let accept = false;
  let cx1 = x1;
  let cy1 = y1;
  let cx2 = x2;
  let cy2 = y2;

  while (true) {
    if ((code1 === 0) && (code2 === 0)) {
      // Both points inside window
      accept = true;
      break;
    } else if ((code1 & code2) !== 0) {
      // Both points share an outside zone -> trivial reject
      break;
    } else {
      // Line needs clipping
      const codeOut = code1 !== 0 ? code1 : code2;
      let x = 0;
      let y = 0;

      if (codeOut & REGION_TOP) {
        x = cx1 + ((cx2 - cx1) * (ymin - cy1)) / (cy2 - cy1);
        y = ymin;
      } else if (codeOut & REGION_BOTTOM) {
        x = cx1 + ((cx2 - cx1) * (ymax - cy1)) / (cy2 - cy1);
        y = ymax;
      } else if (codeOut & REGION_RIGHT) {
        y = cy1 + ((cy2 - cy1) * (xmax - cx1)) / (cx2 - cx1);
        x = xmax;
      } else if (codeOut & REGION_LEFT) {
        y = cy1 + ((cy2 - cy1) * (xmin - cx1)) / (cx2 - cx1);
        x = xmin;
      }

      if (codeOut === code1) {
        cx1 = x;
        cy1 = y;
        code1 = getCohenSutherlandCode(cx1, cy1, xmin, ymin, xmax, ymax);
      } else {
        cx2 = x;
        cy2 = y;
        code2 = getCohenSutherlandCode(cx2, cy2, xmin, ymin, xmax, ymax);
      }
    }
  }

  return {
    accepted: accept,
    x1: Math.round(cx1 * 100) / 100,
    y1: Math.round(cy1 * 100) / 100,
    x2: Math.round(cx2 * 100) / 100,
    y2: Math.round(cy2 * 100) / 100,
    initialCode1,
    initialCode2,
  };
}

// Exp 9 & 10: 3D Projection (Cavalier / Cabinet Oblique Projection)
export function project3DTo2D(p: Point3D): Point2D {
  return {
    x: Math.round(p.x + p.z / 2),
    y: Math.round(p.y - p.z / 2),
  };
}

// Exp 12: Sierpinski Triangle Recursive Fractal
export interface Triangle2D {
  p1: Point2D;
  p2: Point2D;
  p3: Point2D;
}

export function generateSierpinski(
  p1: Point2D,
  p2: Point2D,
  p3: Point2D,
  depth: number
): Triangle2D[] {
  if (depth <= 0) {
    return [{ p1, p2, p3 }];
  }

  const m1 = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
  const m2 = { x: (p2.x + p3.x) / 2, y: (p2.y + p3.y) / 2 };
  const m3 = { x: (p3.x + p1.x) / 2, y: (p3.y + p1.y) / 2 };

  return [
    ...generateSierpinski(p1, m1, m3, depth - 1),
    ...generateSierpinski(m1, p2, m2, depth - 1),
    ...generateSierpinski(m3, m2, p3, depth - 1),
  ];
}
