import * as cheerio from "cheerio";
import { YCCompany, Job, Founder } from "../util/interfaces";

export async function extractCompanyData(
  $: cheerio.CheerioAPI
): Promise<YCCompany> {
  return new Promise(async (resolve, reject) => {
    const card = $(".ycdc-card");
    const innerDescDiv = card.find("div");
    const Name = innerDescDiv.eq(0).text();
    const founded = innerDescDiv.eq(1).find("span").eq(1).text();
    const teamSize = innerDescDiv.eq(1).find("span").eq(3).text();
    const location = innerDescDiv.eq(1).find("span").eq(5).text();
    const founders = extractFounders($);

    let launchLink: string = "";

    const Sections = $("section");
    for (let i = 0; i < Sections.length; i++) {
      const header = Sections.eq(i).find("h3").eq(0).text();
      if (header === "Company Launches") {
        const A_s = Sections.eq(i).find("a");
        const launchL: string =
          "https://www.ycombinator.com" + A_s.eq(0).attr("href");
        launchLink = launchL;
        break;
      }
    }
    resolve({
      name: Name,
      founded: founded,
      teamSize: parseInt(teamSize),
      location: location,
      founders: founders,
      launchPosts: { link: launchLink },
    });
  });
}

export function extractJobs($: cheerio.CheerioAPI): Promise<Job[]> {
  return new Promise((resolve, reject) => {
    const sections = $("section");
    const jobs: Job[] = [];
    if (sections.length !== 0) {
      const jobCard = sections
        .eq(0)
        .find("div")
        .eq(0)
        .find(".flex-grow.space-y-5");

      const role = $(jobCard).find(".ycdc-with-link-color");
      role.each((index, element) => {
        const role = $(element).find("a").text();
        const location = $(element).parent().find(".list-item").first().text();
        jobs.push({
          role: role,
          location: location,
        });
      });
    }
    resolve(jobs);
  });
}

function extractFounders($: cheerio.CheerioAPI): Founder[] {
  const founderCard = $(".leading-snug");
  const founders: Founder[] = [];
  founderCard.each((index, element) => {
    const name = $(element).find(".font-bold").text();
    const founder: Founder = { name: name };
    const links = $(element).find(".mt-1.space-x-2");

    links.find("a").each((index, element) => {
      const title = $(element).attr("title");
      const href = $(element).attr("href");
      if (title && href) {
        const linkName = title.split(" ")[0];
        founder[linkName] = href;
      }
    });
    founders.push(founder);
  });

  return founders;
}
