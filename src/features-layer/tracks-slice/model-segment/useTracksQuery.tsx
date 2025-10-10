import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {client} from "@/shared-layer/api-segment/client.ts";
import type {SchemaGetTracksRequestPayload} from "@/shared-layer/api-segment/schema";

export function useTracksQuery(params: Partial<SchemaGetTracksRequestPayload>) {
  return useQuery({
    queryKey: ['tracksList', {params}],
    queryFn: async () => {
      const clientData = await client.GET('/playlists/tracks', {
        params: {
          query: params,
          // можно передавать по одному параметру
          // query: {
          //   pageSize: pageSize, // колличество треков // LIMIT
          //   pageNumber: pageNumber, // страница // 1
          // }
        }
      });
      return clientData.data!
    },
    placeholderData: keepPreviousData, // временно показывай и сохраняй предыдущие данные
  });
}