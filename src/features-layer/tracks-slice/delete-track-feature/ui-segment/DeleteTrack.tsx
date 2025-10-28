import {
  useDeleteTrack
} from "@/features-layer/tracks-slice/delete-track-feature/modal-segment/useDeleteTrack.ts";

type Props = {
  trackId: string
}

export const DeleteTrack = ({trackId}: Props) => {
  const {isPending, mutate} = useDeleteTrack()

  const handleClick = () => {
    mutate({trackId})
  }

  return (
    <button disabled={isPending} onClick={handleClick}>
      delete track
    </button>
  );
};