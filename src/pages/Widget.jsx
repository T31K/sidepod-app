import { useHotkeys } from 'react-hotkeys-hook';
import { useEffect, useState, useRef } from 'react';

import ProgressBar from '@/components/ProgressBar';
import NextIcon from '@/components/buttons/NextIcon';
import PreviousIcon from '@/components/buttons/PreviousIcon.jsx';
import PlayPauseIcon from '@/components/buttons/PlayPauseIcon.jsx';

import { appWindow } from '@tauri-apps/api/window';
import { emit, listen } from '@tauri-apps/api/event';
import { move_window, Position } from 'tauri-plugin-positioner-api';

import { getToken } from '@/helpers/fileHelper';
import { debounce } from '@/helpers/timeHelper';
import { playTrack } from '@/helpers/trackHelper';

import { getNowPlaying, toggleButton } from '@/helpers/trackHelper.js';
import { NEW_SPOTIFY_API, NEW_CURRENT_TRACK } from '@/helpers/stateHelper';

function Widget({ localInitData: parentInitData }) {
  const [currentTrack, setCurrentTrack] = useState(NEW_CURRENT_TRACK);
  const [spotifyApi, setSpotifyApi] = useState(NEW_SPOTIFY_API);

  const itemRefs = useRef([]);
  const mainRef = useRef(null);
  const inputRef = useRef(null);
  const sectionRef = useRef(null);

  const [items, setItems] = useState([]);
  const [searchVal, setSearchVal] = useState('');
  const [tokenTime, setTokenTime] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const [isActive, setIsActive] = useState(false);
  const [songActive, setSongActive] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchResultActive, setSearchResultActive] = useState(false);

  // SCROLL
  useHotkeys(
    ['down'],
    () => {
      setActiveIndex((prevActiveIndex) =>
        prevActiveIndex < items.length - 1 ? prevActiveIndex + 1 : items.length - 1
      );
    },
    { preventDefault: true, enableOnFormTags: ['INPUT'] }
  );

  useHotkeys(
    ['up'],
    () => {
      setActiveIndex((prevActiveIndex) => (prevActiveIndex > 0 ? prevActiveIndex - 1 : 0));
    },
    { preventDefault: true, enableOnFormTags: ['INPUT'] }
  );

  useHotkeys(
    ['escape'],
    () => {
      if (mainRef.current.clientHeight == 465 || mainRef.current.clientHeight == 150) {
        setItems([]);
        setSearchActive(false);
        setIsActive(false);
      }
    },
    { preventDefault: true, enableOnFormTags: ['INPUT'] }
  );

  useHotkeys(
    ['enter'],
    () => {
      let { uri } = items[activeIndex];
      playTrack(uri);
    },
    { preventDefault: true, enableOnFormTags: ['INPUT'] }
  );

  useEffect(() => {
    initListener();
    localGetToken();
    move_window(Position.TopRight);
    const interval = setInterval(async () => {
      const track = await getNowPlaying();
      setCurrentTrack(track);
    }, 900);
    return async () => {
      clearInterval(interval);
    };
  }, []);

  // WATCHERS
  useEffect(() => {
    if (items.length == 0) setSearchResultActive(false);
    else setSearchResultActive(true);
  }, [items]);

  useEffect(() => {
    if (isActive) {
      handleRefreshIfRequired();
      appWindow.show();
      appWindow.setFocus();
      appWindow.setIgnoreCursorEvents(false);
    } else {
      appWindow.setIgnoreCursorEvents(true);
      emit('updateState:Widget', { isMiniActive: true });
    }
  }, [isActive]);

  useEffect(() => {
    const el = sectionRef.current;
    const activePage = Math.ceil((activeIndex + 1) / 5) - 1;

    el.scrollTo({
      top: activePage * 250,
      behavior: 'smooth',
    });
  }, [activeIndex]);

  useEffect(() => {
    if (!searchActive) {
      setItems([]);
      setSearchVal('');
    }
  }, [searchActive]);

  useEffect(() => {
    if (searchResultActive) {
      // appWindow.setSize(new LogicalSize(380, 480));
    }
  }, [searchResultActive]);

  useEffect(() => {
    if (searchVal !== '') {
      if (!searchActive) {
        setSearchActive(true);
        setSearchResultActive(true);
      }
    }
  }, [searchVal]);

  // useEffect(() => {
  //   let openTimer, closeTimer;

  //   if (songActive) {
  //     appWindow.show();
  //     appWindow.setIgnoreCursorEvents(false);

  //     // Reset the timer if there's a pending song change
  //     if (pendingSongChange) {
  //       clearTimeout(openTimer);
  //       setPendingSongChange(false); // Reset the pending flag
  //     }

  //     // Automatically set songActive to false after 2 seconds
  //     openTimer = setTimeout(() => {
  //       setSongActive(false);
  //     }, 2800);
  //   } else {
  //     emit('updateState:Widget', { isMiniActive: true });

  //     // After 1 second (or however long your closing animation is), check for pending changes
  //     closeTimer = setTimeout(() => {
  //       appWindow.hide();
  //       appWindow.setIgnoreCursorEvents(true);
  //       setIsAnimating(false); // End animation

  //       if (pendingSongChange) {
  //         setPendingSongChange(false);
  //         setSongActive(true);
  //       }
  //     }, 1200);
  //   }

  //   return () => {
  //     clearTimeout(openTimer);
  //     clearTimeout(closeTimer);
  //   };
  // }, [songActive, pendingSongChange]);

  const initListener = async () => {
    const unlisten = await listen('updateState:Mini', async (event) => {
      let { trigger } = event?.payload;
      if (trigger == 'click') {
        if (!isActive) {
          setIsActive(true);
          setSongActive(false);
        }
      }
    });
  };

  const localGetToken = async () => {
    const { token, token_time } = await getToken();

    if (token) {
      spotifyApi.setAccessToken(token);
      setTokenTime(token_time);
    }
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchVal(value);
    if (value === '') {
      debouncedSearch.cancel();
      setItems([]);
    } else {
      debouncedSearch(value);
    }
  };

  const handleImgClick = () => {
    setSearchResultActive(false);
    setSearchActive(false);
    setIsActive(false);
  };

  const handleSearchActive = () => {
    setSearchActive(!searchActive);
    if (searchResultActive) {
      setItems([]);
    }
  };

  const handleRefreshIfRequired = async () => {
    if (isTokenExpiring()) {
      console.log('token is expiring');
      await parentInitData();
      await localGetToken();
    } else {
      console.log('token all good, no action needed');
    }
  };
  const handleBlur = async () => {
    setTimeout(() => {
      const inputElement = inputRef.current;
      inputElement.focus();
      inputElement.setSelectionRange(inputElement.value.length, inputElement.value.length);
    }, 0);
  };

  const isTokenExpiring = () => {
    const currentTime = Date.now();
    const FIFTY_MINUTES_IN_MS = 50 * 60 * 1000;

    return currentTime - tokenTime > FIFTY_MINUTES_IN_MS;
  };

  const debouncedSearch = debounce(async (searchValue) => {
    try {
      const data = await spotifyApi.searchTracks(searchValue);
      let { items } = data?.body?.tracks;
      setActiveIndex(0);
      setItems(items);
      setSearchResultActive(true);
    } catch (err) {
      console.error(err);
    }
  }, 400);

  return (
    <>
      <main
        ref={mainRef}
        className={`bg-black rounded-[25px] ${isActive && 'active'} ${songActive && 'songActive'} ${
          searchActive && 'searchActive'
        } ${searchResultActive && 'searchResultActive'} `}
      >
        <div className="">
          <div className="flex gap-4">
            <img
              src={currentTrack.album}
              alt=""
              className="main select-none cursor-default "
              onClick={handleImgClick}
            />
            <div className="w-full flex">
              <div className="mb-2 ">
                <div
                  className={`text-white title select-none cursor-default truncate text-left ${
                    isActive || songActive ? 'show' : 'hide'
                  }`}
                >
                  {currentTrack.name?.length > 30 ? `${currentTrack.name.substring(0, 27)}...` : currentTrack.name}
                </div>
                <div
                  className={`artist text-gray-200 select-none cursor-default  text-left ${
                    isActive || songActive ? 'show' : 'hide'
                  }`}
                >
                  {currentTrack.artist?.length > 32
                    ? `${currentTrack.artist.substring(0, 27)}...`
                    : currentTrack.artist}
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

        <div
          className={`flex items-center controls items-center justify-center gap-7 mt-[-5px] ${
            isActive ? 'show' : 'hide'
          } `}
        >
          <div>
            <i
              className={`ri-arrow-down-s-line arrow mr-4 mt-2 ${searchActive ? 'rotate-up' : 'rotate-down'}`}
              onClick={handleSearchActive}
            ></i>
          </div>
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
          <div>
            <i className="ri-arrow-down-s-line arrow ml-4 mt-2 invisible "></i>
          </div>
        </div>

        <div className={`${searchActive ? 'show' : 'hide'}`}>
          <div className="relative">
            <input
              type="text"
              className="searchBar"
              spellCheck={false}
              value={searchVal}
              onBlur={handleBlur}
              ref={inputRef}
              onChange={(e) => handleSearch(e)}
              autoFocus
            />
            <i className="ri-search-line absolute top-[26px] left-[12px] text-sm"></i>
          </div>
          <div
            className="overflow-y-scroll overflow-x-hidden h-[250px]"
            ref={sectionRef}
          >
            {items?.map((item, index) => (
              <div
                key={index}
                className={activeIndex !== index ? 'item' : 'item active'}
                ref={(el) => (itemRefs.current[index] = el)}
                onClick={() => playTrack(item.uri)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <div className="flex gap-3">
                  <img
                    src={item?.album?.images[0]?.url}
                    alt=""
                    className="ml-2"
                  />
                  <div className="flex flex-col justify-center">
                    <div className="titleAlt">
                      {item?.name.length > 20 ? item?.name.substring(0, 25) + '...' : item?.name}
                    </div>
                    <div className="artistAlt">
                      {item?.artists[0]?.name.length > 20
                        ? item?.artists[0]?.name.substring(0, 17) + '...'
                        : item?.artists[0]?.name}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

export default Widget;
