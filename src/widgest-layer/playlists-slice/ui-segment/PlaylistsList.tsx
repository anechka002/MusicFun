import {
  usePlaylists
} from "@/widgest-layer/playlists-slice/model-segment/usePlaylists.ts";
import noCover from '@/assets/no-cover.png'
import type {
  SchemaPlaylistListItemResource
} from "@/shared-layer/api-segment/schema";

type Props = {
  userId?: string | undefined
}

export const PlaylistsList = ({userId}: Props) => {
  const {data, isPending, isError} = usePlaylists(userId)

  if (isPending) return <div>Loading...</div>
  if (isError) return <div>Some error... <button>try again</button></div>

  return (
    <div>
      PlaylistsList {userId}
      <div>{data?.data.map(pl => <div key={pl.id}>
            <h4>{pl.attributes.title}</h4>
            <PlaylistCover playlist={pl}/>
          </div>)}
      </div>
    </div>
  );
};

const PlaylistCover = ({playlist}: {playlist: SchemaPlaylistListItemResource}) => {
  let url = noCover;
  if(playlist.attributes.images.main?.length) {
    url = playlist.attributes.images.main[0]!.url
  }
  return (
   <img src={url} alt={'cover'} style={{ width: '200px'}} />
  )
}