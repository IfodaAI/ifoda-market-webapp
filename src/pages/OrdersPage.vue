<template>
    <div class="orders-page">
        <div class="header">
            <!-- <button class="back-btn" @click="router.back()">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
            </button> -->
            <h1>Barcha buyurtmalar</h1>
        </div>

        <div v-if="loading" class="loading">
            <div v-for="i in 5" :key="i" class="order-skeleton"></div>
        </div>

        <div v-else-if="error" class="error-message">
            {{ error }}
            <button @click="fetchOrders" class="retry-btn">Qayta urinish</button>
        </div>

        <div v-else-if="orders.length === 0" class="empty-orders">
            <p>Sizda hali buyurtmalar mavjud emas</p>
            <router-link to="/" class="shop-btn">Xarid qilish</router-link>
        </div>

        <div v-else class="orders-list">
            <div v-for="order in orders" :key="order.id" class="order-card">
                <div class="order-header">
                    <span class="order-id">Buyurtma #{{ order.id?.slice(0, 8) || 'Noma\'lum' }}</span>
                    <span class="order-date">{{ formatDate(order.order_date || order.created_at) }}</span>
                </div>

                <div class="order-status" :class="getStatusClass(order.status)">
                    {{ getStatusText(order.status) }}
                </div>

                <div class="order-items" v-if="order.items && order.items.length > 0, console.log(order.value)">
                    <div v-for="(item, index) in order.items.slice(0, 2)" :key="index" class="order-item">
                        <!-- <img :src="item.image || require('@/assets/no-image.png')" alt="Product" class="item-image" /> -->
                        <div class="item-info">
                            <span class="item-name">{{ item.name || 'Noma\'lum mahsulot' }}</span>
                            <span class="item-quantity">{{ item.quantity || 0 }} x {{ formatPrice(item.price) }}</span>
                        </div>
                    </div>
                    <div v-if="order.items.length > 2" class="more-items">
                        + {{ order.items.length - 2 }} ta mahsulot
                    </div>
                </div>
                <div v-else class="no-items">
                    Mahsulotlar haqida ma'lumot mavjud emas
                </div>

                <div class="order-footer">
                    <div class="total-amount">Jami: {{ formatPrice(order.total_amount) }}</div>
                    <button class="details-btn" @click="viewOrder(order.id)">Batafsil</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { formatDate, formatPrice } from '../utility/formatter'
import { getStatusClass, getStatusText } from '../utility/status'
const orders = ref([])
const loading = ref(false)
const error = ref(null)

onMounted(() => {
    const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id || 1330892088
    fetchOrders(userId)
})

const fetchOrders = async (userId) => {
    loading.value = true
    error.value = null

    try {
        const response = await axios.get(`https://ifoda-shop.uz/order_api/my_orders/?user_id=${userId || '1330892088'}`)
        // API dan kelgan buyurtmalarni tekshirib olish
        orders.value = Array.isArray(response.data) ? response.data : []
        console.log('arr', orders.value);

    } catch (err) {
        error.value = "Buyurtmalarni yuklashda xatolik yuz berdi"
        console.error("Buyurtmalarni yuklashda xato:", err)
    } finally {
        loading.value = false
    }
}

const viewOrder = (orderId) => {
    router.push(`/orders/${orderId}`)
}

</script>

<style scoped>
.orders-page {
    padding: 16px 16px 80px 16px;
    min-height: 100vh;
    background: var(--bg-gradient);
    color: var(--text-color);
}

.header {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    position: relative;
}

.back-btn {
    background: none;
    border: none;
    padding: 8px;
    margin-right: 12px;
    cursor: pointer;
    color: var(--text-color);
}

h1 {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
}

/* Buyurtma kartalari */
.orders-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.order-card {
    background: var(--card-bg);
    border-radius: 16px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    cursor: pointer;
    transition: transform 0.2s;
}

.order-card:hover {
    transform: translateY(-2px);
}

.order-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 14px;
}

.order-id {
    font-weight: 600;
}

.order-date {
    color: var(--text-color);
    opacity: 0.7;
}

.order-status {
    font-size: 14px;
    padding: 4px 12px;
    border-radius: 20px;
    display: inline-block;
    margin-bottom: 16px;
}

.order-status.completed {
    background: rgba(64, 172, 60, 0.1);
    color: var(--primary);
}

.order-status.processing {
    background: rgba(255, 193, 7, 0.1);
    color: #ffc107;
}

.order-status.pending {
    background: rgba(33, 150, 243, 0.1);
    color: #2196f3;
}

.order-status.cancelled {
    background: rgba(244, 67, 54, 0.1);
    color: #f44336;
}

.order-items {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
}

.order-item {
    display: flex;
    gap: 12px;
    align-items: center;
}

.item-image {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    object-fit: cover;
    background: var(--skeleton-base);
}

.item-info {
    display: flex;
    flex-direction: column;
}

.item-name {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 4px;
}

.item-quantity {
    font-size: 13px;
    opacity: 0.7;
}

.more-items {
    font-size: 13px;
    opacity: 0.7;
    text-align: center;
    padding: 8px;
}

.order-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 12px;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.total-amount {
    font-weight: 600;
    font-size: 16px;
}

.details-btn {
    background: var(--primary);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
}

/* Yuklanayotgan holat */
.loading {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.order-skeleton {
    height: 140px;
    border-radius: 16px;
    background: linear-gradient(90deg, var(--skeleton-base), var(--skeleton-highlight), var(--skeleton-base));
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
    0% {
        background-position: -200% 0;
    }

    100% {
        background-position: 200% 0;
    }
}

/* Xato xabari */
.error-message {
    text-align: center;
    padding: 40px 20px;
    color: var(--danger);
}

.retry-btn {
    margin-top: 16px;
    background: var(--danger);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
}

/* Bo'sh buyurtmalar */
.empty-orders {
    text-align: center;
    padding: 40px 20px;
}

.empty-orders img {
    width: 150px;
    height: 150px;
    opacity: 0.7;
    margin-bottom: 16px;
}

.empty-orders p {
    margin-bottom: 16px;
    color: var(--text-color);
    opacity: 0.7;
}

.shop-btn {
    display: inline-block;
    background: var(--primary);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 500;
}
</style>