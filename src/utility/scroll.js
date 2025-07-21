export const scrollToBottom = () => {
    nextTick(() => {
        if (chatBox.value) {
            chatBox.value.scrollTo({
                top: chatBox.value.scrollHeight,
                behavior: 'smooth'
            })
        }
    })
}