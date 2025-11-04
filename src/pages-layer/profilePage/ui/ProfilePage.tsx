import {useParams} from "react-router";
import {useMeQuery} from "@/features-layer/auth-slice/model/useMeQuery.ts";
import {useState} from "react";
import {
  TracksTab
} from "@/pages-layer/profilePage/ui/TracksTab/TracksTab.tsx";
import {
  PlaylistsTab
} from "@/pages-layer/profilePage/ui/PlaylistsTab/PlaylistsTab.tsx";

export const ProfilePage = () => {

  const {userId} = useParams()

  const {data} = useMeQuery()

  const isProfileOwner = userId === data?.userId

  const [currentTab, setCurrentTab] = useState<'tracks' | 'playlists'>('playlists')

  return (
    <div>
      <button onClick={() => setCurrentTab('tracks')}>Tracks</button>
      <button onClick={() => setCurrentTab('playlists')}>Playlists</button>

      {currentTab === 'tracks' && <TracksTab userId={userId} isProfileOwner={isProfileOwner}/>}

      {currentTab === 'playlists' && <PlaylistsTab userId={userId} isProfileOwner={isProfileOwner}/>}

    </div>
  );
};
