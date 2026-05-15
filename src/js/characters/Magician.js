import Character from '../Character';

/**
 * Маг (игрок)
 * Атака: 10, Защита: 40
 * Движение: 1 клетка
 * Дальность атаки: 4 клетки
 */
export default class Magician extends Character {
    constructor(level) {
        super(1, 'magician');
        this.attack = 10;
        this.defence = 40;

        this.moveDistance = 1;
        this.attackDistance = 4;

        for (let i = 1; i < level; i++) {
            this.levelUp();
        }
    }
}