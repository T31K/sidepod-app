import { useEffect, useState } from 'react';
import { appWindow } from '@tauri-apps/api/window';

import { getHash, setToken } from './helpers/fileHelper';
import { initData } from './helpers/APIHelper';

import Widget from '@/pages/Widget.jsx';
import Mini from '@/pages/Mini.jsx';
import Settings from '@/pages/Settings.jsx';

import './App.css';

function App() {
  const [userHash, setUserHash] = useState('');
  const [userToken, setUserToken] = useState('');
  const [userEmail, setUserEmail] = useState(false);

  const [isAuth, setIsAuth] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const localGetHash = async () => {
      const hash = await getHash();
      setUserHash(hash);
    };
    localGetHash();
  }, []);

  useEffect(() => {
    if (userHash.length === 6 && appWindow.label !== 'main' && appWindow.label !== 'mini') {
      localInitData();
    }
  }, [userHash]);

  const localInitData = async () => {
    try {
      const res = await initData(userHash);
      const { access_token, premium, email, token_time } = res.data;
      if (access_token) {
        await setToken({ token: access_token, token_time: token_time, premium: premium });
        setUserEmail(email);
        setIsAuth(true);
      }
      setIsPremium(premium);
    } catch (error) {
      console.error('Error in getDataWithHash:', error);
      return;
    }
  };

  return (
    <>
      {appWindow.label === 'main' ? (
        <Widget localInitData={localInitData} />
      ) : appWindow.label == 'mini' ? (
        <Mini />
      ) : (
        <Settings
          userHash={userHash}
          userEmail={userEmail}
          isAuth={isAuth}
          isPremium={isPremium}
        />
      )}
    </>
  );
}

export default App;
