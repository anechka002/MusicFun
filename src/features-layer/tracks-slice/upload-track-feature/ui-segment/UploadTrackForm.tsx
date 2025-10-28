import type {FormEvent} from "react";
import {
  useUploadTrack
} from "@/features-layer/tracks-slice/upload-track-feature/model-segment/useUploadTrack.ts";

export const UploadTrackForm = () => {

  const { mutate, isError, error, isPending} = useUploadTrack()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget
    const formData = new FormData(form)
    const values = Object.fromEntries(formData.entries())

    mutate(values as any, {
      onSuccess: () => {
        form.reset()
      }
    })

    console.log('submit')
  }
  return (
    <form onSubmit={handleSubmit}>
      {/*isIdle: {isIdle ? 'true' : 'false'}*/}
      {/*isPending: {isPending ? 'true' : 'false'}*/}
      {isError && <div style={{color: 'red'}}>{JSON.stringify(error)}</div>}
      <div>
        <input
          type="text"
          name={'title'}
        />
      </div>
      <div>
        <input
          type="file"
          name={'file'}
        />
      </div>
      <div>
        <button disabled={isPending} type={"submit"}>Upload</button>
      </div>
    </form>
  );
};