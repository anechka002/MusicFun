import {
  usePlaylists
} from "@/widgest-layer/playlists-slice/model-segment/usePlaylists.ts";
import noCover from '@/assets/no-cover.png'
import type {
  components,
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
            <PlaylistCover images={pl.attributes.images} playlistCoverTitle={pl.attributes.title} />
          </div>)}
      </div>
    </div>
  );
};

type PlaylistImagesOutputDTO = components["schemas"]["PlaylistImagesOutputDTO"];

const PlaylistCover = ({images, playlistCoverTitle}: {images: PlaylistImagesOutputDTO, playlistCoverTitle: string}) => {
  let url = noCover;
  if(images.main?.length) {
    url = images.main[0]!.url
  }
  return (
   <img src={url} alt={playlistCoverTitle} style={{ width: '200px'}} />
  )
}