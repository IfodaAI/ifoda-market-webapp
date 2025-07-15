<template>
    <div class="home">
        <div class="header">
            <h1>🛍️ Mahsulotlar</h1>
            <p class="subtitle">Eng sifatli mahsulotlarni tanlang</p>
        </div>

        <div class="product-grid">
            <ProductCard v-for="product in products" :key="product.id" :product="product" @add-to-cart="addToCart" />

            <!-- Yuklanayotgan paytida Skeletonlar -->
            <CardSkeleton v-if="isLoading" v-for="n in 3" :key="'skeleton-' + n" />

            <!-- Ma'lumot qolmagan holatda -->
            <div v-if="!hasMore && !isLoading" class="end-msg">
                🔚 Boshqa mahsulotlar qolmadi
            </div>
        </div>
        <div v-if="isLoading" class="loading-spinner">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import CardSkeleton from '@/components/CardSkeleton.vue'
import axios from 'axios'
import { useCartStore } from '../store/cartStore'

const products = ref([])
const isLoading = ref(false)
const page = ref(1)
const hasMore = ref(true)

const cart = useCartStore()

const addToCart = (product) => {
    cart.addToCart(product)
}

const loadProducts = async () => {
    if (isLoading.value || !hasMore.value) return

    isLoading.value = true

    // 🔄 Sekinroq loading animatsiya uchun delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    try {
        const res = await axios.get('http://94.141.76.204:8088/pills_api/', {
            params: {
                isPaginated: true,
                page: page.value,
            },
        })

        const newItems = res.data.results
        if (newItems.length > 0) {
            products.value.push(...newItems)
            page.value++
            if (!res.data.next) {
                hasMore.value = false
            }
        } else {
            hasMore.value = false
        }
    } catch (err) {
        console.error('❌ API xatoligi:', err)
    } finally {
        isLoading.value = false
    }
}




const handleScroll = () => {
    const scrollTop = window.scrollY
    const windowHeight = window.innerHeight
    const docHeight = document.documentElement.scrollHeight

    if (scrollTop + windowHeight >= docHeight - 100) {
        loadProducts()
    }
}

onMounted(() => {
    loadProducts()
    window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.home {
    padding: 16px;
    padding-bottom: 80px;
    min-height: 100vh;
    background-color: var(--bg-color);
    color: var(--text-color);
    transition: background-color 0.3s ease, color 0.3s ease;
}

.header {
    text-align: center;
    margin-bottom: 24px;
}

.header h1 {
    font-size: 28px;
    font-weight: 700;
    margin: 0 0 8px;
    color: var(--accent);
}

.subtitle {
    font-size: 16px;
    color: var(--muted);
    margin: 0;
    font-weight: 400;
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 14px;
}

.end-msg {
    text-align: center;
    margin-top: 20px;
    color: var(--muted);
    font-size: 14px;
}

.loading-spinner {
    text-align: center;
    margin: 16px 0 32px;
}

.loading-spinner .dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    margin: 0 4px;
    background-color: var(--accent);
    border-radius: 50%;
    animation: bounce 1.2s infinite ease-in-out;
}

.loading-spinner .dot:nth-child(2) {
    animation-delay: 0.2s;
}

.loading-spinner .dot:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes bounce {

    0%,
    80%,
    100% {
        transform: scale(0);
    }

    40% {
        transform: scale(1);
    }
}
</style>
