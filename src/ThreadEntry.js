const {workerData, parentPort} = require("worker_threads");
const fs = require("fs");
const { files, pixelSize, xSize, ySize } = workerData;
const {ImageManipulator} = require("./ImageManipulator")

function processFile(fileObj) {
  const {file, index} = fileObj;
  const strJson = fs.readFileSync(`outputs/${file}`, {
    encoding: "utf8"
  });
  const jsonFile = JSON.parse(strJson);
  const image = ImageManipulator.createWithAliveCoordinates(jsonFile, pixelSize, xSize, ySize);
  image.print(`outputs/out-${index}.png`)
    .then(() => {
      files.shift();
      if (files.length === 0) {
        parentPort.close();
      } else {
        processFile(files[0]);
      }
    })
}

processFile(files[0]);
