import {type ChangeEvent, useRef, useState} from "react";

export const useSearchInput = () => {
  // 🧠 Локальное состояние для хранения текста поиска
  const [search, setSearch] = useState<string>('')

  // 🗒 ref, который всегда хранит последнее введённое значение, чтобы использовать его в throttle
  const searchValueRef = useRef<string>('');

  // 🧑‍💻 Изменили текст в инпуте
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setSearch(value) // обновляем состояние (чтобы отобразилось в input)
    searchValueRef.current = value // сохраняем значение для throttle
  }
  return {search, searchValueRef, handleSearchChange}
}