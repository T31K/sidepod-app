import { useEffect, useState } from 'react';
import { getNowPlaying, toggleButton } from '@/helpers/trackHelper.js';

import PlayPauseIcon from '@/components/buttons/PlayPauseIcon.jsx';
import PreviousIcon from '@/components/buttons/PreviousIcon.jsx';
import NextIcon from '@/components/buttons/NextIcon';
import ProgressBar from '@/components/ProgressBar';
import { appWindow } from '@tauri-apps/api/window';
import { move_window, Position } from 'tauri-plugin-positioner-api';
import { emit, listen } from '@tauri-apps/api/event';

function Widget() {
  const [currentTrack, setCurrentTrack] = useState({
    name: 'Never Gonna Give You Up',
    artist: 'Rick Astley',
    album: 'https://images.placeholders.dev/?width=100&height=100&bgColor=%23000&textColor=rgba(255,255,255,0.5)',
    repeat: false,
    shuffle: false,
    state: '',
  });

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    initListener();
    move_window(Position.TopRight);
    const interval = setInterval(async () => {
      const track = await getNowPlaying();
      setCurrentTrack(track);
    }, 900);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isActive) {
      appWindow.show();
      appWindow.setIgnoreCursorEvents(false);
    } else {
      emit('updateState:Widget', { isMiniActive: true });
      setTimeout(() => {
        appWindow.hide();
        appWindow.setIgnoreCursorEvents(true);
      }, 1000);
    }
  }, [isActive]);

  const initListener = async () => {
    const unlisten = await listen('updateState:Mini', (event) => {
      let { payload } = event;
      setIsActive(payload.isWidgetActive);
    });
  };

  return (
    <>
      <main className={`bg-black rounded-[25px] ${isActive && 'active'}`}>
        <div className="">
          <div className="flex gap-4">
            <img
              src={currentTrack.album}
              alt=""
              className="select-none cursor-default "
              onClick={() => setIsActive(!isActive)}
            />
            <div className="w-full flex">
              <div className="mb-2 ">
                <div
                  className={`text-white title select-none cursor-default truncate text-left ${
                    isActive ? 'show' : 'hide'
                  }`}
                >
                  {currentTrack.name}
                </div>
                <div
                  className={`artist text-gray-200 select-none cursor-default  text-left ${isActive ? 'show' : 'hide'}`}
                >
                  {currentTrack.artist}{' '}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`w-[100%] flex text-white justify-center gap-2 ${isActive ? 'show' : 'hide'}`}>
          <ProgressBar
            isActive={isActive}
            currentTrack={currentTrack}
          />
        </div>

        <div className={`flex items-center controls justify-center gap-7 mt-[-5px] ${isActive ? 'show' : 'hide'} `}>
          <PreviousIcon
            onClick={() => toggleButton('previous')}
            className="w-[24px]"
          />
          <PlayPauseIcon
            isPlaying={currentTrack?.state?.includes('playing')}
            onClick={() => toggleButton('next')}
          />
          <NextIcon
            className="w-[25px]"
            onClick={() => toggleButton('next')}
          />
        </div>
      </main>
    </>
  );
}

export default Widget;
