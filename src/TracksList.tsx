import {Track} from './Track.tsx';
import {useQuery} from "@tanstack/react-query";
import {client} from "@/shared/api/client.ts";
import {useRef, useState} from "react";

export const TracksList = () => {

  const {isPending, isError, data: tracks} = useQuery({
    queryKey: ['tracksList'],
    queryFn: async () =>  {
      const clientData = await client.GET('/playlists/tracks');
      return clientData.data!
    }
  })

  const [, setCurrentTrackPlay] = useState<string | null>(null)

  const audioElementRef = useRef<Record<string, HTMLAudioElement | null>>({})
  if (isPending) {
    return <div>Loading...</div>
  }
  if (isError) {
    return <div>Can't load tracks</div>
  }

  const handleTrackEnded = (id: string) => {
    const endedIndex = tracks.data.findIndex((e) => e.id === id);
    if (endedIndex !== -1) {
      const nextTrack = tracks.data[endedIndex + 1];
      if (!nextTrack) {
        setCurrentTrackPlay(null)
        return
      }
      setCurrentTrackPlay(nextTrack.id);
      audioElementRef.current[nextTrack.id]!.play()
    }
  }

  return (
    <ul>
      {tracks.data.map((track) => (
        <Track
          onTrackEnded={handleTrackEnded}
          key={track.id}
          track={track}
          setRef={(el) => {
            if(el) audioElementRef.current[track.id] = el
            else delete audioElementRef.current[track.id];
          }}
        />
      ))}
    </ul>
  );
};
