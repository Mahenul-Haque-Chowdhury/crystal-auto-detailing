import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import ffmpegPath from "ffmpeg-static";

const projectRoot = process.cwd();
const publicDir = path.join(projectRoot, "public");

const input = path.join(publicDir, "background.mp4");
const out720 = path.join(publicDir, "background-720.mp4");
const out480 = path.join(publicDir, "background-480.mp4");
const poster = path.join(publicDir, "background-poster.jpg");

if (!existsSync(input)) {
  console.error(`Missing input video: ${input}`);
  process.exit(1);
}

if (!ffmpegPath) {
  console.error("ffmpeg-static did not resolve an ffmpeg binary.");
  process.exit(1);
}

function run(args, label) {
  const result = spawnSync(ffmpegPath, args, {
    stdio: "inherit",
    cwd: projectRoot,
  });

  if (result.error) {
    console.error(`${label} failed:`, result.error);
    process.exit(1);
  }

  if (typeof result.status === "number" && result.status !== 0) {
    console.error(`${label} failed with exit code ${result.status}`);
    process.exit(result.status);
  }
}

// Poster (1 second in, scaled, jpg)
run(
  [
    "-y",
    "-i",
    input,
    "-ss",
    "00:00:01",
    "-vframes",
    "1",
    "-vf",
    "scale=1280:-2",
    "-q:v",
    "3",
    poster,
  ],
  "poster"
);

// 720p desktop-ish (smaller than original, faststart)
run(
  [
    "-y",
    "-i",
    input,
    "-an",
    "-vf",
    "scale=-2:720,fps=30",
    "-c:v",
    "libx264",
    "-profile:v",
    "main",
    "-level",
    "3.1",
    "-pix_fmt",
    "yuv420p",
    "-preset",
    "veryfast",
    "-crf",
    "24",
    "-tune",
    "fastdecode",
    "-movflags",
    "+faststart",
    out720,
  ],
  "720p"
);

// 480p mobile/low-end (baseline profile for broad compatibility)
run(
  [
    "-y",
    "-i",
    input,
    "-an",
    "-vf",
    "scale=-2:480,fps=24",
    "-c:v",
    "libx264",
    "-profile:v",
    "baseline",
    "-level",
    "3.0",
    "-pix_fmt",
    "yuv420p",
    "-preset",
    "veryfast",
    "-crf",
    "28",
    "-tune",
    "fastdecode",
    "-movflags",
    "+faststart",
    out480,
  ],
  "480p"
);

console.log("\nGenerated:");
console.log(`- ${path.relative(projectRoot, poster)}`);
console.log(`- ${path.relative(projectRoot, out720)}`);
console.log(`- ${path.relative(projectRoot, out480)}`);
