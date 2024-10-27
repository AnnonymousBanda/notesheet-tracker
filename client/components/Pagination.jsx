import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Pagination() {
  const searchparams = useSearchParams();
  const params = new URLSearchParams(searchparams);
  const pathname = usePathname();
  const { replace } = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10; 

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <p
          key={i}
          onClick={() => {
            params.set("page", i);
            replace(`${pathname}?${params.toString()}`);
            setCurrentPage(i);
          }}
          className={`py-1 px-4 ${
            currentPage === i ? "bg-gray-300 " : ""
          } text-[1.5rem] text-gray-700 hover:bg-gray-300  font-semibold rounded-full cursor-pointer transition-colors duration-200 `}
        >
          {i}
        </p>
      );
    }
    return pageNumbers;
  };

  return (
      <div className="flex gap-[1rem] bg-white w-fit rounded-full p-2 fixed bottom-8 left-8">
        <button className="py-1 px-4 hover:bg-gray-300 cursor-pointer transition-colors duration-200 rounded-full">
          {"<<"}
        </button>
        <div className="flex gap-[1rem]">{renderPageNumbers()}</div>
        <button className="px-4 py-2 hover:bg-gray-300 cursor-pointer transition-colors duration-200 rounded-full">
          {">>"}
        </button>
      </div>
  );
}
