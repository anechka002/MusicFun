import {useQuery} from "@tanstack/react-query";
import {client} from "@/shared-layer/api-segment/client.ts";

export const useMeQuery = () => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const wrapper = await client.GET('/auth/me')
      return wrapper.data
    },
    retry: false
  })
}