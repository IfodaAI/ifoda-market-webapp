// Formatlash funksiyalari
export const formatDate = (dateString) => {
    if (!dateString) return ''
    const options = { day: 'numeric', month: 'short', year: 'numeric' }
    return new Date(dateString).toLocaleDateString('uz-UZ', options)
}

export const formatPrice = (price) => {
    const amount = parseFloat(price || 0)
    return amount.toLocaleString('uz-UZ', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) + ' so\'m'
}

export const formatPhoneNumber = (phone) => {
    if (!phone) return ''
    // +998901234567 -> +998 90 123 45 67
    return phone.replace(/(\+\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')
}