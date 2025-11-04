import type {components} from "@/shared-layer/api-segment/schema";
import noCover from '@/assets/no-cover.png'

type PlaylistImagesOutputDTO = components["schemas"]["PlaylistImagesOutputDTO"];

export const PlaylistCover = ({images, playlistCoverTitle}: {images: PlaylistImagesOutputDTO, playlistCoverTitle: string}) => {
  let url = noCover;
  if(images.main?.length) {
    url = images.main[0]!.url
  }
  return (
    <img src={url} alt={playlistCoverTitle} style={{ width: '200px'}} />
  )
}