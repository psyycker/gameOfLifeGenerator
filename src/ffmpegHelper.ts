import { exec } from "child_process";
import util from "util";
import fs from "fs";
const execPromise = util.promisify(exec);


// ffmpeg -start_number n -i test_%d.jpg -vcodec mpeg4 test.avi

const FFMPEG = "ffmpeg"
const START_NUMBER_PARAM = "-start_number 0"
const CODEC = "-vcodec mpeg4"
const INPUTS = "-i outputs/out-%d.png"
export async function generateVideoFromImages(output: string) {
  if (fs.existsSync(output)) {
    fs.rmSync(output);
  }
  const command = `${FFMPEG} ${START_NUMBER_PARAM} ${INPUTS} ${CODEC} ${output}`
  const { stdout, stderr } = await execPromise(command)
  console.log("Video successfully generated")
}
