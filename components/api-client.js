/**
 * Атомарний компонент: API Client
 * 
 * Спрощує роботу з API запитами
 */

function createApiClient() {
    var network = new Lampa.Reguest();
    
    return {
        /**
         * GET запит
         * @param {string} url - URL
         * @param {Function} onSuccess - Обробник успіху
         * @param {Function} onError - Обробник помилки
         */
        get: function(url, onSuccess, onError) {
            console.log('API', 'GET:', url);
            
            network.silent(url,
                function(data) {
                    console.log('API', 'Success:', url);
                    if (onSuccess) onSuccess(data);
                },
                function(error) {
                    console.log('API', 'Error:', url, error);
                    if (onError) onError(error);
                }
            );
        },
        
        /**
         * POST запит
         * @param {string} url - URL
         * @param {Object} data - Дані
         * @param {Function} onSuccess - Обробник успіху
         * @param {Function} onError - Обробник помилки
         */
        post: function(url, data, onSuccess, onError) {
            console.log('API', 'POST:', url);
            
            network.silent(url,
                function(response) {
                    console.log('API', 'Success:', url);
                    if (onSuccess) onSuccess(response);
                },
                function(error) {
                    console.log('API', 'Error:', url, error);
                    if (onError) onError(error);
                },
                JSON.stringify(data),
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
        },
        
        /**
         * TMDB запит
         * @param {string} endpoint - Ендпоінт (наприклад, 'movie/popular')
         * @param {Object} params - Параметри запиту
         * @param {Function} onSuccess - Обробник успіху
         * @param {Function} onError - Обробник помилки
         */
        tmdb: function(endpoint, params, onSuccess, onError) {
            var api = Lampa.Api.sources.tmdb;
            var url = api.url(endpoint, Object.assign({
                language: api.language
            }, params || {}));
            
            this.get(url, onSuccess, onError);
        },
        
        /**
         * Запит з індикатором завантаження
         * @param {string} url - URL
         * @param {Function} onSuccess - Обробник успіху
         * @param {Function} onError - Обробник помилки
         */
        getWithLoading: function(url, onSuccess, onError) {
            Lampa.Loading.start();
            
            this.get(url,
                function(data) {
                    Lampa.Loading.stop();
                    if (onSuccess) onSuccess(data);
                },
                function(error) {
                    Lampa.Loading.stop();
                    if (onError) onError(error);
                }
            );
        }
    };
}

// Експорт для використання
if (typeof module !== 'undefined' && module.exports) {
    module.exports = createApiClient;
}
