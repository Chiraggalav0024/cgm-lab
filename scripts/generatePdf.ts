import fs from 'fs';
import path from 'path';
import { generateLabManualPdf } from '../src/utils/pdfGenerator.ts';

const doc = generateLabManualPdf();
const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
const outputPath = path.resolve('public', 'Computer_Graphics_Lab_Manual_Experiments_1_to_12.pdf');

fs.writeFileSync(outputPath, pdfBuffer);
console.log(`Successfully generated PDF file at: ${outputPath} (${pdfBuffer.length} bytes)`);
