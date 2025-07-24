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
                        <button @click="addToCart(item)" class="add-btn">
                            Savatga qo'shish
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCartStore } from '../stores/cartStore';
import { formatPrice } from '../utility/formatter';

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
        const response = await fetch(`https://ifoda-shop.uz/ordertopills_api/get-order-id/${props.orderId}`);
        if (!response.ok) throw new Error('Failed to fetch medicines');
        const data = await response.json();
        medicines.value = data.map(item => item.pills);
    } catch (error) {
        console.error('Error fetching medicines:', error);
    } finally {
        loading.value = false;
    }
};

const addToCart = (medicine) => {
    cartStore.addToCart({
        id: medicine.id,
        name: medicine.name,
        price: medicine.price,
        description: medicine.description,
        image: medicine.image
    });
    closeModal();
};

const closeModal = () => {
    isOpen.value = false;
    emit('close');
};

onMounted(() => {
    fetchMedicines();
});
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: white;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
}

.modal-header {
    padding: 15px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h3 {
    margin: 0;
}

.close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
}

.modal-body {
    padding: 15px;
}

.medicine-item {
    padding: 10px 0;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.medicine-info {
    flex: 1;
}

.medicine-info h4 {
    margin: 0 0 5px 0;
}

.medicine-info p {
    margin: 5px 0;
    color: #666;
    font-size: 14px;
}

.price {
    font-weight: bold;
    color: #4CAF50 !important;
}

.add-btn {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 10px;
}

.add-btn:hover {
    background-color: #45a049;
}

.loading-spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #4CAF50;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
    margin: 20px auto;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>