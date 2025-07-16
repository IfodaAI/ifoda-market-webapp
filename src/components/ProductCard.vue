<template>
    <div class="card">
        <router-link :to="`/product/${id}`" class="image-container">
            <img :src="image" v-if="image" :alt="name" class="product-img" />
            <img v-else src="@/assets/no-image.png" alt="No image available" class="product-img" />
            <div class="overlay">
                <div class="quick-view">👁️</div>
            </div>
        </router-link>

        <div class="info">
            <h3>{{ name }}</h3>
            <p class="price">{{ formatPrice(price) }}</p>
            <button @click="addToCart" :disabled="isAdded" :class="['add-btn', { added: isAdded }]">
                <span class="btn-icon">🛒</span>
                <span class="btn-text">
                    {{ isAdded ? 'Qo‘shilgan ✅' : 'Savatga' }}
                </span>
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useCartStore } from '../store/cartStore'
import '../styles/card.css'
onMounted(() => {
    console.log('Current cart items:', cart.items)
})

// Propsdan productni qabul qilamiz
const props = defineProps({
    product: {
        type: Object,
        required: true,
    },
})

// Ma'lumotlarni destructure qilib olamiz
const { id, name, image, price } = props.product

// Cart store bilan ishlaymiz
const cart = useCartStore()

// Product allaqachon savatda bormi yo‘qmi
const isAdded = computed(() =>
    cart.items.some((item) => item.id === id)
)

// Qo‘shish funksiyasi
const addToCart = () => {
    if (!isAdded.value) {
        cart.addToCart(props.product)
    }
}

// Narxni formatlash
const formatPrice = (price) => {
    return price ? price.toLocaleString('uz-UZ') + ' so‘m' : 'Narx belgilanmagan'
}
</script>
