export interface INewsFeedItem {
  title: string;
  description?: string;
  path: string;
  date: string;
  imageSlug?: string;
}

export interface ISitemapEntry {
  path: string;
  updatedAt?: string;
}
