import {useEffect, useRef} from "react";

export const useSearchTimer = () => {
  // ⏱ Ссылка на ID таймера (для debounce/throttle)
  // ref сохраняет значение между рендерами, не теряя его
  const timerIdRef = useRef<number | undefined>(undefined);

  // ставит таймер, но прежде очищает старый.
  const setTimer = (callback: () => void, delay: number) => {
    // очистим старый если есть
    if(timerIdRef.current !== undefined) {
      clearTimeout(timerIdRef.current);
    }
    // window.setTimeout гарантирует number в браузере
    timerIdRef.current = window.setTimeout(callback, delay);
  };

  // безопасная очистка
  const clearTimer = () => {
    if (timerIdRef.current !== undefined) {
      clearTimeout(timerIdRef.current);
      timerIdRef.current = undefined
    }
  };

  useEffect(() => {
    // cleanup on unmount
    return () => clearTimer();
  }, []);

  return { timerIdRef, setTimer, clearTimer };
}