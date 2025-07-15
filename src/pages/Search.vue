<template>
    <div class="search-page">
        <h1>🔍 Mahsulot qidirish</h1>

        <div class="input-wrapper">
            <input v-model="query" type="text" placeholder="Mahsulot nomini kiriting..." class="search-input" />
        </div>

        <div class="product-grid">
            <ProductCard v-for="product in products" :key="product.id" :product="product" @add-to-cart="addToCart" />
            <CardSkeleton v-if="isLoading" v-for="n in 3" :key="'skeleton-' + n" />
        </div>

        <div v-if="!isLoading && products.length === 0" class="no-results">
            <img src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png" alt="No results" class="no-result-img" />
            <p>Hech narsa topilmadi... 🤔</p>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import ProductCard from '@/components/ProductCard.vue'
import CardSkeleton from '@/components/CardSkeleton.vue'
import { useCartStore } from '../store/cartStore'

const query = ref('')
const products = ref([])
const isLoading = ref(false)
const page = ref(1)
const hasMore = ref(true)
const cart = useCartStore()
let debounceTimeout

// Qidiruv so‘zini kuzatish
watch(query, (newQuery) => {
    clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(() => {
        resetSearch()
        if (newQuery.trim().length > 0) {
            fetchProducts()
        }
    }, 500)
})

// Scroll event infinite scroll uchun
const handleScroll = () => {
    const scrollTop = window.scrollY
    const windowHeight = window.innerHeight
    const docHeight = document.documentElement.scrollHeight

    if (scrollTop + windowHeight >= docHeight - 100) {
        fetchProducts()
    }
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})

// Qayta qidiruv bo‘lsa reset qilamiz
const resetSearch = () => {
    page.value = 1
    hasMore.value = true
    products.value = []
}

// Mahsulotlarni olish
const fetchProducts = async () => {
    if (isLoading.value || !hasMore.value || !query.value.trim()) return
    isLoading.value = true
    try {
        const res = await axios.get('https://ifoda-shop.uz/pills_api/', {
            params: {
                isPaginated: true,
                page: page.value,
                name__icontains: query.value,
            },
        })
        const results = res.data.results || []
        if (results.length > 0) {
            products.value.push(...results)
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

const addToCart = (product) => {
    cart.addToCart(product)
}
</script>

<style scoped>
.search-page {
    padding: 16px;
    padding-bottom: 80px;
    background-color: var(--bg-color);
    color: var(--text-color);
    min-height: 100vh;
    transition: background-color 0.3s ease, color 0.3s ease;
}

h1 {
    font-size: 22px;
    margin-bottom: 14px;
    color: var(--text-color);
}

.input-wrapper {
    position: relative;
}

.search-input {
    width: 100%;
    padding: 12px 18px;
    border: none;
    border-radius: 14px;
    font-size: 16px;
    background-color: var(--card-bg);
    color: var(--text-color);
    box-shadow: 0 4px 12px rgba(64, 172, 60, 0.12);
    transition: all 0.3s ease;
    outline: none;
}

.search-input::placeholder {
    color: var(--muted);
}

.search-input:focus {
    box-shadow: 0 0 0 3px rgba(64, 172, 60, 0.2);
}

.product-grid {
    margin-top: 20px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 16px;
}

.no-results {
    margin-top: 30px;
    text-align: center;
    color: var(--muted);
}

.no-result-img {
    width: 80px;
    margin-bottom: 10px;
    opacity: 0.7;
}
</style>
