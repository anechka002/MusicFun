import { useEffect, useRef, useState } from 'react';
import type {
  TrackDataItem,
  TrackResponse,
  TracksResponse,
} from './types/types';

export function App() {
  const [tracks, setTracks] = useState<TrackDataItem[]>([]);
  const [listQueryStatus, setListQueryStatus] = useState<'loading' | 'success' | 'error' | 'idle'>('idle');
  
  const [selectedTrack, setSelectedTrack] = useState<TrackResponse | null>(
    null
  );
  const [detailQueryStatus, setDetailQueryStatus] = useState<'loading' | 'success' | 'error' | 'idle'>('idle');

  const [selectedTrackIds, setSelectedTrackIds] = useState<string[]>([]);
  const abortControllerRef = useRef<null | AbortController>(null)

  useEffect(() => {
    setListQueryStatus('loading');
    fetch('https://musicfun.it-incubator.app/api/1.0/playlists/tracks', {
      headers: {
        'API-KEY': '2379558b-0188-43ee-9a39-5ee90ce1492e',
      },
    })
      .then((res) => res.json() as Promise<TracksResponse>)
      .then((data) => {
        // console.log(data);
        setTracks(data.data);
        setListQueryStatus('success');
      });
  }, []);

  const handleSelectedTrackClick = (trackId: string) => {
    
    setSelectedTrackIds((prev) => {

      // Отменяем предыдущий запрос
      abortControllerRef.current?.abort()
      // Создаём новый AbortController для нового запроса
      abortControllerRef.current = new AbortController()

      if (prev.includes(trackId)) {
        if(selectedTrack?.data.id === trackId) {
          setSelectedTrack(null)
        }
        return prev.filter((id) => id !== trackId); // если уже выбран — убираем
      } else {
        setDetailQueryStatus('loading')

        fetch(
          'https://musicfun.it-incubator.app/api/1.0/playlists/tracks/' +
            trackId,
          {
            signal: abortControllerRef.current.signal,
            headers: {
              'API-KEY': '2379558b-0188-43ee-9a39-5ee90ce1492e',
            },
          }
        )
          .then((res) => res.json() as Promise<TrackResponse>)
          .then((data) => {
            // console.log(data);
            setSelectedTrack(data);
            setDetailQueryStatus('success')
          });
        return [...prev, trackId]; // иначе добавляем
      }
    });
  };

  return (
    <div>
      <h2>Music Fun</h2>

      <div style={{ display: 'flex', gap: '24px' }}>
        {listQueryStatus === 'loading' && <p>Loading...</p>}

        <ul>
          <h2>List</h2>
          {listQueryStatus === 'success' && tracks!.map((track, index) => {
            const color = selectedTrackIds.includes(track.id) ? 'red' : 'white';
            return (
              <li key={index} style={{ color: color }}>
                <h5 onClick={() => handleSelectedTrackClick(track.id)}>
                  {track.attributes.title}
                </h5>
                <audio
                  src={track.attributes.attachments[0].url}
                  controls={true}
                ></audio>
              </li>
            );
          })}
        </ul>
        <div>
          <h2>Detail</h2>
          {detailQueryStatus === 'loading' && <p>Loading...</p>}
          {detailQueryStatus === 'success' && selectedTrack && selectedTrackIds.includes(selectedTrack.data.id) && (
            <div>
              <h3>{selectedTrack.data.attributes.title}</h3>
              <p>{selectedTrack.data.attributes.addedAt}</p>
              <p>Likes: {selectedTrack.data.attributes.likesCount}</p>
              <p>Lyrics: {selectedTrack.data.attributes.lyrics}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
