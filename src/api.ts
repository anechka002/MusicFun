import type {TrackResponse, TracksResponse} from "@/types/types.ts";

export const api = {
  async getTracks(): Promise<TracksResponse> {
     const response = await fetch('https://musicfun.it-incubator.app/api/1.0/playlists/tracks', {
      headers: {
        'API-KEY': '2379558b-0188-43ee-9a39-5ee90ce1492e',
      },
    })
    return response.json();
  },
  async getTrack(trackId: string, signal?: AbortSignal): Promise<TrackResponse> {
    const response = await fetch(
      `https://musicfun.it-incubator.app/api/1.0/playlists/tracks/${trackId}`,
      {
        headers: {
          'API-KEY': '2379558b-0188-43ee-9a39-5ee90ce1492e',
        },
        signal: signal
      }
    )
    return response.json();
  }
}