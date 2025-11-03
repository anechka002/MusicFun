import {
  CreatePlaylistForm
} from "@/features-layer/playlists-slice/create-playlist-feature/ui-segment/CreatePlaylistForm.tsx";
import {
  PlaylistsList
} from "@/widgest-layer/playlists-slice/ui-segment/PlaylistsList.tsx";

export const PlaylistsTab = ({isProfileOwner, userId}: {isProfileOwner: boolean, userId?: string}) => {
  return (
    <>
      {isProfileOwner && <CreatePlaylistForm/>}
      <PlaylistsList userId={userId}/>
    </>
  )
}