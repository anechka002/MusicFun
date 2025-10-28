import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {client} from "@/shared-layer/api-segment/client.ts";

type Props = {
  trackId: string;
}

export const TrackDetail = ({trackId}: Props) => {

  const {data: track, isPending,  isError, isFetching} = useQuery({
    queryKey: ['trackDetail', trackId], // обязательно включаем ID
    queryFn: async({signal}) => {
      const clientData = await client.GET('/playlists/tracks/{trackId}', {
        params: {
          path: {
            trackId: trackId!
          }
        },
        signal: signal
      })
      return clientData.data;
    },
    enabled: Boolean(trackId), // запрос только если есть трек
    placeholderData: keepPreviousData, // временно показывай и сохраняй предыдущие данные
  })

  if(!trackId) return <p>no track selected</p>

  if (isPending) {
    return <p>Loading...</p>
  }

  if (isError) {
    return <p>some error when fetch track!</p>
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
