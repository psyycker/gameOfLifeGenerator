// @ts-ignore
const PImage = require("pureimage");
const fs = require("fs");
const EMPTY =  "#000000";
const FULL = "#ffffff";

function doubleLoop(ySize, xSize, callback, printPercentage = false) {
  let nextPercentage = 0;
  for (let y = 0; y < ySize; y += 1) {
    if (printPercentage) {
      const percentage = (y / ySize) * 100;
      if (percentage >= nextPercentage) {
        console.log(`${nextPercentage}%`)
        nextPercentage += 10;
      }
    }
    for (let x = 0; x < xSize; x += 1) {
      callback(y, x);
    }
  }
}




class ImageManipulator {

  static createWithMap(map , pixelSize = 1) {
    const image = new ImageManipulator(map.length, map[0].length, pixelSize);
    image.fill(EMPTY)
    doubleLoop(map.length, map[0].length, (y, x) => {
      const value = map[y][x];
      if (value === 1) {
        image.setPixel(y, x, "#ffffff")
      }
    })
    return image;
  }

  static createWithAliveCoordinates(aliveCoordinates, pixelSize = 1, xSize, ySize) {
    const image = new ImageManipulator(ySize, xSize, pixelSize);
    image.fill(EMPTY)
    aliveCoordinates.forEach((coordinatesStr) => {
      const [y, x] = coordinatesStr.split(":");
      image.setPixel(y, x, "#ffffff")
    })
    return image;
  }

  constructor(ySize, xSize, pixelSize = 1) {
    this._img = PImage.make(ySize * pixelSize, xSize * pixelSize);
    this._xSize = xSize;
    this._ySize = ySize;
    this._pixelSize = pixelSize;
  }

  setPixel(y, x, color) {
    const ctx = this.img.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(x * this._pixelSize,y * this._pixelSize,this._pixelSize,this._pixelSize);
  }

  fill(color) {
    const ctx = this.img.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(0,0,this.xSize * this._pixelSize,this.ySize * this._pixelSize);
  }

  print(filePath) {
    console.log("printing... ", filePath)
    return PImage.encodePNGToStream(this.img, fs.createWriteStream(filePath))
  }

  get xSize() {
    return this._xSize;
  }

  get ySize() {
    return this._ySize;
  }

  get img() {
    return this._img;
  }


}

module.exports = {ImageManipulator}
