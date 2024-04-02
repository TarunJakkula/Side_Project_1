import * as fs from "fs";
import * as csv from "fast-csv";
import { scrapeJob, scrapeYCProfile } from "./helper/scrapper";
import { Job, responseData, YCCompany } from "./util/interfaces";
import { CSV_INPUT_PATH, JSON_OUTPUT_PATH } from "./resources";

export async function processCompanyList() {
  //company data
  const companies: { name: string; url: string }[] = [];

  //reading the csv file in a stream
  fs.createReadStream(CSV_INPUT_PATH)
    .pipe(csv.parse({ headers: true })) //creating a pip to directly connect the stream to csv parser
    .on(
      "data",
      (response: responseData) =>
        companies.push({
          name: response["Company Name"],
          url: response["YC URL"],
        }) //pushing each parsed data to the variable created above
    )
    .on("end", async () => {
      const urls: string[] = companies.map((obj) => {
        return obj.url;
      });

      // stores scraped data from the urls
      const scrapedData: YCCompany[] = await scrapeYCProfile(urls);

      const joburls: string[] = urls.map((obj) => {
        return obj + "/jobs";
      });

      const jobs: { [key: string]: Job[] }[] = await scrapeJob(joburls);
      scrapedData.forEach((company) => {
        const companyUrl = company.url + "/jobs";
        const matchingJobs = jobs.find((job) => job.hasOwnProperty(companyUrl));
        if (matchingJobs) {
          company.jobs = matchingJobs[companyUrl];
        }
      });

      try {
        fs.mkdirSync("out");
      } catch (err) {
        // 'out' already exists
      }

      //creates a json file int the out folder
      fs.writeFileSync(JSON_OUTPUT_PATH, JSON.stringify(scrapedData, null, 2));
    });
}
