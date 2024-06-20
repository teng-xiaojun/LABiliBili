<template>
    <div class="my-item">
        <!--各项小模块-->
        <el-scrollbar style="height: 92%;">
            <div class="my-item-single flex-column-left-container" v-for="(videoPanel, index) in personVideoData"
                :key="index">
                <div class="my-single-title-wrap flex-between-container"><!--标题和展开-->
                    <div class="flex-left-container">
                        <p class="my-single-title font-first-color">{{ videoPanel.title }}</p>
                        <div v-if="isSelf && (videoPanel.title === '我的合集' || videoPanel.title === '我的收藏')"
                            class="common-btn-center"
                            style="width:1.48rem;height:1.48rem;border-radius:50%;margin-left:2rem;background-color: #6674f6;"
                            @click="openFolder(index)">
                            <img src="@/assets/img/utils/plus.svg" style="width:0.8rem;height: 0.8rem;" />
                        </div>
                    </div>
                    <img src="@/assets/img/utils/rightArrow.svg" class="item-btn common-btn-center"
                        @click="turnToMyDetail()" />
                </div>
                <div class="my-single-content">
                    <div v-if="data[index].length > 0">
                        <el-scrollbar style="width:88%;">
                            <div v-if="videoPanel.isAllowed && videoPanel.title !== '我的收藏'" class="flex-left-container">
                                <div v-for="(item, subIndex) in data[index]" :key="subIndex">
                                    <videoCardVue :videoInfo="item"
                                        style="width:20rem;height:14rem;margin:1rem 2rem 1.5rem 1rem;" />
                                </div>
                            </div>
                            <div
                                v-else-if="videoPanel.isAllowed && (videoPanel.title === '我的合集' || videoPanel.title === '我的收藏')">
                                <div v-for="(item, subIndex) in data[2]" :key="subIndex">
                                    {{ item }}

                                </div>
                            </div>
                        </el-scrollbar>
                    </div>
                    <div v-else class="flex-center-container">
                        <img src="@/assets/img/utils/noData.png" style="width:15rem;height:15rem;" />
                    </div>
                </div>
            </div>
        </el-scrollbar>
        <!--打开合集和收藏夹新建-->
        <div v-if="isOpenNew">
            <newCollectionVue v-model:isShow="isOpenNew" v-model:isCollected="isCollectedVal" :isVideoDetail="false" />
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed, defineAsyncComponent } from "vue"
import { fetchUpVideo, fetchVideoCompilations, fetchRecentLikeVideo } from "@/api/video"
import { fetchCollection } from "@/api/like_and_collect"
import { useUserInfo } from '@/store/userInfo'
import { useRoute } from 'vue-router'
// import { ElMessage } from "element-plus"
const videoCardVue = defineAsyncComponent(() =>
    import("@/components/video/VideoCard.vue")
)
const newCollectionVue = defineAsyncComponent(() =>
    import("@/components/collect/CollectCard2.vue")
)
const currentURL = window.location.href
const parts = currentURL.split('/') // 当前url的分割数组
const upId = parseInt(parts[parts.length - 1]) // 最后一位upId
const isOpenNew = ref(false) // 是否打开合集和收藏夹的新建
const isCollectedVal = ref(true) // 打开的是否为收藏夹
const data = ref([[], [], [], []]) // 渲染的数据
const userInfo = useUserInfo() // 保存登录信息
const userId = userInfo.getId()
const isSelf = upId === userId // 是否为自己
let route = useRoute()

// const upId = useRoute().params.userId
// const upId = route.pa.upId
const personVideoData = reactive([{
    "isAllowed": true,
    "title": "我的投稿",
},
// {
//     "isAllowed": true,
//     "title": "我的合集",
// },
{
    "isAllowed": true,
    "title": "我的收藏",
}, {
    "isAllowed": true,
    "title": "最近点赞",
}])

const openFolder = (index) => {
    if (index === 1) {
        isCollectedVal.value = false
    }
    isOpenNew.value = true
}
// 获取数据
const getData = async (index) => {
    let data_ = []
    switch (index) {
        case 0: {
            data_ = await fetchUpVideo(upId)
            break
        }
        case 1: {
            data_ = await fetchVideoCompilations(upId)
            break
        }
        case 2: {
            data_ = await fetchCollection(upId)
            break
        }
        case 3: {
            data_ = await fetchRecentLikeVideo(userId)
            break
        }
    }
    return data_
}
// 跳转到本页面的详细
const turnToMyDetail = computed(() => {

})
/**
 * 对视频的管理
 */
// 测试视频数据
onMounted(async () => {
    // 获得权限
    // 渲染数据
    const promises = []
    for (let i = 0; i < 4; i++) {
        promises.push(getData(i))
    }
    data.value = await Promise.all(promises)
})
</script>

<style lang="scss" scoped>
.my-item {
    padding: 2rem;
    width: 100%;
    height: 100%;
}

.my-item-single {
    width: 90%;
    min-height: 18rem;
    height: auto;
    text-align: left;

    &:not(:first-child) {
        margin-top: 2rem;
    }

    .my-single-title-wrap {
        width: 85%;
        margin-bottom: 1rem;

        .my-single-title {
            font-size: 1.3rem;
            font-weight: 600;
        }
    }

    .my-single-content {
        width: 90%;
        min-height: 5rem;
        height: auto;
    }
}

@media screen and (min-width:1020px) {
    .my-item-single {
        width: 96%;

        .my-single-title-wrap {
            width: 90%;
        }
    }
}
</style>