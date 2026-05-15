import Character from '../Character';

/**
 * Демон (противник)
 * Атака: 10, Защита: 10
 * Движение: 1 клетка
 * Дальность атаки: 4 клетки
 */
export default class Daemon extends Character {
    constructor(level) {
        super(1, 'daemon');
        this.attack = 10;
        this.defence = 10;

        this.moveDistance = 1;
        this.attackDistance = 4;

        for (let i = 1; i < level; i++) {
            this.levelUp();
        }
    }
}