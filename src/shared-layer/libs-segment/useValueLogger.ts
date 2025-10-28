import {useEffect} from "react";

export const useValueLogger = (label: string, value: string) => {
  useEffect(() => {
    // console.log(`[useValueLogger] ${label}:`, value);
  }, [label, value]);
};