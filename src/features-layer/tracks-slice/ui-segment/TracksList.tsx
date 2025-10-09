import {Track} from '../../../Track.tsx';
import {type ChangeEvent, useRef, useState} from "react";
import s from '../../../TraksList.module.css'
import {
  useTracksQuery
} from "@/features-layer/tracks-slice/model-segment/useTracksQuery.tsx";

export const TracksList = () => {

  // Номер текущей страницы (для пагинации)
  const [pageNumber, setPageNumber] = useState(1);

  const [pageSize, setPageSize] = useState(5);

  // Загружаем список треков через React Query
  const {isPending, isError, data: tracks, isFetching} = useTracksQuery({
    pageNumber,
    pageSize,
  })

  // Хранит ID текущего проигрываемого трека
  const [currentTrackPlay, setCurrentTrackPlay] = useState<string | null>(null)

  // useRef для хранения ссылок на элементы <audio>, чтобы управлять ими напрямую
  const audioElementRef = useRef<Record<string, HTMLAudioElement | null>>({})
  // useRef для скролла к текущему треку
  const selectedTrackRef = useRef<HTMLLIElement | null>(null)

  // Если данные ещё не пришли (первичная загрузка) — показываем "Loading..."
  if (isPending) {
    return <div>Loading...</div>
  }
  // Если запрос упал с ошибкой
  if (isError) {
    return <div>Can't load tracks</div>
  }

  // 🔊 Срабатывает, когда трек закончил играть
  const handleTrackEnded = (id: string) => {
    // Ищем индекс трека, который только что закончился
    const endedIndex = tracks.data.findIndex((el) => el.id === id);
    if (endedIndex === -1) return; // защита

    // Считаем индекс следующего трека (если есть)
    const nextIndex = endedIndex + 1 < tracks.data.length ? endedIndex + 1 : -1;

    // Если дошли до конца списка — останавливаем проигрывание
    if(nextIndex === -1) {
      setCurrentTrackPlay(null);
      return;
    }

    // Берём следующий трек
    const nextTrack = tracks.data[nextIndex];
    if(!nextTrack) return;

    // ставим на паузу старый трек
    audioElementRef.current[id]?.pause();

    // обновляем state
    setCurrentTrackPlay(nextTrack.id)

    // запускаем новый трек в состояние Play
    audioElementRef.current[nextTrack.id]?.play()
    // скроллим к нему
    selectedTrackRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // ▶️ Когда пользователь нажал Play (через нативный контрол)
  const handleTrackPlay = (id: string) => {
    // если играет другой трек → ставим его на паузу
    if (currentTrackPlay && currentTrackPlay !== id) {
      audioElementRef.current[currentTrackPlay]?.pause();
    }
    // Запоминаем ID нового активного трека
    setCurrentTrackPlay(id);

    // скроллим к текущему треку
    selectedTrackRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // ⏸️ Когда пользователь нажал Pause
  const handleTrackPause = (id: string) => {
    //  Если это тот же трек, что сейчас играет — сбрасываем state
    if (currentTrackPlay === id) {
      setCurrentTrackPlay(null);
    }
  };

  // Меняем текущую страницу (номер)
  const handlePageSelect = (pageNumber: number) => {
    setPageNumber(pageNumber)
  }

  // true → контент устарел, идёт обновление (например, пользователь переключил страницу)
  // const isPageContentUnactual = tracks.meta.page !== pageNumber
  const isPageContentUnactual = isFetching && !isPending

  // true → контент подгружается (для блокировки кнопок пагинации и визуальных эффектов)
  const isPageUpdating = isFetching && !isPending

  const handlePageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPageSize(+e.currentTarget.value)
    setPageNumber(1)
  }

  return (
    <>
      <select value={pageSize} onChange={handlePageSizeChange}>
        <option value="5">5 items</option>
        <option value="10">10 items</option>
        <option value="20">20 items</option>
      </select>
      <Pagination total={tracks.meta.totalCount!}
                  skip={tracks.meta.pageSize * (pageNumber - 1)}
                  limit={tracks.meta.pageSize}
                  onPageSelect={handlePageSelect}
                  isPageUpdating={isPageUpdating}
      />
      <ul style={{ opacity: isPageContentUnactual ? '0.4' : '1' }}>
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


type PaginationType = {
  limit: number;
  skip: number;
  total: number;
  onPageSelect: (pageNumber: number) => void;
  isPageUpdating: boolean;
}

function Pagination ({ limit, total, skip, onPageSelect, isPageUpdating }: PaginationType) {
  // Считаем количество страниц (всего)
  const totalPagesCount = Math.ceil(total / limit);

  // Определяем номер текущей страницы
  const currentPage = skip / limit + 1

  return (
    <div style={{display: 'flex', flexDirection: 'row', gap: '5px'}}>
      {[...Array(totalPagesCount)].map((_, index) => {
        return (
          <button
            disabled={isPageUpdating}
            onClick={() => {
              if(currentPage !== index + 1) {
                onPageSelect(index + 1)
              }
            }}
            style={{
            cursor: 'pointer',
            border: currentPage === index + 1 ? '1px solid red' : 'none',
          }}
            key={index}>{index + 1}
          </button>)}
        )
      }
    </div>
  )
}