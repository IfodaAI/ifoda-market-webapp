<template>
    <div class="cart-page">
        <h1>🛒 Savatchangiz</h1>

        <div v-if="cart.items.length > 0" class="cart-list">
            <div v-for="item in cart.items" :key="item.id" class="cart-item">
                <img :src="item.image" alt="img" class="thumb" />
                <div class="info">
                    <div class="top">
                        <h3>{{ item.title }}</h3>
                        <button class="remove-btn" @click="cart.removeFromCart(item.id)">🗑️</button>
                    </div>
                    <p class="price">
                        Narxi: <strong>{{ item.price.toLocaleString() }} so‘m</strong>
                    </p>
                    <div class="bottom">
                        <div class="quantity">
                            <button @click="cart.decrement(item.id)">➖</button>
                            <span>{{ item.quantity }}</span>
                            <button @click="cart.increment(item.id)">➕</button>
                        </div>
                        <p class="total">
                            Jami: {{ (item.price * item.quantity).toLocaleString() }} so‘m
                        </p>
                    </div>
                </div>
            </div>

            <div class="cart-summary">
                <div class="line" />
                <div class="total-box">
                    <span>Umumiy:</span>
                    <strong>{{ cart.total.toLocaleString() }} so‘m</strong>
                </div>
                <button class="pay-btn" @click="pay">
                    💳 Karta orqali to‘lash
                </button>
            </div>
        </div>

        <div v-else class="empty">
            <img src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" alt="empty" />
            <p>Savat hozircha bo‘sh 🙃</p>
        </div>
    </div>
</template>

<script setup>
import { useCartStore } from '../store/cartStore'

const cart = useCartStore()

const pay = () => {
    alert('💳 To‘lov funktsiyasi hozircha aktiv emas!')
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
    border: 1px solid #ccc;
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
}

.bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
    background-color: var(--accent);
    color: var(--card-bg);
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

/* Responsivlik */
@media (max-width: 420px) {
    .cart-item {
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
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

    .pay-btn {
        font-size: 14px;
        padding: 10px 20px;
    }

    h1 {
        font-size: 18px;
    }
}
</style>
