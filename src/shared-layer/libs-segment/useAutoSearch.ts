import {
  useImmediateMode
} from "@/shared-layer/libs-segment/useImmediateMode.ts";
import {useDebounceMode} from "@/shared-layer/libs-segment/useDebounceMode.ts";
import {useThrottleMode} from "@/shared-layer/libs-segment/useThrottleMode.ts";

type ModeType = 'debounce' | 'throttle' | 'immediate'

export const useAutoSearch = (
  mode: ModeType,
  isSearchButtonVisible: boolean,
  search: string,
  onSearch:(value: string) => void,
  searchValueRef: React.MutableRefObject<string>
) => {

  const isActive = !isSearchButtonVisible;

  useImmediateMode(isActive && mode === 'immediate', onSearch, search)
  useDebounceMode(isActive && mode === 'debounce', onSearch, search)
  useThrottleMode(isActive && mode === 'throttle', onSearch, searchValueRef)
}