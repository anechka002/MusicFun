import {Track} from './Track.tsx';
import {useTracksList} from "@/hooks/useTracksList.ts";

type Props = {
  onTrackSelect: (trackId: string) => void;
  selectedTrackIds: string[];
};

export const TracksList = ({onTrackSelect, selectedTrackIds}: Props) => {

  const {listQueryStatus, tracks} = useTracksList()

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
