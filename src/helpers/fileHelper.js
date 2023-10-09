import { BaseDirectory, writeTextFile, readTextFile } from '@tauri-apps/api/fs';

export const getHash = async () => {
  const contents = await readTextFile('hash.conf', { dir: BaseDirectory.AppData });
  return contents;
};

export const setHash = async (data) => {
  await writeTextFile('hash.conf', `${data}`, { dir: BaseDirectory.AppData });
};

export const getToken = async (data) => {
  const contents = await readTextFile('app.conf', { dir: BaseDirectory.AppData });

  if (contents) {
    return JSON.parse(contents);
  } else {
    return null;
  }
};

export const setToken = async (data) => {
  let stringData = JSON.stringify(data);
  await writeTextFile('app.conf', stringData, { dir: BaseDirectory.AppData });
};
