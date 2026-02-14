/**
 * Атомарний компонент: Менеджер Storage
 * 
 * Спрощує роботу зі Storage Lampa
 */

function createStorageManager(storageKey) {
    return {
        key: storageKey,
        
        /**
         * Отримати дані
         * @param {*} defaultValue - Значення за замовчуванням
         */
        get: function(defaultValue) {
            return Lampa.Storage.get(this.key, defaultValue);
        },
        
        /**
         * Зберегти дані
         * @param {*} value - Значення для збереження
         */
        set: function(value) {
            Lampa.Storage.set(this.key, value);
            console.log('Storage', 'Saved:', this.key);
        },
        
        /**
         * Видалити дані
         */
        remove: function() {
            Lampa.Storage.remove(this.key);
            console.log('Storage', 'Removed:', this.key);
        },
        
        /**
         * Підписатися на зміни
         * @param {Function} callback - Обробник змін
         */
        watch: function(callback) {
            var self = this;
            Lampa.Storage.listener.follow('change', function(e) {
                if (e.name === self.key) {
                    callback(e.value);
                }
            });
        },
        
        /**
         * Оновити частину даних (для об'єктів)
         * @param {Object} updates - Оновлення
         */
        update: function(updates) {
            var current = this.get({});
            var updated = Object.assign({}, current, updates);
            this.set(updated);
        },
        
        /**
         * Додати елемент в масив
         * @param {*} item - Елемент для додавання
         */
        push: function(item) {
            var current = this.get([]);
            current.push(item);
            this.set(current);
        },
        
        /**
         * Видалити елемент з масиву
         * @param {Function} predicate - Функція пошуку
         */
        remove: function(predicate) {
            var current = this.get([]);
            var filtered = current.filter(function(item) {
                return !predicate(item);
            });
            this.set(filtered);
        }
    };
}

// Експорт для використання
if (typeof module !== 'undefined' && module.exports) {
    module.exports = createStorageManager;
}
