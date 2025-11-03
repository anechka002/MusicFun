import {Track} from '../../../Track.tsx';
import {type ChangeEvent, useRef, useState} from "react";
import s from '../../../TraksList.module.css'
import {
  useTracksQuery
} from "@/widgest-layer/tracks-slice/model-segment/useTracksQuery.ts";
import {Search} from "@/shared-layer/ui-segment/Search.tsx";
import {Pagination} from "@/shared-layer/ui-segment/Pagination.tsx";
import {usePagination} from "@/shared-layer/utils/hooks/usePagination.ts";

type SortDirectionType =  "desc" | "asc" | undefined
type SortByType =  "publishedAt"| "likesCount"

type Props = {
  userId?: string;
  includeDrafts?: boolean;
}

export const TracksList = ({userId, includeDrafts}: Props) => {
  // console.log('TracksList')
  const {pageNumber, pageSize, setPageSize, setPageNumber} = usePagination()

  // ↕️ Направление сортировки (по убыванию/возрастанию)
  const [sortDirection, setSortDirection]= useState<SortDirectionType>('desc')
  // 🔤 Поле, по которому идёт сортировка (дата публикации или количество лайков)
  const [sortBy, setSortBy]= useState<SortByType>('publishedAt')
  // 🔍 Поисковая строка
  const [search, setSearch] = useState<string>('')

  // 🔁 Загружаем список треков через React Query с параметрами пагинации и сортировки
  const {isPending, isError, data: tracks, isFetching} = useTracksQuery({
    pageNumber,
    pageSize,
    sortDirection,
    sortBy,
    search,
    userId,
    includeDrafts
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

  // 📄 Изменение текущей страницы (при клике на номер страницы)
  // const handlePageSelect = (pageNumber: number) => {
  //   setPageNumber(pageNumber)
  // }

  // ⚙️ Флаг: контент устарел (React Query обновляет данные)
  // true → контент устарел, идёт обновление (например, пользователь переключил страницу)
  // const isPageContentUnactual = tracks.meta.page !== pageNumber
  const isPageContentUnactual = isFetching && !isPending

  // ⏳ Флаг: страница в процессе обновления (например, при смене страницы)
  // true → контент подгружается (для блокировки кнопок пагинации и визуальных эффектов)
  // const isPageUpdating = isFetching && !isPending

  // 🔢 Изменение количества элементов на странице
  const handlePageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPageSize(+e.currentTarget.value)
  }

  // ↕️ Изменение направления сортировки (asc / desc)
  const handleSortDirectionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortDirection(e.currentTarget.value as SortDirectionType)
  }

  // 🧭 Изменение поля сортировки (по дате / по лайкам)
  const handleSortByChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.currentTarget.value as SortByType)
  }

  // 🔍 Обработка нажатия кнопки "Search"
  const handleSearchClick = (value: string) => {
    setSearch(value)
  }

  return (
    <>
      <Search onSearch={handleSearchClick} isSearchButtonVisible={false} mode={'debounce'}/>
      
      <hr/>
      
      <select value={pageSize} onChange={handlePageSizeChange}>
        <option value="5">5 items</option>
        <option value="10">10 items</option>
        <option value="20">20 items</option>
      </select>

      <select value={sortDirection} onChange={handleSortDirectionChange}>
        <option value={'desc'}>desc</option>
        <option value={'asc'}>asc</option>
      </select>

      <select value={sortBy} onChange={handleSortByChange}>
        <option value={'publishedAt'}>publishedAt</option>
        <option value={'likesCount'}>likesCount</option>
      </select>

      <hr/>

      <Pagination total={tracks.meta.totalCount!}
                  skip={tracks.meta.pageSize * (pageNumber - 1)}
                  limit={tracks.meta.pageSize}
                  // onPageSelect={handlePageSelect}
                  onPageSelect={setPageNumber}
                  // isPageUpdating={isPageUpdating}
                  isPageUpdating={isFetching && !isPending}
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


