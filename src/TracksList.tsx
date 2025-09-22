import {Track} from './Track.tsx';
import {useQuery} from "@tanstack/react-query";
import {client} from "@/shared/api/client.ts";

type Props = {
  onTrackSelect: (trackId: string) => void;
  selectedTrackIds: string[];
}

export const TracksList = ({onTrackSelect, selectedTrackIds}: Props) => {

  const {isPending, isError, data: tracks} = useQuery({
    queryKey: ['tracksList'],
    queryFn: async () =>  {
      const clientData = await client.GET('/playlists/tracks');
      return clientData.data!
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
