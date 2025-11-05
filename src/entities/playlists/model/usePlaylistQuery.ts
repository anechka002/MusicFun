import {useQuery} from "@tanstack/react-query";
import {client} from "@/shared-layer/api-segment/client.ts";

export const usePlaylistQuery = (playlistId: string) => {
  return useQuery({
    queryKey: ['playlists', 'detail', playlistId],
    queryFn: async () => {
      const clientData = await client.GET('/playlists/{playlistId}', {
        params: {
          path: {
            playlistId: playlistId
          },
        }
      });
      return clientData.data!
    },
    enabled: !!playlistId, // <-- Запускаем запрос только если ID не пустой
  })
}