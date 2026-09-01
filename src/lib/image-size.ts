import fs from "fs";

export interface Size {
  width: number;
  height: number;
}

/* Pixel dimensions straight out of a file's header.

   Only the first few KB are read: every format below records its size within
   them. This exists so the gallery can reserve each photo's exact box before
   the browser has the bytes — without it the rail relayouts as images land. */
export function imageSize(filePath: string): Size | null {
  const buf = Buffer.alloc(65536);
  const fd = fs.openSync(filePath, "r");
  let read: number;
  try {
    read = fs.readSync(fd, buf, 0, buf.length, 0);
  } finally {
    fs.closeSync(fd);
  }

  const head = buf.subarray(0, read);

  return png(head) ?? gif(head) ?? webp(head) ?? jpeg(head);
}

function png(b: Buffer): Size | null {
  if (b.length < 24 || b.readUInt32BE(0) !== 0x89504e47) return null;
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

function gif(b: Buffer): Size | null {
  if (b.length < 10 || b.toString("ascii", 0, 3) !== "GIF") return null;
  return { width: b.readUInt16LE(6), height: b.readUInt16LE(8) };
}

/* WebP comes in three flavours, each storing its size differently. */
function webp(b: Buffer): Size | null {
  if (b.length < 30 || b.toString("ascii", 8, 12) !== "WEBP") return null;
  const format = b.toString("ascii", 12, 16);

  if (format === "VP8X") {
    // 24-bit little-endian, stored one less than the true dimension.
    const at = (i: number) => (b[i] | (b[i + 1] << 8) | (b[i + 2] << 16)) + 1;
    return { width: at(24), height: at(27) };
  }

  if (format === "VP8 ") {
    // 14 bits each, after the 3-byte start code.
    return {
      width: b.readUInt16LE(26) & 0x3fff,
      height: b.readUInt16LE(28) & 0x3fff,
    };
  }

  if (format === "VP8L") {
    const bits = b.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }

  return null;
}

/* JPEG hides its size in a start-of-frame marker, reachable only by walking
   the segment chain from the top of the file. */
function jpeg(b: Buffer): Size | null {
  if (b.length < 4 || b.readUInt16BE(0) !== 0xffd8) return null;

  let offset = 2;
  while (offset + 9 < b.length) {
    if (b[offset] !== 0xff) {
      offset++; // Resync: padding bytes are legal between segments.
      continue;
    }

    const marker = b[offset + 1];
    // SOF0-SOF15 carry the dimensions; SOF4/SOF8/SOF12 are not frame headers.
    if (
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc
    ) {
      return {
        height: b.readUInt16BE(offset + 5),
        width: b.readUInt16BE(offset + 7),
      };
    }

    offset += 2 + b.readUInt16BE(offset + 2);
  }

  return null;
}
