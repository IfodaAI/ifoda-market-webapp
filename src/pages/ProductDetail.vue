<template>
    <div class="detail-page">
        <div class="top-bar">
            <button class="back-btn" @click="goBack">
                <span class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#40ac3c" viewBox="0 0 24 24">
                        <path
                            d="M15.54 4.46a1.25 1.25 0 0 1 0 1.77L9.77 12l5.77 5.77a1.25 1.25 0 1 1-1.77 1.77l-6.66-6.66a1.25 1.25 0 0 1 0-1.77l6.66-6.66a1.25 1.25 0 0 1 1.77 0z" />
                    </svg>
                </span>
                <span>Ortga</span>
            </button>
        </div>

        <div v-if="loading" class="loading">Yuklanmoqda...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else>
            <img :src="product.image" v-if="product.image" alt="Product Image" class="product-image" />
            <img src="@/assets/no-image.png" v-else alt="Product Image" class="product-image" />


            <div class="info-box">
                <h1 class="title">{{ product.name }}</h1>
                <p class="price">{{ formatPrice(product.price) }}</p>
                <p class="description">{{ product.description }}</p>

                <button :class="['add-btn', { added: isInCart }]" @click="addToCart(product)" :disabled="isInCart">
                    {{ isInCart ? '✅ Savatga qo\'shilgan' : '🛒 Savatga qo\'shish' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useCartStore } from '../store/cartStore'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()
const isInCart = ref(false)

const product = ref({
    id: '',
    name: '',
    description: '',
    price: 0,
    image: null
})
const loading = ref(false)
const error = ref(null)

const goBack = () => {
    router.back()
}

const fetchProduct = async () => {
    const id = route.params.id
    loading.value = true
    error.value = null

    try {
        const response = await axios.get(`https://ifoda-shop.uz/pills_api/${id}/`)
        product.value = {
            id: response.data.id,
            name: response.data.name,
            description: response.data.description,
            price: response.data.price,
            image: response.data.image
        }
        checkCartStatus()
    } catch (err) {
        error.value = 'Mahsulot yuklanmadi. Iltimos, keyinroq urunib ko\'ring.'
        console.error('API error:', err)
    } finally {
        loading.value = false
    }
}
const checkCartStatus = () => {
    try {
        const cartData = localStorage.getItem('cart')
        if (cartData) {
            const cartItems = JSON.parse(cartData)
            isInCart.value = cartItems.some(item => item.id === product.value.id)
        } else {
            isInCart.value = false
        }
    } catch (e) {
        console.error('Savatni tekshirishda xato:', e)
        isInCart.value = false
    }
}

onMounted(fetchProduct)
onMounted(() => {
    const item = localStorage.getItem('cart');
})

const addToCart = (item) => {
    cart.addToCart(item)
}

const formatPrice = (price) => {
    return typeof price === 'number'
        ? price.toLocaleString('uz-UZ') + ' so\'m'
        : 'Noma\'lum narx'
}
</script>

<style scoped>
.top-bar {
    margin: 5px 0;
}

.detail-page {
    padding: 16px;
    background: var(--bg-color);
    min-height: 100vh;
    transition: background 0.3s;
}

.product-image {
    width: 100%;
    height: auto;
    max-height: 400px;
    border-radius: 16px;
    object-fit: cover;
    box-shadow: 0 6px 20px rgba(64, 172, 60, 0.2);
}

.info-box {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.title {
    font-size: 20px;
    font-weight: bold;
    color: var(--text-color);
}

.price {
    font-size: 18px;
    color: var(--primary);
    font-weight: 700;
    text-shadow: 0 1px 2px rgba(64, 172, 60, 0.1);
}

.description {
    font-size: 14px;
    line-height: 1.5;
    color: var(--text-color);
    background: var(--card-bg);
    padding: 12px;
    border-radius: 12px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.add-btn {
    background-color: var(--primary);
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.add-btn.added {
    background: linear-gradient(135deg, #b8efb7, #92dc91);
    color: #2e7d32;
    cursor: not-allowed;
    box-shadow: none;
}

.add-btn:hover {
    filter: brightness(1.1);
    box-shadow: 0 4px 14px rgba(64, 172, 60, 0.3);
}

.back-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    color: var(--primary);
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    padding: 6px 10px;
    border-radius: 10px;
    transition: background 0.3s ease;
}

.back-btn:hover {
    background-color: rgba(64, 172, 60, 0.1);
}

.back-btn svg {
    width: 20px;
    height: 20px;
    fill: var(--primary);
}
</style>
