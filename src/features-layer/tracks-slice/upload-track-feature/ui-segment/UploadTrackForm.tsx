import {
  useUploadTrack
} from "@/features-layer/tracks-slice/upload-track-feature/model-segment/useUploadTrack.ts";
import {z} from "zod";
import {type SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

const schema = z.object({
  title: z.string({message: 'Title is required'}).min(3),
  file: z.any()
  // file: z.instanceof(FileList).refine((files) => files.length > 0, { message: 'File is required' })
})
// type UploadTrackFormInputs = z.infer<typeof schema>
type UploadTrackFormInputs = {
  title: string
  file: FileList
}

export const UploadTrackForm = () => {

  const { mutateAsync, isPending} = useUploadTrack()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: {errors}
  } = useForm<UploadTrackFormInputs>({
    resolver: zodResolver(schema)
  })

  const myHandleSubmit: SubmitHandler<UploadTrackFormInputs> = async (inputs) => {
    try {
      const file = inputs.file[0]
      if(!file) {
        setError('file', { message: 'File is required' })
        return
      }
      await mutateAsync({...inputs, file})
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
          {...register('title', {required: true})}
        />
        {errors.title && <span>{errors.title.message}</span>}
      </div>
      <div>
        <input
          type={"file"}
          {...register('file')}
        />
        {errors.file?.message && <span>{String(errors.file.message)}</span>}
      </div>
      <div>
        <button disabled={isPending} type={"submit"}>Upload</button>
      </div>
    </form>
  );
};