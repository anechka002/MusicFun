import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {client} from "@/shared/api/client.ts";

type Props = {
  trackIds: string[];
};

export const TrackDetail = ({trackIds}: Props) => {

  const lastTrackId = trackIds[trackIds.length - 1];

  const {data: track, isPending,  isError, isFetching} = useQuery({
    queryKey: ['trackDetail', lastTrackId], // обязательно включаем ID
    queryFn: async({signal}) => {
      const clientData = await client.GET('/playlists/tracks/{trackId}', {
        params: {
          path: {
            trackId: lastTrackId!
          }
        },
        signal: signal
      }) //api.getTrack(lastTrackId, signal)
      return clientData.data;
    },
    enabled: Boolean(lastTrackId), // запрос только если есть трек
    placeholderData: keepPreviousData, // временно показывай и сохраняй предыдущие данные
  })

  if(!lastTrackId) return <p>no track selected</p>

  if (isPending) {
    return <p>Loading...</p>
  }

  if (isError) {
    return <p>some error when fetch track</p>
  }

  return (
    <div>
      <h2>Detail {isFetching && '⏳'}</h2>
      <div>
        <h3>{track?.data.attributes.title}</h3>
        <p>{track?.data.attributes.addedAt}</p>
        <p>Likes: {track?.data.attributes.likesCount}</p>
        <p>Lyrics: {track?.data.attributes.lyrics}</p>
      </div>
    </div>
  );
};
