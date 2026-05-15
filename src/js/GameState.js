import Team from './Team';
import PositionedCharacter from './PositionedCharacter';
import Bowman from './characters/Bowman';
import Swordsman from './characters/Swordsman';
import Magician from './characters/Magician';
import Vampire from './characters/Vampire';
import Undead from './characters/Undead';
import Daemon from './characters/Daemon';

const CLASS_MAP = {
  swordsman: Swordsman,
  bowman: Bowman,
  magician: Magician,
  vampire: Vampire,
  undead: Undead,
  daemon: Daemon,
};

const PLAYER_TYPES = new Set(['swordsman', 'bowman', 'magician']);
const ENEMY_TYPES = new Set(['vampire', 'undead', 'daemon']);

export default class GameState {
  constructor() {
    this.level = 1;
    this.positions = [];
    this.turn = 'player';
    this.playerTeam = null;
    this.enemyTeam = null;
    this.selectedCharacter = null;
  }

  reset() {
    Object.assign(this, new GameState());
  }

  static from(object) {
    if (typeof object !== 'object' || object === null) {
      return null;
    }

    const state = new GameState();
    state.level = object.level;
    state.turn = object.turn;

    state.positions = object.positions.map((pos) => {
      const charInfo = pos.character;
      const CharClass = CLASS_MAP[charInfo.type];

      if (!CharClass) {
        throw new Error(`Unknown character type: ${charInfo.type}`);
      }

      const character = new CharClass(charInfo.level);
      character.attack = charInfo.attack;
      character.defence = charInfo.defence;
      character.health = charInfo.health;

      return new PositionedCharacter(character, pos.position);
    });

    state.playerTeam = new Team(
      state.positions
        .filter((p) => PLAYER_TYPES.has(p.character.type))
        .map((p) => p.character),
    );

    state.enemyTeam = new Team(
      state.positions
        .filter((p) => ENEMY_TYPES.has(p.character.type))
        .map((p) => p.character),
    );

    return state;
  }
}