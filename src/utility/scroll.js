import { nextTick } from "vue"

export const scrollToBottom = (chatBox) => {
    nextTick(() => {
        if (chatBox.value) {
            chatBox.value.scrollTo({
                top: chatBox.value.scrollHeight,
                behavior: 'smooth'
            })
        }
    })
}