import {useSearchTimer} from "@/shared-layer/libs-segment/useSearchTimer.ts";
import {useEffect, useRef} from "react";

export const useThrottleMode = (
  active: boolean,
  onSearch: (value: string) => void,
  searchValueRef: React.MutableRefObject<string>,
  delay = 1000
) => {

  const {setTimer, clearTimer} = useSearchTimer()
  // 🚦 Флаг, который говорит — "ждём, пока закончится throttle-задержка"
  const throttleIsWaitingRef = useRef<boolean>(false);

  useEffect(() => {
    if(!active) return;
    if(throttleIsWaitingRef.current) return

    setTimer(() => {
      onSearch(searchValueRef.current)
      throttleIsWaitingRef.current = false
    }, delay);

    // Ставим флаг ожидания
    throttleIsWaitingRef.current = true;

    return () => clearTimer();
  }, [active, delay, searchValueRef, onSearch, clearTimer, setTimer]);
}