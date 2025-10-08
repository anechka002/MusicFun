import {TracksList} from "@/TracksList.tsx";

export const MainPage = () => {

  return (
    <div>
      <h2>Music Fun</h2>
      <div style={{display: 'flex', gap: '24px'}}>
        <TracksList />
        {/*<TracksListWithButtons/>*/}
        {/*<TracksListPlayer/>*/}
      </div>
    </div>
  );
};