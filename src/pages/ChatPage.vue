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
                    <button v-if="msg.from === 'USER' && msg.showMedicinesButton"
                        @click="openMedicinesModal(msg.orderId)" class="medicines-btn">
                        Dorilarni ko'rish
                    </button>
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
        <MedicinesModal v-if="showMedicinesModal" :order-id="currentOrderId" @close="closeMedicinesModal" />
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formatTime } from '../utility/formatter'
import { scrollToBottom } from '../utility/scroll'
import MedicinesModal from '../components/MedicinesModal.vue'
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
const showMedicinesModal = ref(false)
const currentOrderId = route.params.id

// Activate input function
const activateInput = () => {
    inputFocused.value = true
    scrollToBottom(chatBox)
}

// Go back function
const goBack = () => {
    router.push('/chats')
}

// Open medicines modal
const openMedicinesModal = (orderId) => {
    currentOrderId.value = orderId
    showMedicinesModal.value = true
}

// Close medicines modal
const closeMedicinesModal = () => {
    showMedicinesModal.value = false
}

// Process incoming messages (both from WS and history)
const processMessage = (data) => {
    const messageText = data.text || data.message || ''
    const containsDiseases = messageText.toLowerCase().includes('kasalliklar')

    return {
        id: data.id || Date.now(),
        text: messageText,
        image: data.type === 'IMAGE' ? data.image_url : null,
        from: data.sender === 'USER' ? 'bot' : 'me',
        timestamp: data.timestamp || new Date().toISOString(),
        type: data.type || 'TEXT',
        showMedicinesButton: data.sender === 'USER' && containsDiseases,
        orderId: data.order || route.params.id
    }
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
            messages.value.push(processMessage(data))
            scrollToBottom(chatBox)
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

// Fetch chat history
const fetchChatHistory = async () => {
    const chatId = route.params.id
    if (!chatId) return

    try {
        loading.value = true
        const response = await fetch(`https://ifoda-shop.uz/message_api/?order=${chatId}`)

        if (!response.ok) throw new Error('Failed to fetch chat history')

        const history = await response.json()
        messages.value = history.map(processMessage)

        // Add welcome message if chat is empty
        if (messages.value.length === 0) {
            messages.value.push({
                id: Date.now(),
                text: "👋 Salom! Plant Doctor ga xush kelibsiz!\n📸 Kasal o'simlikning rasmini yuboring.\n🧪 Biz tahlil qilib eng yaxshi davolash usulini tavsiya qilamiz!",
                from: 'bot',
                timestamp: new Date().toISOString()
            })
        }
    } catch (error) {
        console.error('Error fetching chat history:', error)
        messages.value.push({
            id: Date.now(),
            text: "Chat tarixini yuklashda xatolik yuz berdi",
            from: 'bot',
            timestamp: new Date().toISOString()
        })
    } finally {
        loading.value = false
        scrollToBottom(chatBox)
    }
}

// Send text message
const sendMessage = () => {
    const messageText = newMessage.value.trim()
    if (!messageText || !socketConnected.value) return

    const messageData = {
        text: messageText,
        sender: 'BOT',
        type: 'TEXT'
    }

    // Add to local messages
    messages.value.push({
        id: Date.now().toString(),
        text: messageText,
        from: 'me',
        timestamp: new Date().toISOString(),
        type: 'TEXT'
    })

    // Send via WebSocket
    if (socket.value?.readyState === WebSocket.OPEN) {
        socket.value.send(JSON.stringify(messageData))
    }

    newMessage.value = ''
    scrollToBottom(chatBox)
}

// Handle image upload
const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const chatId = route.params.id

    const reader = new FileReader()
    reader.onload = async () => {
        // Add to local messages
        messages.value.push({
            id: Date.now(),
            image: reader.result,
            from: 'me',
            timestamp: new Date().toISOString(),
            type: 'IMAGE'
        })
        scrollToBottom(chatBox)

        try {
            // Send to API
            const formData = new FormData()
            formData.append('order', chatId)
            formData.append('type', 'IMAGE')
            formData.append('sender', 'BOT')
            formData.append('image', file)

            const response = await fetch('https://ifoda-shop.uz/message_api/', {
                method: 'POST',
                body: formData
            })

            if (!response.ok) throw new Error('API request failed')
        } catch (error) {
            console.error('Error sending image:', error)
            messages.value.push({
                id: Date.now(),
                text: "Rasm yuborishda xatolik yuz berdi. Iltimos, qayta urunib ko'ring.",
                from: 'bot',
                timestamp: new Date().toISOString()
            })
        }
    }
    reader.readAsDataURL(file)
    e.target.value = null
}

// Initialize
onMounted(() => {
    connectWebSocket()
    fetchChatHistory()
})

// Clean up
onBeforeUnmount(() => {
    if (socket.value) {
        socket.value.close()
    }
})
</script>

<style scoped></style>