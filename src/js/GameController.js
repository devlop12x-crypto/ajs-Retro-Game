import { generateTeam, positionTeam } from './generators';
import { Bowman, Swordsman, Magician, Vampire, Undead, Daemon } from './characters/index';
import GameState from './GameState';
import cursors from './cursors';
import themes from './themes';
import { canMove, canAttack, getCharacterInfo } from './utils';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.isProcessing = false;
    this.state = new GameState();
    this.boardSize = 8;

    this.playerTypes = [Bowman, Swordsman, Magician];
    this.enemyTypes = [Vampire, Undead, Daemon];

    this.themes = {
      1: themes.prairie,
      2: themes.desert,
      3: themes.arctic,
      4: themes.mountain,
    };
  }

  showError(message) {
    alert(message);
  }

  showMessage(message) {
    alert(message);
  }

  init() {
    this.gamePlay.drawUi(this.themes[this.state.level]);
    this.loadGame(true);

    if (this.state.positions.length === 0) {
      this.startNewGame();
    }

    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGameClick.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadGameClick.bind(this));
  }

  startNewGame() {
    this.state.reset();
    this.state.level = 1;

    const teamSize = 2;
    this.state.playerTeam = generateTeam(this.playerTypes, 1, teamSize);
    this.state.enemyTeam = generateTeam(this.enemyTypes, 1, teamSize);

    const playerPositions = positionTeam(this.state.playerTeam, [0, 1], this.boardSize);
    const enemyPositions = positionTeam(this.state.enemyTeam, [6, 7], this.boardSize);

    this.state.positions = [...playerPositions, ...enemyPositions];

    this.gamePlay.drawUi(this.themes[this.state.level]);
    this.gamePlay.redrawPositions(this.state.positions);

    this.state.turn = 'player';
  }

  onCellEnter(index) {
    const positioned = this.getCharacterAtPosition(index);

    if (positioned) {
      const info = getCharacterInfo(positioned.character);
      this.gamePlay.showCellTooltip(info, index);
    }

    if (this.state.turn !== 'player') {
      return;
    }

    if (positioned && this.isPlayerCharacter(positioned.character)) {
      this.gamePlay.setCursor(cursors.pointer);
    } else if (this.state.selectedCharacter) {
      const selected = this.state.selectedCharacter;

      if (positioned && !this.isPlayerCharacter(positioned.character)) {
        if (canAttack(selected.position, index, selected.character.attackDistance, this.boardSize)) {
          this.gamePlay.setCursor(cursors.crosshair);
          this.gamePlay.selectCell(index, 'red');
        } else {
          this.gamePlay.setCursor(cursors.notallowed);
        }
      } else if (!positioned) {
        if (canMove(selected.position, index, selected.character.moveDistance, this.boardSize)) {
          this.gamePlay.setCursor(cursors.pointer);
          this.gamePlay.selectCell(index, 'green');
        } else {
          this.gamePlay.setCursor(cursors.notallowed);
        }
      }
    } else {
      this.gamePlay.setCursor(cursors.auto);
    }
  }

  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);

    if (!this.state.selectedCharacter || this.state.selectedCharacter.position !== index) {
      this.gamePlay.deselectCell(index);
    }

    this.gamePlay.setCursor(cursors.auto);
  }

  onCellClick(index) {
    if (this.state.turn !== 'player' || this.isProcessing) return;

    const positioned = this.getCharacterAtPosition(index);

    if (positioned && this.isPlayerCharacter(positioned.character)) {
      this.selectCharacter(positioned);
      return;
    }

    if (!this.state.selectedCharacter) {
      if (positioned) {
        this.showError('Это не ваш персонаж!');
      } else {
        this.showError('Сначала выберите персонажа!');
      }
      return;
    }

    if (positioned && !this.isPlayerCharacter(positioned.character)) {
      this.attackCharacter(this.state.selectedCharacter, positioned);
      return;
    }

    if (!positioned) {
      this.moveCharacter(this.state.selectedCharacter, index);
      return;
    }
  }
  selectCharacter(positioned) {
    // Снимаем выделение с предыдущего персонажа, если он был выбран
    if (this.state.selectedCharacter) {
      this.gamePlay.deselectCell(this.state.selectedCharacter.position);
    }

    // Запоминаем нового выбранного персонажа
    this.state.selectedCharacter = positioned;

    // Рисуем под ним желтый круг
    this.gamePlay.selectCell(positioned.position);
  }

  async attackCharacter(attacker, target) {
    if (!canAttack(attacker.position, target.position, attacker.character.attackDistance, this.boardSize)) {
      this.showError('Слишком далеко для атаки!');
      return;
    }

    this.isProcessing = true;
    try {
      const damage = Math.round(Math.max(
        attacker.character.attack - target.character.defence,
        attacker.character.attack * 0.1,
      ));

      await this.gamePlay.showDamage(target.position, damage);
      target.character.health -= damage;

      if (target.character.health <= 0) {
        this.removeCharacter(target);
      }

      this.gamePlay.deselectCell(attacker.position);
      this.gamePlay.redrawPositions(this.state.positions);
      this.state.selectedCharacter = null;

      if (this.checkGameOver()) return;

      await this.endPlayerTurn();
    } finally {
      this.isProcessing = false;
    }
  }

  async moveCharacter(positioned, newPosition) {
    if (!canMove(positioned.position, newPosition, positioned.character.moveDistance, this.boardSize)) {
      this.showError('Слишком далеко для перемещения!');
      return;
    }

    if (this.getCharacterAtPosition(newPosition)) {
      this.showError('Ячейка занята!');
      return;
    }

    this.isProcessing = true;
    try {
      const oldPosition = positioned.position;
      positioned.position = newPosition;

      this.gamePlay.deselectCell(oldPosition);
      this.gamePlay.deselectCell(newPosition);
      this.gamePlay.redrawPositions(this.state.positions);
      this.state.selectedCharacter = null;

      await this.endPlayerTurn();
    } finally {
      this.isProcessing = false;
    }
  }

  async endPlayerTurn() {
    this.state.turn = 'computer';
    await new Promise(resolve => setTimeout(resolve, 500));
    await this.computerTurn();

    if (!this.checkGameOver()) {
      this.state.turn = 'player';
    }
  }

  async computerTurn() {
    const enemyPositions = this.state.positions.filter(
      (p) => !this.isPlayerCharacter(p.character) && p.character.health > 0,
    );
    const playerPositions = this.state.positions.filter(
      (p) => this.isPlayerCharacter(p.character) && p.character.health > 0,
    );

    if (enemyPositions.length === 0 || playerPositions.length === 0) return;

    // Ищем лучшее действие среди ВСЕХ врагов
    let bestAction = null;
    let minDistance = Infinity;

    for (const enemy of enemyPositions) {
      for (const player of playerPositions) {
        const distance = this.calculateDistance(enemy.position, player.position);

        if (distance < minDistance) {
          minDistance = distance;

          if (canAttack(enemy.position, player.position, enemy.character.attackDistance, this.boardSize)) {
            bestAction = { type: 'attack', attacker: enemy, target: player };
          } else {
            const movePos = this.findMoveTowards(enemy, player.position);
            if (movePos !== null) {
              bestAction = { type: 'move', attacker: enemy, position: movePos };
            }
          }
        }
      }
    }

    // Выполняем ОДНО действие
    if (bestAction?.type === 'attack') {
      const { attacker, target } = bestAction;
      const damage = Math.round(Math.max(
        attacker.character.attack - target.character.defence,
        attacker.character.attack * 0.1,
      ));

      await this.gamePlay.showDamage(target.position, damage);
      target.character.health -= damage;

      if (target.character.health <= 0) {
        this.removeCharacter(target);
      }
    } else if (bestAction?.type === 'move') {
      bestAction.attacker.position = bestAction.position;
    }

    this.gamePlay.redrawPositions(this.state.positions);
  }

  findMoveTowards(from, targetPosition) {
    const fromRow = Math.floor(from.position / this.boardSize);
    const fromCol = from.position % this.boardSize;
    const toRow = Math.floor(targetPosition / this.boardSize);
    const toCol = targetPosition % this.boardSize;

    const rowDiff = toRow - fromRow;
    const colDiff = toCol - fromCol;

    const rowDir = rowDiff === 0 ? 0 : rowDiff / Math.abs(rowDiff);
    const colDir = colDiff === 0 ? 0 : colDiff / Math.abs(colDiff);

    for (let distance = from.character.moveDistance; distance > 0; distance--) {
      const newRow = fromRow + rowDir * distance;
      const newCol = fromCol + colDir * distance;
      const newPos = newRow * this.boardSize + newCol;

      if (newRow < 0 || newRow >= this.boardSize || newCol < 0 || newCol >= this.boardSize) {
        continue;
      }

      if (!this.getCharacterAtPosition(newPos) &&
        canMove(from.position, newPos, from.character.moveDistance, this.boardSize)) {
        return newPos;
      }
    }

    return null;
  }

  calculateDistance(pos1, pos2) {
    const row1 = Math.floor(pos1 / this.boardSize);
    const col1 = pos1 % this.boardSize;
    const row2 = Math.floor(pos2 / this.boardSize);
    const col2 = pos2 % this.boardSize;

    return Math.max(Math.abs(row2 - row1), Math.abs(col2 - col1));
  }

  removeCharacter(positioned) {
    this.state.positions = this.state.positions.filter(p => p !== positioned);

    if (this.isPlayerCharacter(positioned.character)) {
      this.state.playerTeam.remove(positioned.character);
    } else {
      this.state.enemyTeam.remove(positioned.character);
    }
  }

  checkGameOver() {
    const playerAlive = this.state.positions.some(p =>
      this.isPlayerCharacter(p.character) && p.character.health > 0
    );

    const enemyAlive = this.state.positions.some(p =>
      !this.isPlayerCharacter(p.character) && p.character.health > 0
    );

    if (!playerAlive) {
      this.showError('Вы проиграли!'); // ✅
      this.state.turn = 'gameover';
      return true;
    }

    if (!enemyAlive) {
      this.levelUp();
      return true;
    }

    return false;
  }

  levelUp() {
    // 1. Повышаем уровень выживших
    for (const positioned of this.state.positions) {
      if (this.isPlayerCharacter(positioned.character)) {
        positioned.character.levelUp();
      }
    }

    this.state.level += 1;

    if (this.state.level > 4) {
      this.showMessage('Поздравляем! Вы прошли все уровни!');
      this.state.turn = 'gameover';
      return;
    }

    // 2. Генерируем новых врагов
    const teamSize = this.state.level + 1; // Чем дальше, тем их больше!
    const maxLevel = this.state.level;
    this.state.enemyTeam = generateTeam(this.enemyTypes, maxLevel, teamSize);

    // 3. ЗАНОВО РАССТАВЛЯЕМ ВСЕХ ПО МЕСТАМ!
    // Игрока возвращаем в колонки 0 и 1
    const playerPositions = positionTeam(this.state.playerTeam, [0, 1], this.boardSize);
    // Врагов ставим в колонки 6 и 7
    const enemyPositions = positionTeam(this.state.enemyTeam, [6, 7], this.boardSize);

    // 4. Обновляем массив позиций
    this.state.positions = [...playerPositions, ...enemyPositions];

    // 5. Отрисовываем новую доску
    this.gamePlay.drawUi(this.themes[this.state.level]);
    this.gamePlay.redrawPositions(this.state.positions);

    this.state.turn = 'player';
  }

  getCharacterAtPosition(position) {
    return this.state.positions.find(p => p.position === position);
  }

  isPlayerCharacter(character) {
    return ['bowman', 'swordsman', 'magician'].includes(character.type);
  }

  onNewGameClick() {
    this.startNewGame();
  }

  onSaveGameClick() {
    this.stateService.save(this.state);
    this.showMessage('Игра сохранена!'); // ✅
  }

  onLoadGameClick() {
    this.loadGame();
  }

  loadGame(silent = false) {
    try {
      const loadedState = this.stateService.load();
      if (loadedState) {
        this.state = GameState.from(loadedState);
        this.gamePlay.drawUi(this.themes[this.state.level]);
        this.gamePlay.redrawPositions(this.state.positions);
        if (!silent) this.showMessage('Игра загружена!');
      }
    } catch (error) {
      console.error(error);
    }
  }
}