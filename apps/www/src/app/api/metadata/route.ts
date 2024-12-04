import { extractUrlMetadata } from "@/lib/utils";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const href = url.searchParams.get("url");

  if (!href) {
    return new Response("Missing url", { status: 400 });
  }

  const metadata = await extractUrlMetadata(href);

  return new Response(JSON.stringify(metadata), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
