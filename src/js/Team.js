export default class Team {
    constructor(characters = []) {
        this.characters = characters;
    }

    /**
     * Добавить персонажа в команду
     */
    add(character) {
        this.characters.push(character);
    }

    /**
     * Удалить персонажа из команды
     */
    remove(character) {
        const index = this.characters.indexOf(character);
        if (index > -1) {
            this.characters.splice(index, 1);
        }
    }

    /**
     * Получить всех живых персонажей
     */
    getAlive() {
        return this.characters.filter(char => char.health > 0);
    }

    /**
     * Проверить, есть ли живые персонажи
     */
    hasAlive() {
        return this.getAlive().length > 0;
    }
}