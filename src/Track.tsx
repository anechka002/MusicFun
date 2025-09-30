import type {SchemaTrackListItemOutput} from "@/shared/api/schema";
import {NavLink} from "react-router";

type Props = {
  track: SchemaTrackListItemOutput
}

export const Track = ({track}: Props) => {

  return (
    <li key={track.id}>
      <h5>
        <NavLink to={`/tracks/${track.id}`}>
          {track.attributes.title}
        </NavLink>
      </h5>
      <audio
        src={track.attributes.attachments[0]!.url}
        controls={true}
      ></audio>
    </li>
  );
};
