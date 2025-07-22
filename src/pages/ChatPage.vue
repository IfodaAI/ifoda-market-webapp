<template>
    <div class="chat-page">
        <div class="chat-header">
            <button class="back-btn" @click="goBack">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
            </button>
            <p>💬 Plant Doctor</p>
        </div>

        <div class="chat-box" ref="chatBox">
            <div v-if="loading" class="loading-messages">
                <div class="loading-spinner"></div>
            </div>

            <div v-for="msg in messages" :key="msg.id" class="chat-message" :class="msg.from">
                <div class="message-content">
                    <img v-if="msg.image" :src="msg.image" class="chat-image" @load="scrollToBottom" />
                    <p v-if="msg.text">{{ msg.text }}</p>
                </div>
                <div class="message-time">{{ formatTime(msg.timestamp || msg.id) }}</div>
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

            <input v-model="newMessage" type="text" placeholder="Xabar yozing..." @focus="activateInput"
                @blur="inputFocused = false" @keyup.enter="sendMessage" :disabled="!socketConnected" />

            <button @click="sendMessage" :disabled="!newMessage.trim() || !socketConnected">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
            </button>
        </div>

        <div v-if="!socketConnected" class="connection-status">
            <div class="connection-dot"></div>
            <span>Ulanmoqda...</span>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formatTime } from '../utility/formatter'
import { scrollToBottom } from '../utility/scroll'
import '../styles/chat.css'

const route = useRoute()
const router = useRouter()
const messages = ref([])
const newMessage = ref('')
const fileInput = ref(null)
const chatBox = ref(null)
const inputFocused = ref(false)
const socket = ref(null)
const socketConnected = ref(false)
const loading = ref(true)



// Activate input function
const activateInput = () => {
    inputFocused.value = true
    scrollToBottom(chatBox)
}

// Go back function
const goBack = () => {
    router.push('/chats')
}

// WebSocket connection
const connectWebSocket = () => {
    const chatId = route.params.id
    if (!chatId) return

    socket.value = new WebSocket(`wss://ifoda-shop.uz/ws/chat/${chatId}/`)

    socket.value.onopen = () => {
        console.log('WebSocket connected')
        socketConnected.value = true
        loading.value = false
    }

    socket.value.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data)
            console.log('Message received:', data)

            // Handle both message formats (text vs message property)
            const messageText = data.text || data.message || ''

            if (data.type === 'TEXT' && data.sender === 'USER' && messageText) {
                messages.value.push({
                    id: data.id || Date.now(),
                    text: messageText,
                    from: data.sender === 'USER' ? 'bot' : 'user',
                    timestamp: data.timestamp || new Date().toISOString(),
                    type: 'TEXT'
                })
                scrollToBottom(chatBox)
            }
        } catch (error) {
            console.error('Error parsing message:', error)
        }
    }

    socket.value.onclose = () => {
        console.log('WebSocket disconnected')
        socketConnected.value = false
        setTimeout(connectWebSocket, 5000)
    }

    socket.value.onerror = (error) => {
        console.error('WebSocket error:', error)
        socketConnected.value = false
    }
}


const sendMessage = () => {
    const messageText = newMessage.value.trim()
    if (!messageText || !socketConnected.value) return

    const messageData = {
        text: messageText,  // Using 'message' instead of 'text' to match backend
        sender: 'BOT',
        type: 'TEXT'
    }

    // Add to local messages immediately
    messages.value.push({
        id: Date.now().toString(),
        text: messageText,
        from: 'me',
        timestamp: new Date().toISOString(),
        type: 'TEXT'
    })

    // Send via WebSocket
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
        socket.value.send(JSON.stringify(messageData))
    } else {
        console.error('WebSocket not connected')
    }

    newMessage.value = ''
    scrollToBottom(chatBox)
}

const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async () => {
        // Create message object for local display
        const msg = {
            id: Date.now(),
            image: reader.result,
            from: 'me',
            timestamp: new Date().toISOString(),
            type: 'IMAGE'
        }
        messages.value.push(msg)
        scrollToBottom(chatBox)

        try {
            // Prepare FormData for API
            const formData = new FormData()
            formData.append('order', 'order')  // required field
            formData.append('type', 'IMAGE')    // required field
            formData.append('sender', 'BOT')    // required field
            formData.append('image', file)     // image file

            // Send to API
            const response = await fetch('http://ifoda-shop.uz/message_api/', {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                throw new Error('API request failed')
            }

            const data = await response.json()
            console.log('API response:', data)

            // Handle API response if needed
            if (data.success) {
                // You can add any success handling here
            }
        } catch (error) {
            console.error('Error sending image:', error)
            // Optionally show error message to user
            messages.value.push({
                id: Date.now(),
                text: "Rasm yuborishda xatolik yuz berdi. Iltimos, qayta urunib ko'ring.",
                from: 'bot',
                timestamp: new Date().toISOString()
            })
            scrollToBottom(chatBox)
        }
    }
    reader.readAsDataURL(file)
    e.target.value = null
}
watch(newMessage, val => console.log(val, 'newMessage value'))
onMounted(() => {
    connectWebSocket()
    // Add initial bot message
    messages.value.push({
        id: Date.now(),
        text: "👋 Salom! Plant Doctor ga xush kelibsiz!\n📸 Kasal o'simlikning rasmini yuboring.\n🧪 Biz tahlil qilib eng yaxshi davolash usulini tavsiya qilamiz!",
        from: 'bot',
        timestamp: new Date().toISOString()
    })
    scrollToBottom(chatBox)
})

onBeforeUnmount(() => {
    if (socket.value) {
        socket.value.close()
    }
})
</script>

<style scoped></style>