import {z} from "zod";
import {type SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
  useUpdatePlaylistMutation
} from "@/features-layer/playlists-slice/create-playlist-feature/model-segment/useUpdatePlaylistMutation.ts";
import {usePlaylistQuery} from "@/entities/playlists/model/usePlaylistQuery.ts";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable(),
})

type SchemaUpdatePlaylistRequestPayload = z.infer<typeof schema>

export const UpdatePlaylistForm = ({playlistId}: {playlistId: string}) => {

  const { mutateAsync, isPending} = useUpdatePlaylistMutation()

  const {data, isPending: isPendingDetail, isError} = usePlaylistQuery(playlistId)

  const {
    register,
    handleSubmit,
    setError,
    formState: {errors}
  } = useForm<SchemaUpdatePlaylistRequestPayload>({
    resolver: zodResolver(schema)
  })

  if(isPendingDetail) return <div>Loading...</div>
  if(isError) return <div>some error...</div>

  const myHandleSubmit: SubmitHandler<SchemaUpdatePlaylistRequestPayload> = async (data) => {
    try {
      await mutateAsync({
        payload: {
          ...data,
          tagIds: []
        },
        playlistId
      })
    } catch {
      setError('title', {
        message: 'Title is required'
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(myHandleSubmit)}>
      <div>
        <input
          {...register('title')}
          defaultValue={data?.data.attributes.title}
        />
        {errors.title?.message && <span>{String(errors.title.message)}</span>}
      </div>
      <div>
        <input
          {...register('description')}
          defaultValue={data.data.attributes.description ?? ''}
        />
        {errors.description?.message && <span>{String(errors.description.message)}</span>}
      </div>
      <div>
        <button disabled={isPending} type={"submit"}>Update</button>
      </div>
    </form>
  );
};