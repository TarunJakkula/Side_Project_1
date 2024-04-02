import { CheerioCrawler } from "crawlee";
import { extractCompanyData, extractJobs } from "./extracter";
import { YCCompany, Job } from "../util/interfaces";

export async function scrapeYCProfile(url: string[]): Promise<YCCompany[]> {
  // Array to hold scraped data
  const scrapedData: YCCompany[] = [];

  //configure the crawler
  const crawler = new CheerioCrawler({
    requestHandler: async ({ response, $ }) => {
      //funtion call to handle the extraction logic
      const companyData = await extractCompanyData($);
      scrapedData.push({ ...companyData, url: response.url });
    },

    // handle failed request
    failedRequestHandler({ request }) {
      console.log(request.url, "failed");
    },
  });

  // start the crawler
  await crawler.run(url);

  return scrapedData;
}

export async function scrapeJob(
  url: string[]
): Promise<{ [key: string]: Job[] }[]> {
  let scrapedData: { [key: string]: Job[] }[] = [];
  const crawler = new CheerioCrawler({
    requestHandler: async ({ response, $ }) => {
      //funtion call to handle the extraction logic
      const jobData = await extractJobs($);
      const data: { [key: string]: Job[] } = {};
      data[response.url] = jobData;
      scrapedData.push(data);
    },

    // handle failed request
    failedRequestHandler({ request }) {
      console.log(request.url, "failed");
    },
  });
  await crawler.run(url);

  return scrapedData;
}
