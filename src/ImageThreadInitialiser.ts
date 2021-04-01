import fs from "fs";
import { Worker } from "worker_threads";

const MAX_THREADS = 8;
export default function StartImagesThreads(pixelSize: number, xSize: number, ySize: number) {
  let cptr = 0;
  const objects: {[key: string]: { file: string, index: number }[]} = {};
  for (let i = 0; i < MAX_THREADS; i += 1) {
    objects[i] = []
  }
  const files = fs.readdirSync("outputs");
  const fileNumbers = files.map(file => parseInt(file.replace(".json", ""))).sort((a, b) => a > b ? 1 : -1);
  fileNumbers.forEach((file) => {
    objects[cptr].push({file: `${file}.json`, index: file});
    cptr += 1;
    if (cptr === MAX_THREADS) {
      cptr = 0;
    }
  })
  const promises = Object.values(objects).map((files) => {
    return new Promise((resolve) => {
      const worker = new Worker("./src/ThreadEntry.js", {
        workerData: {
          files,
          pixelSize,
          xSize,
          ySize
        }
      })
      worker.on("message", resolve)
    })
  });
  return Promise.all(promises)
}
