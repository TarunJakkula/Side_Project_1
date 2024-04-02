import downloadFile from "./helper/download";
import extractFile from "./helper/extract";
import processCSV from "./helper/process";
import { DUMP_DOWNLOAD_URL } from "./resources";

export function processDataDump(): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const fileUrl: string = DUMP_DOWNLOAD_URL; // doanload url
    const filePath: string = "tmp/dump.tar.gz"; // downloadd location
    const extractionDestination: string = "tmp/"; // extraction location
    // csv's from the extracted zip file
    const customersFilePath: string = "tmp/dump/customers.csv";
    const organizationsFilePath: string = "tmp/dump/organizations.csv";

    try {
      // Download the file
      console.log("Downloading...");
      await downloadFile(fileUrl, filePath);
      console.log("\nDownload complete!\n");

      // Extract the file
      console.log("Extracting....");
      await extractFile(filePath, extractionDestination);
      console.log("\nExtraction complete!\n");

      console.log("Processing customers csv...\n");
      // processing customer csv
      processCSV(customersFilePath, "customers")
        .then(() => {
          console.log("\nCustomers processing complete!\n");
          console.log("Processing organization csv...\n");
          // processing organisation csv
          processCSV(organizationsFilePath, "organizations")
            .then(() => {
              console.log("\nOrganizations processing complete!\n");
              resolve();
            })
            .catch((err) => {
              console.error("Error processing organization CSV:", err);
            });
        })
        .catch((err) => {
          console.error("Error processing customers CSV:", err);
        });
    } catch (err) {
      reject(err); // Reject the promise if an error occurs
    }
  });
}
