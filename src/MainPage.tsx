import {TracksList} from "@/features-layer/tracks-slice/ui-segment/TracksList.tsx";

export const MainPage = () => {

  return (
    <div>
      <h2>Music Fun</h2>
      <div>
        <TracksList />
        {/*<TracksListWithButtons/>*/}
        {/*<TracksListPlayer/>*/}
      </div>
    </div>
  );
};