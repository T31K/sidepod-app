import { appWindow } from '@tauri-apps/api/window';
import { useEffect, useState } from 'react';
import { move_window, Position } from 'tauri-plugin-positioner-api';
import { tabs } from '../helpers/tabHelper';
import { exit, relaunch } from '@tauri-apps/api/process';

function Settings() {
  useEffect(() => {
    // move_window(Position.Center);
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
      <div className="topBar rounded-t-xl  p-2.5 flex justify-between items-center">
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
          <div>
            {route == 'Customization' ? (
              <div className="py-5 px-2">
                <div>
                  <div className="tracking-tight mb-2">Position</div>
                  <div className="flex h-[130px] gap-2 hover:cursor-pointer">
                    <div className="w-[50%] bg-custom-gray rounded-lg p-2">
                      <div className="w-[20px] h-[20px] bg-gray-400 rounded-md"></div>
                    </div>
                    <div className="w-[50%] bg-custom-gray rounded-lg p-2 flex justify-end">
                      <div className="w-[20px] h-[20px] bg-gray-400 rounded-md"></div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="tracking-tight leading-none mb-2 mt-6">Color Scheme</div>
                  <div className="flex gap-2 hover:cursor-pointer">
                    <div className="bg-custom-gray px-3 py-2 rounded-lg tracking-tight font-medium">Light Mode</div>
                    <div className="bg-custom-gray active px-3 py-2 rounded-lg tracking-tight font-medium">
                      Dark Mode
                    </div>
                    <div className="bg-custom-gray px-3 py-2 rounded-lg tracking-tight font-medium">System</div>
                  </div>
                </div>
              </div>
            ) : route == 'System' ? (
              <div className="py-5 px-1">
                <button
                  onClick={async () => exit()}
                  className="!mr-2 tracking-tight font-medium rounded-lg"
                >
                  Quit app
                </button>
                <button
                  onClick={async () => relaunch()}
                  className="tracking-tight font-medium rounded-lg"
                >
                  Restart app
                </button>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
