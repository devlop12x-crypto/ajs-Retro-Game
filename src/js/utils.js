/**
 * Определяет тип ячейки на игровом поле
 * @param {number} index - индекс поля (0 до boardSize² - 1)
 * @param {number} boardSize - размер квадратного поля
 * @returns {string} тип ячейки
 */
export function calcTileType(index, boardSize) {
  const row = Math.floor(index / boardSize);
  const col = index % boardSize;

  if (row === 0 && col === 0) return 'top-left';
  if (row === 0 && col === boardSize - 1) return 'top-right';
  if (row === boardSize - 1 && col === 0) return 'bottom-left';
  if (row === boardSize - 1 && col === boardSize - 1) return 'bottom-right';

  if (row === 0) return 'top';
  if (row === boardSize - 1) return 'bottom';
  if (col === 0) return 'left';
  if (col === boardSize - 1) return 'right';

  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) return 'critical';
  if (health < 50) return 'normal';
  return 'high';
}

/**
 * Формирует строку с информацией о персонаже
 */
export function getCharacterInfo(character) {
  return `\u{1F396}${character.level} \u{2694}${Math.round(character.attack)} \u{1F6E1}${Math.round(character.defence)} \u{2764}${Math.round(character.health)}`;
}

/**
 * Проверяет, может ли персонаж походить в указанную клетку
 */
export function canMove(startIndex, targetIndex, distance, boardSize = 8) {
  if (startIndex === targetIndex) return false;

  const startRow = Math.floor(startIndex / boardSize);
  const startCol = startIndex % boardSize;
  const targetRow = Math.floor(targetIndex / boardSize);
  const targetCol = targetIndex % boardSize;

  const rowDiff = Math.abs(startRow - targetRow);
  const colDiff = Math.abs(startCol - targetCol);

  if (rowDiff > distance || colDiff > distance) return false;

  // Только прямые линии и диагонали
  return rowDiff === 0 || colDiff === 0 || rowDiff === colDiff;
}

/**
 * Проверяет, достает ли персонаж до цели своей атакой
 */
export function canAttack(startIndex, targetIndex, distance, boardSize = 8) {
  if (startIndex === targetIndex) return false;

  const startRow = Math.floor(startIndex / boardSize);
  const startCol = startIndex % boardSize;
  const targetRow = Math.floor(targetIndex / boardSize);
  const targetCol = targetIndex % boardSize;

  const rowDiff = Math.abs(startRow - targetRow);
  const colDiff = Math.abs(startCol - targetCol);

  return rowDiff <= distance && colDiff <= distance;
}