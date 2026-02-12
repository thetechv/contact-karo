import React, { useState, useEffect } from "react";
import { Button } from "./Button";


interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  title?: string;
  totalItems?: number;
  loading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  title = "Rows",
  totalItems,
  loading = false,
}) => {
  const pageSizeOptions = [10, 20, 30, 40, 50];
  const [inputPage, setInputPage] = useState(currentPage.toString());

  useEffect(() => {
    setInputPage(currentPage.toString());
  }, [currentPage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPage(e.target.value);
  };

  const handlePageSubmit = () => {
    let page = parseInt(inputPage);
    if (isNaN(page)) {
      page = currentPage;
    } else {
      if (page < 1) page = 1;
      if (page > totalPages) page = totalPages;
    }
    setInputPage(page.toString());
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handlePageSubmit();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-6 py-4 px-2 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 text-sm">
      
      {/* Navigation Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || loading}
          className={`${currentPage <= 1 || loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Prev
        </Button>

        <span className="text-gray-600 dark:text-gray-300">Page</span>
        
        <input
          type="number"
          min={1}
          max={totalPages}
          value={inputPage}
          onChange={handleInputChange}
          onBlur={handlePageSubmit}
          onKeyDown={handleKeyDown}
          disabled={loading}
          className="w-12 h-8 text-center rounded-md border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
        />

        <span className="text-gray-600 dark:text-gray-300">of {totalPages}</span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || loading}
          className={`${currentPage >= totalPages || loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Next
        </Button>
      </div>

      {/* Page Size & Total */}
      <div className="flex items-center gap-2">
        <span className="text-gray-500 dark:text-gray-400">
          {title}:
        </span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          disabled={loading}
          className="h-8 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 transition-colors disabled:opacity-50"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        {totalItems !== undefined && (
          <span className="text-gray-500 dark:text-gray-400 ml-2">
            (Total {totalItems})
          </span>
        )}
      </div>

    </div>
  );
};
