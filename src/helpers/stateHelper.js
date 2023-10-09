import SpotifyWebApi from 'spotify-web-api-node';

export const NEW_CURRENT_TRACK = {
  name: 'Never Gonna Give You Up',
  artists: [{ name: 'Rick Astley' }],
  album: {
    images: [
      {},
      { url: 'https://upload.wikimedia.org/wikipedia/en/3/34/RickAstleyNeverGonnaGiveYouUp7InchSingleCover.jpg' },
    ],
  },
};

export const NEW_SPOTIFY_API = new SpotifyWebApi();
