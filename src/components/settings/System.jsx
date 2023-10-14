import { appWindow } from '@tauri-apps/api/window';
import { useEffect, useState } from 'react';
import { move_window, Position } from 'tauri-plugin-positioner-api';
import { exit, relaunch } from '@tauri-apps/api/process';
import { WebviewWindow } from '@tauri-apps/api/window';
import axios from 'axios';

function System() {
  const handleRefresh = () => {
    window.location.reload();
  };
  return (
    <div className="py-5 px-1">
      <button
        onClick={handleRefresh}
        className="tracking-tight font-medium rounded-lg !mr-2"
      >
        Refresh app
      </button>
      <button
        onClick={async () => relaunch}
        className="tracking-tight font-medium rounded-lg !mr-2"
      >
        Relaunch app
      </button>
      <button
        onClick={async () => exit()}
        className=" tracking-tight font-medium rounded-lg"
      >
        Quit app
      </button>
    </div>
  );
}

export default System;
