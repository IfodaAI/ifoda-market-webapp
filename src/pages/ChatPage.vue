<template>
    <div class="chat-page">
        <div class="chat-header">
            <p>💬 Plant Doctor</p>
        </div>

        <div class="chat-box" ref="chatBox">
            <div v-for="msg in messages" :key="msg.id" class="chat-message" :class="msg.from">
                <div class="message-content">
                    <img v-if="msg.image" :src="msg.image" class="chat-image" @load="scrollToBottom" />
                    <p v-if="msg.text">{{ msg.text }}</p>
                </div>
                <div class="message-time">{{ formatTime(msg.id) }}</div>
            </div>
        </div>

        <div class="chat-input" :class="{ 'input-active': inputFocused }">
            <input type="file" @change="handleImageUpload" accept="image/*" hidden ref="fileInput" />
            <button class="upload-btn" @click="$refs.fileInput.click()">
                <CloudUpload />
            </button>

            <input v-model="newMessage" type="text" placeholder="Type a message..." @focus="activateInput"
                @blur="inputFocused = false" @keyup.enter="sendMessage" />



            <button @click="sendMessage" :disabled="!newMessage.trim()">
                <SendHorizontal />
            </button>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import '../styles/chat.css'
import { CloudUpload, SendHorizontal } from 'lucide-vue-next'

const messages = ref([])
const newMessage = ref('')
const fileInput = ref()
const chatBox = ref()

const router = useRouter()
const inputFocused = ref(false)



const goBack = () => {
    router.back()
}
onMounted(() => {
    messages.value = [
        {
            id: Date.now(),
            text: "👋 Hello! Welcome to our plant doctor!\n📸 Please send a photo of your sick plant.\n🧪 We'll analyze it and recommend the best treatment!",
            from: 'bot'
        }
    ]
})

const activateInput = () => {
    inputFocused.value = true
    scrollToBottom()
}


const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const sendMessage = () => {
    if (newMessage.value.trim()) {
        messages.value.push({
            id: Date.now(),
            text: newMessage.value,
            from: 'me'
        })
        newMessage.value = ''
        scrollToBottom()
    }
}

const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = () => {
            messages.value.push({
                id: Date.now(),
                image: reader.result,
                from: 'me'
            })
            scrollToBottom()
        }
        reader.readAsDataURL(file)
    }
    e.target.value = null // Reset input to allow same file to be selected again
}

const scrollToBottom = () => {
    nextTick(() => {
        chatBox.value.scrollTo({
            top: chatBox.value.scrollHeight,
            behavior: 'smooth'
        })
    })
}
</script>
