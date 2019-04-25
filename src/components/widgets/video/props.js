import { PropTypes } from 'react'

export const propTypes = {
  url: PropTypes.string,
  playing: PropTypes.bool,
  volume: PropTypes.number,
  width: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
  height: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
  className: PropTypes.string,

  soundcloudConfig: PropTypes.shape({
    clientId: PropTypes.string,
  }),

  youtubeConfig: PropTypes.shape({
    playerVars: PropTypes.object,
  }),

  vimeoConfig: PropTypes.shape({
    iframeParams: PropTypes.object,
  }),

  onPlay: PropTypes.func,
  onPause: PropTypes.func,
  onBuffer: PropTypes.func,
  onEnded: PropTypes.func,
  onError: PropTypes.func,
  onProgress: PropTypes.func,
}

export const defaultProps = {
  playing: false,
  width: '100%',
  height: 450,
  volume: 0.8,

  soundcloudConfig: {
    clientId: 'e8b6f84fbcad14c301ca1355cae1dea2',
  },

  youtubeConfig: {
    playerVars: {
      controls: 1,
      rel: 0,
    },

    preload: false,
  },

  vimeoConfig: {
    iframeParams: {},
    preload: false,
  },

  onPlay() {},
  onPause() {},
  onBuffer() {},
  onEnded() {},
  onError() {},
  onProgress() {},
}
