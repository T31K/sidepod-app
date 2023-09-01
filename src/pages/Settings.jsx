import { appWindow } from '@tauri-apps/api/window';
import { useEffect, useState } from 'react';
import { move_window, Position } from 'tauri-plugin-positioner-api';
import { tabs } from '../helpers/tabHelper';

function Settings() {
  useEffect(() => {
    move_window(Position.Center);
  }, []);

  const [route, setRoute] = useState('Customization');

  const handleClose = async () => {
    await appWindow.hide();
  };
  return (
    <div
      className="h-screen w-screen rounded-xl"
      id="settings"
    >
      <div
        className="topBar rounded-t-xl  p-2.5 flex justify-between items-center"
        data-tauri-drag-region
      >
        <div className="flex gap-2">
          <div
            className="w-[13px] h-[13px] rounded-full bg-red-500 active:bg-red-700"
            onClick={handleClose}
          ></div>
          <div
            className="w-[13px] h-[13px] rounded-full bg-yellow-500"
            onClick={() => move_window(Position.Center)}
          ></div>
          <div className="w-[13px] h-[13px] rounded-full bg-green-500 "></div>
        </div>
      </div>
      <div className="flex h-full ">
        <div className="sideBar gap-2">
          {tabs.map((tab, key) => (
            <i
              className={`ri-${tab.name}-line text-2xl ${route == tab.label ? 'active' : ''}`}
              onClick={() => setRoute(tab.label)}
              key={key}
            ></i>
          ))}
        </div>
        <div className="w-[70%] p-3">
          <div className="breadcrumb">
            <div className="pill">{route}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
