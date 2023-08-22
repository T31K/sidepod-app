import { useState, useEffect, useRef } from 'react';
import { Range, getTrackBackground } from 'react-range';
import { formatSecondsToMinutes } from '@/helpers/timeHelper';
import { getPlaybackInfo, goToPos } from '@/helpers/trackHelper';
const STEP = 1;
const MIN = 0;
const MAX = 100;

const ProgressBar = ({ rtl, isActive, currentTrack }) => {
  const [values, setValues] = useState([90]);
  const [currValue, setCurrValue] = useState(0);
  const [totalValue, setTotalValue] = useState(0);

  const handleGetPlaybackInfo = async () => {
    const playbackInfo = await getPlaybackInfo();
    const { currentPos, totalDuration } = playbackInfo;
    const sliderValue = (currentPos / totalDuration) * 100;
    setValues([Math.floor(sliderValue)]);
    setCurrValue([Math.floor(currentPos)]);
    setTotalValue(Math.floor(totalDuration));
  };

  useEffect(() => {
    let intervalId;
    if (isActive) intervalId = setInterval(handleGetPlaybackInfo, 1000);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isActive]);

  return (
    <div className="flex justify-center items-center w-[94%] gap-3">
      <div className="timestamp">{formatSecondsToMinutes(currValue)}</div>
      <Range
        values={values}
        step={STEP}
        rtl={rtl}
        onChange={(values) => setValues(values)}
        renderTrack={({ props, children }) => (
          <div
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            style={{
              ...props.style,
              height: '36px',
              display: 'flex',
              width: '100%',
            }}
          >
            <div
              ref={props.ref}
              style={{
                height: '5px',
                width: '100%',
                borderRadius: '4px',
                background: getTrackBackground({
                  values,
                  colors: ['#fff', '#333'],
                  min: MIN,
                  max: MAX,
                  rtl,
                }),
                alignSelf: 'center',
              }}
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({ props, isDragged }) => (
          <div
            {...props}
            style={{
              ...props.style,
              borderRadius: '4px',
              backgroundColor: '#FFF',
              opacity: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0px 2px 6px #AAA',
            }}
          ></div>
        )}
      />
      <div className="timestamp">{formatSecondsToMinutes(totalValue)}</div>
    </div>
  );
};

export default ProgressBar;
