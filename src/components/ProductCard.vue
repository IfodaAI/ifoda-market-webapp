<template>
    <div class="card">
        <router-link :to="`/product/${product.id}`" class="image-container">
            <img :src="product.image" :alt="product.title" class="product-img" />
            <div class="overlay">
                <div class="quick-view">👁️</div>
            </div>
        </router-link>
        <div class="info">
            <h3>{{ product.title }}</h3>
            <p class="price">{{ formatPrice(product.price) }}</p>
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
import { computed } from 'vue'
import { useCartStore } from '../store/cartStore'


const props = defineProps({
    product: Object
})

const cart = useCartStore()

// ✅ isAdded computed orqali tekshiramiz
const isAdded = computed(() =>
    cart.items.some((item) => item.id === props.product.id)
)

// ✅ addToCart endi props.product dan foydalansak bo'ladi
const addToCart = () => {
    if (!isAdded.value) {
        cart.addToCart(props.product)
    }
}
const formatPrice = (price) => {
    return price.toLocaleString('uz-UZ') + ' so‘m'
}
</script>


<style scoped>
.card {
    display: flex;
    flex-direction: column;
    background: linear-gradient(145deg, #ffffff, #f8f9fa);
    border-radius: 16px;
    overflow: hidden;
    box-shadow:
        0 4px 20px rgba(0, 0, 0, 0.08),
        0 1px 4px rgba(0, 0, 0, 0.04);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid rgba(64, 172, 60, 0.1);
    position: relative;
}

.card:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow:
        0 12px 40px rgba(64, 172, 60, 0.15),
        0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: rgba(64, 172, 60, 0.2);
}

.image-container {
    position: relative;
    overflow: hidden;
}

.product-img {
    width: 100%;
    height: 140px;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.card:hover .product-img {
    transform: scale(1.1);
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(64, 172, 60, 0.8), rgba(45, 122, 42, 0.8));
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.card:hover .overlay {
    opacity: 1;
}

.quick-view {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.quick-view:hover {
    transform: scale(1.1);
    background: rgba(255, 255, 255, 0.3);
}

.info {
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex-grow: 1;
}

h3 {
    font-size: 15px;
    font-weight: 600;
    margin: 0;
    color: #1a1a1a;
    line-height: 1.3;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.price {
    font-weight: 700;
    color: #40ac3c;
    margin: 0;
    font-size: 16px;
    text-shadow: 0 1px 2px rgba(64, 172, 60, 0.1);
}

.add-btn {
    margin-top: auto;
    padding: 10px 12px;
    background: linear-gradient(135deg, #40ac3c, #2d7a2a);
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 13px;
    box-shadow: 0 2px 8px rgba(64, 172, 60, 0.3);
    position: relative;
    overflow: hidden;
}

.add-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
}

.add-btn:hover::before {
    left: 100%;
}

.add-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(64, 172, 60, 0.4);
    background: linear-gradient(135deg, #349a33, #2d7a2a);
}

.add-btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(64, 172, 60, 0.3);
}

.btn-icon {
    font-size: 14px;
    transition: transform 0.3s ease;
}

.add-btn:hover .btn-icon {
    transform: scale(1.1);
}

.btn-text {
    font-size: 13px;
}

.add-btn.added {
    background: linear-gradient(135deg, #c9f2c8, #a4e5a3);
    color: #2e7d32;
    cursor: not-allowed;
    box-shadow: none;
}

.add-btn.added:hover::before {
    display: none;
}

.add-btn.added:hover {
    transform: none;
    box-shadow: none;
}

/* Mobil uchun responsive */
@media (max-width: 768px) {
    .card {
        border-radius: 12px;
    }

    .product-img {
        height: 120px;
    }

    .info {
        padding: 12px;
        gap: 6px;
    }

    h3 {
        font-size: 14px;
    }

    .price {
        font-size: 15px;
    }

    .add-btn {
        padding: 8px 10px;
        font-size: 12px;
    }

    .btn-text {
        font-size: 12px;
    }
}

/* Kichik ekranlar uchun */
@media (max-width: 480px) {
    .product-img {
        height: 100px;
    }

    .info {
        padding: 10px;
    }

    h3 {
        font-size: 13px;
    }

    .price {
        font-size: 14px;
    }

    .add-btn {
        padding: 7px 8px;
    }
}
</style>