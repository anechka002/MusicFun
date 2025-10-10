type PaginationType = {
  limit: number;
  skip: number;
  total: number;
  onPageSelect: (pageNumber: number) => void;
  isPageUpdating: boolean;
}

export function Pagination({
                             limit,
                             total,
                             skip,
                             onPageSelect,
                             isPageUpdating
                           }: PaginationType) {
  // Считаем количество страниц (всего)
  const totalPagesCount = Math.ceil(total / limit);

  // Определяем номер текущей страницы
  const currentPage = skip / limit + 1

  return (
    <div style={{display: 'flex', flexDirection: 'row', gap: '5px'}}>
      {[...Array(totalPagesCount)].map((_, index) => {
          return (
            <button
              disabled={isPageUpdating}
              onClick={() => {
                if (currentPage !== index + 1) {
                  onPageSelect(index + 1)
                }
              }}
              style={{
                cursor: 'pointer',
                border: currentPage === index + 1 ? '1px solid red' : 'none',
              }}
              key={index}
            >{index + 1}
            </button>)
        }
      )
      }
    </div>
  )
}