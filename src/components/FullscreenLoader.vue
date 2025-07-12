<template>
    <div class="fullscreen-loader" :class="{ 'dark-mode': darkMode }">
        <div class="loader-content">
            <div class="spinner"></div>
            <div class="loading-text">Loading plant analysis...</div>
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const darkMode = ref(false);
// You can set darkMode based on user preference or system settings
</script>

<style scoped>
.fullscreen-loader {
    position: fixed;
    inset: 0;
    background: var(--bg-color);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    transition: background-color 0.3s ease;
}

.loader-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    max-width: 300px;
    text-align: center;
}

.spinner {
    width: 56px;
    height: 56px;
    border: 4px solid rgba(64, 172, 60, 0.1);
    border-top-color: var(--primary);
    border-bottom-color: var(--primary);
    border-radius: 50%;
    animation: spin 1.2s ease-in-out infinite;
    will-change: transform;
}

.loading-text {
    color: var(--text-color);
    font-size: 18px;
    font-weight: 500;
    letter-spacing: 0.5px;
    animation: pulse 1.5s ease-in-out infinite;
}

.progress-bar {
    width: 100%;
    height: 6px;
    background: rgba(64, 172, 60, 0.1);
    border-radius: 3px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    width: 0;
    background: var(--primary);
    border-radius: 3px;
    animation: progress 2.5s ease-in-out infinite;
}

/* Dark mode styles */
.fullscreen-loader.dark-mode {
    background: var(--bg-color);
}

.fullscreen-loader.dark-mode .spinner {
    border-color: rgba(88, 199, 85, 0.1);
    border-top-color: var(--primary);
    border-bottom-color: var(--primary);
}

.fullscreen-loader.dark-mode .progress-bar {
    background: rgba(88, 199, 85, 0.1);
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

@keyframes pulse {

    0%,
    100% {
        opacity: 0.8;
    }

    50% {
        opacity: 1;
    }
}

@keyframes progress {
    0% {
        width: 0;
        transform: translateX(0);
    }

    50% {
        width: 100%;
        transform: translateX(0);
    }

    100% {
        width: 0;
        transform: translateX(100%);
    }
}

/* Responsive adjustments */
@media (max-width: 480px) {
    .spinner {
        width: 48px;
        height: 48px;
    }

    .loading-text {
        font-size: 16px;
    }

    .loader-content {
        gap: 18px;
        padding: 0 20px;
    }
}
</style>