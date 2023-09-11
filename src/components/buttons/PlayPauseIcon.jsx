import { getNowPlaying, toggleButton } from '@/helpers/trackHelper.js';

function PlayPauseIcon({ isPlaying }) {
  return isPlaying ? (
    <div onClick={() => toggleButton('playpause')}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="33"
        height="40"
        viewBox="0 0 33 40"
        fill="none"
        className="w-[25px]"
      >
        <path
          d="M7.19922 35.7256H11.4297C13.0439 35.7256 13.8975 34.8721 13.8975 33.2393V7.96777C13.8975 6.2793 13.0439 5.5 11.4297 5.5H7.19922C5.58496 5.5 4.73145 6.35352 4.73145 7.96777V33.2393C4.73145 34.8721 5.58496 35.7256 7.19922 35.7256ZM20.6885 35.7256H24.9004C26.5332 35.7256 27.3682 34.8721 27.3682 33.2393V7.96777C27.3682 6.2793 26.5332 5.5 24.9004 5.5H20.6885C19.0557 5.5 18.2021 6.35352 18.2021 7.96777V33.2393C18.2021 34.8721 19.0557 35.7256 20.6885 35.7256Z"
          fill="white"
        />
      </svg>
    </div>
  ) : (
    <div onClick={() => toggleButton('playpause')}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="20"
        viewBox="0 0 14 16"
        fill="none"
        className="w-[25px]"
      >
        <path
          d="M1.54687 15.7809C1.91819 15.7809 2.2473 15.6544 2.66925 15.4096L12.6862 9.60366C13.4373 9.17328 13.7749 8.8104 13.7749 8.22812C13.7749 7.65427 13.4373 7.2914 12.6862 6.85258L2.66925 1.04661C2.2473 0.801877 1.91819 0.675293 1.54687 0.675293C0.812689 0.675293 0.26416 1.2407 0.26416 2.14366V14.3126C0.26416 15.224 0.812689 15.7809 1.54687 15.7809Z"
          fill="white"
        />
      </svg>{' '}
    </div>
  );
}

export default PlayPauseIcon;
