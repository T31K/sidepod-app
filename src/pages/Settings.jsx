import { appWindow } from '@tauri-apps/api/window';
import { useEffect, useState } from 'react';
import { move_window, Position } from 'tauri-plugin-positioner-api';
import { tabs } from '../helpers/tabHelper';
import { exit, relaunch } from '@tauri-apps/api/process';

import Customization from '../components/settings/Customization';
import Premium from '../components/settings/Premium';
import System from '../components/settings/System';
import Update from '../components/settings/Update';
import Login from '../components/settings/Login';

function Settings({ userHash, userEmail, isPremium, isAuth }) {
  const [route, setRoute] = useState('Login');

  return (
    <div
      className="h-[450px] w-screen rounded-xl"
      id="settings"
    >
      <div
        className="topBar rounded-t-xl  p-2.5 flex justify-between items-center"
        data-tauri-drag-region
      >
        <div className="flex gap-2">
          <div
            className="w-[13px] h-[13px] rounded-full bg-red-500 active:bg-red-700"
            onClick={async () => appWindow.hide()}
          ></div>
          <div
            className="w-[13px] h-[13px] rounded-full bg-yellow-500"
            onClick={() => move_window(Position.Center)}
          ></div>
          <div className="w-[13px] h-[13px] rounded-full bg-green-500"></div>
        </div>
      </div>
      <div className="flex h-full">
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
            {(() => {
              if (route === 'Customization') {
                return <Customization />;
              } else if (route === 'System') {
                return (
                  <System
                    exit={exit}
                    relaunch={relaunch}
                  />
                );
              } else if (route === 'Login') {
                return (
                  <Login
                    userHash={userHash}
                    isAuth={isAuth}
                    isPremium={isPremium}
                  />
                );
              } else if (route === 'Update') {
                return <Update />;
              } else {
                return (
                  <Premium
                    isPremium={isPremium}
                    userHash={userHash}
                    userEmail={userEmail}
                  />
                );
              }
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
