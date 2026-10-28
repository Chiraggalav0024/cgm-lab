import { jsPDF } from 'jspdf';
import { EXPERIMENTS, Experiment } from '../data/experimentsData.ts';

export function generateLabManualPdf(): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;

  // Helper to add clean running header & footer
  const addHeaderFooter = (pageNumber: number, totalPages?: number) => {
    if (pageNumber === 1) return; // Skip cover page

    // Header rule
    doc.setDrawColor(203, 213, 225); // Slate 300
    doc.setLineWidth(0.3);
    doc.line(margin, 12, pageWidth - margin, 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('COMPUTER GRAPHICS LABORATORY MANUAL (C / BGI)', margin, 9);
    doc.text('ACADEMIC PRACTICAL RECORD', pageWidth - margin, 9, { align: 'right' });

    // Footer rule
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    doc.text(
      'Department of Computer Science & Engineering | Practical File',
      margin,
      pageHeight - 8
    );
    doc.text(
      `Page ${pageNumber}${totalPages ? ` of ${totalPages}` : ''}`,
      pageWidth - margin,
      pageHeight - 8,
      { align: 'right' }
    );
  };

  // ==========================================
  // PAGE 1: COVER PAGE
  // ==========================================
  // Outer decorative border
  doc.setDrawColor(30, 41, 59); // Slate 800
  doc.setLineWidth(1.2);
  doc.rect(margin - 4, margin - 4, contentWidth + 8, pageHeight - 2 * margin + 8);
  doc.setLineWidth(0.4);
  doc.rect(margin - 2, margin - 2, contentWidth + 4, pageHeight - 2 * margin + 4);

  // Institution Banner / Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.text('DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING', pageWidth / 2, 45, { align: 'center' });

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('COMPUTER GRAPHICS & MULTIMEDIA LABORATORY', pageWidth / 2, 54, { align: 'center' });

  // Accent Line
  doc.setDrawColor(37, 99, 235); // Blue 600
  doc.setLineWidth(1.5);
  doc.line(pageWidth / 2 - 40, 62, pageWidth / 2 + 40, 62);

  // Big Badge / Title Block
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin + 5, 80, contentWidth - 10, 45, 3, 3, 'F');
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.8);
  doc.roundedRect(margin + 5, 80, contentWidth - 10, 45, 3, 3, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(30, 58, 138); // Blue 900
  doc.text('LABORATORY EXPERIMENT RECORD', pageWidth / 2, 95, { align: 'center' });

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text('All 12 Practical Experiments with Corrected C Graphics Code & Verified Logic', pageWidth / 2, 105, { align: 'center' });
  doc.text('Turbo C / BGI & GCC libgraph Compatible', pageWidth / 2, 113, { align: 'center' });

  // Student & Faculty Information Card
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin + 10, 140, contentWidth - 20, 65, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('ACADEMIC RECORD DETAILS', margin + 15, 150);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);

  const metaRows = [
    ['Subject Name:', 'Computer Graphics Lab (Practical)'],
    ['Subject Code:', 'CS302 / CGL-Lab'],
    ['Total Experiments:', '12 Numbered Laboratory Programs'],
    ['Code Standard:', 'ANSI C / Turbo C 3.0 / Borland Graphics Interface'],
    ['Academic Term:', '2026 - 2027'],
  ];

  let currentY = 160;
  metaRows.forEach(([lbl, val]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(lbl, margin + 18, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(val, margin + 65, currentY);
    currentY += 8;
  });

  // Signatures at bottom of cover page
  doc.line(margin + 15, 245, margin + 70, 245);
  doc.text('Faculty In-Charge Signature', margin + 18, 250);

  doc.line(pageWidth - margin - 70, 245, pageWidth - margin - 15, 245);
  doc.text('Student Signature', pageWidth - margin - 58, 250);

  // ==========================================
  // PAGE 2: TABLE OF CONTENTS
  // ==========================================
  doc.addPage();
  addHeaderFooter(2);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text('TABLE OF EXPERIMENTS / INDEX', margin, 24);

  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.8);
  doc.line(margin, 27, margin + 75, 27);

  // Table header
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, 34, contentWidth, 8, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.rect(margin, 34, contentWidth, 8, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text('Exp #', margin + 3, 39.5);
  doc.text('Experiment Title & Topic', margin + 20, 39.5);
  doc.text('Category', margin + 130, 39.5);
  doc.text('Status', margin + 165, 39.5);

  let tocY = 46;
  EXPERIMENTS.forEach((exp) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(37, 99, 235);
    doc.text(`Exp ${exp.number}`, margin + 3, tocY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    // Truncate title if needed
    const shortTitle = exp.title.length > 55 ? exp.title.substring(0, 52) + '...' : exp.title;
    doc.text(shortTitle, margin + 20, tocY);

    doc.setTextColor(100, 116, 139);
    doc.text(exp.category, margin + 130, tocY);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129); // Emerald
    doc.text('Verified', margin + 165, tocY);

    // Row line
    doc.setDrawColor(241, 245, 249);
    doc.line(margin, tocY + 2.5, pageWidth - margin, tocY + 2.5);

    tocY += 7.5;
  });

  // Summary box below TOC
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, 145, contentWidth, 40, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('NOTE ON SYNTAX CORRECTIONS & ORIGINAL LOGIC PRESERVATION:', margin + 5, 153);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  const noteLines = [
    '• All mathematical logic, coordinate points, and algorithm decisions from the original scans and',
    '  handwritten records have been 100% preserved without alteration.',
    '• All syntax errors, missing semicolons (Exp 1), missing assignments (Exp 5), miscalculated boundary',
    '  intercept formulas corrected by teacher in red pen (Exp 8), and typos (Exp 11) have been repaired.',
    '• Each experiment provides full, compilable C source code with clean Turbo C BGI graphics initialization.',
  ];
  let noteY = 160;
  noteLines.forEach((l) => {
    doc.text(l, margin + 5, noteY);
    noteY += 5.5;
  });

  // ==========================================
  // EXPERIMENTS PAGES (1 to 12)
  // ==========================================
  let pageCounter = 3;

  EXPERIMENTS.forEach((exp) => {
    doc.addPage();
    addHeaderFooter(pageCounter);
    pageCounter++;

    let y = 20;

    // Header Badge: Experiment Number
    doc.setFillColor(37, 99, 235);
    doc.roundedRect(margin, y, 32, 7, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(`EXPERIMENT ${exp.number}`, margin + 3.5, y + 4.8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Category: ${exp.category} | Source: ${exp.originalFileName}`, margin + 38, y + 4.8);

    y += 12;

    // Experiment Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text(exp.title, margin, y);
    y += 7;

    // Aim Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 14, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text('AIM / OBJECTIVE:', margin + 4, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    const splitAim = doc.splitTextToSize(exp.aim, contentWidth - 8);
    doc.text(splitAim, margin + 4, y + 9.5);

    y += 18;

    // Theory & Algorithm summary
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text('THEORY & KEY FORMULAS:', margin, y);
    y += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.8);
    doc.setTextColor(51, 65, 85);
    const splitTheory = doc.splitTextToSize(exp.theory, contentWidth);
    doc.text(splitTheory, margin, y);
    y += splitTheory.length * 3.8 + 2;

    // Syntax Errors & Corrections Box (Yellow/Amber Callout)
    if (exp.syntaxErrorsFound.length > 0) {
      doc.setFillColor(254, 252, 232); // Amber 50
      doc.setDrawColor(251, 191, 36);  // Amber 400
      doc.setLineWidth(0.4);

      const boxY = y;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(146, 64, 14); // Amber 800

      let errTextY = boxY + 4.5;
      const errorRenderStrings: string[] = [];
      exp.syntaxErrorsFound.forEach((err) => {
        errorRenderStrings.push(`[${err.location}] Issue: ${err.issue} -> Fix: ${err.fix}`);
      });

      const allErrLines: string[] = [];
      errorRenderStrings.forEach((str) => {
        const lines = doc.splitTextToSize(`• ${str}`, contentWidth - 8);
        allErrLines.push(...lines);
      });

      const calloutHeight = Math.max(12, allErrLines.length * 3.6 + 7);
      doc.roundedRect(margin, boxY, contentWidth, calloutHeight, 1.5, 1.5, 'FD');

      doc.text('SYNTAX CORRECTIONS APPLIED (KEEPING ORIGINAL LOGIC):', margin + 4, errTextY);
      errTextY += 4.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.2);
      allErrLines.forEach((line) => {
        doc.text(line, margin + 4, errTextY);
        errTextY += 3.4;
      });

      y += calloutHeight + 4;
    }

    // Corrected Source Code Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text('CORRECTED C SOURCE CODE (TURBO C / GCC GRAPHICS):', margin, y);
    y += 4;

    // Code container box
    const codeLines = exp.correctedCode.split('\n');
    const availableHeight = pageHeight - margin - y - 10;
    
    // Check if code fits on this page or needs a second page for this experiment
    const lineHeight = 3.1;
    const requiredCodeHeight = codeLines.length * lineHeight + 8;

    if (requiredCodeHeight > availableHeight) {
      // Split code across pages or add page
      const firstChunkLines = Math.floor((availableHeight - 10) / lineHeight);
      const chunk1 = codeLines.slice(0, firstChunkLines);
      const chunk2 = codeLines.slice(firstChunkLines);

      // Render Chunk 1
      renderCodeBox(doc, chunk1, margin, y, contentWidth, firstChunkLines * lineHeight + 6);

      // New Page for Chunk 2
      doc.addPage();
      addHeaderFooter(pageCounter);
      pageCounter++;
      let p2Y = 22;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`EXPERIMENT ${exp.number} (CONTINUED): ${exp.title}`, margin, p2Y);
      p2Y += 5;

      renderCodeBox(doc, chunk2, margin, p2Y, contentWidth, chunk2.length * lineHeight + 6);
    } else {
      renderCodeBox(doc, codeLines, margin, y, contentWidth, requiredCodeHeight);
    }
  });

  return doc;
}

function renderCodeBox(
  doc: jsPDF,
  lines: string[],
  x: number,
  y: number,
  width: number,
  height: number
) {
  // Background
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.roundedRect(x, y, width, height, 1.5, 1.5, 'F');

  doc.setFont('courier', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(226, 232, 240); // Slate 200

  let lineY = y + 4.5;
  lines.forEach((line, idx) => {
    // Line number in dimmed slate
    doc.setTextColor(100, 116, 139);
    const lineNum = String(idx + 1).padStart(2, ' ');
    doc.text(lineNum, x + 2.5, lineY);

    // Comment highlight
    if (line.trim().startsWith('/*') || line.trim().startsWith('*') || line.trim().startsWith('//')) {
      doc.setTextColor(148, 163, 184); // Muted comment
    } else if (line.trim().startsWith('#include') || line.trim().startsWith('#define')) {
      doc.setTextColor(147, 197, 253); // Light blue
    } else if (
      line.includes('initgraph') ||
      line.includes('putpixel') ||
      line.includes('line(') ||
      line.includes('circle(') ||
      line.includes('ellipse(') ||
      line.includes('rectangle(')
    ) {
      doc.setTextColor(253, 224, 71); // Yellow accent
    } else {
      doc.setTextColor(248, 250, 252); // White
    }

    doc.text(line.replace(/\t/g, '    '), x + 10, lineY);
    lineY += 3.1;
  });
}
