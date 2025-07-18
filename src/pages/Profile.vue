<template>
    <div class="profile-page">
        <!-- Avatar + Name -->
        <div class="user-box">
            <div class="avatar-wrap">
                <img class="avatar" :src="user?.photo_url" />
            </div>
            <h2>{{ user?.first_name || 'Mehmon' }}</h2>
            <p class="user-phone">{{ userPhone }}</p>
        </div>

        <!-- Buyurtmalar -->
        <div class="card">
            <div class="card-header">
                <h3>🧾 Oxirgi buyurtmalar</h3>
                <router-link v-if="orders.length > 0" to="/orders" class="view-all">
                    Barchasini ko'rish
                </router-link>
            </div>

            <div v-if="loadingOrders" class="loading-orders">
                <div v-for="i in 3" :key="i" class="order-skeleton"></div>
            </div>

            <div v-else-if="orders.length === 0" class="empty-orders">
                <!-- <img src="@/assets/empty-orders.png" alt="No orders" class="empty-img" /> -->
                <p>Sizda hali buyurtmalar mavjud emas</p>
                <router-link to="/" class="shop-btn">Xarid qilish</router-link>
            </div>

            <div v-else class="orders-list">
                <div v-for="order in recentOrders" :key="order.id" class="order-item">
                    <div class="order-info">
                        <span class="order-id">#{{ order.id.slice(0, 8) }}</span>
                        <span class="order-date">{{ formatDate(order.order_date) }}</span>
                    </div>
                    <div class="order-meta">
                        <span class="order-payment">
                            {{ getPaymentMethod(order.payment_method) }}
                            <span v-if="order.is_paid" class="paid-badge">To'langan</span>
                            <span v-else class="unpaid-badge">To'lanmagan</span>
                        </span>
                        <span class="order-delivery">
                            {{ getDeliveryMethod(order.delivery_method) }}
                        </span>
                    </div>
                    <div class="order-status" :class="getStatusClass(order.status)">
                        {{ getStatusText(order.status) }}
                    </div>
                    <div class="order-total">{{ formatPrice(order.total_amount) }}</div>
                </div>
            </div>
        </div>

        <!-- Yordam -->
        <div class="card">
            <h3>📬 Yordam</h3>
            <a class="support-btn" :href="supportLink" target="_blank">
                Telegram orqali bog'lanish
            </a>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { getDeliveryMethod, getPaymentMethod, getStatusClass, getStatusText } from '../utility/status'
import { formatDate, formatPhoneNumber, formatPrice } from '../utility/formatter'

const router = useRouter()

// Foydalanuvchi ma'lumotlari
const user = ref(null)
const userPhone = ref('')
const orders = ref([])
const loadingOrders = ref(false)
const error = ref(null)
const supportLink = ref('https://t.me/ifoda_support')

// Telegramdan foydalanuvchi ma'lumotlarini olish
onMounted(() => {
    const tg = window.Telegram?.WebApp
    if (tg?.initDataUnsafe?.user) {
        user.value = tg.initDataUnsafe.user
        userPhone.value = formatPhoneNumber(tg.initDataUnsafe.user?.phone_number)
        fetchOrders(tg.initDataUnsafe.user?.id)
    } else {
        console.warn("Telegram foydalanuvchi topilmadi.")
        // Demo ma'lumotlar
        user.value = { first_name: "Foydalanuvchi" }
        fetchOrders() // Test uchun
    }
})

// Oxirgi 5 ta buyurtma
const recentOrders = computed(() => {
    return [...orders.value]
        .sort((a, b) => new Date(b.order_date) - new Date(a.order_date))
        .slice(0, 2)
})

// Buyurtmalarni yuklash
const fetchOrders = async (userId) => {
    loadingOrders.value = true
    error.value = null

    try {
        const response = await axios.get(`https://ifoda-shop.uz/order_api/my_orders/?user_id=${userId}`)
        orders.value = response.data
    } catch (err) {
        error.value = "Buyurtmalarni yuklashda xatolik yuz berdi"
        console.error("Buyurtmalarni yuklashda xato:", err)
    } finally {
        loadingOrders.value = false
    }
}


</script>

<style scoped>
.profile-page {
    padding: 20px 16px 80px 16px;
    min-height: 100vh;
    background: var(--bg-color);
    color: var(--text-color);
}

.user-box {
    text-align: center;
    margin-bottom: 24px;

}

.avatar-wrap {
    display: inline-block;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    padding: 5px;
    background: var(--primary);
}

.avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid var(--bg-color);
}

h2 {
    margin-top: 10px;
    font-size: 20px;
    font-weight: 600;
}

.card {
    background: var(--card-bg);
    margin: 0 15px 20px 15px;
    border-radius: 16px;
    padding: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    transition: ease-in-out 250ms;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

h3 {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-color);
}

.view-all {
    font-size: 14px;
    color: var(--primary);
    text-decoration: none;
}

.setting-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
}

.theme-btn {
    background: var(--primary);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
}

/* Buyurtmalar ro'yxati */
.orders-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.order-item {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    border: 1px solid rgba(0, 0, 0, 0.05);
}

.order-info {
    display: flex;
    justify-content: space-between;
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
    padding: 4px 8px;
    border-radius: 6px;
    align-self: flex-start;
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

.order-total {
    font-weight: 600;
    font-size: 16px;
    text-align: right;
}

/* Yuklanayotgan holat */
.loading-orders {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.order-skeleton {
    height: 80px;
    border-radius: 12px;
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

/* Bo'sh buyurtmalar */
.empty-orders {
    text-align: center;
    padding: 20px 0;
}

.empty-img {
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
    padding: 10px 24px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 500;
}

/* Yordam */
.support-btn {
    display: inline-block;
    margin-top: 6px;
    text-decoration: none;
    color: var(--primary);
    background: rgba(64, 172, 60, 0.05);
    padding: 10px 16px;
    border-radius: 10px;
    font-weight: 500;
    transition: background 0.3s ease;
}

.support-btn:hover {
    background: rgba(64, 172, 60, 0.12);
}

.user-phone {
    margin-top: 4px;
    font-size: 14px;
    opacity: 0.8;
}

.order-meta {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    margin: 6px 0;
    color: var(--text-color);
    opacity: 0.8;
}

.order-payment,
.order-delivery {
    display: flex;
    align-items: center;
    gap: 4px;
}

.paid-badge {
    background: rgba(64, 172, 60, 0.1);
    color: var(--primary);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 11px;
}

.unpaid-badge {
    background: rgba(244, 67, 54, 0.1);
    color: #f44336;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 11px;
}

/* ... qolgan stillar ... */
</style>