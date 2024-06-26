import { getWeather } from './components/openWeatherMap.js';
import { getGif } from './components/giphy.js';
import { getJoke, jokeTypes } from './components/jokeApi.js';
import { displayMessage, getCurrentTime } from './components/message.js';
import { clearMessageList } from './components/messageList.js';

document.addEventListener('DOMContentLoaded', () => {
    const botList = document.querySelectorAll('.bot');
    const chatSections = document.querySelectorAll('.chat-section');

    //config et gestion des differents bot avec ce qu'ils doivent faire
    const botConfig = {
        'meteo': {
            sendButton: document.getElementById('send-button-meteo'),
            userInput: document.getElementById('user-input-meteo'),
            messageList: document.getElementById('message-list-meteo'),
            handler: async (message) => {
                //gestion commandes pour la meteo
                const command = message.trim().match(/^(actuelle|previsions|soleil) \[(.+?)\] \[(\d+)\]$/);
                if (command) {
                    const action = command[1];
                    const location = command[2];
                    const days = parseInt(command[3]);

                    try {
                        let weatherInfo;
                        if (action === 'actuelle') {
                            weatherInfo = await getWeather(location, 1);
                            return `Météo actuelle à ${weatherInfo.city} : ${weatherInfo.forecastData[0].description}, Température : ${weatherInfo.forecastData[0].temperature}°C`;
                        } else if (action === 'previsions') {
                            weatherInfo = await getWeather(location, days);
                            let forecastMessage = `Prévision météo pour ${weatherInfo.city} sur ${days} jours:\n`;
                            weatherInfo.forecastData.forEach(forecast => {
                                forecastMessage += `${forecast.date} : ${forecast.description}, Température : ${forecast.temperature}°C\n`;
                            });
                            return forecastMessage;
                        } else if (action === 'soleil') {
                            weatherInfo = await getWeather(location, days);
                            let sunMessage = `Heures de lever et coucher du soleil pour ${weatherInfo.city} sur ${days} jours:\n`;
                            weatherInfo.forecastData.forEach(forecast => {
                                sunMessage += `${forecast.date} : Lever du soleil : ${forecast.sunrise}, Coucher du soleil : ${forecast.sunset}\n`;
                            });
                            return sunMessage;
                        } else {
                            return 'Action de commande non reconnue.';
                        }
                    } catch (error) {
                        console.error('Erreur lors de la récupération des données météo :', error);
                        return 'Erreur lors de la récupération des données météo.';
                    }
                } else {
                    return 'Format de commande incorrect.';
                }
            }
        },
        'gifs': {
            sendButton: document.getElementById('send-button-gifs'),
            userInput: document.getElementById('user-input-gifs'),
            messageList: document.getElementById('message-list-gifs'),
            handler: async (message) => {
                //gestion commandes gifs
                if (message.trim() !== '') {
                    const keyword = message.trim();
                    const apiUrl = `https://api.giphy.com/v1/gifs/random?api_key=cCYX7WvMePzAYufsSFcfBGV1y6CBeqZq&tag=${keyword}`;
                    try {
                        return await getGif(apiUrl);
                    } catch (error) {
                        return 'Erreur lors de la récupération du GIF.';
                    }
                } else {
                    return 'Veuillez entrer un mot-clé pour rechercher un GIF.';
                }
            }
        },
        'blagues': {
            sendButton: document.getElementById('send-button-blagues'),
            userInput: document.getElementById('user-input-blagues'),
            messageList: document.getElementById('message-list-blagues'),
            handler: async (message) => {
                //gestion des commandes de blagues
                const userMessage = message.trim();
                if (userMessage === '/help') {
                    return `Types de blagues disponibles : ${jokeTypes.join(', ')}`;
                }
                const type = userMessage || 'global';
                if (jokeTypes.includes(type)) {
                    try {
                        const jokeData = await getJoke(type);
                        console.log('Blague récupérée :', jokeData);

                        if (jokeData.joke && jokeData.answer) {
                            return `${jokeData.joke} - ${jokeData.answer}`;
                        } else {
                            return jokeData.joke || 'Aucune réponse trouvée';
                        }
                    } catch (error) {
                        console.error('Erreur lors de la récupération de la blague :', error);
                        return 'Erreur lors de la récupération de la blague.';
                    }
                } else {
                    return `Type de blague non reconnu. Utilisez /help pour voir les types disponibles.`;
                }
            }
        }
    };

    //gérer l'envoi de messages
    const createSendMessageHandler = (saveMessages, loadMessages, displayMessage, getCurrentTime) => {
        return async (currentBot, message) => {
            if (!currentBot) return;

            const { userInput, messageList, handler } = botConfig[currentBot];
            if (message === '') return;

            const userMessage = { sender: 'Vous', time: getCurrentTime(), content: message, isBot: false };
            displayMessage(userMessage.sender, userMessage.time, userMessage.content, userMessage.isBot, messageList);

            try {
                const responseMessage = await handler(message);
                const botMessage = { sender: currentBot, time: getCurrentTime(), content: responseMessage, isBot: true };
                displayMessage(botMessage.sender, botMessage.time, botMessage.content, botMessage.isBot, messageList);

                const messages = loadMessages(currentBot);
                messages.push(userMessage, botMessage);
                saveMessages(currentBot, messages);
            } catch (error) {
                console.error('Erreur lors de la gestion de la commande :', error);
                displayMessage('Système', getCurrentTime(), 'Erreur lors de la gestion de la commande.', false, messageList);
            }

            userInput.value = '';
        };
    };

    // Sauvegarde et chargement des messages avec localStorage
    const saveMessagesToLocalStorage = (bot, messages) => {
        localStorage.setItem(`chat_${bot}`, JSON.stringify(messages));
    };

    const loadMessagesFromLocalStorage = (bot) => {
        const messages = localStorage.getItem(`chat_${bot}`);
        return messages ? JSON.parse(messages) : [];
    };

    
    const sendMessageHandler = createSendMessageHandler(
        saveMessagesToLocalStorage,
        loadMessagesFromLocalStorage,
        displayMessage,
        getCurrentTime
    );

    let currentBot = null;

    // Gestion des événements des bots
    botList.forEach((bot) => {
        bot.addEventListener('click', () => {
            botList.forEach((b) => b.classList.remove('active'));

            bot.classList.add('active');
            currentBot = bot.getAttribute('data-bot');
            chatSections.forEach((section) => {
                if (section.id === `chat-${currentBot}`) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });

            const { messageList } = botConfig[currentBot];
            if (messageList) {
                clearMessageList(messageList);
                renderMessages(currentBot, messageList);
            }
            displayMessage('Système', getCurrentTime(), `Bienvenue dans la discussion avec le ${bot.textContent.trim()}!!`, false, messageList);

            // Affichage des commandes spécifiques pour chaque bot
            if (currentBot === 'meteo') {
                const commandsMessage = 'Commandes disponibles : \'actuelle [ville] [1]\' pour obtenir la météo actuelle; ou \'previsions [ville] [jours]\'  pour obtenir les prévisions météo sur le nombre de jours indiqué; ou bien \'soleil [ville] [jours]\' pour les heures de lever et coucher du soleil';
                displayMessage('Système', getCurrentTime(), commandsMessage, false, messageList);
            } else if (currentBot === 'gifs') {
                const commandsMessage = 'Entrez un mot clé pour recevoir un gif associé';
                displayMessage('Système', getCurrentTime(), commandsMessage, false, messageList);
            } else if (currentBot === 'blagues') {
                const commandsMessage = 'Afin de recevoir une blague, donnez le type d\'humour que vous souhaitez (dev, dark, limit, beauf, blondes)';
                displayMessage('Système', getCurrentTime(), commandsMessage, false, messageList);
            }
        });
    });

    // Gestion de l'envoi de messages avec bouton ou touche entrée
    Object.keys(botConfig).forEach(botKey => {
        const { sendButton, userInput } = botConfig[botKey];
        sendButton.addEventListener('click', () => {
            const message = userInput.value.trim();
            sendMessageHandler(currentBot, message);
        });

        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const message = userInput.value.trim();
                sendMessageHandler(currentBot, message);
            }
        });
    });

    // Fonction pour charger et afficher les messages depuis localStorage
    const renderMessages = (bot, messageList) => {
        const messages = loadMessagesFromLocalStorage(bot);
        messages.forEach(({ sender, time, content, isBot }) => {
            displayMessage(sender, time, content, isBot, messageList);
        });
    };
});
