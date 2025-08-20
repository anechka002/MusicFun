import { useEffect, useState } from 'react';
import type { TrackDataItem } from './types/types';

export function App() {
  const [tracks, setTracks] = useState<TrackDataItem[]>([]);

  useEffect(() => {
    // rest api
    fetch('https://musicfun.it-incubator.app/api/1.0/playlists/tracks', {
      headers: {
        'API-KEY': '2379558b-0188-43ee-9a39-5ee90ce1492e',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setTracks(data.data)
      });
  }, []);

  const trackElement = tracks.map((track, index) => (
    <li key={index}>
      <h5>{track.attributes.title}</h5>
      <audio src={track.attributes.attachments[0].url} controls={true}></audio>
    </li>
  ));

  return <ul>{trackElement}</ul>;
}
