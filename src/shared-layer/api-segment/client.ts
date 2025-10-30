import createClient, {type Middleware} from "openapi-fetch";
import type {paths} from "@/shared-layer/api-segment/schema";
import {storage} from "@/shared-layer/libs-segment/storage.ts";

export const client = createClient<paths>({ baseUrl: "https://musicfun.it-incubator.app/api/1.0/" });

const myMiddleware: Middleware = {
  async onRequest({ request }) {
    request.headers.set('API-KEY', '2379558b-0188-43ee-9a39-5ee90ce1492e');
    const creds = storage.getBasicCredentials()
    if(creds) {
      const encoded = btoa(`${creds.login}:${creds.password}`)
      request.headers.set('Authorization', `Basic ${encoded}`);
    }
    return request;
  },
};

client.use(myMiddleware)

// const encoded = btoa('anechka002:MasteR!123')