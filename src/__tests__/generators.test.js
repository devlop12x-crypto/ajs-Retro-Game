import { characterGenerator, generateTeam, positionTeam } from '../js/generators';
import Bowman from '../js/characters/Bowman';
import Swordsman from '../js/characters/Swordsman';
import Magician from '../js/characters/Magician';
import Vampire from '../js/characters/Vampire';
import Undead from '../js/characters/Undead';
import Daemon from '../js/characters/Daemon';

const playerTypes = [Bowman, Swordsman, Magician];
const enemyTypes = [Vampire, Undead, Daemon];

describe('characterGenerator', () => {
    test('генератор возвращает персонажей бесконечно', () => {
        const generator = characterGenerator(playerTypes, 2);

        const char1 = generator.next().value;
        const char2 = generator.next().value;
        const char3 = generator.next().value;

        expect(char1).toBeDefined();
        expect(char2).toBeDefined();
        expect(char3).toBeDefined();
    });

    test('генератор создаёт персонажей из списка allowedTypes', () => {
        const generator = characterGenerator([Bowman], 1);

        const char = generator.next().value;

        expect(char).toBeInstanceOf(Bowman);
        expect(char.type).toBe('bowman');
    });

    test('генератор создаёт персонажей не выше maxLevel', () => {
        const generator = characterGenerator(playerTypes, 3);

        for (let i = 0; i < 20; i++) {
            const char = generator.next().value;
            expect(char.level).toBeGreaterThanOrEqual(1);
            expect(char.level).toBeLessThanOrEqual(3);
        }
    });
});

describe('generateTeam', () => {
    test('создаёт команду нужного размера', () => {
        const team = generateTeam(playerTypes, 2, 5);

        // Проверяем длину массива внутри экземпляра Team
        expect(team.characters).toHaveLength(5);
    });

    test('все персонажи в диапазоне уровней', () => {
        const team = generateTeam(enemyTypes, 2, 10);

        // Перебираем массив внутри Team
        team.characters.forEach((char) => {
            expect(char.level).toBeGreaterThanOrEqual(1);
            expect(char.level).toBeLessThanOrEqual(2);
        });
    });

    test('персонажи принадлежат к указанным типам', () => {
        const team = generateTeam(playerTypes, 3, 6);

        // Перебираем массив внутри Team
        team.characters.forEach((char) => {
            expect(['bowman', 'swordsman', 'magician']).toContain(char.type);
        });
    });
});

test('positionTeam должен расставлять массив персонажей', () => {
    // Оборачиваем бойцов в объект со свойством characters, ровно так, как ждет функция!
    const mockTeam = {
        characters: [new Bowman(1), new Swordsman(1)]
    };
    const allowedCols = [0, 1];

    // Передаем наш mockTeam вместо массива
    const positioned = positionTeam(mockTeam, allowedCols, 8);

    expect(positioned.length).toBe(2);
    expect(positioned[0].position).toBeGreaterThanOrEqual(0);
    expect(positioned[1].position).toBeGreaterThanOrEqual(0);
});