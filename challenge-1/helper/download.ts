import * as https from "https";
import * as fs from "fs";

export default async function downloadFile(
  url: string,
  filePath: string
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    //stream to write the downloaded file
    const fileStream = fs.createWriteStream(filePath);
    //download the file from the url
    https
      .get(url, (response) => {
        response.pipe(fileStream);
        fileStream.on("finish", () => {
          fileStream.close(); // close write stream
          resolve();
        });
      })
      .on("error", (error) => {
        fs.unlinkSync(filePath); // delete any partially downloaded data
        reject(error);
      });
  });
}
