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
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

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

// Format time function
const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Scroll to bottom function
const scrollToBottom = () => {
    nextTick(() => {
        if (chatBox.value) {
            chatBox.value.scrollTo({
                top: chatBox.value.scrollHeight,
                behavior: 'smooth'
            })
        }
    })
}

// Activate input function
const activateInput = () => {
    inputFocused.value = true
    scrollToBottom()
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

            if (data.type === 'TEXT') {
                messages.value.push({
                    id: Date.now(),
                    text: data.message,
                    from: data.sender === 'BOT' ? 'bot' : 'user',
                    timestamp: new Date().toISOString(),
                    type: 'TEXT'
                })
                scrollToBottom()
            }
        } catch (error) {
            console.error('Error parsing message:', error)
        }
    }

    socket.value.onclose = () => {
        console.log('WebSocket disconnected')
        socketConnected.value = false
        setTimeout(connectWebSocket, 5000) // Reconnect after 5 seconds
    }

    socket.value.onerror = (error) => {
        console.error('WebSocket error:', error)
        socketConnected.value = false
    }
}

const sendMessage = () => {
    if (!newMessage.value.trim() || !socketConnected.value) return

    // messageData ni inputni bo'shatishdan oldin yarating
    const messageData = {
        message: newMessage.value,
        sender: 'USER',
        type: 'TEXT'
    }

    // Add to local messages immediately
    messages.value.push({
        id: Date.now(),
        text: newMessage.value,
        from: 'me',
        timestamp: new Date().toISOString(),
        type: 'TEXT'
    })

    // Endi inputni bo'shating
    newMessage.value = ''
    scrollToBottom()

    // Send via WebSocket
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
        socket.value.send(JSON.stringify(messageData))
    } else {
        console.error('WebSocket not connected')
    }
}

const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
        const msg = {
            id: Date.now(),
            image: reader.result,
            from: 'me',
            timestamp: new Date().toISOString(),
            type: 'IMAGE'
        }
        messages.value.push(msg)
        scrollToBottom()

        // Prepare image data for sending
        const imageData = {
            message: reader.result,
            sender: 'USER',
            type: 'IMAGE'
        }

        // Send via WebSocket
        if (socket.value && socket.value.readyState === WebSocket.OPEN) {
            socket.value.send(JSON.stringify(imageData))
        }
    }
    reader.readAsDataURL(file)
    e.target.value = null
}

onMounted(() => {
    connectWebSocket()
    // Add initial bot message
    messages.value.push({
        id: Date.now(),
        text: "👋 Salom! Plant Doctor ga xush kelibsiz!\n📸 Kasal o'simlikning rasmini yuboring.\n🧪 Biz tahlil qilib eng yaxshi davolash usulini tavsiya qilamiz!",
        from: 'bot',
        timestamp: new Date().toISOString()
    })
    scrollToBottom()
})

onBeforeUnmount(() => {
    if (socket.value) {
        socket.value.close()
    }
})
</script>

<style scoped>
/* Existing styles... */

.loading-messages {
    display: flex;
    justify-content: center;
    padding: 20px;
}

.loading-spinner {
    width: 24px;
    height: 24px;
    border: 3px solid rgba(64, 172, 60, 0.2);
    border-radius: 50%;
    border-top-color: var(--primary);
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.connection-status {
    position: fixed;
    bottom: 70px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--card-bg);
    padding: 6px 12px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.connection-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #ffc107;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% {
        opacity: 0.5;
    }

    50% {
        opacity: 1;
    }

    100% {
        opacity: 0.5;
    }
}

.chat-input:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
}
</style>