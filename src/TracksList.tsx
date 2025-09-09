import {Track} from './Track.tsx';
import {useQuery} from "@/hooks/useQuery.ts";
import {api} from "@/api.ts";

type Props = {
  onTrackSelect: (trackId: string) => void;
  selectedTrackIds: string[];
}

export const TracksList = ({onTrackSelect, selectedTrackIds}: Props) => {

  // const {listQueryStatus, tracks} = useTracksList()

  const {status, data: tracks} = useQuery({
    queryKeys: ['tracks'],
    queryFn: () =>  {
      return api.getTracks()
    }
  })

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return (
    <ul>
      {tracks?.data.map((track) => (
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
