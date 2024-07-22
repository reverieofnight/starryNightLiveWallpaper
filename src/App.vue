<script setup>
import background from './Layers/background/index.vue';
import disc from './Layers/disc/index.vue';
import foreground from './Layers/foreground/index.vue';
import { onMounted } from 'vue';
import { useStore } from "@/pinia";
import { thumbnailList } from '../samples/mediaInfoExample';
import emitter from '@/utils/mitt';
const store = useStore();
let intervalTimer = '';
onMounted(() => {
  console.log('ENV',process.env.NODE_ENV);
  if(process.env.NODE_ENV === 'production'){
    window.wallpaperPropertyListener = {
      applyUserProperties: function (properties) {
        console.log('用户属性改变', properties);
        //播放器样式
        if(properties.playerStyle){
          store.playerStyle = properties.playerStyle.value;
        }
      },
      applyGeneralProperties:function(properties){
        if(properties.fps){
          store.fpsLimit = properties.fps;
          console.log('帧数限制',store.fpsLimit);
        }
      }
    }
    window.wallpaperRegisterMediaPropertiesListener(wallpaperMediaPropertiesListener);
    function wallpaperMediaPropertiesListener(event){
      console.log('wallpaperMediaPropertiesListener',event);
      store.properties.albumArtist = event.albumArtist;
      store.properties.albumTitle =  event.albumTitle;
      store.properties.artist = event.artist;
      store.properties.contentType = event.contentType;
      store.properties.genres = event.genres;
      store.properties.subTitle = event.subTitle;
      store.properties.title = event.title;
    }
    window.wallpaperRegisterMediaThumbnailListener(wallpaperMediaThumbnailListener);
    function wallpaperMediaThumbnailListener(event){
      console.log('wallpaperMediaThumbnailListener',event);
      store.thumbs.thumbnail = event.thumbnail;
      store.thumbs.primaryColor = event.primaryColor;
      store.thumbs.secondaryColor = event.secondaryColor;
      store.thumbs.tertiaryColor = event.tertiaryColor;
      store.thumbs.textColor = event.textColor;
      store.thumbs.highContrastColor = event.highContrastColor;
    }
    window.wallpaperRegisterMediaPlaybackListener(wallpaperMediaPlaybackListener);
    function wallpaperMediaPlaybackListener(event) {
      console.log('wallpaperMediaPlaybackListener',event);
      switch (event.state) {
        case 0:
          store.state = 'stopped';
          break;
        case 1:
          store.state = 'playing';
          break;
        case 2:
          store.state = 'paused';
          break;
        default:
          store.state = 'undefined';
          break;
      }
    }

  } else if(process.env.NODE_ENV === 'development'){
      store.playerStyle = 'left';
      store.properties.albumArtist = '';
      store.properties.albumTitle =  '若月亮还没来（若是月亮还没来）';
      store.properties.artist = '王宇宙Leto/乔浚丞';
      store.properties.contentType = 'music';
      store.properties.genres = '';
      store.properties.subTitle = '';
      store.properties.title = '若月亮还没来（若是月亮还没来）';

      store.thumbs.primaryColor = '#357DBB';
      store.thumbs.secondaryColor = '#F9A7B2';
      store.thumbs.tertiaryColor = '#454C79';
      store.thumbs.textColor = '#00000';
      store.thumbs.highContrastColor = '#000000';

      store.fpsLimit = 60;
      let index = 1;
      setTimeout(() => {
        store.thumbs.thumbnail = thumbnailList[0];
        store.state = 'playing';
      },1000)
      setTimeout(() => {
        store.state = 'paused';
        setTimeout(() => {
          store.state = 'playing';
        },1000)
      },3000)
      intervalTimer = setInterval(() => {
        if(index < thumbnailList.length){
          store.thumbs.thumbnail = thumbnailList[index];
          index++;
        } else {
          index = 0;
          store.thumbs.thumbnail = thumbnailList[index];
        }
      },5000)
      
  }
  window.onresize = () => {
    emitter.emit('windowResize');
  }
  document.addEventListener('visibilitychange', (val) => {
    emitter.emit('visibilitychange',document.visibilityState);
    let visibilityState = document.visibilityState;
    if(visibilityState === 'hidden'){
      if(intervalTimer){
        clearInterval(intervalTimer);
      }
    }
    if(visibilityState === 'visible'){
      if(intervalTimer){
        clearInterval(intervalTimer);
      }
      let index = 0;
      store.thumbs.thumbnail = thumbnailList[index];
      intervalTimer = setInterval(() => {
        if(index < thumbnailList.length){
          store.thumbs.thumbnail = thumbnailList[index];
          index++;
        } else {
          index = 0;
          store.thumbs.thumbnail = thumbnailList[index];
        }
      },5000)
    }
  });
})
</script>

<template>
  <div class="view">
    <foreground class="foreground-layer" />
    <disc class="disc-layer" />
    <background class="background-layer" />
  </div>
</template>

<style lang="less">
*{
  padding:0;
  margin:0;
}

.view{
  width:100vw;
  height:100vh;
  overflow: hidden;
  .foreground-layer,
  .disc-layer,
  .background-layer{
    position: absolute;
    width: 100%;
    height:100%;
    overflow: hidden;
  }
  .foreground-layer{
    z-index: 2;
  }
  .disc-layer{
    z-index: 1;
  }
  .background-layer{
    z-index: 0;
  }
}
</style>
