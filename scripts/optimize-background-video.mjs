import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import ffmpegPath from "ffmpeg-static";

const projectRoot = process.cwd();
const publicDir = path.join(projectRoot, "public");

const input = path.join(publicDir, "background.mp4");
const out1080 = path.join(publicDir, "background-1080.mp4");
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

// 1080p 60fps (single source of truth)
// Note: some Android devices may still struggle with 1080p60 regardless of encoding.
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
    "main",
    "-level",
    "4.2",
    "-pix_fmt",
    "yuv420p",
    "-preset",
    "veryfast",
    "-tune",
    "fastdecode",
    // Cap bitrate spikes (helps mobile decoders / thermal throttling).
    "-maxrate",
    "4500k",
    "-bufsize",
    "9000k",
    // Reduce decode complexity a bit.
    "-x264-params",
    "ref=1:bframes=0:weightp=0:keyint=120:min-keyint=60",
    "-crf",
    "24",
    "-movflags",
    "+faststart",
    out1080,
  ],
  "1080p60"
);

console.log("\nGenerated:");
console.log(`- ${path.relative(projectRoot, poster)}`);
console.log(`- ${path.relative(projectRoot, out1080)}`);
