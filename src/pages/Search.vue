<template>
    <div class="search-page">
        <h1>🔍 Mahsulot qidirish</h1>

        <div class="input-wrapper">
            <input v-model="query" type="text" placeholder="Mahsulot nomini kiriting..." class="search-input" />
        </div>

        <div class="product-grid">
            <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product"
                @add-to-cart="addToCart" />
        </div>

        <div v-if="filteredProducts.length === 0" class="no-results">
            <img src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png" alt="No results" class="no-result-img" />
            <p>Hech narsa topilmadi... 🤔</p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import { useCartStore } from '../store/cartStore'

const user = ref(null)

onMounted(() => {
    const tg = window.Telegram?.WebApp
    if (tg?.initDataUnsafe?.user) {
        user.value = tg.initDataUnsafe.user
        console.log('Telegram foydalanuvchi:', user.value)
    } else {
        console.warn("Telegram foydalanuvchi topilmadi.")
    }
})


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
])

const query = ref('')

const filteredProducts = computed(() =>
    products.value.filter((product) =>
        product.title.toLowerCase().includes(query.value.toLowerCase())
    )
)

const cart = useCartStore()

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
