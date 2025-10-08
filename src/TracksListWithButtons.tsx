import {useQuery} from "@tanstack/react-query";
import {client} from "@/shared/api/client.ts";
import {useEffect, useRef, useState} from "react";
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
  // состояние Play/Pause
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  // useRef для хранения ссылок на элементы <audio>, чтобы управлять ими напрямую
  const audioElementRef = useRef<Record<string, HTMLAudioElement | null>>({})
  // useRef для скролла к текущему треку
  const selectedTrackRef = useRef<HTMLLIElement | null>(null)

  if (isPending) return <div>Loading...</div>

  if (isError) return <div>Can't load tracks</div>

  // Автоплей следующего трека после окончания текущего
  const handleTrackEnded = (id: string) => {
    const endedIndex = tracks.data.findIndex((el) => el.id === id);
    if (endedIndex === -1) return; // защита

    // вычисляем следующий индекс (или -1, если дошли до конца)
    const nextIndex = endedIndex + 1 < tracks.data.length ? endedIndex + 1 : -1;

    if(nextIndex === -1) {
      // Если дошли до конца -> останавливаем воспроизведение
      setCurrentTrackPlay(null);
      setIsPlaying(false)
      return;
    }

    const nextTrack = tracks.data[nextIndex];
    if(!nextTrack) return;

    // Ставим следующий трек в состояние Play
    setCurrentTrackPlay(nextTrack.id)
    setIsPlaying(true)

    // Запускаем следующий трек через ссылку на <audio>
    audioElementRef.current[nextTrack.id]?.play()
    selectedTrackRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });

    // console.log("Переключились на:", nextTrack)
  }

  const handlePlayPause = (id: string) => {
    if(currentTrackPlay === id) {
      // если нажали на тот же трек → просто переключаем Play/Pause
      setIsPlaying(prev => !prev)
    } else {
      // переключились на другой трек
      setCurrentTrackPlay(id)
      setIsPlaying(true)
    }
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
              isPlaying={isPlaying}
              isActive={currentTrackPlay === track.id}
              onPlayPause={() => handlePlayPause(track.id)}
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

import type {SchemaTrackListItemResource} from "@/shared/api/schema";
import {NavLink} from "react-router";

type Props = {
  track: SchemaTrackListItemResource
  onTrackEnded: (id: string) => void
  onPlayPause: () => void
  setRef: (ref: HTMLAudioElement | null) => void
  isActive: boolean // этот трек выбран?
  isPlaying: boolean // играет или пауза?
}

export const Track = ({track, onTrackEnded, isPlaying, onPlayPause, isActive}: Props) => {
  const ref = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if(!ref.current) return;
    if(isActive) {
      if(isPlaying) {
        ref.current?.play()
      } else {
        ref.current?.pause()
      }
    } else {
      ref.current?.pause()
      ref.current.currentTime = 0  // сбрасываем, если не активный
    }
  }, [isPlaying, isActive])

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
        ref={ref}
        autoPlay={isPlaying}
      ></audio>
      <button onClick={onPlayPause}>{isPlaying && isActive ? 'Pause' : 'Play'}</button>
    </>
  );
};

