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

        <img :src="product.image" alt="Product Image" class="product-image" />

        <div class="info-box">
            <h1 class="title">{{ product.title }}</h1>
            <p class="price">{{ formatPrice(product.price) }}</p>
            <p class="description">{{ product.description }}</p>

            <button class="add-btn" @click="addToCart(product)">
                🛒 Savatga qo‘shish
            </button>
        </div>
    </div>
</template>
>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '../store/cartStore'
// import { useCartStore } from '@/stores/cartStore'



const route = useRoute()
const cart = useCartStore()

const product = ref({})

const router = useRouter()

const goBack = () => {
    router.back()
}

const fetchProduct = async () => {
    const id = route.params.id
    product.value = {
        id,
        title: 'Namuna Mahsulot',
        price: 119000,
        image: 'https://picsum.photos/seed/picsum/400/300',
        description:
            'Bu mahsulot zamonaviy, bardoshli va sizning ehtiyojlaringiz uchun ajoyib tanlov! Juda yengil, foydalanuvchiga qulay va ekologik toza materiallardan tayyorlangan.'
    }
}

onMounted(fetchProduct)

const addToCart = (item) => {
    cart.addToCart(item)
}

const formatPrice = (price) => {
    return typeof price === 'number'
        ? price.toLocaleString('uz-UZ') + ' so‘m'
        : 'Nomaʼlum narx'
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
