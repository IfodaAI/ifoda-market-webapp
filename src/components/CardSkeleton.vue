<template>
    <div class="card skeleton">
        <div class="image-container">
            <div class="skeleton-image"></div>
        </div>
        <div class="info">
            <div class="skeleton-title"></div>
            <div class="skeleton-price"></div>
            <div class="skeleton-button"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ProductCardSkeleton'
}
</script>

<style scoped>
.skeleton {
    display: flex;
    flex-direction: column;
    background: var(--card-bg);
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid rgba(0, 0, 0, 0.08);
}

.image-container {
    position: relative;
    overflow: hidden;
}

/* Skeleton gradient with dynamic variables */
.skeleton-image,
.skeleton-title,
.skeleton-price,
.skeleton-button {
    background: linear-gradient(90deg,
            var(--skeleton-base) 25%,
            var(--skeleton-highlight) 50%,
            var(--skeleton-base) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
}

.skeleton-image {
    width: 100%;
    height: 140px;
    border-radius: 0;
}

.info {
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.skeleton-title {
    height: 40px;
}

.skeleton-price {
    height: 20px;
    width: 80px;
}

.skeleton-button {
    height: 40px;
    border-radius: 12px;
    margin-top: auto;
}

/* Animation */
@keyframes shimmer {
    0% {
        background-position: 200% 0;
    }

    100% {
        background-position: -200% 0;
    }
}

/* Responsive */
@media (max-width: 768px) {
    .skeleton-image {
        height: 120px;
    }

    .skeleton-title {
        height: 36px;
    }

    .skeleton-button {
        height: 36px;
    }
}

@media (max-width: 480px) {
    .skeleton-image {
        height: 100px;
    }

    .skeleton-title {
        height: 32px;
    }

    .skeleton-button {
        height: 32px;
    }
}
</style>