import { useEffect, useState } from 'react';
import { getNowPlayingAlbumOnly } from '@/helpers/trackHelper.js';

import LoveIcon from '@/components/buttons/LoveIcon.jsx';
import PlayPauseIcon from '@/components/buttons/PlayPauseIcon.jsx';
import PreviousIcon from '@/components/buttons/PreviousIcon.jsx';
import NextIcon from '@/components/buttons/NextIcon';
import ProgressBar from '@/components/ProgressBar';
import { appWindow } from '@tauri-apps/api/window';
import { move_window, Position } from 'tauri-plugin-positioner-api';
import { emit, listen } from '@tauri-apps/api/event';

const NEW_ALBUM =
  'https://images.placeholders.dev/?width=100&height=100&bgColor=%23fff&textColor=rgba(255,255,255,0.5)';
function Mini() {
  const [currentAlbum, setCurrentAlbum] = useState(NEW_ALBUM);
  const [isMiniActive, setMiniActive] = useState(true);
  // const [isFirstLaunch, setIsFirstLaunch] = useState(0);

  useEffect(() => {
    initListener();
    move_window(Position.TopRight);
    const interval = setInterval(async () => {
      const artwork = await getNowPlayingAlbumOnly();
      setCurrentAlbum(artwork);
    }, 900);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isMiniActive) {
    } else {
      emit('updateState:Mini', { isWidgetActive: true });
    }
  }, [isMiniActive]);

  // useEffect(() => {
  //   if (isFirstLaunch <= 1) {
  //     setIsFirstLaunch(isFirstLaunch + 1);
  //   } else {
  //   }
  // }, [currentAlbum]);

  const initListener = async () => {
    const unlisten = await listen('updateState:Widget', (event) => {
      let { payload } = event;
      setMiniActive(payload.isMiniActive);
    });
  };

  return (
    <>
      <div className="mini flex items-center justify-center ">
        <img
          src={currentAlbum}
          alt="test"
          className="select-none cursor-default "
          onClick={() => setMiniActive(!isMiniActive)}
        />
      </div>
    </>
  );
}

export default Mini;
