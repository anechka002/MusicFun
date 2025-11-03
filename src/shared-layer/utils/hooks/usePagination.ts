// 🧩 Кастомный хук для управления пагинацией
import {useState} from "react";

export const usePagination = () => {
  // 🔢 Номер текущей страницы (для пагинации)
  const [pageNumber, setPageNumber] = useState<number>(1);
  // 📏 Количество треков на странице
  const [pageSize, setPageSize] = useState<number>(5);

  return {
    pageNumber,
    pageSize,
    // Устанавливает новую страницу
    setPageNumber: (newPageNumber: number) => {
      setPageNumber(newPageNumber);
    },
    // Меняет количество элементов на странице и сбрасывает страницу на первую
    setPageSize: (newPageSize: number) => {
      setPageSize(newPageSize);
      setPageNumber(1)
    },
  }
}