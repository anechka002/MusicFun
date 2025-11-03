import {z} from "zod";
import {type SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
  useUploadPlaylistCover
} from "@/features-layer/playlists-slice/upload-playlist-cover-feature/model-segment/useUploadPlaylistCover.ts";

const schema = z.object({
  file: z.any()
})

type UploadPlaylistCoverFormInputs = {
  file: FileList
}

type Props = {
  playlistId: string
}

export const UploadPlaylistCoverForm = ({playlistId}: Props) => {

  const { mutateAsync, isPending} = useUploadPlaylistCover()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: {errors}
  } = useForm<UploadPlaylistCoverFormInputs>({
    resolver: zodResolver(schema)
  })

  const myHandleSubmit: SubmitHandler<UploadPlaylistCoverFormInputs> = async (inputs) => {
    try {
      const file = inputs.file[0]
      if(!file) {
        setError('file', { message: 'File is required' })
        return
      }
      await mutateAsync({playlistId, file})
      reset()
    } catch {
      setError('file', {
        message: 'Title and File is required'
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(myHandleSubmit)}>
      <div>
        <input
          type={"file"}
          {...register('file')}
        />
        {errors.file?.message && <span>{String(errors.file.message)}</span>}
      </div>
      <div>
        <button disabled={isPending} type={"submit"}>Upload Cover</button>
      </div>
    </form>
  );
};