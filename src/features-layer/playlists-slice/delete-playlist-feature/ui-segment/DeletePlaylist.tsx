import {
  useDeletePlaylist
} from "../modal-segment/useDeletePlaylist.ts";

type Props = {
  playlistId: string
}

export const DeletePlaylist = ({playlistId}: Props) => {
  const {isPending, mutate} = useDeletePlaylist()

  const handleClick = () => {
    mutate({playlistId})
  }

  return (
    <button disabled={isPending} onClick={handleClick}>
      Delete
    </button>
  );
};