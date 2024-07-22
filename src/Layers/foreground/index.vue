<template>
	<div>
		<video v-if="playerStyle === 'left'" src="@/assets/cover1.webm" type="video/webm" autoplay muted loop></video>
		<video v-if="playerStyle === 'center'" src="@/assets/cover.webm" type="video/webm" autoplay muted loop></video>
	</div>
</template>

<script setup>
import { ref, computed,watch } from "vue";
import { useStore } from "@/pinia";
const store = useStore();
const playerStyle = computed(() => {
	return store.playerStyle;
})
</script>

<style lang="less" scoped>
video {
	width: 100%;
	height: 100%;
	object-fit: cover;
}
</style>