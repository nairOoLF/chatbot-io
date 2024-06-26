//affichage du message dans la liste
export const displayMessage = (sender, timestamp, content, isReceived, messageList) => {
  const messageItem = document.createElement('li');
  messageItem.classList.add('message-item');
  messageItem.classList.add(isReceived ? 'received' : 'sent');

  //creation de l'avatar
  const avatar = document.createElement('div');
  avatar.classList.add('avatar');
  avatar.textContent = sender.charAt(0).toUpperCase();

  //contenu du message avec le nom l'heure et le contenue
  const messageContent = document.createElement('div');
  messageContent.classList.add('message-content');
  messageContent.innerHTML = `
      <div class="message-info">
          <span class="message-sender">${sender}</span>
          <span class="message-timestamp">${timestamp}</span>
      </div>
      <div class="message-text">${content}</div>
  `;

  messageItem.appendChild(avatar);
  messageItem.appendChild(messageContent);

  //gestion scrollbar
  if (messageList) {
      messageList.appendChild(messageItem);
      messageList.scrollTop = messageList.scrollHeight;
  } else {
      console.error('Element de la liste des messages non trouvé.');
  }
};

export const getCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};
