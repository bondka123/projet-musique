let searchResults = [];
        let currentSong = null;

        // Fonction pour rechercher de la musique via l'API iTunes
        async function searchMusic() {
            const query = document.getElementById('searchInput').value.trim();
            if (!query) return;

            showLoading(true);
            hideResults();
            hideError();

            try {
                // Utilisation de l'API iTunes Search
                const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=25`);
                
                if (!response.ok) {
                    throw new Error('Erreur lors de la recherche');
                }

                const data = await response.json();
                searchResults = data.results;
                
                showLoading(false);
                displayResults();
                
            } catch (error) {
                console.error('Erreur:', error);
                showLoading(false);
                showError('Erreur lors de la recherche. Vérifiez votre connexion internet.');
            }
        }

        function showLoading(show) {
            document.getElementById('loading').style.display = show ? 'block' : 'none';
        }

        function hideResults() {
            document.getElementById('resultsContainer').style.display = 'none';
        }

        function showError(message) {
            const errorDiv = document.getElementById('errorMessage');
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }

        function hideError() {
            document.getElementById('errorMessage').style.display = 'none';
        }

        function formatDuration(milliseconds) {
            const minutes = Math.floor(milliseconds / 60000);
            const seconds = Math.floor((milliseconds % 60000) / 1000);
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }

        function displayResults() {
            const resultsContainer = document.getElementById('resultsContainer');
            const resultsDiv = document.getElementById('results');

            if (searchResults.length === 0) {
                resultsDiv.innerHTML = `
                    <div class="no-results">
                        <h3>Aucun résultat trouvé</h3>
                        <p>Essayez avec d'autres mots-clés</p>
                    </div>
                `;
            } else {
                resultsDiv.innerHTML = searchResults.map((song, index) => `
                    <div class="result-item" onclick="playSong(${index})">
                        <img 
                            src="${song.artworkUrl60 || song.artworkUrl100 || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZjBmMGYwIi8+CjxwYXRoIGQ9Ik0zMCAyMEMzNS41MjI5IDIwIDQwIDI0LjQ3NzEgNDAgMzBDNDAzNS41MjI5IDM1LjUyMjkgMzAgMzVTMjAgMzUuNTIyOSAyMCAzMEMyMCAyNC40NzcxIDI0LjQ3NzEgMjAgMzAgMjBaIiBmaWxsPSIjY2NjIi8+Cjwvc3ZnPgo='}" 
                            alt="Album cover" 
                            class="album-art"
                            onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZjBmMGYwIi8+CjxwYXRoIGQ9Ik0zMCAyMEMzNS41MjI5IDIwIDQwIDI0LjQ3NzEgNDAgMzBDNDAzNS41MjI5IDM1LjUyMjkgMzAgMzVTMjAgMzUuNTIyOSAyMCAzMEMyMCAyNC40NzcxIDI0LjQ3NzEgMjAgMzAgMjBaIiBmaWxsPSIjY2NjIi8+Cjwvc3ZnPgo='"
                        >
                        <div class="song-info">
                            <div class="song-title">${song.trackName || 'Titre inconnu'}</div>
                            <div class="artist-name">${song.artistName || 'Artiste inconnu'}</div>
                            <div class="album-name">${song.collectionName || 'Album inconnu'}</div>
                        </div>
                        <div class="song-details">
                            <button class="play-btn" onclick="event.stopPropagation(); playSong(${index})">
                                ▶️
                            </button>
                            ${song.trackTimeMillis ? `<div class="duration">${formatDuration(song.trackTimeMillis)}</div>` : ''}
                        </div>
                    </div>
                `).join('');
            }

            resultsContainer.style.display = 'block';
        }

        function playSong(songIndex) {
            const song = searchResults[songIndex];
            if (!song) return;

            currentSong = song;
            
            const currentPlayingDiv = document.getElementById('currentPlaying');
            const playingInfoDiv = document.getElementById('playingInfo');
            const audioPlayer = document.getElementById('audioPlayer');
            
            playingInfoDiv.innerHTML = `
                <div class="playing">
                    <strong>${song.trackName || 'Titre inconnu'}</strong><br>
                    par ${song.artistName || 'Artiste inconnu'}<br>
                    <small>Album: ${song.collectionName || 'Album inconnu'}</small>
                </div>
            `;
            
            // Si un aperçu audio est disponible
            if (song.previewUrl) {
                audioPlayer.src = song.previewUrl;
                audioPlayer.style.display = 'block';
                audioPlayer.play().catch(e => console.log('Lecture automatique bloquée par le navigateur'));
            } else {
                audioPlayer.style.display = 'none';
            }
            
            currentPlayingDiv.style.display = 'block';
            
            console.log(`Lecture de: ${song.trackName} par ${song.artistName}`);
        }

        // Permettre la recherche avec Enter
        document.getElementById('searchInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchMusic();
            }
        });

        // Recherche par défaut au chargement
        window.onload = function() {
            document.getElementById('searchInput').value = 'Nouba';
            searchMusic();
        };