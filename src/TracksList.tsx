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

  // Хранит ID текущего проигрываемого трека
  const [currentTrackPlay, setCurrentTrackPlay] = useState<string | null>(null)
  console.log('currentTrackPlay', currentTrackPlay)

  // useRef для хранения ссылок на элементы <audio>, чтобы управлять ими напрямую
  const audioElementRef = useRef<Record<string, HTMLAudioElement | null>>({})
  // useRef для скролла к текущему треку
  const selectedTrackRef = useRef<HTMLLIElement | null>(null)

  if (isPending) {
    return <div>Loading...</div>
  }
  if (isError) {
    return <div>Can't load tracks</div>
  }

  // Автоплей следующего трека после окончания текущего
  const handleTrackEnded = (id: string) => {
    const endedIndex = tracks.data.findIndex((el) => el.id === id);
    if (endedIndex === -1) return; // защита

    // вычисляем следующий индекс (или -1, если дошли до конца)
    const nextIndex = endedIndex + 1 < tracks.data.length ? endedIndex + 1 : -1;

    if(nextIndex === -1) {
      // Если дошли до конца -> останавливаем воспроизведение
      setCurrentTrackPlay(null);
      return;
    }

    const nextTrack = tracks.data[nextIndex];
    if(!nextTrack) return;

    // ставим на паузу старый
    audioElementRef.current[id]?.pause();

    // обновляем state
    setCurrentTrackPlay(nextTrack.id)

    // запускаем новый трек в состояние Play
    audioElementRef.current[nextTrack.id]?.play()
    // скроллим к нему
    selectedTrackRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });

    console.log("Переключились на:", nextTrack)
  }

  // При старте Play через нативный контрол
  const handleTrackPlay = (id: string) => {
    // если играет другой трек → ставим его на паузу
    if (currentTrackPlay && currentTrackPlay !== id) {
      audioElementRef.current[currentTrackPlay]?.pause();
    }
    setCurrentTrackPlay(id);

    // скроллим к текущему треку
    selectedTrackRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // При Pause через нативный контрол
  const handleTrackPause = (id: string) => {
    if (currentTrackPlay === id) {
      setCurrentTrackPlay(null);
    }
  };

  return (
    <>
      <ul>
        {tracks.data.map((track) => (
          <li className={currentTrackPlay === track.id ? s.active : ''}
              key={track.id}
              ref={currentTrackPlay === track.id ? selectedTrackRef : null}
          >
            <Track
              onTrackPlay={() => handleTrackPlay(track.id)}
              onTrackPause={() => handleTrackPause(track.id)}
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
