export interface SponsorCategory {
  name: string;
  logo: string;
  description: string;
  website?: string;
}

export interface SponsorsData {
  [key: string]: SponsorCategory[];
}