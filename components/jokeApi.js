const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjAzMTUwOTI2NDMzNDg0ODAxIiwibGltaXQiOjEwMCwia2V5IjoiZEQybzBPenB2T0FEZkhIUXRDZ3l5bzkya0lnOWQ4YWhzN0xaN0lVUFlDTzI1ZTE5WnoiLCJjcmVhdGVkX2F0IjoiMjAyNC0wNi0yNVQxNDowMDoxNiswMDowMCIsImlhdCI6MTcxOTMyNDAxNn0.CjBuiKI6P3O6dnw4azSEK9e1xEP04NlwerqVjalk964';

export async function getJoke(type = 'global') {
    const apiUrl = `https://www.blagues-api.fr/api/type/${type}/random`;
    const headers = {
        'Authorization': `Bearer ${apiKey}`
    };

    try {
        const response = await fetch(apiUrl, { headers });
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération de la blague');
        }
        const jokeData = await response.json();

        return jokeData;
    } catch (error) {
        console.error('Erreur lors de la récupération de la blague :', error);
        throw new Error('Erreur lors de la récupération de la blague.');
    }
}

export const jokeTypes = [
    'global', 'dev', 'dark', 'limit', 'beauf', 'blondes'
];