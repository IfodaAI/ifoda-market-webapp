<template>
    <div class="profile-page">
        <!-- Avatar + Name -->
        <div class="user-box">
            <div class="avatar-wrap">
                <img class="avatar" :src="avatarUrl" />
            </div>
            <h2>{{ userName }}</h2>
        </div>

        <!-- Sozlamalar -->
        <div class="card">
            <h3>⚙️ Sozlamalar</h3>
            <div class="setting-row">
                <span>Tema:</span>
                <button class="theme-btn" @click="toggleTheme">
                    {{ isDark ? '🌙 Tungi' : '🔆 Yorug‘' }}
                </button>
            </div>
        </div>

        <!-- Buyurtmalar -->
        <div class="card">
            <h3>🧾 Buyurtmalarim</h3>
            <div class="orders">
                <span class="order-chip" v-for="order in orders" :key="order.id">
                    🛍️ {{ order.title }}
                </span>
            </div>
        </div>

        <!-- Yordam -->
        <div class="card">
            <h3>📬 Yordam</h3>
            <a class="support-btn" href="https://t.me/sizning_bot" target="_blank">
                Telegram orqali bog‘lanish
            </a>
        </div>

        <!-- Logout -->
        <div class="logout">
            <button class="logout-btn" @click="logout">🚪 Chiqish</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const userName = 'Iboxim'
const avatarUrl = 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Iboxim'

const isDark = ref(false)
const toggleTheme = () => {
    isDark.value = !isDark.value
    document.body.classList.toggle('dark-mode', isDark.value)
}

const orders = ref([
    { id: 1, title: 'Pizza Margherita' },
    { id: 2, title: 'Galaxy A54' }
])

const logout = () => {
    if (window.Telegram?.WebApp?.close) {
        window.Telegram.WebApp.close()
    } else {
        alert('Bu faqat Telegram WebApp ichida ishlaydi.')
    }
}
</script>

<style scoped>
.profile-page {
    padding: 20px 16px 100px;
    min-height: 100vh;
}

/* Avatar style */
.user-box {
    text-align: center;
    margin-bottom: 24px;
}

.avatar-wrap {
    display: inline-block;
    padding: 4px;
    background: linear-gradient(135deg, #40ac3c, #2d7a2a);
    border-radius: 50%;
}

.avatar {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid white;
}

h2 {
    margin-top: 10px;
    font-size: 18px;
    color: #2e7d32;
}

/* Cards */
.card {
    background: white;
    border-radius: 16px;
    padding: 14px 16px;
    margin-bottom: 20px;
    box-shadow: 0 2px 12px rgba(64, 172, 60, 0.1);
}

h3 {
    margin-bottom: 10px;
    font-size: 16px;
    color: #2e7d32;
}

.setting-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
}

.theme-btn {
    background: #40ac3c;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 13px;
    cursor: pointer;
    transition: background 0.3s;
}

.theme-btn:hover {
    background: #2d7a2a;
}

/* Buyurtmalar */
.orders {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.order-chip {
    background: #e6f4ea;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 13px;
    color: #2e7d32;
    border: 1px solid #c5e1c5;
}

/* Support */
.support-btn {
    display: inline-block;
    margin-top: 6px;
    text-decoration: none;
    color: #40ac3c;
    background: #f0fdf4;
    padding: 8px 14px;
    border-radius: 10px;
    font-weight: 500;
    transition: background 0.3s ease;
}

.support-btn:hover {
    background: #e2fbe9;
}

/* Logout */
.logout {
    text-align: center;
    margin-top: 20px;
}

.logout-btn {
    background: #e53935;
    color: white;
    padding: 10px 24px;
    border: none;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s ease;
}

.logout-btn:hover {
    background: #c62828;
}
</style>
