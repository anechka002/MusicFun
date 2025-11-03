import {useQuery} from "@tanstack/react-query";
import {client} from "@/shared-layer/api-segment/client.ts";
import type {
  SchemaGetPlaylistsRequestPayload
} from "@/shared-layer/api-segment/schema";

export const usePlaylists = (params: Partial<SchemaGetPlaylistsRequestPayload>) => {
  return useQuery({
    queryKey: ['playlists', 'list', params],
    queryFn: async () => {
      const clientData = await client.GET('/playlists', {
        params: {
          query: params
        }
      })
      return clientData.data
    }
  })
}