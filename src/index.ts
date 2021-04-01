import Express from "express";

const app = Express();
// @ts-ignore
import videoshow from "videoshow";
import {genMap, getNextState} from "./GoLService";
import fs from "fs"
import {generateVideoFromImages} from "./ffmpegHelper";
import StartImagesThreads from "./ImageThreadInitialiser";

const Y = 2000;
const X = 2000;
const PIXEL_SIZE = 1;
const LOOPS = 30;

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
  let mapB = JSON.parse(JSON.stringify(mapA));
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

run();


app.listen(4000);
