<!--和别人私聊-->
<template>
   <div class="chat-panel">
        <!--左侧用户列表-->
        <div class="chat-userList">
            <chatListVue />
        </div>
        <!--纵轴隔-->
        <div class="message-vertical-divided here-vertical-divided"></div>
        <!--右侧聊天框-->
        <div class="chat-content flex-column-left-max-container" style="position: relative;">
            <div class="main-title chat-content-item">{{currentPerson.upName}}</div>
            <div class="chat-content-item">{{currentPerson.intro}}</div>
            <div style="position: absolute;top:10px;right: 10px;">
                <el-tabs :tab-position="'tops'"  type="card" @tab-change="changeType">
                    <el-tab-pane label="文本" name="0"></el-tab-pane>
                    <el-tab-pane label="图片" name="1"></el-tab-pane>
                    <el-tab-pane label="PPT" name="2"></el-tab-pane>
                </el-tabs>
            </div>
            <chatContentVue :type="type"/>
        </div>
   </div>     
</template>

<script setup>
import { ref, watch, onMounted, provide, defineAsyncComponent } from "vue"
import { fetchUserInfo } from '@/api/user'
import { useChat } from "@/store/chat"
import { useUserInfo } from "@/store/userInfo"
const userInfo = useUserInfo() // 使用登录信息 
const userId = userInfo.getId() // 登录用户的id
const chatSession = useChat() // 使用聊天信息
const chatListVue = defineAsyncComponent(()=>
    import ("./ChatObj.vue")
)
const chatContentVue = defineAsyncComponent(()=>
    import ("./ChatContent.vue")
)
const defaultBigModel = { // 默认是大模型的id
    upId: 0, // 聊天对象的id
    upName: "星火API", // 聊天对象的name
    intro: "星火大模型伴你同行",
    avatar: require("@/assets/img/avater.png"), // 聊天对象的头像
    leastMessage: "星火大模型伴你同行",
    leastMessageFrom: 2, // 0是不存在，1是自己，2是对方
    updatedUnreadFlag: true, // 是否有新的未读消息
    unreadNum: 1, // 未读新消息的条数 
}
const currentPerson = ref(defaultBigModel)
const updateCurrentPerson = (item) => {
    currentPerson.value = item
}
// provide("chatting", currentPerson)
// provide("updateChat", updateCurrentPerson)
const getIntro = async() => {
    const res = await fetchUserInfo(userId, currentPerson.value.upId)
    if(currentPerson.value.upId!==0) {
        currentPerson.value.intro = res.intro
    } else {
        currentPerson.value.intro = "星火大模型伴你同行"
    }
}
let type = ref('0')
const changeType = (val)=>{
    console.log(val);
    type.value = val
}
// 监听
watch(chatSession, (newValue, oldValue) => { // NOTE 监听pinia中属性会失败
    currentPerson.value.upId = newValue.getCurrentUp()[0]
    currentPerson.value.upName = chatSession.getCurrentUp()[1]
    getIntro()
}, {deep: true})
// 接收消息时的处理
onMounted(()=>{
    currentPerson.value.upId = chatSession.getUpId()
    currentPerson.value.upName = chatSession.getUpName()
    getIntro() // 获得intro
})
</script>

<style lang="scss" scoped>
@import "@/assets/css/messagePage.scss";
.chat-panel {
    display: flex;
    flex-flow: row nowrap;
    height: 99%; 
}
.chat-userList {
    flex: 0.1 0.1 15rem;
}
.message-vertical-divided {
    margin: 0.5rem 0.5rem;
    height: 99%;
}
.chat-content {
    flex: 0.9 0.9 8rem;
    .chat-content-item {
        margin-top: 0.5rem;
        margin-left: 0.8rem;
    }
}
</style>