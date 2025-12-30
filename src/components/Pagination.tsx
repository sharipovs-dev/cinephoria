import React, { useEffect, useRef, useState } from 'react'
import './Pagination.css'

const DOTS = '...'
interface createPageArrayProps{
  totalPages:number;
  page:number;
  siblingCount:number;
  boundaryCount:number;
}
function createPageArray({ totalPages, page, siblingCount = 1, boundaryCount = 1 }:createPageArrayProps):(number | typeof DOTS)[] {
  const totalNumbers = siblingCount * 2 + boundaryCount * 2 + 3 // first, last, current
  // const totalBlocks = totalNumbers + 2 // for two DOTS

  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const leftSiblingIndex = Math.max(page - siblingCount, 1)
  const rightSiblingIndex = Math.min(page + siblingCount, totalPages)

  const shouldShowLeftDots = leftSiblingIndex > boundaryCount + 2
  const shouldShowRightDots = rightSiblingIndex < totalPages - (boundaryCount + 1)

  const firstPages = Array.from({ length: boundaryCount }, (_, i) => i + 1)
  const lastPages = Array.from({ length: boundaryCount }, (_, i) => totalPages - boundaryCount + 1 + i)

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = siblingCount * 2 + boundaryCount + 2
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1)
    return [...leftRange, DOTS, ...lastPages]
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = siblingCount * 2 + boundaryCount + 2
    const rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + 1 + i)
    return [...firstPages, DOTS, ...rightRange]
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = Array.from({ length: rightSiblingIndex - leftSiblingIndex + 1 }, (_, i) => leftSiblingIndex + i)
    return [...firstPages, DOTS, ...middleRange, DOTS, ...lastPages]
  }

  return Array.from({ length: totalPages }, (_, i) => i + 1)
}
interface PaginationProps{
   page?:number;
  totalPages?:number;
  onPageChange ?: (page: number) => void;
  siblingCount?:number;
  boundaryCount ?:number;
  className ?:string;
}
export default function Pagination({
  page = 1,
  totalPages = 1,
  onPageChange = () => {},
  siblingCount = 1,
  boundaryCount = 1,
  className = ''
}:PaginationProps) {
  const [inputValue, setInputValue] = useState<string>('')
  const pages = createPageArray({ totalPages, page, siblingCount, boundaryCount })
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => setInputValue(''), [page, totalPages])

  function goTo(p:number) {
    const next:number = Math.max(1, Math.min(totalPages, p))
    if (next !== page) onPageChange(next)
  }

  function handleKeyDown(e:React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const n = Number(inputValue)
      if (!Number.isNaN(n)) goTo(n)
    }
    if (e.key === 'ArrowLeft') goTo(page - 1)
    if (e.key === 'ArrowRight') goTo(page + 1)
  }

  return (
    <nav className={`pagination-root ${className}`} aria-label="Pagination">
      <button
        className="page-btn prev"
        onClick={() => goTo(page - 1)}
        disabled={page <= 1}
        aria-disabled={page <= 1}
        aria-label="Previous page"
      >
        ‹
      </button>

      <ol className="page-list">
        {pages.map((p, idx) => (
          <li key={`p_${p}_${idx}`} className="page-list-item">
            {p === DOTS ? (
              <span className="page-dots" aria-hidden="true">
                {DOTS}
              </span>
            ) : (
              <button
                className={`page-btn ${p === page ? 'active' : ''}`}
                onClick={() => goTo(p)}
                aria-current={p === page ? 'page' : undefined}
              >
                {p}
              </button>
            )}
          </li>
        ))}
      </ol>

      <button
        className="page-btn next"
        onClick={() => goTo(page + 1)}
        disabled={page >= totalPages}
        aria-disabled={page >= totalPages}
        aria-label="Next page"
      >
        ›
      </button>

      <div className="pagination-controls">
        <label className="jump-label">
          <span className="sr-only">Jump to page</span>
          <input
            ref={inputRef}
            className="jump-input"
            type="number"
            min={1}
            max={totalPages}
            placeholder="Page"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Page number"
          />
        </label>
        <button
          className="page-btn go-btn"
          onClick={() => {
            const n = Number(inputValue)
            if (!Number.isNaN(n)) goTo(n)
          }}
        >
          Go
        </button>
      </div>
    </nav>
  )
}
