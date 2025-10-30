import {useMutation, useQueryClient} from "@tanstack/react-query";
import {storage} from "@/shared-layer/libs-segment/storage.ts";
import {client} from "@/shared-layer/api-segment/client.ts";

export const useLoginMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async({login, password}: {login: string, password: string}) => {
      storage.saveBasicCredentials(login, password)
      const wrapper = await client.GET('/auth/me')
      if(wrapper.error) {
        throw wrapper.error
      }
      return wrapper.data
    },
    onError: () => {
      storage.removeBasicCredentials()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['auth']
      })
    }
  })
}