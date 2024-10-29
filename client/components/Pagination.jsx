import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react"; 

export default function Pagination({total}) {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const { replace } = useRouter();

  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1
  );
  const totalPages = Math.ceil(total);

  const updatePage = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page);
    replace(`${pathname}?${params.toString()}`);
    setCurrentPage(page);
  };

  const nextPage = () => {
    if (currentPage < totalPages) updatePage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) updatePage(currentPage - 1);
  };

  useEffect(() => {
    setCurrentPage(parseInt(searchParams.get("page")) || 1);
    }
  , [params.toString()]);

  const renderPageNumbers = () =>
    Array.from({ length: totalPages }, (_, i) => (
      <p
        key={i + 1}
        onClick={() => updatePage(i + 1)}
        className={`py-1 px-4 ${
          currentPage === i + 1 ? "bg-gray-300" : ""
        } text-[1.5rem] text-gray-700 hover:bg-gray-300 font-semibold rounded-full cursor-pointer transition-colors duration-200`}
      >
        {i + 1}
      </p>
    ));

  return (
    <div className={`w-full ${totalPages === 0 ? "hidden" : "flex"} justify-center absolute bottom-8`}>
      <div className="flex gap-[1rem] bg-white w-fit rounded-full p-2">
        <button
          onClick={prevPage}
          className="py-1 px-4 hover:bg-gray-300 cursor-pointer transition-colors duration-200 rounded-full"
          disabled={currentPage === 1}
        >
          {"<<"}
        </button>
        <div className="flex gap-[1rem]">{renderPageNumbers()}</div>
        <button
          onClick={nextPage}
          className="px-4 py-2 hover:bg-gray-300 cursor-pointer transition-colors duration-200 rounded-full"
          disabled={currentPage === totalPages}
        >
          {">>"}
        </button>
      </div>
    </div>
  );
}
