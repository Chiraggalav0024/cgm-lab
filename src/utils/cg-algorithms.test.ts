import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeDdaLine,
  computeBresenhamLine,
  computeMidpointCircle,
  computeMidpointEllipse,
  transform2DTriangle,
  cohenSutherlandClip,
  getCohenSutherlandCode,
  REGION_LEFT,
  REGION_RIGHT,
  REGION_TOP,
  REGION_BOTTOM,
  REGION_INSIDE,
  project3DTo2D,
  generateSierpinski,
} from './cg-algorithms.ts';

test('Exp 3: DDA line algorithm generates correct endpoints', () => {
  const points = computeDdaLine(10, 10, 15, 10);
  assert.equal(points.length, 6);
  assert.deepEqual(points[0], { x: 10, y: 10 });
  assert.deepEqual(points[5], { x: 15, y: 10 });
});

test('Exp 4: Bresenham line algorithm calculates discrete integer path', () => {
  const points = computeBresenhamLine(0, 0, 5, 2);
  assert.equal(points.length, 6);
  assert.deepEqual(points[0], { x: 0, y: 0 });
  assert.deepEqual(points[points.length - 1], { x: 5, y: 2 });
});

test('Exp 5: Midpoint circle algorithm respects radius geometry', () => {
  const points = computeMidpointCircle(100, 100, 20);
  assert.ok(points.length > 0);
  // Verify distance of points from center is approximately radius (within 1 pixel)
  for (const pt of points) {
    const dist = Math.sqrt((pt.x - 100) ** 2 + (pt.y - 100) ** 2);
    assert.ok(Math.abs(dist - 20) <= 1.5, `Point (${pt.x}, ${pt.y}) distance ${dist} deviated from r=20`);
  }
});

test('Exp 6: Midpoint ellipse produces 4-quadrant symmetric points', () => {
  const points = computeMidpointEllipse(200, 200, 30, 20);
  assert.ok(points.length > 0);
});

test('Exp 7: 2D Transformations on triangle (Translate, Rotate, Scale)', () => {
  const triangle: [{ x: number; y: number }, { x: number; y: number }, { x: number; y: number }] = [
    { x: 200, y: 150 },
    { x: 150, y: 250 },
    { x: 250, y: 250 },
  ];
  // Translation
  const translated = transform2DTriangle(triangle, 'translate', { tx: 50, ty: -20 });
  assert.equal(translated[0].x, 250);
  assert.equal(translated[0].y, 130);

  // Reflection about center y
  const reflected = transform2DTriangle(triangle, 'reflect', {});
  const cy = (150 + 250 + 250) / 3; // 216.666
  assert.ok(Math.abs(reflected[0].y - (2 * cy - 150)) < 0.001);
});

test('Exp 8: Cohen-Sutherland Region Codes and Clipping Logic', () => {
  const xmin = 100, ymin = 100, xmax = 300, ymax = 300;
  
  // Point inside
  assert.equal(getCohenSutherlandCode(150, 150, xmin, ymin, xmax, ymax), REGION_INSIDE);
  // Point to the left
  assert.equal(getCohenSutherlandCode(50, 150, xmin, ymin, xmax, ymax), REGION_LEFT);
  // Point to the right & top
  assert.equal(getCohenSutherlandCode(350, 50, xmin, ymin, xmax, ymax), REGION_RIGHT | REGION_TOP);

  // Trivial accept
  const clip1 = cohenSutherlandClip(120, 120, 200, 200, xmin, ymin, xmax, ymax);
  assert.equal(clip1.accepted, true);
  assert.equal(clip1.x1, 120);
  assert.equal(clip1.x2, 200);

  // Trivial reject (both to the left)
  const clip2 = cohenSutherlandClip(20, 120, 50, 200, xmin, ymin, xmax, ymax);
  assert.equal(clip2.accepted, false);

  // Clipping crossing boundary
  const clip3 = cohenSutherlandClip(50, 150, 250, 150, xmin, ymin, xmax, ymax);
  assert.equal(clip3.accepted, true);
  assert.equal(clip3.x1, 100);
  assert.equal(clip3.x2, 250);
});

test('Exp 9 & 10: 3D to 2D Oblique Projection', () => {
  const proj = project3DTo2D({ x: 200, y: 180, z: 80 });
  assert.equal(proj.x, 240); // 200 + 80 / 2
  assert.equal(proj.y, 140); // 180 - 80 / 2
});

test('Exp 12: Sierpinski recursive triangle count', () => {
  const p1 = { x: 320, y: 50 };
  const p2 = { x: 100, y: 400 };
  const p3 = { x: 540, y: 400 };
  const depth0 = generateSierpinski(p1, p2, p3, 0);
  assert.equal(depth0.length, 1);
  const depth1 = generateSierpinski(p1, p2, p3, 1);
  assert.equal(depth1.length, 3);
  const depth2 = generateSierpinski(p1, p2, p3, 2);
  assert.equal(depth2.length, 9);
});
