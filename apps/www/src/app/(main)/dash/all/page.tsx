"use client";

import { useAction } from "next-safe-action/hooks";
import { useEffect, useRef, useState } from "react";
import { fetchBookmarksAction } from "../_actions/fetch-bookmarks";
import { parseAsInteger, useQueryState } from "nuqs";
import BookmarkCard from "../_components/bookmark-card";

export default function Page() {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [limit, setLimit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(20)
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const loaderRef = useRef<HTMLDivElement>(null);

  const { execute, status, result } = useAction(fetchBookmarksAction);

  const fetchItems = () => {
    setLoading(true);
    execute({
      limit,
      page,
    });
  };

  useEffect(() => {
    if (status === "hasSucceeded" && result.data?.metadata) {
      setHasMore(page < result.data.metadata.totalPages);
      setLoading(false);
      console.log(result.data, page);
    }
  }, [status, page, result.data?.metadata]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, setPage]);

  useEffect(() => {
    fetchItems();
  }, [page]);

  return (
    <div>
      <div className="my-4">
        <h3 className="text-2xl font-semibold">All</h3>
        <hr className="mt-2 " />
      </div>
      <div className="space-y-3">
        {result.data?.bookmarks.map((bookmark) => (
          <BookmarkCard bookmark={bookmark} key={bookmark.id} canEdit={true} />
        ))}
      </div>
      {hasMore && (
        <div ref={loaderRef} className="py-4 text-center">
          {loading ? "Loading..." : "Scroll for more"}
        </div>
      )}

      {!hasMore && (
        <div className="py-4 text-center text-gray-500">
          No more items to load
        </div>
      )}
    </div>
  );
}
