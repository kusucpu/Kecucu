document.addEventListener('DOMContentLoaded', () => {
  const chatContainer = document.getElementById('chatContainer');
  const messageInput = document.getElementById('messageInput');
  const sendButton = document.getElementById('sendButton');
  const modelSelect = document.getElementById('modelSelect');

  messageInput.addEventListener('input', () => {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
  });

  messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  sendButton.addEventListener('click', sendMessage);

  async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    messageInput.value = '';
    messageInput.style.height = '40px';

    const loadingId = showLoading();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: message,
          model: modelSelect.value
        })
      });

      removeLoading(loadingId);

      const data = await response.json();

      if (response.ok && data.success) {
        // Tampilkan response bot
        addMessage(data.response, 'bot');
      } else {
        // Tampilkan error
        addMessage(`Error: ${data.error || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      removeLoading(loadingId);
      addMessage(`Error: ${error.message}`, 'error');
      console.error('Error:', error);
    }
  }

  function addMessage(content, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type === 'user' ? 'user-message' : ''} ${type === 'error' ? 'error-message' : ''}`;

    if (type !== 'error') {
      const avatar = document.createElement('div');
      avatar.className = 'avatar';
      avatar.textContent = type === 'user' ? '👤' : '🤖';
      messageDiv.appendChild(avatar);
    }

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = content;
    messageDiv.appendChild(messageContent);

    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function showLoading() {
    const id = Date.now();
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message';
    loadingDiv.id = `loading-${id}`;

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = '🤖';
    loadingDiv.appendChild(avatar);

    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.innerHTML = '<span></span><span></span><span></span>';
    loadingDiv.appendChild(indicator);

    chatContainer.appendChild(loadingDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    return id;
  }

  function removeLoading(id) {
    const loading = document.getElementById(`loading-${id}`);
    if (loading) loading.remove();
  }
});
