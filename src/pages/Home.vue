<template>
    <div class="home">
        <div class="header">
            <h1>{{ showSearchResults ? '🔍 Qidiruv natijalari' : '🛍️ Mahsulotlar' }}</h1>
            <p class="subtitle">{{ showSearchResults ? "Qidiruv bo\'yicha topilgan mahsulotlar" :
                "Eng sifatli mahsulotlarni tanlang" }}</p>

            <div class="input-wrapper">
                <input v-model="query" type="text" placeholder="Mahsulot qidirish..." class="search-input"
                    @input="handleSearchInput" />
            </div>
        </div>

        <div class="product-grid">
            <ProductCard v-for="product in displayedProducts" :key="product.id" :product="product"
                @add-to-cart="addToCart" />

            <CardSkeleton v-if="isLoading" v-for="n in 3" :key="'skeleton-' + n" />

            <div v-if="showNoResultsMessage" class="no-results">
                <img src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png" alt="No results"
                    class="no-result-img" />
                <p>Hech narsa topilmadi... 🤔</p>
            </div>

            <div v-if="showEndOfCatalogMessage" class="end-msg">
                🔚 Boshqa mahsulotlar qolmadi
            </div>
        </div>

        <div v-if="isLoading" class="loading-spinner">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
        </div>
        <button v-if="showScrollTopBtn" @click="scrollToTop" class="scroll-top-btn">
            <CircleChevronUp />
        </button>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import axios from 'axios'
import ProductCard from '@/components/ProductCard.vue'
import CardSkeleton from '@/components/CardSkeleton.vue'
import { useCartStore } from '../store/cartStore'
import '../styles/home.css'
import { CircleChevronUp } from 'lucide-vue-next'

const query = ref('')
const products = ref([])
const homeProducts = ref([])
const isLoading = ref(false)
const page = ref(1)
const searchPage = ref(1)
const hasMore = ref(true)
const hasMoreSearch = ref(true)
const cart = useCartStore()
let debounceTimeout

// Computed properties
const displayedProducts = computed(() => {
    return hasSearchQuery.value ? products.value : homeProducts.value
})

const hasSearchQuery = computed(() => {
    return query.value.trim().length > 0
})

const showSearchResults = computed(() => {
    return hasSearchQuery.value
})

const showNoResultsMessage = computed(() => {
    return hasSearchQuery.value && !isLoading.value && products.value.length === 0
})

const showEndOfCatalogMessage = computed(() => {
    return !hasSearchQuery.value && !hasMore.value && !isLoading.value && homeProducts.value.length > 0
})

// Methods
const handleSearchInput = () => {
    clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(() => {
        if (hasSearchQuery.value) {
            resetSearch()
            fetchProducts(true)
        } else {
            products.value = []
        }
    }, 500)
}

const resetSearch = () => {
    searchPage.value = 1
    hasMoreSearch.value = true
    products.value = []
}

const fetchProducts = async (isSearch = false) => {
    // Oldingi so'rov tugamaguncha yoki boshqa sahifa qolmagan bo'lsa to'xtatamiz
    if (isLoading.value || (isSearch ? !hasMoreSearch.value : !hasMore.value)) return

    // Loading holatini yoqamiz
    isLoading.value = true

    // Minimal loading vaqtini ta'minlash uchun 500ms kutamiz
    const minLoadingTime = 500
    const startTime = Date.now()

    try {
        const currentPage = isSearch ? searchPage.value : page.value
        const params = {
            isPaginated: true,
            page: currentPage,
        }

        if (isSearch) {
            params.name__icontains = query.value.trim()
        }

        // API so'rovini yuboramiz
        const res = await axios.get('https://ifoda-shop.uz/pills_api/', { params })
        const results = res.data.results || []

        // Minimal loading vaqtini ta'minlash
        const elapsedTime = Date.now() - startTime
        if (elapsedTime < minLoadingTime) {
            await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime))
        }

        if (results.length > 0) {
            if (isSearch) {
                products.value.push(...results)
                searchPage.value++
                hasMoreSearch.value = !!res.data.next
            } else {
                homeProducts.value.push(...results)
                page.value++
                hasMore.value = !!res.data.next
            }
        } else {
            if (isSearch) {
                hasMoreSearch.value = false
            } else {
                hasMore.value = false
            }
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

let isScrolling = false
const showScrollTopBtn = ref(false)

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    })
}

const handleScroll = () => {
    if (isScrolling) return
    isScrolling = true

    requestAnimationFrame(() => {
        const scrollTop = window.scrollY
        const windowHeight = window.innerHeight
        const docHeight = document.documentElement.scrollHeight

        // ⬆️ Tugmani ko‘rsatish shartlari
        showScrollTopBtn.value = scrollTop > 300

        if (scrollTop + windowHeight >= docHeight - 100) {
            if (query.value.trim().length > 0) {
                fetchProducts(true)
            } else {
                fetchProducts(false)
            }
        }

        isScrolling = false
    })
}



// Lifecycle hooks
onMounted(() => {
    window.addEventListener('scroll', handleScroll)
    fetchProducts(false) // Load initial home products
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>
