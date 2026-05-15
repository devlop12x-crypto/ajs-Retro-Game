export default class GameStateService {
  constructor(storage) {
    this.storage = storage;
  }

  save(state) {
    this.storage.setItem('gameState', JSON.stringify(state));
  }

  load() {
    const data = this.storage.getItem('gameState');
    if (!data) throw new Error('No saved game found');

    try {
      return JSON.parse(data);
    } catch {
      throw new Error('Invalid save data');
    }
  }
}