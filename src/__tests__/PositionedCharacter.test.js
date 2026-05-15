import PositionedCharacter from '../js/PositionedCharacter';
import Bowman from '../js/characters/Bowman';

describe('PositionedCharacter', () => {
    test('должен успешно создаваться с правильными аргументами', () => {
        const character = new Bowman(1);
        const positioned = new PositionedCharacter(character, 42);

        expect(positioned.character).toBe(character);
        expect(positioned.position).toBe(42);
    });

    test('должен выбрасывать ошибку, если передан не класс Character', () => {
        // Передаем обычный объект вместо экземпляра класса
        expect(() => {
            new PositionedCharacter({ level: 1, type: 'bowman' }, 42);
        }).toThrow();
    });
});
test('должен выбрасывать ошибку, если передан не класс Character', () => {
  // Передаем обычную строку или объект вместо new Bowman()
  expect(() => new PositionedCharacter('fakeCharacter', 42)).toThrow(); 
});