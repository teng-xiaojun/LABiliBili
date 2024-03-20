// 弹幕：自定义
import { ElMessage } from "element-plus"
import request from "./index.js"

const basic_danmu = '/danmaku/'
export const fetchDanMu = async(videoId) => {
    try {
        const getUrl = basic_danmu + 'getDanmaku/' + videoId
        const response = await request.get(getUrl, {videoId: videoId})
        console.log("查看弹幕显示", JSON.stringify(response))
        return response.map((danmu)=>({
            content: danmu.content,
            createTime: danmu.createTime,
            timeStamp: danmu.place, // string: 弹幕在视频中的时刻
            userId: danmu.userId,
        }))
    }catch (e) {
        ElMessage.error("获取弹幕失败", e)
        console.error("获取弹幕失败", e)
    }
}

export const addDanMu = async(videoId) => {
    try {
        const getUrl = basic_danmu + 'addDanmaku'
        const response = await request.get(getUrl, {videoId: videoId})
        return response
    }catch (e) {
        console.error("撤回弹幕失败",e)
    }
}

export const deleteDanMu = async(videoId) => {
    try {
        const getUrl = basic_danmu + 'addDanmaku'
        const response = await request.get(getUrl, {videoId: videoId})
        return response
    }catch (e) {
        console.error("撤回弹幕失败", e)
    }
}