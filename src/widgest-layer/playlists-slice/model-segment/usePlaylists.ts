import {useQuery} from "@tanstack/react-query";
import {client} from "@/shared-layer/api-segment/client.ts";
import type {
  SchemaGetPlaylistsRequestPayload
} from "@/shared-layer/api-segment/schema";
import type {Strict} from "@/shared-layer/utils/types/strict.ts";

type PlaylistsParams = Partial<SchemaGetPlaylistsRequestPayload>

export function usePlaylists<P extends PlaylistsParams> (params: Strict<PlaylistsParams, P>) {
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