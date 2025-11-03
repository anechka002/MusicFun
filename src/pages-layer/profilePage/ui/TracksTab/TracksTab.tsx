import {
  UploadTrackForm
} from "@/features-layer/tracks-slice/upload-track-feature/ui-segment/UploadTrackForm.tsx";
import {
  TracksList
} from "@/widgest-layer/tracks-slice/ui-segment/TracksList.tsx";

type Props = {
  isProfileOwner: boolean;
  userId: string | undefined;
}
export const TracksTab = ({isProfileOwner, userId}: Props) => {
  return (
    <>
      {isProfileOwner && <UploadTrackForm/>}
      <TracksList userId={userId} includeDrafts={isProfileOwner}/>
    </>
  )
}