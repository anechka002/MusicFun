import {useEffect, useState} from 'react';
import {Track} from './Track.tsx';
import type {TrackDataItem} from './types/types';
import {api} from "@/api.ts";

type Props = {
  onTrackSelect: (trackId: string) => void;
  selectedTrackIds: string[];
};

export const TracksList = ({onTrackSelect, selectedTrackIds}: Props) => {
  const [tracks, setTracks] = useState<TrackDataItem[]>([]);
  const [listQueryStatus, setListQueryStatus] = useState<'loading' | 'success' | 'error' | 'idle'>('idle');

  useEffect(() => {
    setListQueryStatus('loading');

    api.getTracks()
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
