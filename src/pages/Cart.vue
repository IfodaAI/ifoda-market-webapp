<template>
    <div class="cart-page">
        <h1>🛒 Savatchangiz</h1>

        <div v-if="cart.items.length > 0" class="cart-list">
            <div v-for="item in cart.items" :key="item.id" class="cart-item">
                <img src="@/assets/no-image.png" alt="Mahsulot rasmi" class="thumb" />
                <div class="info">
                    <div class="top">
                        <h3>{{ item.title || item.name }}</h3>
                        <button class="remove-btn" @click="cart.removeFromCart(item.id)">🗑️</button>
                    </div>
                    <p class="price">
                        Narxi: <strong>{{ (item.price || 0).toLocaleString('uz-UZ') }} so'm</strong>
                    </p>
                    <div class="bottom">
                        <div class="quantity">
                            <button @click="cart.decrement(item.id)">➖</button>
                            <span>{{ item.quantity }}</span>
                            <button @click="cart.increment(item.id)">➕</button>
                        </div>
                        <p class="total">
                            Jami: {{ ((item.price || 0) * item.quantity).toLocaleString('uz-UZ') }} so'm
                        </p>
                    </div>
                </div>
            </div>

            <div class="cart-summary">
                <div class="line" />
                <div class="total-box">
                    <span>Umumiy:</span>
                    <strong>{{ cart.total.toLocaleString('uz-UZ') }} so'm</strong>
                </div>
                <button class="pay-btn" @click="openPaymentModal">
                    💳 Buyurtma berish
                </button>
            </div>
        </div>

        <div v-else class="empty">
            <img src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" alt="Bo'sh savat" />
            <p>Savat hozircha bo'sh 🙃</p>
            <router-link to="/" class="shop-btn">Bosh sahifaga qaytish</router-link>
        </div>

        <!-- To'lov modali -->
        <div v-if="showPaymentModal" class="modal-overlay">
            <div class="modal">
                <button class="close-modal" @click="closePaymentModal">✕</button>
                <h2>Buyurtma ma'lumotlari</h2>

                <form @submit.prevent="handlePayment">
                    <div class="form-group">
                        <label>Ismingiz</label>
                        <input v-model="customerData.name" type="text" placeholder="Ism familiya" required>
                    </div>

                    <div class="form-group">
                        <label>Telefon raqam</label>
                        <input v-model="customerData.phone" type="tel" placeholder="+998 XX XXX XX XX" required>
                    </div>

                    <div class="form-group">
                        <label>Yetkazib berish manzili</label>
                        <textarea v-model="customerData.address" placeholder="To'liq manzil" required></textarea>
                    </div>

                    <div class="form-group">
                        <label>Qo'shimcha izoh (ixtiyoriy)</label>
                        <textarea v-model="customerData.comment"
                            placeholder="Buyurtmangiz haqida qo'shimcha ma'lumot"></textarea>
                    </div>

                    <div class="payment-methods">
                        <h3>To'lov usuli</h3>
                        <div class="methods">
                            <label class="method">
                                <input type="radio" v-model="paymentMethod" value="cash" checked>
                                <span>Naqd pul</span>
                            </label>
                            <label class="method">
                                <input type="radio" v-model="paymentMethod" value="card">
                                <span>Karta orqali</span>
                            </label>
                            <label class="method">
                                <input type="radio" v-model="paymentMethod" value="click">
                                <span>Click</span>
                            </label>
                        </div>
                    </div>

                    <div class="modal-buttons">
                        <button type="button" @click="closePaymentModal" class="cancel-btn">
                            Bekor qilish
                        </button>
                        <button type="submit" :disabled="cart.isLoading" class="submit-btn">
                            {{ cart.isLoading ? 'Yuborilmoqda...' : 'Buyurtma berish' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Xato xabari -->
        <div v-if="cart.error" class="error-message">
            {{ cart.error }}
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../store/cartStore'
import '../styles/cart.css'

const router = useRouter()
const cart = useCartStore()

const showPaymentModal = ref(false)
const paymentMethod = ref('cash')
const customerData = ref({
    name: '',
    phone: '',
    address: '',
    comment: ''
})

const openPaymentModal = () => {
    if (cart.items.length === 0) return
    showPaymentModal.value = true
}

const closePaymentModal = () => {
    showPaymentModal.value = false
    cart.error = null
}

const handlePayment = async () => {
    try {
        const orderData = {
            ...customerData.value,
            payment_method: paymentMethod.value,
            items: cart.items,
            total_amount: cart.total
        }

        // APIga buyurtma yuborish
        const order = await cart.submitOrder(orderData)

        // Muvaffaqiyatli bo'lsa tasdiqlash sahifasiga yo'naltiramiz
        router.push({
            name: 'OrderConfirmation',
            query: { orderId: order.id }
        })

    } catch (error) {
        console.error('Buyurtma xatosi:', error)
    }
}
</script>
