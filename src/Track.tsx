// import type {SchemaTrackListItemOutput} from "@/shared/api/schema";
import {NavLink} from "react-router";
import type {SchemaTrackListItemResource} from "@/shared-layer/api-segment/schema";

type Props = {
  // track: SchemaTrackListItemOutput
  track: SchemaTrackListItemResource
  onTrackEnded: (id: string) => void
  onTrackPlay: (id: string) => void
  onTrackPause: (id: string) => void
  setRef: (ref: HTMLAudioElement | null) => void
}

export const Track = ({track, onTrackEnded, onTrackPlay, setRef, onTrackPause}: Props) => {

  const handleTrackEnded = () => {
    onTrackEnded(track.id)
  }

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
    </>
  );
};
