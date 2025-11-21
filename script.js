const searchInput = document.getElementById('pokemon-search');
const searchBtn = document.getElementById('search-btn');
const pokemonDataContainer = document.getElementById('pokemon-data');

const API_URL = 'https://pokeapi.co/api/v2/pokemon/';

async function fetchPokemon(query) {
    try {
        showLoading();
        const response = await fetch(`${API_URL}${query.toLowerCase()}`);

        if (!response.ok) {
            throw new Error('Pokemon not found');
        }

        const data = await response.json();
        displayPokemon(data);
    } catch (error) {
        showError();
    }
}

function displayPokemon(data) {
    const typesHtml = data.types
        .map(typeInfo => `<span class="type-badge type-${typeInfo.type.name}">${typeInfo.type.name}</span>`)
        .join('');

    const stats = {
        hp: data.stats.find(s => s.stat.name === 'hp').base_stat,
        attack: data.stats.find(s => s.stat.name === 'attack').base_stat,
        defense: data.stats.find(s => s.stat.name === 'defense').base_stat,
        speed: data.stats.find(s => s.stat.name === 'speed').base_stat
    };

    const html = `
        <div class="pokemon-img-container">
            <img src="${data.sprites.other['official-artwork'].front_default || data.sprites.front_default}" 
                 alt="${data.name}" 
                 class="pokemon-img">
        </div>
        <span class="pokemon-id">#${String(data.id).padStart(3, '0')}</span>
        <h2 class="pokemon-name">${data.name}</h2>
        <div class="types-container">
            ${typesHtml}
        </div>
        <div class="stats-container">
            <div class="stat-item">
                <span class="stat-label">HP</span>
                <span class="stat-value">${stats.hp}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">ATK</span>
                <span class="stat-value">${stats.attack}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">DEF</span>
                <span class="stat-value">${stats.defense}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">SPD</span>
                <span class="stat-value">${stats.speed}</span>
            </div>
        </div>
    `;

    pokemonDataContainer.innerHTML = html;
}

function showLoading() {
    pokemonDataContainer.innerHTML = `
        <div class="loading-state">
            <div class="pokeball-spinner"></div>
            <p>Searching...</p>
        </div>
    `;
}

function showError() {
    pokemonDataContainer.innerHTML = `
        <div class="error-state">
            <p style="font-size: 3rem; margin-bottom: 10px;">?</p>
            <h3 style="margin-bottom: 10px;">Pokemon Not Found</h3>
            <p style="color: var(--text-dim);">Check the spelling or try another ID</p>
        </div>
    `;
}

searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) fetchPokemon(query);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) fetchPokemon(query);
    }
});

fetchPokemon('ditto');
