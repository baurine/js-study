# JavaScript Misc

- audio

## audio

safari/chrome/firefox 上 audio 的播放行为不太一致。change currentTime 就是其中之一。

chrome/firefox 中允许在 audio element load 后马上对 audio element 设置 currentTime，但在 safari 上不行，这种操作无效。

    loadSrc = () => {
      const { audioInfo, progress } = this.state
      if (audioInfo && audioInfo.src) {
        this.audioElement.src = audioInfo.src
        this.audioElement.load()

        const jumpTo = progress || audioInfo.startProgress
        if (jumpTo > 0) {
          this.audioElement.currentTime = jumpTo
        }

        this.startPlay &&
        this.audioElement.play().catch(this.handlePlayError)
      }
    }

这段代码在 chrome/firefox 上是工作正常的，即可以从上次记录的播放位置继续播放。

但在 safari 上，load() 之后直接改变 currentTime 是无效的，每次都从头开始播放。

于是改成在 canplay 回调中去改变 currentTime。

    onCanPlay = () => {
      console.log('can play')
      ...
      this.audioElement.currentTime = jumpTo
      this.audioElement.playbackRate = this.state.playbackRate
    }

如此修改以后，在 safari 上工作正常了，但发现在 chrome/firefox 上不行了，原来在 chrome/firefox 上修改 currentTime 后，会重新触发 canplay 回调，因此造成了死循环，但在 safari 上 change currentTime 不会触发 canplay 回调...

最后的修改方法是，把 change currentTime 的操作放到 loadeddata 中回调中，这样，在三者上都工作正常了。

      this.audioElement.addEventListener('loadeddata', this.onLoadData)

      onLoadData = () => {
        console.log('load data')
        ...
        this.audioElement.currentTime = jumpTo
      }

一个示例：https://jsfiddle.net/Richard_Liu/cvkxehz6/
