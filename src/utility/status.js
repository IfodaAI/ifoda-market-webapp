// Status va metodlar uchun funksiyalar
export const getStatusClass = (status) => {
    switch (status?.toUpperCase()) {
        case 'DELIVERED': return 'completed'
        case 'PROCESS': return 'processing'
        case 'CANCELLED': return 'cancelled'
        default: return 'pending'
    }
}

export const getStatusText = (status) => {
    switch (status?.toUpperCase()) {
        case 'DELIVERED': return 'Yetkazilgan'
        case 'PROCESS': return 'Jarayonda'
        case 'CANCELLED': return 'Bekor qilingan'
        default: return 'Kutilmoqda'
    }
}

export const getPaymentMethod = (method) => {
    switch (method?.toUpperCase()) {
        case 'CASH': return 'Naqd pul'
        case 'CARD': return 'Karta orqali'
        case 'CLICK': return 'Click'
        case 'PAYME': return 'Payme'
        default: return method || 'Noma\'lum'
    }
}

export const getDeliveryMethod = (method) => {
    switch (method?.toUpperCase()) {
        case 'DELIVERY': return 'Yetkazib berish'
        case 'PICKUP': return 'Olib ketish'
        default: return method || 'Noma\'lum'
    }
}