import {useTrackDetail} from "@/hooks/useTrackDetail.ts";

type Props = {
  trackIds: string[];
};

export const TrackDetail = ({trackIds}: Props) => {

  const {detailQueryStatus, track } = useTrackDetail(trackIds)

  return (
    <div>
      <h2>Detail</h2>
      <div>
        {detailQueryStatus === 'idle' && <p>No tracks for display</p>}
        {detailQueryStatus === 'loading' && <p>Loading...</p>}
        {detailQueryStatus === 'success' &&
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
