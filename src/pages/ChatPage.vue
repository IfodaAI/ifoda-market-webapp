<template>
    <div class="chat-page">
        <div class="chat-header">💬 Chat</div>

        <div class="chat-box">
            <div v-for="msg in messages" :key="msg.id" class="chat-message" :class="msg.from">
                <img v-if="msg.image" :src="msg.image" class="chat-image" />
                <p v-if="msg.text">{{ msg.text }}</p>
            </div>
        </div>

        <div class="chat-input">
            <input type="file" @change="handleImageUpload" accept="image/*" hidden ref="fileInput" />
            <button class="upload-btn" @click="$refs.fileInput.click()">📎</button>

            <input v-model="newMessage" type="text" placeholder="Xabar yozing..." />

            <button @click="sendMessage">📩</button>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'



onMounted(() => {
    messages.value = [
        {
            id: Date.now(),
            text: "👋 Salom! Bizning o‘simlik shifokorimizga xush kelibsiz!\n📸 Iltimos, kasallangan o‘simlikingizning suratini yuboring.\n🧪 Biz uni tahlil qilib, eng mos davo choralarini tavsiya qilamiz!",
            from: 'bot'
        }
    ]
})


const messages = ref([
    { id: 1, text: 'Salom!', from: 'other' },
    { id: 2, text: 'Qandaysiz?', from: 'me' }
])

const newMessage = ref('')
const fileInput = ref()

const sendMessage = () => {
    if (newMessage.value.trim()) {
        messages.value.push({
            id: Date.now(),
            text: newMessage.value,
            from: 'me'
        })
        newMessage.value = ''
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
        }
        reader.readAsDataURL(file)
    }
}
</script>

<style scoped>
.chat-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: var(--bg-color);
    color: var(--text-color);
    padding-bottom: 64px;
}

.chat-header {
    padding: 12px;
    font-weight: bold;
    font-size: 18px;
    text-align: center;
    background: var(--primary);
    color: white;
    position: sticky;
    top: 0;
    z-index: 10;
}

.chat-box {
    flex: 1;
    padding: 12px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.chat-message {
    max-width: 70%;
    padding: 10px;
    border-radius: 12px;
    word-wrap: break-word;
    background: var(--card-bg);
}

.chat-message.me {
    align-self: flex-end;
    background: #d4f5d4;
    color: #222;
}

.chat-message.other {
    align-self: flex-start;
    background: #f1f1f1;
    color: #222;
}

.chat-message img.chat-image {
    width: 160px;
    border-radius: 12px;
    margin-top: 6px;
}

.chat-input {
    display: flex;
    align-items: center;
    padding: 10px;
    /* border-top: 1px solid #ccc; */
    gap: 8px;
    background: var(--bg-color);
    position: fixed;
    bottom: 8%;
    width: 100%;
}

.chat-input input[type="text"] {
    flex: 1;
    padding: 10px;
    border-radius: 10px;
    border: 1.5px solid var(--primary);
    font-size: 14px;
    background: var(--card-bg);
    color: var(--text-color);
    outline: none;
}

.chat-input button {
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 10px;
    padding: 8px 12px;
    font-size: 16px;
    cursor: pointer;
}

.upload-btn {
    background: transparent;
    color: var(--primary);
    font-size: 20px;
}
</style>
