import {Track} from './Track.tsx';
import {useQuery} from "@tanstack/react-query";
import {client} from "@/shared/api/client.ts";
import {useEffect, useRef, useState} from "react";
import s from './TraksList.module.css'

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

  const selectedTrackRef = useRef<HTMLLIElement | null>(null)
  const [index, setIndex] = useState<number>(0)

  useEffect(() => {
    console.log(index)
    selectedTrackRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [index])

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

  const handleNext = () => {
    if(index < tracks.data.length - 1) {
      setIndex(index + 1)
    } else {
      setIndex(0)
    }
  }

  return (
    <>
      <button onClick={handleNext}>Next</button>
      <ul>
        {tracks.data.map((track, i) => (
          <li className={index === i ? s.active : ''} key={track.id} ref={index === i ? selectedTrackRef : null}>
            <Track
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
