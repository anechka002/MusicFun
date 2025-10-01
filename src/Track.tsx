import type {SchemaTrackListItemOutput} from "@/shared/api/schema";
import {NavLink} from "react-router";

type Props = {
  track: SchemaTrackListItemOutput
  onTrackEnded: (id: string) => void
  setRef: (ref: HTMLAudioElement | null) => void
}

export const Track = ({track, onTrackEnded, setRef}: Props) => {

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
      ></audio>
    </>
  );
};
