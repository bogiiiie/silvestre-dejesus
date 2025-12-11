function toggleChatbot() {
    const chatContainer = document.getElementById('chatContainer');
    const chatIcon = document.getElementById('chatIcon');
    const chatIconSymbol = document.getElementById('chatIconSymbol');
    const articleContainer = document.querySelector('article[aria-controls="chatContainer"]');
    const isHidden = chatContainer.classList.contains('hidden');

    if (isHidden) {
        // Open chatbot
        chatContainer.classList.remove('hidden');
        articleContainer.setAttribute('aria-expanded', 'true');

        // Change icon to X
        chatIconSymbol.className = 'fas fa-times text-[#d1d5db] text-xl sm:text-2xl group-hover:text-white transition-colors';

        // Hide loading indicator after iframe loads
        setTimeout(() => {
            const loadingIndicator = document.querySelector('.chatbot-loading');
            if (loadingIndicator) {
                loadingIndicator.style.opacity = '0';
                setTimeout(() => {
                    loadingIndicator.style.display = 'none';
                }, 300);
            }
        }, 1500);
    } else {
        // Close chatbot
        chatContainer.classList.add('hidden');
        articleContainer.setAttribute('aria-expanded', 'false');

        // Change icon back to chat
        chatIconSymbol.className = 'fas fa-comments text-[#d1d5db] text-xl sm:text-2xl group-hover:text-white transition-colors';
    }
}

function closeChatbot() {
    const chatContainer = document.getElementById('chatContainer');
    const chatIconSymbol = document.getElementById('chatIconSymbol');
    const articleContainer = document.querySelector('article[aria-controls="chatContainer"]');

    chatContainer.classList.add('hidden');
    articleContainer.setAttribute('aria-expanded', 'false');

    // Change icon back to chat
    chatIconSymbol.className = 'fas fa-comments text-[#d1d5db] text-xl sm:text-2xl group-hover:text-white transition-colors';
}

// Close chatbot on Escape key
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeChatbot();
    }
});