import {useEffect, useState} from 'react';
import {Track} from './Track.tsx';
import type {TrackDataItem, TracksResponse} from './types/types';

type Props = {
  onTrackSelect: (trackId: string) => void;
  selectedTrackIds: string[];
};

export const TracksList = ({onTrackSelect, selectedTrackIds}: Props) => {
  const [tracks, setTracks] = useState<TrackDataItem[]>([]);
  const [listQueryStatus, setListQueryStatus] = useState<'loading' | 'success' | 'error' | 'idle'>('idle');

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

  if (listQueryStatus === 'loading') {
    return <div>Loading...</div>
  }

  return (
    <ul>
      {tracks?.map((track) => (
        <Track
          key={track.id}
          onSelect={onTrackSelect}
          track={track}
          isSelected={selectedTrackIds.includes(track.id)}
        />
      ))}
    </ul>
  );
};
