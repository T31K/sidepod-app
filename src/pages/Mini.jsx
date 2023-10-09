import { useEffect, useState } from 'react';
import { getNowPlayingAlbumOnly } from '@/helpers/trackHelper.js';

import { appWindow } from '@tauri-apps/api/window';
import { emit, listen } from '@tauri-apps/api/event';
import { move_window, Position } from 'tauri-plugin-positioner-api';
import { register, isRegistered, unregisterAll } from '@tauri-apps/api/globalShortcut';

const NEW_ALBUM =
  'https://images.placeholders.dev/?width=100&height=100&bgColor=%23fff&textColor=rgba(255,255,255,0.5)';
function Mini() {
  const [currentAlbum, setCurrentAlbum] = useState(NEW_ALBUM);

  useEffect(() => {
    preFlightChecks();
    const interval = setInterval(async () => {
      const artwork = await getNowPlayingAlbumOnly();
      setCurrentAlbum(artwork);
    }, 900);

    return async () => {
      unregisterAll();
      clearInterval(interval);
    };
  }, []);

  // useEffect(() => {
  //   if (isFirstLaunch <= 1) {
  //     setIsFirstLaunch(isFirstLaunch + 1);
  //   } else {
  //     emit('updateState:Mini', { trigger: 'songChange' });
  //   }
  // }, [currentAlbum]);

  const preFlightChecks = async () => {
    move_window(Position.TopRight);
    registerShortcuts();

    const unlisten = await listen('updateState:Widget', (event) => {
      let { payload } = event;
    });
  };

  const handleClick = (e) => {
    e?.stopPropagation();
    emit('updateState:Mini', { trigger: 'click' });
  };

  const registerShortcuts = async () => {
    const registered = await isRegistered('CommandOrControl+Shift+Space');
    console.log(registered);
    if (!registered) {
      await register('CommandOrControl+Shift+Space', () => {
        emit('updateState:Mini', { trigger: 'click' });
      });
    }
  };

  return (
    <>
      <div className="mini flex items-center justify-center">
        <img
          src={currentAlbum}
          alt="test"
          className="select-none cursor-default w-[55px] h-[55px] rounded-[13px]"
          onClick={(e) => handleClick(e)}
        />
      </div>
    </>
  );
}

export default Mini;
