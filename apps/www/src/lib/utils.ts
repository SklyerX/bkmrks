import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import type { UrlMetadata } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {}
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(decimals)} ${
    sizeType === "accurate"
      ? (accurateSizes[i] ?? "Bytest")
      : (sizes[i] ?? "Bytes")
  }`;
}

export const extractUrlMetadata = async (url: string): Promise<UrlMetadata> => {
  const { data: html } = await axios.get(url);

  const titleMatch = html.match(/<title>(.*?)<\/title>/);
  const descriptionMatch = html.match(
    /<meta name="description" content="(.*?)"/
  );
  const imageMatch = html.match(/<meta property="og:image" content="(.*?)"/);

  const title = titleMatch ? titleMatch[1] : "";
  const description = descriptionMatch ? descriptionMatch[1] : "";
  const imageURL = imageMatch ? imageMatch[1] : "";

  return {
    title,
    description,
    favicon: imageURL,
    url,
  };
};
