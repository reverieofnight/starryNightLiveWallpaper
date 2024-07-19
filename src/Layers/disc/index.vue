<template>
	<div>
		<img ref="before" class="thumbnail" :src="beforeThumbnail" alt="">
		<img ref="after" class="thumbnail" :src="afterThumbnail" alt="">
		<img ref="front" class="front" src="@/assets/disc1.png" alt="">
		<img class="back" src="@/assets/disc.png" alt="">
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

// const animationState = computed(() => {
// 	switch (state.value) {
// 		case 'playing':
// 			return 'running';
// 			break;
// 		case 'paused':
// 			return 'paused'
// 		default:
// 			break;
// 	}
// })
watch(thumbnail, (val) => {
	changeThumbnailAnimation(val);
})
const before = ref();
const after = ref();
const front = ref();
watch(state,(val) => {
	switch(val){
		case 'playing':
			before.value.classList.remove('paused');
			before.value.classList.add('running');
			after.value.classList.remove('paused');
			after.value.classList.add('running');
			front.value.classList.remove('paused');
			front.value.classList.add('running');
			break;
		case 'paused':
			before.value.classList.remove('running');
			before.value.classList.add('paused');
			after.value.classList.remove('running');
			after.value.classList.add('paused');
			front.value.classList.remove('running');
			front.value.classList.add('paused');
			break;
		default:
			break;
	}
})

const beforeThumbnail = ref('');
const afterThumbnail = ref('');
function changeThumbnailAnimation(val) {
	if (beforeThumbnail.value) {
		before.value.style.opacity = 1;
		before.value.style.left = "24%";
		before.value.style.transition = 'none';
		setTimeout(() => {
			before.value.style.left = "calc(-32vh - 265px)";
			before.value.style.transition = 'left 0.5s ease';
			setTimeout(() => {
				before.value.classList.remove('rotate');
				before.value.style.opacity = 0;
			},500)
		}, 100)
	}
	afterThumbnail.value = val;
	after.value.style.left = "calc(100vw + 32vh + 265px)";
	after.value.style.transition = 'none';
	after.value.classList.remove('rotate');
	setTimeout(() => {
		after.value.style.left = "24%";
		after.value.style.transition = 'left 1s ease';
		setTimeout(() => {
			before.value.classList.add('rotate');
			after.value.classList.add('rotate');
			beforeThumbnail.value = val;
		}, 1000)
	}, 100)

}
</script>

<style lang="less" scoped>
@keyframes rotateAni {
	0% {
		transform: translate3d(-50%, -50%, 0) rotate(0deg);
	}

	100% {
		transform: translate3d(-50%, -50%, 0) rotate(360deg);
	}
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

.rotate {
	// animation: rotateAni 25s linear infinite;
}

.front {
	z-index: 1;
	// animation: rotateAni 25s linear infinite;
}

.back {
	z-index: 0;
}

.paused {
	animation-play-state: paused;
}

.running {
	animation-play-state: running;
}
</style>