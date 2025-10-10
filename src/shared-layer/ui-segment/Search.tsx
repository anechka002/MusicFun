import {type ChangeEvent, useEffect, useRef, useState} from "react";

type SearchProps = {
  onSearch: (value: string) => void; // функция, вызываемая при поиске
  isSearchButtonVisible?: boolean; // показывать ли кнопку "Search"
  mode?: 'debounce' | 'throttle' | 'immediate' // режим поиска: с задержкой, с ограничением, или сразу
}

export function Search({
                         onSearch,
                         isSearchButtonVisible = true,
                         mode = 'immediate',
}: SearchProps) {
  // 🧠 Локальное состояние для хранения текста поиска
  const [search, setSearch] = useState<string>('')

  // ⏱ Ссылка на ID таймера (для debounce/throttle)
  // ref сохраняет значение между рендерами, не теряя его
  const timerIdRef = useRef<number | undefined>(undefined);

  // 🚦 Флаг, который говорит — "ждём, пока закончится throttle-задержка"
  const throttleIsWaitingRef = useRef<boolean>(false);

  // 🗒 Здесь храним последнее введённое значение, чтобы использовать его в throttle
  const searchValueRef = useRef<string>('');

  // 🔄 useEffect срабатывает каждый раз, когда изменяется текст поиска (или настройки)
  useEffect(() => {
    // Если кнопка "Search" скрыта, значит, поиск должен выполняться автоматически при наборе текста
    if (!isSearchButtonVisible) {

      switch (mode) {
        case 'immediate':
          // 🟢 IMMEDIATE — вызываем поиск сразу при каждом вводе символа
          onSearch(search)
          break;

        case 'debounce':
          // 🟡 DEBOUNCE — ждём паузу в наборе текста, прежде чем выполнить поиск
          // Если пользователь вводит быстро, старый таймер очищается
          if (timerIdRef.current) clearTimeout(timerIdRef.current)

          // Запускаем новый таймер на 1 секунду
          timerIdRef.current = window.setTimeout(() => {
            onSearch(search)
          }, 1000)
          break;

        case 'throttle':
          // 🔴 THROTTLE — вызываем поиск не чаще, чем раз в 1 секунду
          // Если уже ждём — ничего не делаем
          if (throttleIsWaitingRef.current) return;

          // Через секунду сбрасываем флаг — теперь можно снова искать
          timerIdRef.current = window.setTimeout(() => {
            onSearch(searchValueRef.current)
            throttleIsWaitingRef.current = false
          }, 1000)

          // Ставим флаг ожидания
          throttleIsWaitingRef.current = true;
          break;
        default:
          onSearch(search)
      }
    }
    // 🧹 Возвращаем cleanup — если режим debounce, очищаем таймер перед новым вызовом
    return () => {
      if (mode === 'debounce') {
        clearTimeout(timerIdRef.current);
      }
    }
  }, [search, isSearchButtonVisible, onSearch, mode]);

  // 💣 Очистка таймеров при размонтировании
  useEffect(() => {
    return () => {
      if(timerIdRef.current !== undefined) {
        clearTimeout(timerIdRef.current)
      }
    }
  }, []);

  // 👆 Нажали на кнопку "Search" — отправляем поиск вручную
  const handleSearchClick = () => {
    onSearch(search)
  }

  // 🧑‍💻 Изменили текст в инпуте
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setSearch(value) // обновляем состояние (чтобы отобразилось в input)
    searchValueRef.current = value // сохраняем значение для throttle
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