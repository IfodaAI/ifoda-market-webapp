<template>
    <div class="confirmation-page">
        <div class="confirmation-box">
            <h1>✅ Buyurtmangiz qabul qilindi!</h1>
            <p>Buyurtma raqami: <strong>{{ orderId }}</strong></p>
            <p>Tez orada operatorlarimiz siz bilan bog'lanishadi</p>

            <router-link to="/" class="back-btn">
                Bosh sahifaga qaytish
            </router-link>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const orderId = computed(() => route.query.orderId)
</script>

<style scoped>
.confirmation-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
    background-color: var(--bg-color);
}

.confirmation-box {
    background-color: var(--card-bg);
    padding: 32px;
    border-radius: 16px;
    text-align: center;
    max-width: 500px;
    width: 100%;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.confirmation-box h1 {
    color: var(--accent);
    margin-top: 0;
}

.back-btn {
    display: inline-block;
    margin-top: 24px;
    padding: 12px 24px;
    background-color: var(--accent);
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
}
</style>