import { DeletePlaylist } from '@/features-layer/playlists-slice/delete-playlist-feature/ui-segment/DeletePlaylist.tsx';
import type { SchemaPlaylistListItemResource } from '@/shared-layer/api-segment/schema';
import { PlaylistCover } from '@/entities/playlists/ui/PlaylistCover.tsx';
import { useMeQuery } from '@/features-layer/auth-slice/model/useMeQuery.ts';
import { UploadPlaylistCoverForm } from '@/features-layer/playlists-slice/upload-playlist-cover-feature/ui-segment/UploadPlaylistCoverForm.tsx';
import { useState } from 'react';
import { UpdatePlaylistForm } from '@/features-layer/playlists-slice/update-playlist-feature/ui-segment/UpdatePlaylistForm';

export const PlaylistsListItemCard = ({
  playlist,
}: {
  playlist: SchemaPlaylistListItemResource;
}) => {
  const { data: meData } = useMeQuery();

  const isPlaylistOwner =
    meData && meData.userId === playlist.attributes.user.id;

  const [mode, setMode] = useState<'display' | 'edit'>('display');

  if (!isPlaylistOwner && mode === 'edit')
    throw new Error('You are not allowed to edit this playlist');

  if (mode === 'display')
    return (
      <div>
        {isPlaylistOwner && <button onClick={() => setMode('edit')}>✏️</button>}
        <DisplayMode playlist={playlist} />
      </div>
    );

  if (mode === 'edit')
    return (
      <div>
        <button onClick={() => setMode('display')}>❌</button>
        <EditMode playlist={playlist} />
      </div>
    );
};

const DisplayMode = ({
  playlist,
}: {
  playlist: SchemaPlaylistListItemResource;
}) => {
  return (
    <div>
      <h4>{playlist.attributes.title}</h4>
      <PlaylistCover
        images={playlist.attributes.images}
        playlistCoverTitle={playlist.attributes.title}
      />
    </div>
  );
};

const EditMode = ({
  playlist,
}: {
  playlist: SchemaPlaylistListItemResource;
}) => {
  return (
    <div>
      <UpdatePlaylistForm playlistId={playlist.id} />
      <div>
        <DeletePlaylist playlistId={playlist.id} />
      </div>
      <div>
        <UploadPlaylistCoverForm playlistId={playlist.id} />
      </div>
      <PlaylistCover
        images={playlist.attributes.images}
        playlistCoverTitle={playlist.attributes.title}
      />
    </div>
  );
};
