import {
  usePlaylists
} from "@/widgest-layer/playlists-slice/model-segment/usePlaylists.ts";
import {usePagination} from "@/shared-layer/utils/hooks/usePagination.ts";
import {Pagination} from "@/shared-layer/ui-segment/Pagination.tsx";
import {
  PlaylistsListItemCard
} from "@/entities/playlists/ui/PlaylistsListItemCard.tsx";

type Props = {
  userId?: string | undefined
}

export const PlaylistsList = ({userId}: Props) => {
  const {pageNumber, pageSize, setPageSize, setPageNumber } = usePagination()

  const {data, isFetching, isPending, isError} = usePlaylists({
    userId,
    pageSize,
    pageNumber
  })

  if (isPending || !data) return <div>Loading...</div>
  if (isError) return <div>Some error... <button>try again</button></div>

  return (
    <div>
      PlaylistsList {userId}
      <div style={{display: 'flex', gap: '30px', flexWrap: 'wrap'}}>
        {data.data.map(pl => <PlaylistsListItemCard key={pl.id} playlist={pl}/>)}
      </div>
      <Pagination total={data.meta.totalCount!}
                  skip={data.meta.pageSize * (pageNumber - 1)}
                  limit={data.meta.pageSize}
                  onPageSelect={setPageNumber}
                  isPageUpdating={isFetching && !isPending}
      />
    </div>
  );
};

