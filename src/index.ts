import Express from "express";

const app = Express();
// @ts-ignore
import videoshow from "videoshow";
import {copyMap, genMap, getNextState} from "./GoLService";
import fs from "fs"
import {generateVideoFromImages} from "./ffmpegHelper";
import StartImagesThreads from "./ImageThreadInitialiser";
import {Server} from "http";

const Y = 5000;
const X = 5000;
const PIXEL_SIZE = 1;

// The amount of threads created. My computer has a i9, So I have much interest to keep it high.
// For computer with 4 cores, you should get it down to 4
const LOOPS = 1000;
export const THREADS = 4;

function cleanOutputs() {
  if (fs.existsSync("outputs")) {
    console.log("Cleaning outputs directory...")
    const files = fs.readdirSync("outputs");
    files.forEach((file) => {
      fs.rmSync("outputs/" + file);
    })
    console.log("Ouputs directory cleaned")
  }
}

function init() {
  cleanOutputs();
  if (!fs.existsSync("outputs")) {
    fs.mkdirSync("outputs")
  }
  let mapA = genMap(Y, X);
  let mapB = copyMap(mapA);
  return {
    mapA, mapB
  }
}

async function run() {
  let {mapA, mapB} = init();

  let intermediate = null;

  for (let i = 0; i < LOOPS; i += 1) {
    console.log(`${i}/${LOOPS}`)
    intermediate = mapA;
    mapA = mapB;
    mapB = intermediate;
    const {aliveCoordinates} = getNextState(mapA, mapB);
    fs.writeFileSync(`./outputs/${i}.json`, JSON.stringify(aliveCoordinates));
  }
  StartImagesThreads(PIXEL_SIZE, X, Y)
    .then(async () => {
      console.log("Generating video...")
      await generateVideoFromImages("video.mp4");
      cleanOutputs();
    })
}

let server: Server;

run()
  .then(() => {
    if (server) {
      server.close();
    }
  })


server = app.listen(4000);
