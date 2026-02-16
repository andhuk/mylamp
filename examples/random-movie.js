(function () {
    'use strict';

    Lampa.Plugins.add('random_dice_recommender', function () {
        
        // 1. Define the Button in Sidebar
        Lampa.Main.add({
            id: 'random_dice',
            title: 'Random',
            icon: '<svg height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM7 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm10 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0-10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM7 19c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm5-5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="white"/></svg>',
            onSelect: function () {
                getRandomRecommendation();
            }
        });

        // 2. Data Retrieval Logic
        function getRandomRecommendation() {
            // Extract IDs from Lampa Storage
            let history = Lampa.Storage.get('history', '[]');
            let favorites = Lampa.Storage.get('favorite', '[]');
            let rated = Lampa.Storage.get('items_vote', '[]');

            // Merge and deduplicate source IDs
            let sourcePool = [...history, ...favorites, ...rated].filter(item => item.id);
            
            if (sourcePool.length === 0) {
                Lampa.Noty.show('No data found in history or favorites.');
                return;
            }

            // Pick a random seed item
            let seed = sourcePool[Math.floor(Math.random() * sourcePool.length)];
            
            fetchSimilar(seed);
        }

        // 3. API Call for Similar Content (TMDB Example)
        function fetchSimilar(seed) {
            let type = seed.type || 'movie';
            let url = `https://api.themoviedb.org/3/${type}/${seed.id}/recommendations?api_key=${Lampa.TMDB.key()}&language=${Lampa.Storage.get('language','ru')}`;

            Lampa.Loading.show();

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    Lampa.Loading.hide();
                    if (data.results && data.results.length > 0) {
                        let result = data.results[Math.floor(Math.random() * data.results.length)];
                        
                        // Push to Full Info Screen
                        Lampa.Activity.push({
                            url: '',
                            title: 'Full Info',
                            component: 'full',
                            id: result.id,
                            method: type,
                            card: result,
                            source: 'tmdb'
                        });
                    } else {
                        Lampa.Noty.show('Could not find similar items.');
                    }
                })
                .catch(() => {
                    Lampa.Loading.hide();
                    Lampa.Noty.show('Network Error');
                });
        }
    });
})();
