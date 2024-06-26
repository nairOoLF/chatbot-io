export function clearMessageList(messageList) {
  while (messageList.firstChild) {
      messageList.removeChild(messageList.firstChild);
  }
}
