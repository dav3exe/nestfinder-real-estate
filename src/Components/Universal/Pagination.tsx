import prev from "/src/assets/prev.png"
import nextt from "/src/assets/next.png"

interface Pagination {
  totalPosts: number
  postPerPage: number
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const Pagination = ({ totalPosts, postPerPage, setCurrentPage, currentPage }: Pagination) => {
  let pages = []
  const totalPages = Math.ceil(totalPosts / postPerPage)
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i)
  }
  const previous = currentPage === 1
  const next = currentPage === totalPages

  const handlePrevious = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); }
  const handleNext = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); }

  const getVisiblePages = () => {
    if (totalPages <= 6) return pages;

    // Current page is within the first 5
    if (currentPage <= 5) {
      return [...pages.slice(0, 5), "...", totalPages];
    }

    // Current page is within the last page range
    if (currentPage >= totalPages - 1) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    // Current page is somewhere in the middle
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex flex-nowrap justify-between items-center mt-4 mb-7 h-[42px] mx-auto w-full  gap-1 sm:gap-2 md:gap-4 Font-[Inter]">
      {/* Previous Button */}
      <div className="flex-shrink-0">
        <button
          onClick={handlePrevious}
          className={`w-[60px] sm:w-[85px] md:w-[105px] h-[36px] sm:h-[42px] rounded-[8px] py-[8px] flex items-center justify-center gap-1 text-white text-[11px] sm:text-[12px] md:text-[14px] ${previous ? "bg-[#AEAEAE]" : "bg-[#1A3C34]"}`}
        >
          <img src={prev} alt="" className="w-2 sm:w-3 md:w-auto" />
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Prev</span>
        </button>
      </div>

      {/* Page Numbers */}
      <div className="flex flex-nowrap items-center space-x-[4px] sm:space-x-[6px] md:space-x-[10px] overflow-x-auto no-scrollbar">
        {visiblePages.map((page, id) => {
          const isEllipsis = page === "...";
          const color = page === currentPage;

          if (isEllipsis) {
            return (
              <span
                key={`ellipsis-${id}`}
                className="w-[28px] sm:w-[32px] md:w-[36px] h-[28px] sm:h-[32px] md:h-[36px] rounded-[4px] border-[1px] border-gray-200 text-[11px] sm:text-[12px] md:text-[14px] flex items-center justify-center text-[#7A7978] flex-shrink-0"
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={id}
              className="w-[28px] sm:w-[32px] md:w-[36px] h-[28px] sm:h-[32px] md:h-[36px] rounded-[4px] border-[1px] text-[11px] sm:text-[12px] md:text-[14px] flex items-center justify-center flex-shrink-0"
              onClick={() => setCurrentPage(page as number)}
              style={{
                backgroundColor: color ? "#1A3C34" : "#ffffff",
                color: color ? "#ffffff" : "#7A7978"
              }}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <div className="flex-shrink-0">
        <button
          onClick={handleNext}
          className={`w-[60px] sm:w-[85px] md:w-[105px] h-[36px] sm:h-[42px] rounded-[8px] py-[8px] flex flex-row-reverse items-center justify-center text-white gap-1 text-[11px] sm:text-[12px] md:text-[14px] ${next ? "bg-[#AEAEAE]" : "bg-[#1A3C34]"}`}
        >
          <img src={nextt} alt="" className="w-2 sm:w-3 md:w-auto" />
          <span>Next</span>
        </button>
      </div>
    </div>
  )
}

export default Pagination