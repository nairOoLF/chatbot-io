const weatherTranslations = {
    'Thunderstorm': 'Orage',
    'Drizzle': 'Bruine',
    'Rain': 'Pluie',
    'Snow': 'Neige',
    'Mist': 'Brume',
    'Smoke': 'Fumée',
    'Haze': 'Brume de sable',
    'Dust': 'Poussière',
    'Fog': 'Brouillard',
    'Sand': 'Sable',
    'Ash': 'Cendres volcaniques',
    'Squall': 'Rafale',
    'Tornado': 'Tornade',
    'Clear': 'Dégagé',
    'Clouds': 'Nuageux',
};

export async function getWeather(location, days) {
    const apiKey = '56fd536cb29f8789ee3237e5d39c99ad';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&cnt=${days * 8}&appid=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Ville non trouvée.');
        }
        const data = await response.json();

        const city = data.city.name;
        
        //creation du tableau pour les previsions
        const forecastData = data.list.slice(0, days).map(item => ({
            date: new Date(item.dt * 1000).toLocaleDateString('fr-FR', { weekday: 'long' }),
            description: weatherTranslations[item.weather[0].main] || item.weather[0].main,
            temperature: Math.round(item.main.temp - 273.15),
            sunrise: new Date(data.city.sunrise * 1000).toLocaleTimeString(),
            sunset: new Date(data.city.sunset * 1000).toLocaleTimeString()
        }));

        return {
            city,
            forecastData
        };
    } catch (error) {
        console.error('Erreur lors de la récupération des données météo :', error);
        throw new Error('Erreur lors de la récupération des données météo.');
    }
}
