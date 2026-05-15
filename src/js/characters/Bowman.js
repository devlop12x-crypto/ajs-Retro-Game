import Character from '../Character';

/**
 * Лучник (игрок)
 */
export default class Bowman extends Character {
    constructor(level) {
        // Всегда стартуем с 1 уровня, чтобы levelUp корректно повышал его
        super(1, 'bowman');

        this.attack = 25;
        this.defence = 25;

        this.moveDistance = 2;
        this.attackDistance = 2;

        // Теперь, если level = 3, цикл сработает 2 раза,
        // и levelUp() поднимет this.level с 1 до 3.
        for (let i = 1; i < level; i++) {
            this.levelUp();
        }
    }
}