<template>
    <div class="chat-page">
        <div class="chat-header">
            <!-- <button class="back-btn" @click="goBack">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
            </button> -->
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
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
            </button>

            <input v-model="newMessage" type="text" placeholder="Type a message..." @focus="activateInput"
                @blur="inputFocused = false" @keyup.enter="sendMessage" />

            <button @click="sendMessage" :disabled="!newMessage.trim()">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import '../styles/chat.css'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const messages = ref([])
const newMessage = ref('')
const fileInput = ref()
const chatBox = ref()
const inputFocused = ref(false)

const goBack = () => {
    router.push('/chats')
}

onMounted(() => {
    loadMessages()
})

const loadMessages = async () => {
    // Bu yerda chat ID bo'yicha xabarlarni yuklash
    // Hozircha demo ma'lumotlar
    messages.value = [
        {
            id: Date.now(),
            text: "👋 Hello! Welcome to our plant doctor!\n📸 Please send a photo of your sick plant.\n🧪 We'll analyze it and recommend the best treatment!",
            from: 'bot'
        }
    ]
}

const activateInput = () => {
    inputFocused.value = true
    scrollToBottom()
}

const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const sendMessage = async () => {
    if (newMessage.value.trim()) {
        const msg = {
            id: Date.now(),
            text: newMessage.value,
            from: 'me'
        }

        messages.value.push(msg)
        newMessage.value = ''
        scrollToBottom()

        // API ga xabarni yuborish
        try {
            await axios.post(`https://ifoda-shop.uz/order_api/${route.params.id}/messages`, {
                message: msg.text,
                timestamp: msg.id
            })
        } catch (error) {
            console.error('Xabar yuborishda xato:', error)
        }
    }
}

const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = () => {
            const msg = {
                id: Date.now(),
                image: reader.result,
                from: 'me'
            }
            messages.value.push(msg)
            scrollToBottom()

            // API ga rasmni yuborish
            uploadImage(file)
        }
        reader.readAsDataURL(file)
    }
    e.target.value = null
}

const uploadImage = async (file) => {
    try {
        const formData = new FormData()
        formData.append('image', file)

        await axios.post(`https://ifoda-shop.uz/order_api/${route.params.id}/images`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    } catch (error) {
        console.error('Rasm yuklashda xato:', error)
    }
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
