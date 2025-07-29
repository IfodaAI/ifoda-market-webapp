<!-- MedicinesModal.vue -->
<template>
    <div class="modal-overlay" v-if="isOpen" @click.self="closeModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Dorilar</h3>
                <button @click="closeModal" class="close-btn">
                    &times;
                </button>
            </div>
            <div class="modal-body">
                <div v-if="loading" class="loading-spinner"></div>
                <div v-else>
                    <div v-for="item in medicines" :key="item.id" class="medicine-item">
                        <div class="medicine-info">
                            <h4>{{ item.name }}</h4>
                            <p>{{ item.description }}</p>
                            <p class="price">{{ formatPrice(item.price) }}</p>
                        </div>
                        <button @click="addToCart(item)" :disabled="isAdded(item.id)"
                            :class="['add-btn', { added: isAdded(item.id) }]">
                            <span class="btn-icon">🛒</span>
                            <span class="btn-text">
                                {{ isAdded(item.id) ? "Qo‘shilgan ✅" : "Savatga qo‘shish" }}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useCartStore } from '../store/cartStore';
import { formatPrice } from '../utility/formatter';
import '../styles/mm-module.css'

const props = defineProps({
    orderId: {
        type: String,
        required: true
    }
});

const emit = defineEmits(['close']);
const cartStore = useCartStore();

const medicines = ref([]);
const loading = ref(false);
const isOpen = ref(true);

const fetchMedicines = async () => {
    try {
        loading.value = true;
        const response = await axios.get(
            `https://ifoda-shop.uz/ordertopills_api/get-order-id/${props.orderId}`
        );

        // 💊 Dori ma'lumotlarini olish
        medicines.value = Array.isArray(response.data)
            ? response.data.map(item => item.pills)
            : [];
    } catch (error) {
        console.error('Error fetching medicines:', error);
    } finally {
        loading.value = false;
    }
};

// ✅ Savatda borligini tekshirish
const isAdded = (id) => {
    return cartStore.items.some(item => item.id === id);
};

// ➕ Qo‘shish
const addToCart = (medicine) => {
    if (!isAdded(medicine.id)) {
        cartStore.addToCart({
            id: medicine.id,
            name: medicine.name,
            price: medicine.price,
            description: medicine.description,
            image: medicine.image
        });
    }
    // closeModal(); // 🟡 optional – agar qo‘shgan zahoti yopilishini xohlamasang, comment qoldir
};

const closeModal = () => {
    isOpen.value = false;
    emit('close');
};

onMounted(() => {
    fetchMedicines();
});
</script>
