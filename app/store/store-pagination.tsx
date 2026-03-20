"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "@/components/pagination";

interface StorePaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
}

export function StorePagination({
  currentPage,
  totalPages,
  total
}: StorePaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const navigate = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/store?${params}`);
  };

  return (
    <>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={navigate}
        onNext={() => navigate(currentPage + 1)}
        onPrevious={() => navigate(currentPage - 1)}
      />
      <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
        Total de produtos: {total}
      </div>
    </>
  );
}
