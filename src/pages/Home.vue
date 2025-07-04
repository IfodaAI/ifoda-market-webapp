<template>
    <div class="home">
        <div class="header">
            <h1>🛍️ Mahsulotlar</h1>
            <p class="subtitle">Eng sifatli mahsulotlarni tanlang</p>
        </div>
        <div class="product-grid">
            <ProductCard v-for="product in products" :key="product.id" :product="product" @add-to-cart="addToCart" />
        </div>
    </div>
</template>

<script setup>
import ProductCard from '@/components/ProductCard.vue'
import { ref } from 'vue'
import { useCartStore } from '../store/cartStore'

const products = ref([
    {
        id: 1,
        title: 'Quloqchin',
        price: 129000,
        image: 'https://picsum.photos/seed/1/200/300',
    },
    {
        id: 2,
        title: 'Power Bank',
        price: 89000,
        image: 'https://picsum.photos/seed/2/200/300',
    },
    {
        id: 3,
        title: 'USB Kabel',
        price: 29000,
        image: 'https://picsum.photos/seed/3/200/300',
    },
    {
        id: 4,
        title: 'Smart Soat',
        price: 299000,
        image: 'https://picsum.photos/seed/4/200/300',
    },
    {
        id: 5,
        title: 'Kamera',
        price: 499000,
        image: 'https://picsum.photos/seed/5/200/300',
    },
    {
        id: 6,
        title: 'Bluetooth Kolonka',
        price: 159000,
        image: 'https://picsum.photos/seed/6/200/300',
    },
])

const cart = useCartStore()

const addToCart = (product) => {
    cart.addToCart(product)
}
</script>

<style scoped>
.home {
    padding: 16px;
}

.header {
    text-align: center;
    margin-bottom: 24px;
}

.header h1 {
    font-size: 28px;
    font-weight: 700;
    margin: 0 0 8px 0;
    color: #1a1a1a;
    background: linear-gradient(135deg, #40ac3c, #2d7a2a);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.subtitle {
    font-size: 16px;
    color: #666;
    margin: 0;
    font-weight: 400;
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
}

/* Mobil uchun responsive */
</style>