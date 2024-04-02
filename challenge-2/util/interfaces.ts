export interface responseData {
  "Company Name": string;
  "YC URL": string;
}

export interface Founder {
  name: string;
  [key: string]: string;
}

export interface Job {
  role: string;
  location: string;
  url?: string;
}

export interface LaunchPost {
  title?: string;
  link: string;
}

export interface YCCompany {
  name: string;
  url?: string;
  founded?: string;
  teamSize?: number;
  location?: string;
  founders?: Founder[];
  jobs?: Job[];
  launchPosts?: LaunchPost;
}
