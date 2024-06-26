export const getGif = async (apiUrl) => {
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data && data.data && data.data.images) {
        return `<img src="${data.data.images.original.url}" alt="GIF">`;
    } else {
        throw new Error('Données GIF invalides.');
    }
};
