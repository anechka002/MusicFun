import {
  DeletePlaylist
} from "@/features-layer/playlists-slice/delete-playlist-feature/ui-segment/DeletePlaylist.tsx";
import type {
  SchemaPlaylistListItemResource
} from "@/shared-layer/api-segment/schema";
import {PlaylistCover} from "@/entities/playlists/ui/PlaylistCover.tsx";
import {useMeQuery} from "@/features-layer/auth-slice/model/useMeQuery.ts";
import {
  UploadPlaylistCoverForm
} from "@/features-layer/playlists-slice/upload-playlist-cover-feature/ui-segment/UploadPlaylistCoverForm.tsx";

export const PlaylistsListItemCard = ({playlist}: {playlist: SchemaPlaylistListItemResource}) => {

  const {data: meData} = useMeQuery()

  const isPlaylistOwner = meData && meData.userId === playlist.attributes.user.id

  return (
    <div key={playlist.id}>
      <h4>{playlist.attributes.title}</h4>
      { isPlaylistOwner && <div><DeletePlaylist playlistId={playlist.id}/></div> }
      { isPlaylistOwner && <div><UploadPlaylistCoverForm playlistId={playlist.id}/></div> }
      <PlaylistCover images={playlist.attributes.images} playlistCoverTitle={playlist.attributes.title} />
    </div>
  )
}