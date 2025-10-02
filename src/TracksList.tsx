import {Track} from './Track.tsx';
import {useQuery} from "@tanstack/react-query";
import {client} from "@/shared/api/client.ts";
import {useRef, useState} from "react";
import s from './TraksList.module.css'

export const TracksList = () => {

  const {isPending, isError, data: tracks} = useQuery({
    queryKey: ['tracksList'],
    queryFn: async () =>  {
      const clientData = await client.GET('/playlists/tracks');
      return clientData.data!
    }
  })

  const [currentTrackPlay, setCurrentTrackPlay] = useState<string | null>(null)
  console.log('currentTrackPlay', currentTrackPlay)

  const audioElementRef = useRef<Record<string, HTMLAudioElement | null>>({})
  const selectedTrackRef = useRef<HTMLLIElement | null>(null)

  if (isPending) {
    return <div>Loading...</div>
  }
  if (isError) {
    return <div>Can't load tracks</div>
  }

  const handleTrackEnded = (id: string) => {
    const endedIndex = tracks.data.findIndex((el) => el.id === id);
    if (endedIndex === -1) return; // защита

    // вычисляем следующий индекс (или -1, если дошли до конца)
    const nextIndex = endedIndex + 1 < tracks.data.length ? endedIndex + 1 : -1;

    if(nextIndex === -1) {
      // последний трек
      setCurrentTrackPlay(null);
      return;
    }

    const nextTrack = tracks.data[nextIndex];
    if(!nextTrack) return;
    setCurrentTrackPlay(nextTrack.id)

    audioElementRef.current[nextTrack.id]?.play()
    selectedTrackRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });

    console.log("Переключились на:", nextTrack)
  }

  return (
    <>
      <ul>
        {tracks.data.map((track) => (
          <li className={currentTrackPlay === track.id ? s.active : ''}
              key={track.id}
              ref={currentTrackPlay === track.id ? selectedTrackRef : null}
          >
            <Track
              onTrackPlay={() => setCurrentTrackPlay(track.id)}
              onTrackEnded={handleTrackEnded}
              track={track}
              setRef={(el) => {
                if(el) audioElementRef.current[track.id] = el
                else delete audioElementRef.current[track.id];
              }}
            />
          </li>
        ))}
      </ul>
    </>
  );
};
