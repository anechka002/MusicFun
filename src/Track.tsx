import type {TrackDataItem} from "./types/types";

type Props = {
  track: TrackDataItem
  isSelected: boolean
  onSelect: (trackId: string) => void
}

export const Track = ({track, isSelected, onSelect}: Props) => {
  const color = isSelected ? 'red' : 'white';
  return (
    <li
      key={track.id}
      style={{color: color}}
    >
      <h5 onClick={() => onSelect(track.id)}>
        {track.attributes.title}
      </h5>
      <audio
        src={track.attributes.attachments[0].url}
        controls={true}
      ></audio>
    </li>
  );
};
