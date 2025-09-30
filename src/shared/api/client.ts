import createClient, {type Middleware} from "openapi-fetch";
import type {paths} from "@/shared/api/schema";

export const client = createClient<paths>({ baseUrl: "https://musicfun.it-incubator.app/api/1.0/" });

const myMiddleware: Middleware = {
  async onRequest({ request }) {
    request.headers.set('API-KEY', '2379558b-0188-43ee-9a39-5ee90ce1492e');
    return request;
  },
};

client.use(myMiddleware)