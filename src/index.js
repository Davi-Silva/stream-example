const express = require("express");
const { resolve } = require("path");
const { statSync, createReadStream } = require("fs");
const morgan = require("morgan");

const app = express();

const PORT = 3333;

app.use(morgan("dev"));

app.use("/stream/audio", (req, res) => {
  const range = req.headers.range;
  const songPath = resolve(__dirname, "assets", "audio", "song.mp3");
  const songSize = statSync(songPath).size;

  const start = Number(range.replace(/\D/g, ""));

  const BUFFER_SIZE = 10000;
  const end = Math.min(start + BUFFER_SIZE, songSize - 1);

  const headers = {
    "Content-Range": `bytes ${start}-${end}/${songSize}`,
    "Accept-Ranges": "bytes",
    "Content-type": "audio/mpeg",
  };

  res.writeHead(206, headers);

  const songStream = createReadStream(songPath, { start, end });

  songStream.pipe(res);
});

app.use("/stream/video", (req, res) => {
  const range = req.headers.range;
  const songPath = resolve(__dirname, "assets", "video", "video.mp4");
  const songSize = statSync(songPath).size;

  const start = Number(range.replace(/\D/g, ""));

  const BUFFER_SIZE = 50000;
  const end = Math.min(start + BUFFER_SIZE, songSize - 1);

  const headers = {
    "Content-Range": `bytes ${start}-${end}/${songSize}`,
    "Accept-Ranges": "bytes",
    "Content-type": "audio/mpeg",
  };

  res.writeHead(206, headers);

  const songStream = createReadStream(songPath, { start, end });

  songStream.pipe(res);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
