import {type ChangeEvent, useRef, useState} from "react";

type SearchProps = {
  onSearch: (value: string) => void;
  isSearchButtonVisible?: boolean;
  mode?: 'debounce' | 'throttle' | 'immediate'
}

export function Search({
                         onSearch,
                         isSearchButtonVisible = true,
                         mode = 'immediate',
}: SearchProps) {
  console.log('Search')
  const [search, setSearch] = useState<string>('')

  const debounceTimerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  console.log(debounceTimerIdRef)

  const handleSearchClick = () => {
    onSearch(search)
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setSearch(value)

    // Если кнопки нет — ищем сразу при наборе
    if (!isSearchButtonVisible) {
      switch (mode) {
        case 'immediate':
          onSearch(value)
          break;

        case 'debounce':
          if(debounceTimerIdRef.current) {
            clearTimeout(debounceTimerIdRef.current);
          }
          debounceTimerIdRef.current = setTimeout(() => {
            onSearch(value)
          }, 1000)
          break;

        case 'throttle':
          break;

        default: onSearch(value)
      }
    }
  }

  return (
    <>
      <input
        type="text"
        value={search}
        onChange={handleSearchChange}
      />
      {isSearchButtonVisible && <button onClick={handleSearchClick}>Search</button>}
    </>
  )
}