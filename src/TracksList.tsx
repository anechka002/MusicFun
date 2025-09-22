import {Track} from './Track.tsx';
import {api} from "@/api.ts";
import {useQuery} from "@tanstack/react-query";

type Props = {
  onTrackSelect: (trackId: string) => void;
  selectedTrackIds: string[];
}

export const TracksList = ({onTrackSelect, selectedTrackIds}: Props) => {

  const {isPending, isError, data: tracks} = useQuery({
    queryKey: ['tracksList'],
    queryFn: () =>  {
      return api.getTracks()
    }
  })

  if (isPending) {
    return <div>Loading...</div>
  }
  if (isError) {
    return <div>Can't load tracks</div>
  }

  return (
    <ul>
      {tracks.data.map((track) => (
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
