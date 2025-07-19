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
        <div class="card-profile">
            <div class="card-header-profile">
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
        <div class="card-profile">
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
import '../styles/profile.css'

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
        const response = await axios.get(
            `https://ifoda-shop.uz/order_api/my_orders/`,
            {
                params: {
                    user_id: userId,
                    status: 'COMPLETED'
                }
            }
        )
        orders.value = response.data
    } catch (err) {
        error.value = "Buyurtmalarni yuklashda xatolik yuz berdi"
        console.error("Buyurtmalarni yuklashda xato:", err)
    } finally {
        loadingOrders.value = false
    }
}


</script>
