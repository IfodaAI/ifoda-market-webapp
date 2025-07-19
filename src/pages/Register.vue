<template>
    <div class="register-page">
        <div class="header-register">
            <h1>Ro'yxatdan o'tish</h1>
        </div>

        <div class="register-form">
            <div class="form-group">
                <label for="fullname">
                    <span>To'liq ism</span>
                    <span class="required">*</span>
                </label>
                <input id="fullname" type="text" v-model="formData.fullname" placeholder="To'liq ismingiz"
                    :class="{ 'input-error': errors.fullname }" @focus="errors.fullname = ''" />
                <span v-if="errors.fullname" class="error-text">{{ errors.fullname }}</span>
            </div>

            <div class="form-group">
                <label for="username">
                    <span>Username</span>
                    <span class="required">*</span>
                </label>
                <input id="username" type="text" v-model="formData.username" placeholder="Username"
                    :class="{ 'input-error': errors.username }" @focus="errors.username = ''" />
                <span v-if="errors.username" class="error-text">{{ errors.username }}</span>
            </div>

            <div class="form-group">
                <label for="phone">
                    <span>Telefon raqam</span>
                    <span class="required">*</span>
                </label>
                <input id="phone" type="tel" v-model="formData.phone_number" placeholder="+998901234567"
                    :class="{ 'input-error': errors.phone_number }" @input="formatPhone"
                    @focus="errors.phone_number = ''" />
                <span v-if="errors.phone_number" class="error-text">{{ errors.phone_number }}</span>
            </div>

            <div class="form-group">
                <label for="region">
                    <span>Viloyat</span>
                    <span class="required">*</span>
                </label>
                <input id="region" type="text" v-model="formData.region" placeholder="Viloyatingiz"
                    :class="{ 'input-error': errors.region }" @focus="errors.region = ''" />
                <span v-if="errors.region" class="error-text">{{ errors.region }}</span>
            </div>

            <div class="form-group">
                <label for="district">
                    <span>Tuman/Shahar</span>
                    <span class="required">*</span>
                </label>
                <input id="district" type="text" v-model="formData.district" placeholder="Tuman/Shaharingiz"
                    :class="{ 'input-error': errors.district }" @focus="errors.district = ''" />
                <span v-if="errors.district" class="error-text">{{ errors.district }}</span>
            </div>

            <button class="register-btn" @click="registerUser" :disabled="isSubmitting">
                <span v-if="!isSubmitting">Ro'yxatdan o'tish</span>
                <span v-else class="loading-spinner"></span>
            </button>

            <div v-if="error" class="error-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {{ error }}
            </div>

            <div v-if="successMessage" class="success-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                {{ successMessage }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

// Forma ma'lumotlari
const formData = ref({
    telegram_id: '',
    fullname: '',
    username: '',
    phone_number: '',
    region: '',
    district: ''
})

const errors = ref({
    fullname: '',
    username: '',
    phone_number: '',
    region: '',
    district: ''
})

const error = ref('')
const successMessage = ref('')
const isSubmitting = ref(false)

// Telegram foydalanuvchi ma'lumotlarini olish
const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user

onMounted(() => {
    // Agar Telegram foydalanuvchisi bo'lsa, ma'lumotlarni avtomatik to'ldiramiz
    if (tgUser) {
        formData.value = {
            telegram_id: tgUser.id || '',
            fullname: `${tgUser.first_name || ''} ${tgUser.last_name || ''}`.trim(),
            username: tgUser.username || '',
            phone_number: tgUser.phone_number || '',
            region: '',
            district: ''
        }
    }
})

// Forma validatsiyasi
const validateForm = () => {
    let isValid = true

    if (!formData.value.fullname.trim()) {
        errors.value.fullname = "To'liq ism kiritilishi shart"
        isValid = false
    }

    if (!formData.value.username.trim()) {
        errors.value.username = "Username kiritilishi shart"
        isValid = false
    }

    const cleanPhone = formData.value.phone_number.replace(/\D/g, '')
    if (!cleanPhone || cleanPhone.length < 9) {
        errors.value.phone_number = "To'g'ri telefon raqam kiriting"
        isValid = false
    }

    if (!formData.value.region.trim()) {
        errors.value.region = "Viloyat kiritilishi shart"
        isValid = false
    }

    if (!formData.value.district.trim()) {
        errors.value.district = "Tuman/Shahar kiritilishi shart"
        isValid = false
    }

    return isValid
}

// Telefon raqamini formatlash
const formatPhone = () => {
    let x = formData.value.phone_number.replace(/\D/g, '').match(/(\d{0,3})(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})/)
    formData.value.phone_number = !x[2] ? x[1] : '+' + x[1] + ' ' + x[2] + (x[3] ? ' ' + x[3] : '') + (x[4] ? ' ' + x[4] : '') + (x[5] ? ' ' + x[5] : '')
}

// Ro'yxatdan o'tish funksiyasi
const registerUser = async () => {
    error.value = ''
    successMessage.value = ''

    if (!validateForm()) {
        return
    }

    isSubmitting.value = true

    try {
        // Telefon raqamdan barcha bo'sh joy va belgilarni olib tashlash
        const cleanPhone = formData.value.phone_number.replace(/\D/g, '')
        const phoneWithPlus = cleanPhone.startsWith('+') ? cleanPhone : `+${cleanPhone}`

        const response = await axios.post('https://ifoda-shop.uz/telegramuser_api/', {
            telegram_id: formData.value.telegram_id,
            fullname: formData.value.fullname,
            username: formData.value.username,
            phone_number: phoneWithPlus,
            region: formData.value.region,
            district: formData.value.district
        })

        if (response.data && response.data.id) {
            // ID ni localStorage ga saqlaymiz
            localStorage.setItem('telegram_user_id', response.data.id)

            successMessage.value = "Muvaffaqiyatli ro'yxatdan o'tdingiz!"
            setTimeout(() => {
                router.push('/') // Ro'yxatdan o'tgach, asosiy sahifaga yo'naltiramiz
            }, 1500)
        } else {
            error.value = "Ro'yxatdan o'tishda xatolik yuz berdi"
        }
    } catch (err) {
        if (err.response?.data?.error) {
            error.value = err.response.data.error
        } else {
            error.value = 'Server xatosi. Iltimos, keyinroq urunib ko\'ring.'
        }
        console.error('Registration error:', err)
    } finally {
        isSubmitting.value = false
    }
}

const goBack = () => {
    router.back()
}
</script>

<style scoped>
.register-page {
    padding: 16px;
    min-height: 100vh;
    background: var(--bg-color);
    color: var(--text-color);
}

.header-register {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    position: relative;
}

.header-register h1 {
    margin: 0 auto;
    font-size: 20px;
    font-weight: 600;
}

.back-btn {
    background: none;
    border: none;
    padding: 8px;
    color: var(--text-color);
    cursor: pointer;
    position: absolute;
    left: 0;
}

.register-form {
    max-width: 500px;
    margin: 0 auto;
    padding: 0 16px;
}

.form-group {
    margin-bottom: 20px;
    position: relative;
}

.form-group label {
    display: flex;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
    gap: 4px;
}

.required {
    color: var(--danger);
}

.form-group input {
    width: 100%;
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: var(--card-bg);
    color: var(--text-color);
    font-size: 16px;
    transition: border-color 0.2s;
}

.form-group input:focus {
    border-color: var(--primary);
    outline: none;
    box-shadow: 0 0 0 3px rgba(64, 172, 60, 0.15);
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.input-error {
    border-color: var(--danger) !important;
}

.error-text {
    display: block;
    margin-top: 6px;
    font-size: 12px;
    color: var(--danger);
}

.register-btn {
    width: 100%;
    padding: 14px;
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    margin-top: 24px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;
}

.register-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    background: var(--card-bg);
    color: var(--text-color);
}

.register-btn:not(:disabled):hover {
    opacity: 0.9;
}

.loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.error-message,
.success-message {
    margin-top: 16px;
    padding: 12px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
}

.error-message {
    background: rgba(244, 67, 54, 0.1);
    color: var(--danger);
}

.success-message {
    background: rgba(64, 172, 60, 0.1);
    color: var(--primary);
}
</style>