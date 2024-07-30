document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chat-container');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const clearHistoryButton = document.getElementById('clear-history');

    let conversationHistory = [];

    clearHistoryButton.addEventListener('click', clearHistory);
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    function clearHistory() {
        conversationHistory = [];
        chatMessages.innerHTML = '';
    }

    function addMessage(content, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', isUser ? 'user-message' : 'bot-message');
        
        const paragraphs = content.split('\n');
        paragraphs.forEach(paragraph => {
            if (paragraph.trim() !== '') {
                const p = document.createElement('p');
                p.textContent = paragraph;
                messageDiv.appendChild(p);
            }
        });

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, true);
            conversationHistory.push({ role: 'user', content: message });
            userInput.value = '';

            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                    },
                    body: JSON.stringify({ messages: conversationHistory }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                addMessage(data.response, false);
                conversationHistory.push({ role: 'assistant', content: data.response });
            } catch (error) {
                console.error('Error:', error);
                addMessage('抱歉，發生錯誤。請再試一次。', false);
            }
        }
    }
});