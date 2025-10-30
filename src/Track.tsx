import {NavLink} from "react-router";
import type {SchemaTrackListItemResource} from "@/shared-layer/api-segment/schema";
import {
  DeleteTrack
} from "@/features-layer/tracks-slice/delete-track-feature/ui-segment/DeleteTrack.tsx";
import {useMeQuery} from "@/features-layer/auth-slice/model/useMeQuery.ts";

type Props = {
  track: SchemaTrackListItemResource
  onTrackEnded: (id: string) => void
  onTrackPlay: (id: string) => void
  onTrackPause: (id: string) => void
  setRef: (ref: HTMLAudioElement | null) => void
}

export const Track = ({track, onTrackEnded, onTrackPlay, setRef, onTrackPause}: Props) => {
  const {data} = useMeQuery()

  const handleTrackEnded = () => {
    onTrackEnded(track.id)
  }

  const isOwner = data?.userId === track.attributes.user.id

  return (
    <>
      <h5>
        <NavLink to={`/tracks/${track.id}`}>
          {track.attributes.title}
        </NavLink>
      </h5>
      <audio
        src={track.attributes.attachments[0]!.url}
        controls={true}
        onEnded={handleTrackEnded}
        ref={(el) => setRef(el)}
        onPlay={() => onTrackPlay(track.id)}
        onPause={() => onTrackPause(track.id)}
      ></audio>
      {!track.attributes.isPublished && <span>no published</span>}
      {/*<DeleteTrack trackId={track.id} />*/}
      {isOwner && <DeleteTrack trackId={track.id} />}
    </>
  );
};
