import {z} from "zod";
import {type SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import { useCreatePlaylistMutation } from "../../update-playlist-feature/model-segment/useCreatePlaylistMutation";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable(),
})

type CreatePlaylistFormInputs = z.infer<typeof schema>

export const CreatePlaylistForm = () => {

  const { mutateAsync, isPending} = useCreatePlaylistMutation()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: {errors}
  } = useForm<CreatePlaylistFormInputs>({
    resolver: zodResolver(schema)
  })

  const myHandleSubmit: SubmitHandler<CreatePlaylistFormInputs> = async (inputs) => {
    try {
      await mutateAsync(inputs)
      reset()
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
          type={"title"}
          {...register('title')}
        />
        {errors.title?.message && <span>{String(errors.title.message)}</span>}
      </div>
      <div>
        <input
          type={"description"}
          {...register('description')}
        />
        {errors.description?.message && <span>{String(errors.description.message)}</span>}
      </div>
      <div>
        <button disabled={isPending} type={"submit"}>Create</button>
      </div>
    </form>
  );
};