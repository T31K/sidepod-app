import { useEffect, useState } from 'react';
import { authUrl } from '@/helpers/URLHelper.js';

import { WebviewWindow } from '@tauri-apps/api/window';

function Premium({ userHash, isPremium, isAuth }) {
  return (
    <div className="py-3 px-2">
      {isPremium ? (
        isAuth ? (
          <div className="tracking-tight">Logged In</div>
        ) : (
          <a
            target="_blank"
            href={`${authUrl}&state=${userHash}`}
            className={`bg-[#1ed761] px-2 py-3 mt-4 block items-center w-[200px] text-center tracking-tight font-semibold rounded-full`}
          >
            Login With Spotify
          </a>
        )
      ) : (
        <div>Upgrade to premium to use 🚀</div>
      )}
    </div>
  );
}

export default Premium;
