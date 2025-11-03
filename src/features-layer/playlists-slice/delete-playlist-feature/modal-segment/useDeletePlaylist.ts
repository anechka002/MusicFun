import {useMutation, useQueryClient} from "@tanstack/react-query";
import {client} from "@/shared-layer/api-segment/client.ts";

export const useDeletePlaylist = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({playlistId}:{playlistId: string}) => {
      const wrapper = await client.DELETE('/playlists/{playlistId}', {
        params: {
          path: {
            playlistId: playlistId
          }
        },
      })
      //
      // if(wrapper.error) {
      //   throw wrapper.error
      // }
      return wrapper.data
    },
    onSuccess: () => {
      const promise = queryClient.invalidateQueries({queryKey: ["playlists"]})
      // если вернуть промис, то мутация будет считаться завершенной
      // только тогда когда данный промис зарезолвится,
      // а он зарезолвится когда client обновит все кеши
      return promise
    }
  })
}