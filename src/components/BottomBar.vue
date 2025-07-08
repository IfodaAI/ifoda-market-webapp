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
    background-color: var(--card-bg);
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.04);
    z-index: 9999;
    transition: background-color 0.3s ease;
    backdrop-filter: blur(10px);
}

.nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 12px;
    text-decoration: none;
    color: var(--text-color);
    transition: all 0.2s ease;
    font-weight: 500;
}

.nav-item .icon {
    font-size: 20px;
    margin-bottom: 2px;
    transition: transform 0.2s ease;
}

.nav-item.active {
    color: var(--primary);
    font-weight: 600;
}

.nav-item.active .icon {
    transform: scale(1.2);
}
</style>
