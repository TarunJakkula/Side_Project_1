import * as fs from "fs";
import * as zlib from "zlib";
import * as tar from "tar";

export default async function extractFile(
  filePath: string,
  destination: string
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    //create a stream to extract
    fs.createReadStream(filePath)
      .pipe(zlib.createGunzip())
      .pipe(tar.extract({ cwd: destination })) // tar extraction
      .on("finish", resolve)
      .on("error", reject);
  });
}
