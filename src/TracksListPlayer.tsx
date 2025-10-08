import {useQuery} from "@tanstack/react-query";
import {client} from "@/shared/api/client.ts";
import {useEffect, useRef, useState} from "react";
import s from './TraksList.module.css'

type LoopMode = '🚫no-loop' | '🔁loop-playlist' | '🔂loop-one'
            //без повтора //зацикливаем плейлист //гоняем один трек по кругу

export const TracksListPlayer = () => {

  const {isPending, isError, data: tracks} = useQuery({
    queryKey: ['tracksList'],
    queryFn: async () =>  {
      const clientData = await client.GET('/playlists/tracks');
      return clientData.data!
    }
  })

  const [loopMode, setLoopMode] = useState<LoopMode>('🚫no-loop')

  // Хранит ID текущего проигрываемого трека
  const [currentTrackPlay, setCurrentTrackPlay] = useState<string | null>(null)

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

    if(loopMode === '🔂loop-one') {
      // заново тот же трек
      const audio = audioElementRef.current[id]
      if(audio) {
        audio.currentTime = 0
        audio.play()
      }
      return
    }

    if(loopMode === '🔁loop-playlist') {
      // берем следующий индекс по кругу
      const nextIndex = (endedIndex + 1) % tracks.data.length
      const nextTrack = tracks.data[nextIndex]
      if(!nextTrack) return
      setCurrentTrackPlay(nextTrack.id)
      audioElementRef.current[nextTrack!.id]?.play()
      selectedTrackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    if(endedIndex < tracks.data.length - 1) {
      const nextTrack = tracks.data[endedIndex + 1]
      if(!nextTrack) return
      setCurrentTrackPlay(nextTrack.id)
      audioElementRef.current[nextTrack!.id]?.play()
      selectedTrackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } else {
      setCurrentTrackPlay(null)
    }
  }

  const handleToggleLoopMode = () => {
    setLoopMode(prev => {
      switch (prev) {
        case '🚫no-loop':
          return '🔁loop-playlist';
        case '🔁loop-playlist':
          return '🔂loop-one';
        default:
          return '🚫no-loop';
      }
    });
  }

  return (
    <>
      <button onClick={handleToggleLoopMode}>Loop Mode: {loopMode}</button>
      <ul>
        {tracks.data.map((track) => (
          <li className={currentTrackPlay === track.id ? s.active : ''}
              key={track.id}
              ref={currentTrackPlay === track.id ? selectedTrackRef : null}
          >
            <Track
              onPlay={() => setCurrentTrackPlay(track.id)}
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

import type {
  SchemaTrackListItemResource
} from "@/shared/api/schema";
import {NavLink} from "react-router";

type Props = {
  track: SchemaTrackListItemResource
  onTrackEnded: (id: string) => void
  setRef: (ref: HTMLAudioElement | null) => void
  onPlay: () => void
}

export const Track = ({track, onTrackEnded, onPlay, setRef}: Props) => {
  const ref = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setRef(ref.current)
  }, [setRef])

  const handleTrackEnded = () => {
    onTrackEnded(track.id)
  }

  const handlePlay = () => {
    onPlay()
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
        onPlay={handlePlay}
      ></audio>
    </>
  );
};

