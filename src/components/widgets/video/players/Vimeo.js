import React from 'react'
import {findDOMNode} from 'react-dom';
import { stringify } from 'query-string'

import Base from './Base'

const IFRAME_SRC = 'https://player.vimeo.com/video/'
const MATCH_URL = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/
const MATCH_MESSAGE_ORIGIN = /^https?:\/\/player.vimeo.com/
const BLANK_VIDEO_URL = 'https://vimeo.com/127250231'
const DEFAULT_IFRAME_PARAMS = {
  api: 1,
  autoplay: 0,
  badge: 0,
  byline: 0,
  portrait: 0,
  title: 0,
}

export default class Vimeo extends Base {
  static displayName = 'Vimeo';
  static canPlay (url) {
    return MATCH_URL.test(url)
  }
  componentDidMount () {
    window.addEventListener('message', this.onMessage, false)
    this.iframe = findDOMNode(this.refs.iframe);

    if (!this.props.url && this.props.vimeoConfig.preload) {
      this.preloading = true
      this.load(BLANK_VIDEO_URL)
    }

    super.componentDidMount()
  }
  load (url) {
    const id = url.match(MATCH_URL)[3]
    const iframeParams = {
      ...DEFAULT_IFRAME_PARAMS,
      ...this.props.vimeoConfig.iframeParams,
    }

    this.iframe.src = `${IFRAME_SRC + id}?${stringify(iframeParams)}`
  }
  play () {
    this.postMessage('play')
  }
  pause () {
    this.postMessage('pause')
  }
  stop () {
    this.iframe.src = ''
  }
  seekTo (fraction) {
    super.seekTo(fraction)
    this.postMessage('seekTo', this.duration * fraction)
  }
  setVolume (fraction) {
    this.postMessage('setVolume', fraction)
  }
  getFractionPlayed () {
    return this.fractionPlayed || null
  }
  getFractionLoaded () {
    return this.fractionLoaded || null
  }
  onMessage = e => {
    if (!MATCH_MESSAGE_ORIGIN.test(e.origin)) return
    this.origin = this.origin || e.origin
    const data = JSON.parse(e.data)
    if (data.event === 'ready') {
      this.postMessage('getDuration')
      this.postMessage('addEventListener', 'playProgress')
      this.postMessage('addEventListener', 'loadProgress')
      this.postMessage('addEventListener', 'play')
      this.postMessage('addEventListener', 'pause')
      this.postMessage('addEventListener', 'finish')
    }
    if (data.event === 'ready') this.onReady()
    if (data.event === 'playProgress') this.fractionPlayed = data.data.percent
    if (data.event === 'loadProgress') this.fractionLoaded = data.data.percent
    if (data.event === 'play') this.onPlay()
    if (data.event === 'pause') this.props.onPause()
    if (data.event === 'finish') this.props.onEnded()
    if (data.method === 'getDuration') this.duration = data.value // Store for use in seekTo()
  };
  postMessage = (method, value) => {
    if (!this.origin) return
    const data = JSON.stringify({ method, value })
    return this.iframe.contentWindow && this.iframe.contentWindow.postMessage(data, this.origin)
  };
  render () {
    const style = {
      display: this.props.url ? 'block' : 'none',
      width: '100%',
      height: '100%',
    }
    return <iframe ref='iframe' frameBorder='0' style={style} />
  }
}
