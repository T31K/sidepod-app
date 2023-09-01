import { appWindow } from '@tauri-apps/api/window';

import Widget from '@/pages/Widget.jsx';
import Mini from '@/pages/Mini.jsx';
import Settings from '@/pages/Settings.jsx';

import './App.css';

function App() {
  return <>{appWindow.label === 'main' ? <Widget /> : appWindow.label == 'mini' ? <Mini /> : <Settings />}</>;
}

export default App;
