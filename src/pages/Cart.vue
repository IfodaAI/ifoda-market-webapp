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

<style scoped>
.cart-page {
    padding: 16px;
    padding-bottom: 120px;
    background-color: var(--bg-color);
    color: var(--text-color);
    min-height: calc(100vh - 64px);
    transition: background 0.3s ease, color 0.3s ease;
}

/* Sarlavha */
h1 {
    font-size: 22px;
    margin-bottom: 16px;
    color: var(--accent);
}

.cart-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.cart-item {
    background-color: var(--card-bg);
    border-radius: 14px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    display: flex;
    gap: 12px;
    padding: 12px;
    align-items: flex-start;
    transition: background 0.3s ease;
}

.thumb {
    width: 80px;
    height: 80px;
    border-radius: 10px;
    object-fit: cover;
    border: 1px solid #eee;
}

.info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.top {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.top h3 {
    font-size: 16px;
    margin: 0;
    color: var(--text-color);
}

.remove-btn {
    padding: 4px 10px;
    font-size: 13px;
    background-color: var(--danger);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s;
}

.remove-btn:hover {
    background-color: var(--danger-hover);
}

.price {
    margin: 0;
    font-size: 14px;
    color: var(--muted);
}

.bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
}

.quantity {
    display: flex;
    align-items: center;
    gap: 10px;
}

.quantity button {
    padding: 5px 12px;
    background-color: var(--accent);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    font-size: 14px;
    transition: background 0.2s ease;
}

.quantity button:hover {
    background-color: var(--accent-hover);
}

.total {
    font-weight: bold;
    font-size: 14px;
    color: var(--accent);
}

.cart-summary {
    margin-top: 20px;
    text-align: center;
}

.line {
    height: 1px;
    background-color: var(--muted);
    opacity: 0.3;
    margin-bottom: 12px;
}

.total-box {
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    font-size: 17px;
    margin-bottom: 16px;
}

.pay-btn {
    background-color: var(--primary);
    color: var(--text-color);
    font-size: 16px;
    font-weight: 600;
    padding: 12px 24px;
    border: none;
    border-radius: 14px;
    cursor: pointer;
    transition: background 0.3s ease, transform 0.2s ease;
    width: 100%;
}

.pay-btn:hover {
    background-color: var(--accent-hover);
    transform: scale(1.01);
}

.empty {
    text-align: center;
    margin-top: 50px;
    color: var(--muted);
}

.empty img {
    width: 100px;
    margin-bottom: 12px;
    opacity: 0.7;
}

.shop-btn {
    display: inline-block;
    margin-top: 16px;
    padding: 10px 20px;
    background-color: var(--accent);
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
}

/* Modal uchun stillar */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal {
    background-color: var(--card-bg);
    padding: 24px;
    border-radius: 16px;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
}

.close-modal {
    position: absolute;
    top: 12px;
    right: 12px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: var(--muted);
}

.modal h2 {
    margin-top: 0;
    color: var(--accent);
    text-align: center;
}

.form-group {
    margin-bottom: 16px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: var(--text-color);
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid var(--muted);
    border-radius: 8px;
    background-color: var(--bg-color);
    color: var(--text-color);
    font-size: 14px;
}

.form-group textarea {
    min-height: 80px;
    resize: vertical;
}

.payment-methods {
    margin: 20px 0;
}

.payment-methods h3 {
    margin-bottom: 12px;
    color: var(--text-color);
}

.methods {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.method {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background-color: var(--bg-color);
    border-radius: 8px;
    cursor: pointer;
}

.method input {
    margin: 0;
}

.modal-buttons {
    display: flex;
    gap: 12px;
    margin-top: 24px;
}

.cancel-btn,
.submit-btn {
    flex: 1;
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    border: none;
    font-size: 14px;
}

.cancel-btn {
    background-color: var(--danger);
    color: white;
}

.cancel-btn:hover {
    background-color: var(--danger-hover);
}

.submit-btn {
    background-color: var(--accent);
    color: white;
}

.submit-btn:hover:not(:disabled) {
    background-color: var(--accent-hover);
}

.submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.error-message {
    color: var(--danger);
    text-align: center;
    margin-top: 16px;
    padding: 10px;
    background-color: rgba(255, 0, 0, 0.1);
    border-radius: 8px;
}

/* Responsivlik */
@media (max-width: 420px) {
    .cart-item {
        flex-direction: column;
        align-items: flex-start;
    }

    .thumb {
        width: 100%;
        height: auto;
        max-height: 180px;
    }

    .bottom {
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
    }

    .quantity {
        gap: 6px;
    }

    .modal {
        padding: 16px;
    }

    .modal-buttons {
        flex-direction: column;
    }
}
</style>