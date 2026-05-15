import Character from '../js/Character';
import Bowman from '../js/characters/Bowman';
import Swordsman from '../js/characters/Swordsman';
import Magician from '../js/characters/Magician';
import Vampire from '../js/characters/Vampire';
import Undead from '../js/characters/Undead';
import Daemon from '../js/characters/Daemon';

describe('Character', () => {
    test('нельзя создать экземпляр базового класса Character', () => {
        expect(() => new Character(1)).toThrow(
            'Нельзя создать экземпляр базового класса Character'
        );
    });

    test('можно создать экземпляр дочернего класса', () => {
        expect(() => new Bowman(1)).not.toThrow();
        expect(() => new Swordsman(1)).not.toThrow();
        expect(() => new Magician(1)).not.toThrow();
    });
});

describe('Персонажи игрока - уровень 1', () => {
    test('Bowman должен иметь правильные характеристики', () => {
        const bowman = new Bowman(1);

        expect(bowman.type).toBe('bowman');
        expect(bowman.level).toBe(1);
        expect(bowman.attack).toBe(25);
        expect(bowman.defence).toBe(25);
        expect(bowman.health).toBe(50);
        expect(bowman.moveDistance).toBe(2);
        expect(bowman.attackDistance).toBe(2);
    });

    test('Swordsman должен иметь правильные характеристики', () => {
        const swordsman = new Swordsman(1);

        expect(swordsman.type).toBe('swordsman');
        expect(swordsman.level).toBe(1);
        expect(swordsman.attack).toBe(40);
        expect(swordsman.defence).toBe(10);
        expect(swordsman.health).toBe(50);
        expect(swordsman.moveDistance).toBe(4);
        expect(swordsman.attackDistance).toBe(1);
    });

    test('Magician должен иметь правильные характеристики', () => {
        const magician = new Magician(1);

        expect(magician.type).toBe('magician');
        expect(magician.level).toBe(1);
        expect(magician.attack).toBe(10);
        expect(magician.defence).toBe(40);
        expect(magician.health).toBe(50);
        expect(magician.moveDistance).toBe(1);
        expect(magician.attackDistance).toBe(4);
    });
});

describe('Персонажи противника - уровень 1', () => {
    test('Vampire должен иметь правильные характеристики', () => {
        const vampire = new Vampire(1);

        expect(vampire.type).toBe('vampire');
        expect(vampire.level).toBe(1);
        expect(vampire.attack).toBe(25);
        expect(vampire.defence).toBe(25);
    });

    test('Undead должен иметь правильные характеристики', () => {
        const undead = new Undead(1);

        expect(undead.type).toBe('undead');
        expect(undead.level).toBe(1);
        expect(undead.attack).toBe(40);
        expect(undead.defence).toBe(10);
    });

    test('Daemon должен иметь правильные характеристики', () => {
        const daemon = new Daemon(1);

        expect(daemon.type).toBe('daemon');
        expect(daemon.level).toBe(1);
        expect(daemon.attack).toBe(10);
        expect(daemon.defence).toBe(10);
    });
});

describe('Повышение уровня персонажей', () => {
    test('персонаж 2 уровня создаётся с повышенными характеристиками', () => {
        const bowman1 = new Bowman(1);
        const bowman2 = new Bowman(2);

        expect(bowman2.level).toBe(2);
        expect(bowman2.attack).toBeGreaterThan(bowman1.attack);
        expect(bowman2.defence).toBeGreaterThan(bowman1.defence);
    });

    test('персонаж 3 уровня имеет максимальное здоровье', () => {
        const swordsman = new Swordsman(3);

        expect(swordsman.level).toBe(3);
        expect(swordsman.health).toBeGreaterThan(50);
    });

    test('здоровье не превышает 100', () => {
        const magician = new Magician(4);

        expect(magician.health).toBeLessThanOrEqual(100);
    });
});

describe('Характеристики движения и атаки', () => {
    test('каждый класс имеет свои дистанции', () => {
        const characters = [
            new Swordsman(1),
            new Bowman(1),
            new Magician(1),
            new Undead(1),
            new Vampire(1),
            new Daemon(1),
        ];

        characters.forEach((char) => {
            expect(char.moveDistance).toBeDefined();
            expect(char.attackDistance).toBeDefined();
        });
    });

    test('мечник и нежить ходят на 4 клетки', () => {
        expect(new Swordsman(1).moveDistance).toBe(4);
        expect(new Undead(1).moveDistance).toBe(4);
    });

    test('лучник и вампир ходят на 2 клетки', () => {
        expect(new Bowman(1).moveDistance).toBe(2);
        expect(new Vampire(1).moveDistance).toBe(2);
    });

    test('маг и демон ходят на 1 клетку', () => {
        expect(new Magician(1).moveDistance).toBe(1);
        expect(new Daemon(1).moveDistance).toBe(1);
    });
});

test('levelUp мертвеца должен выбрасывать ошибку', () => {
  const deadChar = new Bowman(1);
  deadChar.health = 0; // Убиваем персонажа
  
  // Оборачиваем вызов в функцию, чтобы Jest смог перехватить ошибку
  expect(() => deadChar.levelUp()).toThrow();
});