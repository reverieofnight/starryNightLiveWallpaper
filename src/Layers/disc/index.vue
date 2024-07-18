<template>
    <div>
        <img class="front" src="@/assets/disc1.png" alt="">
        <img class="back" src="@/assets/disc.png" alt="">
        
    </div>
</template>

<script setup>

</script>

<style lang="less" scoped>
@keyframes rotateAni {
    0%{
        transform: translate3d(-50%,-50%,0) rotate(0deg);
    }
    100%{
        transform: translate3d(-50%,-50%,0) rotate(360deg);
    }
}
.front,.back{
    position: absolute;
    left:24%;
    top:50%;
    transform:translate3d(-50%,-50%,0);
}
.front{
    z-index: 1;
    animation: rotateAni 25s linear infinite;
}
.back{
    z-index: 0;
    // animation: rotateAni 5s ease infinite;
    // opacity: 0;
}
</style>