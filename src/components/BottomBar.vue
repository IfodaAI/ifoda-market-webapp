<template>
    <nav class="bottom-bar">
        <RouterLink v-for="link in links" :key="link.path" :to="link.path" class="nav-item"
            :class="{ active: $route.path === link.path }">
            <span class="icon">{{ link.icon }}</span>
            <span class="label">{{ link.label }}</span>
        </RouterLink>
    </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const links = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/search', label: 'Qidiruv', icon: '🔍' },
    { path: '/cart', label: 'Savat', icon: '🛒' },
    { path: '/profile', label: 'Profil', icon: '👤' },
]
</script>

<style scoped>
.bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 64px;
    background-color: #ffffff;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
    border-top: 1px solid #e0e0e0;
    z-index: 1000;
}

.nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 12px;
    text-decoration: none;
    color: #777;
    transition: color 0.2s ease;
}

.nav-item .icon {
    font-size: 20px;
}

.nav-item.active {
    color: #40ac3c;
    font-weight: bold;
}
</style>
