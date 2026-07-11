import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const questImageDirectory = path.join(root, 'assets/images/quests');
const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

const crcTable = Array.from({ length: 256 }, (_, value) => {
  let crc = value;
  for (let bit = 0; bit < 8; bit += 1) {
    crc = (crc & 1) ? (0xedb88320 ^ (crc >>> 1)) : (crc >>> 1);
  }
  return crc >>> 0;
});

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function parsePng(buffer) {
  if (!buffer.subarray(0, 8).equals(signature)) throw new Error('Invalid PNG signature');

  const chunks = [];
  let offset = 8;
  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    chunks.push({ type, data });
    offset += length + 12;
  }
  return chunks;
}

function encodeChunk(type, data) {
  const typeBuffer = Buffer.from(type, 'ascii');
  const chunk = Buffer.allocUnsafe(data.length + 12);
  chunk.writeUInt32BE(data.length, 0);
  typeBuffer.copy(chunk, 4);
  data.copy(chunk, 8);
  chunk.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), data.length + 8);
  return chunk;
}

function recompressPng(buffer) {
  const chunks = parsePng(buffer);
  const compressed = Buffer.concat(chunks.filter(({ type }) => type === 'IDAT').map(({ data }) => data));
  const pixels = zlib.inflateSync(compressed);
  const candidates = [
    zlib.deflateSync(pixels, { level: 9 }),
    zlib.deflateSync(pixels, { level: 9, strategy: zlib.constants.Z_FILTERED }),
    zlib.deflateSync(pixels, { level: 9, strategy: zlib.constants.Z_RLE })
  ];
  const optimized = candidates.reduce((smallest, candidate) => candidate.length < smallest.length ? candidate : smallest);
  const parts = [signature];
  let wroteImageData = false;

  for (const chunk of chunks) {
    if (chunk.type === 'IDAT') {
      if (!wroteImageData) parts.push(encodeChunk('IDAT', optimized));
      wroteImageData = true;
      continue;
    }
    parts.push(encodeChunk(chunk.type, chunk.data));
  }

  const output = Buffer.concat(parts);
  const outputCompressed = Buffer.concat(parsePng(output).filter(({ type }) => type === 'IDAT').map(({ data }) => data));
  if (!zlib.inflateSync(outputCompressed).equals(pixels)) throw new Error('PNG recompression changed decoded scanlines');
  return output;
}

let beforeBytes = 0;
let afterBytes = 0;
for (const fileName of fs.readdirSync(questImageDirectory).filter((file) => file.endsWith('.png')).sort()) {
  const filePath = path.join(questImageDirectory, fileName);
  const input = fs.readFileSync(filePath);
  const output = recompressPng(input);
  beforeBytes += input.length;
  afterBytes += Math.min(input.length, output.length);
  if (output.length < input.length) fs.writeFileSync(filePath, output);
}

console.log(`PNG assets: ${beforeBytes} -> ${afterBytes} bytes (${beforeBytes - afterBytes} saved)`);
