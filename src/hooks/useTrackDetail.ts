import {useEffect, useRef, useState} from "react";
import type {TrackResponse} from "@/types/types.ts";
import {api} from "@/api.ts";

type CachedItem<T> = {
  value: T;              // сами данные
  expirationDate: number // timestamp, когда данные устареют
}

export const useTrackDetail = (trackIds: string[]) => {
  const CACHE_LIFETIME = 60 * 1000 // 1 минута

  const [detailQueryStatus, setDetailQueryStatus] = useState<
    'loading' | 'success' | 'error' | 'idle'
  >('idle');
  const [track, setTrack] = useState<TrackResponse | null>(
    null
  );
  const abortControllerRef = useRef<null | AbortController>(null);

  const cachedData = useRef<Record<string, CachedItem<TrackResponse>>>({});

  useEffect(() => {
    // Отменяем предыдущий запрос
    abortControllerRef.current?.abort();

    const lastTrackId = trackIds[trackIds.length - 1];

    if (!lastTrackId) {
      setTrack(null)
      setDetailQueryStatus('idle');
      return
    }

    const cachedItem = cachedData.current[`cached-${lastTrackId}`]

    // Если в кэше есть свежие данные
    if(cachedItem && cachedItem.expirationDate > Date.now()) {
      // Данные свежие — можно использовать
      setTrack(cachedItem.value)
      return
    }

    // Если данные устарели — удаляем их
    if(cachedItem) {
      // Данные протухли — удаляем их из кэша
      delete cachedData.current[`cached-${lastTrackId}`]
    }

    // Создаём новый AbortController для нового запроса
    abortControllerRef.current = new AbortController();

    setDetailQueryStatus('loading');

    api.getTrack(lastTrackId, abortControllerRef.current.signal)
      .then((data) => {
        // console.log(data);
        setTrack(data);
        setDetailQueryStatus('success');
        // Сохраняем данные в кэш с expiration
        cachedData.current[`cached-${lastTrackId}`] = {
          value: data,
          expirationDate: Date.now() + CACHE_LIFETIME, // живут 1 минуту
        }
      });

  }, [trackIds])

  return {detailQueryStatus, track}
}