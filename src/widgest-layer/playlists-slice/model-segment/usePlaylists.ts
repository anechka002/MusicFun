import {useQuery} from "@tanstack/react-query";
import {client} from "@/shared-layer/api-segment/client.ts";

export const usePlaylists = (userId?: string) => {
  return useQuery({
    queryKey: ['playlists', userId],
    queryFn: async () => {
      const clientData = await client.GET('/playlists', {
        params: {
          query: {
            userId: userId,
          }
        }
      })
      return clientData.data
    }
  })
}