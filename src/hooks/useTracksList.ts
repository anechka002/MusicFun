import {useEffect, useState} from "react";
import type {TrackDataItem} from "@/types/types.ts";
import {api} from "@/api.ts";

export const useTracksList = () => {

  const [tracks, setTracks] = useState<TrackDataItem[]>([]);
  const [listQueryStatus, setListQueryStatus] = useState<'loading' | 'success' | 'error' | 'idle'>('idle');

  useEffect(() => {
    setListQueryStatus('loading');

    api.getTracks()
      .then((data) => {
        // console.log(data);
        setTracks(data.data);
        setListQueryStatus('success');
      });
  }, []);

  return {tracks, listQueryStatus}
}