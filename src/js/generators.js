import Team from './Team';
import PositionedCharacter from './PositionedCharacter';

// Импортируем все классы персонажей
import Bowman from './characters/Bowman';
import Swordsman from './characters/Swordsman';
import Magician from './characters/Magician';
import Vampire from './characters/Vampire';
import Undead from './characters/Undead';
import Daemon from './characters/Daemon';

// Экспортируем списки типов, чтобы тестам и контроллеру было удобно их брать
export const playerTypes = [Bowman, Swordsman, Magician];
export const enemyTypes = [Vampire, Undead, Daemon];

/**
 * Формирует экземпляр персонажа из массива allowedTypes со случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове возвращает нового персонажа
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  while (true) {
    const randomIndex = Math.floor(Math.random() * allowedTypes.length);
    const CharacterClass = allowedTypes[randomIndex];
    const level = Math.floor(Math.random() * maxLevel) + 1;

    yield new CharacterClass(level);
  }
}

/**
 * Формирует массив персонажей на основе characterGenerator
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей
 * @returns экземпляр Team, хранящий экземпляры персонажей
 */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const characters = [];
  const generator = characterGenerator(allowedTypes, maxLevel);

  for (let i = 0; i < characterCount; i++) {
    characters.push(generator.next().value);
  }

  return new Team(characters);
}

/**
 * Расставляет команду на разрешенные колонки случайным образом (без дублирования клеток)
 * 
 * @param team экземпляр класса Team (свойство characters)
 * @param allowedColumns массив с индексами разрешенных колонок (например, [0, 1] для игрока)
 * @param boardSize размер доски (по умолчанию 8)
 * @returns массив объектов PositionedCharacter
 */
export function positionTeam(team, allowedColumns, boardSize = 8) {
  const positions = [];
  const availableIndices = [];

  // 1. Собираем все доступные индексы клеток для разрешенных колонок
  for (let i = 0; i < boardSize ** 2; i++) {
    const col = i % boardSize;
    if (allowedColumns.includes(col)) {
      availableIndices.push(i);
    }
  }

  // 2. Расставляем каждого персонажа из команды на случайную свободную клетку
  team.characters.forEach(character => {
    // Выбираем случайный индекс из массива доступных
    const randomIdx = Math.floor(Math.random() * availableIndices.length);
    // Вырезаем его из массива (чтобы 2 бойца не встали на 1 клетку)
    const position = availableIndices.splice(randomIdx, 1)[0];

    // Создаем привязку персонажа к клетке и пушим в результат
    positions.push(new PositionedCharacter(character, position));
  });

  return positions;
}