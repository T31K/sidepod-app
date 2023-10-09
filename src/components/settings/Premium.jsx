import axios from 'axios';
import { useState } from 'react';
import { appWindow, WebviewWindow } from '@tauri-apps/api/window';
import Loading from '@/components/buttons/Loading';

function Premium({ userHash, isAuth, isPremium }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    const data = {
      hash: userHash,
    };

    try {
      const res = await axios.post('https://api.getharmonize.app/create-sidepod-checkout-session', data);
      if (res.status == 200) {
        const webview = new WebviewWindow('checkout_page', {
          url: res.data,
          title: 'Stripe checkout',
          width: 1024,
          height: 650,
        });
        webview.once('tauri://created', () => {
          setIsLoading(false);
          appWindow.hide();
        });
      }
    } catch (error) {
      console.error('Error submitting data', error);
    }
  };

  return (
    <div className="py-3 px-3">
      <div className="flex gap-2 items-center mb-4 ">
        {isPremium ? (
          <div>Premium upgraded! 🚀</div>
        ) : (
          <>
            <button
              onClick={handleSubmit}
              className={`bg-custom-gray px-3 py-2 rounded-lg tracking-tight font-medium whitespace-nowrap h-[40px] flex items-center gap-2 ${
                isLoading ? 'w-[200px]' : 'w-[170px]'
              }`}
            >
              Upgrade to premium
              {isLoading && <Loading />}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Premium;
