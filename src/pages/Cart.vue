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
import { useCartStore } from '../store/cartStore';



const cart = useCartStore()

const pay = () => {
    alert('💳 To‘lov funktsiyasi hozircha aktiv emas!')
}
</script>

<style scoped>
.cart-page {
    padding: 16px;
    padding-bottom: 100px;
    min-height: 100vh;
    font-family: 'Segoe UI', sans-serif;
}

h1 {
    font-size: 22px;
    margin-bottom: 16px;
    color: #2e7d32;
}

.cart-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.cart-item {
    background-color: #ffffff;
    border-radius: 14px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    display: flex;
    gap: 12px;
    padding: 12px;
    align-items: flex-start;
}

.thumb {
    width: 80px;
    height: 80px;
    border-radius: 10px;
    object-fit: cover;
    border: 1px solid #e0e0e0;
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
    color: #333;
}

.remove-btn {
    padding: 4px 10px;
    font-size: 13px;
    background-color: #ff5252;
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.3s ease;
}

.remove-btn:hover {
    background-color: #e53935;
}

.price {
    margin: 0;
    color: #555;
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
    background-color: #40ac3c;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    font-size: 14px;
    transition: 0.2s;
}

.quantity button:hover {
    background-color: #369634;
}

.quantity span {
    font-size: 15px;
    font-weight: 600;
    color: #333;
}

.total {
    color: #40ac3c;
    font-weight: bold;
    font-size: 14px;
}

.cart-summary {
    margin-top: 20px;
    text-align: center;
}

.line {
    height: 1px;
    background-color: #ccc;
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
    background-color: #40ac3c;
    color: white;
    font-size: 16px;
    font-weight: 600;
    padding: 12px 24px;
    border: none;
    border-radius: 14px;
    cursor: pointer;
    transition: 0.3s ease;
    width: 100%;
}

.pay-btn:hover {
    background-color: #359932;
    box-shadow: 0 4px 12px rgba(64, 172, 60, 0.3);
}

.empty {
    text-align: center;
    margin-top: 50px;
    color: #888;
}

.empty img {
    width: 100px;
    margin-bottom: 12px;
    opacity: 0.7;
}

@media (max-width: 420px) {
    .cart-item {
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
    }

    .info {
        width: 100%;

    }

    .thumb {
        width: 100%;
        height: auto;
        max-height: 180px;
    }

    .top {
        /* flex-direction: column; */
        align-items: center;
        justify-content: space-between;
        gap: 4px;
    }

    .remove-btn {
        padding: 4px 8px;
        font-size: 12px;
    }

    .bottom {
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
    }

    .quantity {
        gap: 6px;
    }

    .quantity button {
        padding: 5px 10px;
        font-size: 13px;
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
