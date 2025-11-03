import {useMutation, useQueryClient} from "@tanstack/react-query";
import {client} from "@/shared-layer/api-segment/client.ts";

export const useDeleteTrack = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({trackId}:{trackId: string}) => {
      const wrapper = await client.DELETE(`/playlists/tracks/{trackId}`, {
        params: {
          path: {
            trackId: trackId
          }
        },
      })

      // if(wrapper.error) {
      //   throw wrapper.error
      // }
      return wrapper.data
    },
    onSuccess: () => {
      const promise = queryClient.invalidateQueries({queryKey: ["tracksList"]})
      // если вернуть промис, то мутация будет считаться завершенной
      // только тогда когда данный промис зарезолвится,
      // а он зарезолвится когда client обновит все кеши
      return promise
    }
  })
}