import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import ffmpegPath from "ffmpeg-static";

const projectRoot = process.cwd();
const publicDir = path.join(projectRoot, "public");

const input = path.join(publicDir, "background.mp4");
const out1080 = path.join(publicDir, "background-1080.mp4");
const out720 = path.join(publicDir, "background-720.mp4");
const out540 = path.join(publicDir, "background-540.mp4");
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

// 1080p60 (best quality; may not be power-efficient on many Android devices)
run(
  [
    "-y",
    "-i",
    input,
    "-an",
    "-vf",
    "scale=-2:1080,fps=60",
    "-c:v",
    "libx264",
    "-profile:v",
    "baseline",
    "-level",
    "4.2",
    "-pix_fmt",
    "yuv420p",
    "-preset",
    "veryfast",
    "-tune",
    "fastdecode",
    "-maxrate",
    "4500k",
    "-bufsize",
    "9000k",
    "-x264-params",
    "cabac=0:ref=1:bframes=0:weightp=0:keyint=120:min-keyint=60:scenecut=0",
    "-crf",
    "24",
    "-movflags",
    "+faststart",
    out1080,
  ],
  "1080p60"
);

// 720p60 (typically smoother on Android while still looking sharp)
run(
  [
    "-y",
    "-i",
    input,
    "-an",
    "-vf",
    "scale=-2:720,fps=60",
    "-c:v",
    "libx264",
    "-profile:v",
    "baseline",
    "-level",
    "4.0",
    "-pix_fmt",
    "yuv420p",
    "-preset",
    "veryfast",
    "-tune",
    "fastdecode",
    "-maxrate",
    "2500k",
    "-bufsize",
    "5000k",
    "-x264-params",
    "cabac=0:ref=1:bframes=0:weightp=0:keyint=120:min-keyint=60:scenecut=0",
    "-crf",
    "25",
    "-movflags",
    "+faststart",
    out720,
  ],
  "720p60"
);

// 540p60 (fallback for lower-end Android devices)
run(
  [
    "-y",
    "-i",
    input,
    "-an",
    "-vf",
    "scale=-2:540,fps=60",
    "-c:v",
    "libx264",
    "-profile:v",
    "baseline",
    "-level",
    "3.2",
    "-pix_fmt",
    "yuv420p",
    "-preset",
    "veryfast",
    "-tune",
    "fastdecode",
    "-maxrate",
    "1600k",
    "-bufsize",
    "3200k",
    "-x264-params",
    "cabac=0:ref=1:bframes=0:weightp=0:keyint=120:min-keyint=60:scenecut=0",
    "-crf",
    "27",
    "-movflags",
    "+faststart",
    out540,
  ],
  "540p60"
);

console.log("\nGenerated:");
console.log(`- ${path.relative(projectRoot, poster)}`);
console.log(`- ${path.relative(projectRoot, out1080)}`);
console.log(`- ${path.relative(projectRoot, out720)}`);
console.log(`- ${path.relative(projectRoot, out540)}`);
