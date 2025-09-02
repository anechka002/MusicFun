import {TracksDetail} from './TracksDetails';
import {TracksList} from './TracksList';
import {useState} from "react";

export const App = () => {

  const [selectedTrackIds, setSelectedTrackIds] = useState<string[]>([]);

  const handleOnTrackSelect  = (trackId: string) => {
    setSelectedTrackIds((prev) =>
      prev.includes(trackId)
        ? prev.filter((t) => t !== trackId) // снять выделение
        : [...prev, trackId] // добавить
    );
  }

  return (
    <div>
      <h2>Music Fun</h2>
      <button onClick={() =>setSelectedTrackIds([])}>Reset</button>
      <div style={{display: 'flex', gap: '24px'}}>
        <TracksList
          selectedTrackIds={selectedTrackIds}
          onTrackSelect={handleOnTrackSelect}
        />
        <TracksDetail trackIds={selectedTrackIds} />
      </div>
    </div>
  );
};
