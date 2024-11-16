export interface UrlMetadata {
  title: string;
  description: string;
  favicon: string | null;
  url: string;
}

export interface MetadataResponse {
  data: UrlMetadata;
  error?: never;
}

export interface MetadataError {
  error: string;
  data?: never;
}

export type MetadataResult = MetadataResponse | MetadataError;
