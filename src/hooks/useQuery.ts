import {useEffect, useRef, useState} from "react";

type QueryStatus = 'loading' | 'success' | 'error' | 'pending'

type QueryFnParams = {
  signal?: AbortSignal
}

type Options<T> = {
  queryStatusDefault?: QueryStatus
  queryKeys: Array<string | null | undefined>;
  queryFn: (params: QueryFnParams) => Promise<T>;
  enabled?: boolean
}

export const useQuery = <T>(options: Options<T>) => {
  const {queryKeys, queryFn, queryStatusDefault, enabled = true} = options

  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<QueryStatus>(queryStatusDefault ?? 'pending');
  const abortControllerRef = useRef<null | AbortController>(null)

  if (!queryKeys) {
    throw new Error('queryKey is required.')
  }

  useEffect(() => {
    abortControllerRef.current?.abort()

    if (queryKeys.some(key => key == null)) {
      setData(null);
      setStatus('pending')
      return
    }

    if (!enabled) return

    setStatus('loading');

    abortControllerRef.current = new AbortController()

    queryFn({signal: abortControllerRef.current.signal})
      .then((data) => {
        // console.log('data', data)
        setData(data);
        setStatus('success');
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        console.error(error);
        setStatus('error');
      });

  }, [JSON.stringify(queryKeys)]);

  return {data, status}
}