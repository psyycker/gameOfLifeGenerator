
const UNDERPOPULATION_VALUE = 2;
const STAY_ALIVE_VALUES = [2, 3]
const DIE_VALUE = 3;
const RESURRECT_VALUE = 3;

const STOP_COUNTING_VALUE = 4;

export function genMap(sizeY: number, sizeX: number) {
  const map = [];
  for (let y = 0; y < sizeY; y += 1) {
    const line = [];
    for (let x = 0; x < sizeX; x += 1) {
      line.push( Math.random() < 0.5 ? 1 : 0)
    }
    map.push(line);
  }
  return map;
}

export function copyMap(map: number[][]) {
  const newMap = [];
  for (let y = 0; y < map.length; y += 1) {
    const line = [];
    for (let x = 0; x < map[y].length; x += 1) {
      line.push(map[y][x]);
    }
    newMap.push(line);
  }
  return newMap;
}

function doX(y: number, x: number, yIndex: number, yLength: number, xLength: number, map: number[][]): number {
  let neighboursCounter = 0;
  for (let xIndex = x - 1; xIndex <= x + 1; xIndex += 1) {
    if (yIndex < 0 || yIndex >= yLength) {
      return neighboursCounter;
    }
    if (xIndex < 0 || (xIndex === x && yIndex === y) || xIndex >= xLength) {
      continue;
    }
    neighboursCounter += map[yIndex][xIndex];
    if (neighboursCounter >= STOP_COUNTING_VALUE) {
      return neighboursCounter;
    }
  }
  return neighboursCounter
}


export function checkRules(y: number, x: number, yLength: number, xLength: number, map: number[][]): number {

  const cellState = map[y][x];
  let neighboursCounter = 0;
  for (let yIndex = y - 1; yIndex <= y + 1; yIndex += 1) {
    neighboursCounter += doX(y, x,  yIndex, yLength, xLength, map);
    if (neighboursCounter >= STOP_COUNTING_VALUE) {
      break;
    }
  }
  if (cellState) {
    if (neighboursCounter < UNDERPOPULATION_VALUE) {
      return 0;
    }
    if (STAY_ALIVE_VALUES.includes(neighboursCounter)) {
      return 1;
    }
    if (neighboursCounter > DIE_VALUE) {
      return 0
    }
  } else if (!cellState && neighboursCounter === RESURRECT_VALUE) {
    return 1;
  }
  return 0;
}

export function getNextState(mapA: number[][], mapB: number[][]): {map: number[][], aliveCoordinates: string[]} {
  const yLength = mapA.length;
  const xLength = mapA[0].length;
  const aliveCoordinates: string[] = []
  for (let y = 0; y < mapA.length; y += 1) {
    for (let x = 0; x < mapA[0].length; x += 1) {
      const result = checkRules(y, x, yLength, xLength, mapA)
      mapB[y][x] = result
      if (result === 1) {
        aliveCoordinates.push(`${y}:${x}`)
      }
    }
  }
  return {map: mapB, aliveCoordinates};
}
