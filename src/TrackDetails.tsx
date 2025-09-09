import {useQuery} from "@/hooks/useQuery.ts";
import {api} from "@/api.ts";

type Props = {
  trackIds: string[];
};

export const TrackDetail = ({trackIds}: Props) => {

  // const {detailQueryStatus, track } = useTrackDetail(trackIds)

  const lastTrackId = trackIds[trackIds.length - 1];

  const {status, data: track} = useQuery({
    queryKeys: ['track', lastTrackId], // обязательно включаем ID
    queryFn: ({signal}) =>  {
      return api.getTrack(lastTrackId, signal)
    },
    enabled: Boolean(lastTrackId) // запрос только если есть трек
  })

  return (
    <div>
      <h2>Detail</h2>
      <div>
        {status === 'pending' && <p>No tracks for display</p>}
        {status === 'loading' && <p>Loading...</p>}
        {status === 'success' &&
          track && (
            <div>
              <h3>{track.data.attributes.title}</h3>
              <p>{track.data.attributes.addedAt}</p>
              <p>Likes: {track.data.attributes.likesCount}</p>
              <p>Lyrics: {track.data.attributes.lyrics}</p>
            </div>
          )}
      </div>
    </div>
  );
};
