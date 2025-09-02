import {useEffect, useRef, useState} from 'react';
import type {TrackResponse} from './types/types';
import {api} from "@/api.ts";

type Props = {
  trackIds: string[];
};

export const TracksDetail = ({trackIds}: Props) => {
  const [detailQueryStatus, setDetailQueryStatus] = useState<
    'loading' | 'success' | 'error' | 'idle'
  >('idle');
  const [track, setTrack] = useState<TrackResponse | null>(
    null
  );
  const abortControllerRef = useRef<null | AbortController>(null);

  useEffect(() => {

    // Отменяем предыдущий запрос
    abortControllerRef.current?.abort();

    const lastTrackId = trackIds[trackIds.length - 1];

    if (!lastTrackId) {
      setTrack(null)
      setDetailQueryStatus('idle');
      return
    }

    // Создаём новый AbortController для нового запроса
    abortControllerRef.current = new AbortController();

    setDetailQueryStatus('loading');

    api.getTrack(lastTrackId, abortControllerRef.current.signal)
      .then((data) => {
        // console.log(data);
        setTrack(data);
        setDetailQueryStatus('success');
      });

  }, [trackIds])

  return (
    <div>
      <h2>Detail</h2>
      <div>
        {detailQueryStatus === 'idle' && <p>No tracks for display</p>}
        {detailQueryStatus === 'loading' && <p>Loading...</p>}
        {detailQueryStatus === 'success' &&
          track && (
            <div>
              <h3>{track.data.attributes.title}</h3>
              <p>{track.data.attributes.addedAt}</p>
              <p>Likes: {track.data.attributes.likesCount}</p>
              <p>Lyrics: {track.data.attributes.lyrics}</p>
            </div>
          )}
      </div>
    </div>
  );
};
