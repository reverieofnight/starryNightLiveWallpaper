<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import background from './Layers/background/index.vue';
import disc from './Layers/disc/index.vue';
import foreground from './Layers/foreground/index.vue';
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
