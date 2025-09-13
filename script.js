async function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    if (message === '') return;

    const chatMessages = document.getElementById('chatMessages');

    const userMessage = document.createElement('div');
    userMessage.className = 'message user';
    userMessage.innerHTML = `<p>${message}</p>`; 
    chatMessages.appendChild(userMessage);

    const typing = document.createElement('div');
    typing.className = 'message bot typing';
    typing.innerHTML = `
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>`;
    chatMessages.appendChild(typing);

    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        const model = document.getElementById('modelSelect').value;

        const response = await fetch("http://localhost:3000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message, model })
        });

        const data = await response.json();

        typing.remove();
        const botMessage = document.createElement('div');
        botMessage.className = 'message bot';
        botMessage.innerHTML = `<p>${data.reply.replace(/\n/g, '<br>')}</p>`;
        chatMessages.appendChild(botMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;

    } catch (error) {
        typing.remove();
        const errorMessage = document.createElement('div');
        errorMessage.className = 'message bot';
        errorMessage.innerHTML = `<p>Hata: ${error.message}</p>`;
        chatMessages.appendChild(errorMessage);
    }

    input.value = '';
}

document.getElementById('userInput').addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});
