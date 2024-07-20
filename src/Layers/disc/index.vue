<template>
	<div>
		<img ref="CD" class="thumbnail" :class="actualState" :src="currentThumbnail" alt="">
		<img ref="front" class="front" :class="actualState" src="@/assets/disc1.png" alt="">
		<img class="back" :class="actualState" src="@/assets/disc.png" alt="">
	</div>
</template>

<script setup>
import { computed, watch, ref, nextTick } from 'vue';
import { useStore } from '@/pinia';
const store = useStore();
const thumbnail = computed(() => {
	return store.thumbs.thumbnail;
})
const state = computed(() => {
	return store.state;
})
const fpsLimit = computed(() => {
	return store.fpsLimit;
})
const isSwitchCD = ref(false);
//真正状态
const actualState = ref('paused');
function calcactualState(){
	let isPlaying = false;
	if(state.value === 'playing' && isSwitchCD.value === false && currentThumbnail.value){
		isPlaying = true;
	}
	if(!isPlaying){
		actualState.value = 'paused';
	} else {
		actualState.value = 'playing';
	}
}

//切换歌曲，切换CD
watch(thumbnail, (val) => {
	changeThumbnailAnimation();
})
const currentThumbnail = ref('');
const animationTime = 1 * 1000;//动画时间
const CD = ref();
let CDLeft = '';//当前位置
let CDDeg = 0;//当前旋转位置
let putNewCDAniId = '';
let rotateAniId = '';
let switchCDAniId = '';
function changeThumbnailAnimation(){
	console.log('切换CD');
	let step = '';
	let targetLeft = '';//目标位置
	let last = '';
	let fpsThreshold = 0;
	isSwitchCD.value = true;
	//之前有唱片，退出之前唱片
	if(currentThumbnail.value){
		switchCD();
	} else {
		putNewCD();
	}
	//切换CD

	function switchCD(){
		//初始化
		last = '';//清空计时器
		fpsThreshold = '';//清空帧计数
		//加上cd半径，让其在屏幕之外
		CDLeft = window.innerWidth * 0.24;//初始位置
		targetLeft = -window.innerHeight * 0.32;
		if(Math.abs(targetLeft) < 265){
			targetLeft = -265;
		}
		step = (CDLeft - targetLeft) * (1 / fpsLimit.value) * (1000 / animationTime);//每一帧移动的像素数
		if(switchCDAniId){
			cancelAnimationFrame(switchCDAniId);
		}
		switchCDAniId = requestAnimationFrame(switchCDDraw);
		//绘制函数
		function switchCDDraw(){
			//限制帧数
			if(!last){
				last = performance.now() / 1000;
			} else {
				let now = performance.now() / 1000;
				let dt = Math.min(now - last,1);
				last = now; 
				if(fpsLimit.value > 0){
					fpsThreshold += dt;
					if(fpsThreshold < 1.0 / fpsLimit.value){
						requestAnimationFrame(switchCDDraw);
						return;
					}
					fpsThreshold -= 1.0 / fpsLimit.value;
				}
			}
			CD.value.style.left = CDLeft + 'px';
			if(CDLeft > targetLeft){
				CDLeft -= step;
				requestAnimationFrame(switchCDDraw);
			} else {
				putNewCD();
			}
		}
	}
	//放置新CD
	function putNewCD(){
		//初始化
		last = '';//清空计时器
		fpsThreshold = '';//清空帧计数

		let initLeft = window.innerWidth//目标初始位置
		//加上cd半径，让其在屏幕之外
		if((window.innerHeight * 0.32) < 265){
			initLeft += 265;
		} else {
			initLeft += window.innerHeight * 0.32;
		}
		targetLeft = window.innerWidth * 0.24;//最终位置
		step = (initLeft - targetLeft) * (1 / fpsLimit.value) * (1000 / animationTime);//每一帧移动的像素数
		CDLeft = calcLeft(targetLeft,initLeft,step);//计算实际初始位置倒推
		currentThumbnail.value = thumbnail.value;
		//重置CD旋转位置
		CDDeg = 0;
		CD.value.style.transform = "translate3d(-50%,-50%,0) rotate(0deg)";
		//一定要清除动画计划，因为页面暂停不会导致事件暂停，事件会累积，必须清除动画计划
		if(putNewCDAniId){
			cancelAnimationFrame(putNewCDAniId);
		}
		//开始绘制动画
		putNewCDAniId = requestAnimationFrame(putNewCDDraw);
		//绘制函数
		function putNewCDDraw(){
			//限制帧数
			if(!last){
				last = performance.now() / 1000;
			} else {
				let now = performance.now() / 1000;
				let dt = Math.min(now - last,1);
				last = now; 
				if(fpsLimit.value > 0){
					fpsThreshold += dt;
					if(fpsThreshold < 1.0 / fpsLimit.value){
						requestAnimationFrame(putNewCDDraw);
						return;
					}
					fpsThreshold -= 1.0 / fpsLimit.value;
				}
			}
			CD.value.style.left = CDLeft + 'px';
			if(CDLeft > targetLeft + (step / 10)){
				CDLeft -= step;
				requestAnimationFrame(putNewCDDraw);
			} else {
				if(CDLeft !== targetLeft){
					//修正最终位置
					CDLeft = targetLeft;
					CD.value.style.left = CDLeft + 'px';
				}
				setTimeout(() => {
					isSwitchCD.value = false;
					rotateCD();
				},200)
			}
		}
	}
	
	function calcLeft(start,end,step){
		start += step;
		if(start < end){
			return calcLeft(start,end,step);
		} else {
			return start;
		}
	}
}

//旋转CD函数
const rotateTime = 25 * 1000;//旋转一圈所需时间
const front = ref();
let frontDeg = 0;
function rotateCD(){
	let last = '';
	let fpsThreshold = 0;
	let step = (360 / rotateTime) * (1000 / fpsLimit.value);
	if(rotateAniId){
		cancelAnimationFrame(rotateAniId);
	}
	rotateAniId = requestAnimationFrame(rotateCDDraw);
	function rotateCDDraw(){
		//如果播放状态为暂停，则停止旋转
		if(actualState.value === 'paused'){
			return;
		}
		//限制帧数
		if(!last){
			last = performance.now() / 1000;
		} else {
			let now = performance.now() / 1000;
			let dt = Math.min(now - last,1);
			last = now; 
			if(fpsLimit.value > 0){
				fpsThreshold += dt;
				if(fpsThreshold < 1.0 / fpsLimit.value){
					requestAnimationFrame(rotateCDDraw);
					return;
				}
				fpsThreshold -= 1.0 / fpsLimit.value;
			}
		}
		CD.value.style.transform = "translate3d(-50%,-50%,0) rotate("+ CDDeg +"deg)";
		front.value.style.transform = "translate3d(-50%,-50%,0) rotate("+ frontDeg +"deg)";
		CDDeg += step;
		frontDeg += step;
		if(CDDeg >= 360){
			CDDeg = 0;
		}
		if(frontDeg >= 360){
			frontDeg = 0;
		}
		requestAnimationFrame(rotateCDDraw);
	}
}
//继续播放，开始旋转	
watch(state, (val) => {
	calcactualState();
	if(actualState.value === 'playing'){
		rotateCD();
	}
})
watch(isSwitchCD,(val) => {
	calcactualState();
})

</script>

<style lang="less" scoped>
.paused{
	opacity: 0.7;
}
.front,
.back {
	position: absolute;
	left: 24%;
	top: 50%;
	transform: translate3d(-50%, -50%, 0);
	width: 60vh;
	height: 60vh;
	min-width: 500px;
	min-height: 500px;
}

.thumbnail {
	z-index: 2;
	position: absolute;
	left: 24%;
	top: 50%;
	transform: translate3d(-50%, -50%, 0);
	width: 32vh;
	height: 32vh;
	border-radius: 50%;
	min-width: 265px;
	min-height: 265px;
}

.front {
	z-index: 1;
}

.back {
	z-index: 0;
}
</style>