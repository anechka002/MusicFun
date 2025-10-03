// import {Track} from './Track.tsx';
import {useQuery} from "@tanstack/react-query";
import {client} from "@/shared/api/client.ts";
import {useRef, useState} from "react";
import s from './TraksList.module.css'

export const TracksListWithButtons = () => {

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

  // Хранит состояние Play/Pause каждого трека для кнопок и синхронизации
  const [playState, setPlayState] = useState<Record<string, boolean>>({})

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
      setPlayState(prev => ({...prev, [id]: false}))
      return;
    }

    const nextTrack = tracks.data[nextIndex];
    if(!nextTrack) return;

    // Ставим следующий трек в состояние Play
    setCurrentTrackPlay(nextTrack.id)
    setPlayState(prev => ({
      ...prev,
      [id]: false,          // ❗️ остановить прошлый
      [nextTrack.id]: true  // ❗️ включить новый
    }))

    // Запускаем следующий трек через ссылку на <audio>
    audioElementRef.current[nextTrack.id]?.play()
    selectedTrackRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });

    console.log("Переключились на:", nextTrack)
  }

  // Функция переключения Play/Pause по клику на кнопку
  const handleTogglePlay = (id: string) => {
    // debugger
    if(currentTrackPlay === id) {
      // Если трек уже играет, ставим на паузу
      audioElementRef.current[id]?.pause()
      setPlayState((prev) => ({ ...prev, [id]: false })) // Обновляем состояние
      setCurrentTrackPlay(null) // Останавливаем текущий трек
    } else {
      // Если другой трек играет, ставим его на паузу
      // debugger
      if(currentTrackPlay) {
        // debugger
        audioElementRef.current[currentTrackPlay]?.pause()
        setPlayState((prev) => ({ ...prev, [currentTrackPlay]: false })) // Обновляем состояние
      }
      // Запускаем новый трек
      setCurrentTrackPlay(id)
      setPlayState((prev) => ({ ...prev, [id]: true }))
      audioElementRef.current[id]?.play()
    }
    // скроллим к нему
    selectedTrackRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
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
              isPlaying={playState[track.id] ?? false}
              // onTrackPlay={() => setCurrentTrackPlay(track.id)}
              onTrackPlay={handleTogglePlay}
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

import type {SchemaTrackListItemOutput} from "@/shared/api/schema";
import {NavLink} from "react-router";

type Props = {
  track: SchemaTrackListItemOutput
  onTrackEnded: (id: string) => void
  onTrackPlay: (id: string) => void
  setRef: (ref: HTMLAudioElement | null) => void
  isPlaying: boolean
}

export const Track = ({track, onTrackEnded, onTrackPlay, setRef, isPlaying, }: Props) => {

  const handleTrackEnded = () => {
    onTrackEnded(track.id)
  }

  const handleTrackPlay = () => {
    onTrackPlay(track.id)
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
        // onPlay={handleTrackPlay}
      ></audio>
      <button onClick={handleTrackPlay}>{isPlaying ? 'Pause' : 'Play'}</button>
    </>
  );
};

