import {useState} from "react";
import {TracksList} from "@/TracksList.tsx";
import {TrackDetail} from "@/TrackDetails.tsx";

export const MainPage = () => {

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
        <TrackDetail trackIds={selectedTrackIds} />
      </div>
    </div>
  );
};