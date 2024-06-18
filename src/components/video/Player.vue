<!--视频本体-->
<template>
    <div class="video-player">
        <!--引用第三方包-->
        <div id="player" class="dplayer">
        </div>
    </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, defineProps, watch, onBeforeMount } from "vue"
import { fetchDanMu } from "@/api/danmu.js"
import { useRoute } from 'vue-router'
import DPlayer from "dplayer" 
let videoURL_ = ""
const route = useRoute()
const dp = ref(null) // 将存储DPlayer实例
const videoId = route.params.videoId // 当前视频Id
// 视频基本数据
const props = defineProps({
    videoUrl: {
        type: String,
        required: true,
        default: ""  
    }
})
// 初始化dplayer.js实例
const initPlayer = () => {
    const opt = {
        container: document.getElementById('player'),
        autoplay: true,
        theme: '#FADFA3',
        loop: true,
        lang: 'zh-cn',
        screenshot: true,
        hotkey: true,
        preload: 'auto',
        volume: 0.7,
        mutex: true,
        video: {
            url: videoURL_,
            type: 'auto'
        }
    }
    dp.value = new DPlayer(opt)
    // 进行监听
}
// 发送弹幕
const sendDanMu =(text, colorString) =>{
    dp.danmaku.send({
        text: text || '我是弹幕',
        color: colorString || '#ff0000',
        size: 20,
        speed: 1000,
        opacity: 0.5,
    },dp.danmaku.draw({
        text: text,
        color: colorString
    }))
    // 向后端发送axios
}
// 删除弹幕
const deleteDanMu = () => {

}
watch(()=>props.videoUrl, (newValue, oldValue)=>{
    if(newValue!==''){
        videoURL_ = newValue
        initPlayer() // 等获取到再更新实例
    }
})
const danmuList = ref([])
const getDanMuList = async()=>{
    const danmuList_ = await fetchDanMu(videoId)
    return danmuList_
}
onBeforeMount(()=>{

})
onMounted(()=>{
    // 获取弹幕数据
    danmuList.value = getDanMuList()
})
onBeforeUnmount(()=>{
    if(dp && dp.value !== null){
      
        dp.value.destroy()
    }  
})
</script>

<style scoped>

</style>