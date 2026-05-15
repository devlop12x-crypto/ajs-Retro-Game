import Character from '../Character';

/**
 * Мечник (игрок)
 * Атака: 40, Защита: 10
 * Движение: 4 клетки
 * Дальность атаки: 1 клетка
 */
export default class Swordsman extends Character {
    constructor(level) {
        super(1, 'swordsman');
        this.attack = 40;
        this.defence = 10;

        this.moveDistance = 4;
        this.attackDistance = 1;

        for (let i = 1; i < level; i++) {
            this.levelUp();
        }
    }
}