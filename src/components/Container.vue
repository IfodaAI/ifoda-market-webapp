<template>
    <div :class="['container', theme]">
        <slot />
    </div>
</template>

<script setup>
defineProps({
    theme: {
        type: String,
        default: 'light', // 'dark' yoki 'light'
    },
})
</script>

<style scoped>
.container {
    max-width: 500px;
    width: 100%;
    background: linear-gradient(145deg, #fdfdfd, #e8fce6);
    margin: 0 auto;
    min-height: 100vh;
    box-sizing: border-box;
    transition: background-color 0.3s ease;
    border: 1px solid red;
    padding-bottom: 80px;
}

/* Light theme */
.container.light {
    background-color: #ffffff;
    color: #000000;
}

/* Dark theme */
.container.dark {
    background-color: #121212;
    color: #ffffff;
}
</style>
