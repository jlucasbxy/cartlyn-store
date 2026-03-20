"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "@/components/pagination";

interface StorePaginationProps {
  hasNextPage: boolean;
  nextCursor: string | null;
}

export function StorePagination({
  hasNextPage,
  nextCursor
}: StorePaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const prevCursorsParam = searchParams.get("prevCursors") || "";
  const prevCursors = prevCursorsParam ? prevCursorsParam.split(",") : [];
  const hasPreviousPage = prevCursors.length > 0;

  const onNext = () => {
    if (!hasNextPage || !nextCursor) return;
    const params = new URLSearchParams(searchParams.toString());
    const currentCursor = searchParams.get("cursor") || "";
    const newPrevCursors = currentCursor
      ? [...prevCursors, currentCursor]
      : prevCursors;
    if (newPrevCursors.length > 0) {
      params.set("prevCursors", newPrevCursors.join(","));
    }
    params.set("cursor", nextCursor);
    router.push(`/store?${params}`);
  };

  const onPrevious = () => {
    if (!hasPreviousPage) return;
    const params = new URLSearchParams(searchParams.toString());
    const prev = prevCursors[prevCursors.length - 1];
    const newPrevCursors = prevCursors.slice(0, -1);
    if (newPrevCursors.length > 0) {
      params.set("prevCursors", newPrevCursors.join(","));
    } else {
      params.delete("prevCursors");
    }
    if (prev) {
      params.set("cursor", prev);
    } else {
      params.delete("cursor");
    }
    router.push(`/store?${params}`);
  };

  return (
    <Pagination
      hasNextPage={hasNextPage}
      hasPreviousPage={hasPreviousPage}
      onNext={onNext}
      onPrevious={onPrevious}
    />
  );
}
