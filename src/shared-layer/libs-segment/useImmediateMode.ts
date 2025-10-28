import {useEffect} from "react";

export const useImmediateMode = (
  active: boolean,
  onSearch: (value: string) => void,
  search: string,
) => {

  useEffect(() => {
    if(!active) return;
    onSearch(search)
  }, [search, onSearch, active]);
}