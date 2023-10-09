import axios from 'axios';

import { useEffect, useState } from 'react';
import { emit } from '@tauri-apps/api/event';

import { authUrl } from '@/helpers/URLHelper.js';
import { getVersion } from '@tauri-apps/api/app';

function Update() {
  const [currVersion, setCurrVersion] = useState(null);
  const [latestVersion, setLatestVersion] = useState(null);

  const handleUpdate = async () => {
    await emit('tauri://update');
  };

  useEffect(() => {
    getCurrVersion();
    getLatestVersion();
  });

  const getCurrVersion = async () => {
    const version = await getVersion();
    setCurrVersion(version);
  };

  const getLatestVersion = async () => {
    try {
      const response = await axios.get(`https://api.github.com/repos/t31k/sidepod/releases/latest`);
      const latestRelease = response.data;
      const latestVersion = latestRelease.tag_name;
      setLatestVersion(latestVersion);
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const isLatestVersion = () => {
    return latestVersion == currVersion;
  };

  return (
    <div className="py-3 px-2">
      <div className="flex items-center mb-4">
        <div className="tracking-tight font-bold mr-2">Version {currVersion}</div>
        <div
          className={`rounded-full tracking-tight text-xs text-stone-700 py-0.5 font-semibold !m-0 px-2 ${
            isLatestVersion() ? 'bg-green-400' : 'bg-red-400'
          }`}
        >
          {isLatestVersion() ? 'Updated' : 'Not Updated'}
        </div>
      </div>

      <button
        className={`rounded-lg ${isLatestVersion() ? 'opacity-50' : 'opacity-100'}`}
        onClick={handleUpdate}
        disabled={isLatestVersion()}
      >
        Check for updates
      </button>
    </div>
  );
}

export default Update;
