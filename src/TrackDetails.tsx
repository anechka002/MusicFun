import {api} from "@/api.ts";
import {keepPreviousData, useQuery} from "@tanstack/react-query";

type Props = {
  trackIds: string[];
};

export const TrackDetail = ({trackIds}: Props) => {

  // const {detailQueryStatus, track } = useTrackDetail(trackIds)

  const lastTrackId = trackIds[trackIds.length - 1];

  const {data: track, isPending,  isError, isFetching} = useQuery({
    queryKey: ['trackDetail', lastTrackId], // обязательно включаем ID
    queryFn: ({signal}) => {
      return api.getTrack(lastTrackId, signal)
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
        <h3>{track.data.attributes.title}</h3>
        <p>{track.data.attributes.addedAt}</p>
        <p>Likes: {track.data.attributes.likesCount}</p>
        <p>Lyrics: {track.data.attributes.lyrics}</p>
      </div>
    </div>
  );
};
