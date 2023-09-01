import { Command } from '@tauri-apps/api/shell';

let isExecuting = false; // Flag to track if the function is currently executing
let isAltExecuting = false;

export const getNowPlaying = () => {
  if (isExecuting) {
    // If the function is already executing, return a promise that resolves when the current execution completes
    return new Promise((resolve) => {
      const checkExecution = () => {
        if (!isExecuting) {
          resolve(getNowPlaying()); // Retry the function once the current execution completes
        } else {
          setTimeout(checkExecution, 100); // Check again after a short delay
        }
      };

      checkExecution();
    });
  }

  isExecuting = true; // Set the flag to indicate that the function is now executing

  const command = new Command('get-track', [
    '-e',
    'tell application "Spotify" to {artist of current track & ";", artwork url of current track & ";", id of current track & ";", repeating & ";", shuffling & ";", player state & ";", name of current track}',
  ]);

  return new Promise((resolve, reject) => {
    command.stdout.on('data', (line) => {
      const [artist, album, uri, repeat, shuffle, state, name] = line.split(';,');
      let output = {
        name,
        artist,
        uri,
        album,
        repeat,
        shuffle,
        state,
      };
      resolve(output);
    });

    command.on('close', ({ code }) => {
      isExecuting = false;
      if (code !== 0) {
        console.log('error getNowPlaying');
        reject(new Error(`Command execution failed with code ${code}`));
      } else {
        resolve(code);
      }
    });

    command.on('error', (err) => {
      isExecuting = false; // Reset the flag in case of an error
      console.log('error getNowPlaying');
      reject(err);
    });

    command.spawn();
  });
};

export const getNowPlayingAlbumOnly = () => {
  if (isAltExecuting) {
    // If the function is already executing, return a promise that resolves when the current execution completes
    return new Promise((resolve) => {
      const checkAltExecution = () => {
        if (!isAltExecuting) {
          resolve(getNowPlayingAlbumOnly()); // Retry the function once the current execution completes
        } else {
          setTimeout(checkAltExecution, 100); // Check again after a short delay
        }
      };

      checkAltExecution();
    });
  }

  isAltExecuting = true; // Set the flag to indicate that the function is now executing

  const command = new Command('get-track', ['-e', 'tell application "Spotify" to {artwork url of current track}']);

  return new Promise((resolve, reject) => {
    command.stdout.on('data', (line) => {
      resolve(line);
    });

    command.on('close', ({ code }) => {
      isAltExecuting = false;
      if (code !== 0) {
        console.log('error getNowPlayingAlbumOnly');
        reject(new Error(`Command execution failed with code ${code}`));
      } else {
        resolve(code);
      }
    });

    command.on('error', (err) => {
      isAltExecuting = false; // Reset the flag in case of an error
      console.log('error getNowPlayingAlbumOnly');
      reject(err);
    });

    command.spawn();
  });
};

export const playTrack = (uri) => {
  const playCommand = uri ? `play track "${uri}"` : `play`;
  const command = new Command('play', ['-e', `tell application "Spotify" to ${playCommand}`]);

  return new Promise((resolve, reject) => {
    command.stdout.on('data', (line) => {
      resolve(line);
    });

    command.on('close', ({ code }) => {
      if (code !== 0) reject(new Error(`Command execution failed with code ${code}`));
      else resolve(code);
    });

    command.on('error', (err) => {
      reject(err);
    });

    command.spawn();
  });
};

export const openSpotifyApp = (uri) => {
  const command = new Command('open-spotify', ['-a', 'Spotify.app']);

  return new Promise((resolve, reject) => {
    command.stdout.on('data', (line) => {
      resolve(line);
    });

    command.on('close', ({ code }) => {
      if (code !== 0) reject(new Error(`Command execution failed with code ${code}`));
      else resolve(code);
    });

    command.on('error', (err) => {
      reject(err);
    });

    command.spawn();
  });
};

export const getCurrPos = () => {
  const command = new Command('get-timestamp', [
    '-e',
    'tell application "Spotify" to set currentSeconds to (player position as integer)',
  ]);

  return new Promise((resolve, reject) => {
    command.stdout.on('data', (line) => {
      resolve(line);
    });

    command.on('close', ({ code }) => {
      if (code !== 0) reject(new Error(`Command execution failed with code ${code}`));
      else resolve(code);
    });

    command.on('error', (err) => {
      reject(err);
    });

    command.spawn();
  });
};

export const getPlaybackInfo = () => {
  const command = new Command('get-timestamp', [
    '-e',
    'tell application "Spotify" to set currentSeconds to (player position as integer) & "," & ((duration of current track) / 1000 as integer)',
  ]);

  return new Promise((resolve, reject) => {
    command.stdout.on('data', (line) => {
      const values = line
        .trim()
        .split(',')
        .filter((val) => val.trim() !== '' && !isNaN(val))
        .map((num) => parseInt(num, 10));
      if (values.length < 2) {
        reject(new Error('Unexpected output from AppleScript.'));
        return;
      }
      const [currentPos, totalDuration] = values;
      resolve({
        currentPos,
        totalDuration,
      });
    });

    command.on('close', ({ code }) => {
      if (code !== 0) reject(new Error(`Command execution failed with code ${code}`));
    });

    command.on('error', (err) => {
      reject(err);
    });

    command.spawn();
  });
};

export const goToPos = (val) => {
  const command = new Command('get-timestamp', ['-e', `tell application "Spotify" to set player position to ${val}`]);

  return new Promise((resolve, reject) => {
    command.stdout.on('data', (line) => {
      resolve(line);
    });

    command.on('close', ({ code }) => {
      if (code !== 0) reject(new Error(`Command execution failed with code ${code}`));
      else resolve();
    });

    command.on('error', (err) => {
      reject(err);
    });

    command.spawn();
  });
};

export const setVolume = (val) => {
  const command = new Command('get-timestamp', ['-e', `tell application "Spotify" to set sound volume to ${val}`]);

  return new Promise((resolve, reject) => {
    command.stdout.on('data', (line) => {
      resolve(line);
    });

    command.on('close', ({ code }) => {
      if (code !== 0) reject(new Error(`Command execution failed with code ${code}`));
      else resolve(code);
    });

    command.on('error', (err) => {
      reject(err);
    });

    command.spawn();
  });
};

export const toggleButton = (option) => {
  let commandString;
  switch (option) {
    case 'shuffle':
      commandString = 'tell application "Spotify" to set shuffling to not shuffling';
      break;
    case 'repeat':
      commandString = 'tell application "Spotify" to set repeating to (repeating is not true)';
      break;
    case 'previous':
      commandString = 'tell application "Spotify" to previous track';
      break;
    case 'next':
      commandString = 'tell application "Spotify" to next track';
      break;
    case 'playpause':
      commandString = 'tell application "Spotify" to playpause';
      break;
    default:
      commandString = 'tell application "Spotify" to set shuffling to not shuffling';
  }
  const command = new Command('get-timestamp', ['-e', commandString]);

  return new Promise((resolve, reject) => {
    command.stdout.on('data', (line) => {
      resolve(line);
    });

    command.on('close', ({ code }) => {
      if (code !== 0) reject(new Error(`Command ${option} failed`));
      else resolve(code);
    });

    command.on('error', (err) => {
      reject(err);
    });

    command.spawn();
  });
};
