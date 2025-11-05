import { UpdatePlaylistForm } from '@/features-layer/playlists-slice/update-playlist-feature/ui-segment/UpdatePlaylistForm';
import { PlaylistsList } from '@/widgest-layer/playlists-slice/ui-segment/PlaylistsList.tsx';
import {
  usePlaylists
} from "@/widgest-layer/playlists-slice/model-segment/usePlaylists.ts";
import {
  CreatePlaylistForm
} from "@/features-layer/playlists-slice/create-playlist-feature/ui-segment/CreatePlaylistForm.tsx";

export const PlaylistsTab = ({
  isProfileOwner,
  userId,
}: {
  isProfileOwner: boolean;
  userId?: string;
}) => {
  return (
    <>
      {isProfileOwner && <CreatePlaylistForm/>}
      <PlaylistsList userId={userId} />
    </>
  );
};
