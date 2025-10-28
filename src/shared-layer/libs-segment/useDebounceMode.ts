import {useEffect} from "react";
import {useSearchTimer} from "@/shared-layer/libs-segment/useSearchTimer.ts";

export const useDebounceMode = (
  active: boolean,
  onSearch: (value: string) => void,
  search: string,
  delay = 1000
) => {

  const {setTimer, clearTimer} = useSearchTimer()

  useEffect(() => {
    if(!active) return;
    clearTimer();
    setTimer(() => onSearch(search), delay);

    return () => clearTimer();
  }, [active, delay, search, onSearch, clearTimer, setTimer]);

}