import Team from '../js/Team';

const makeChar = (type, health) => ({ type, health });

describe('Team', () => {
    describe('constructor', () => {
        test('создаётся с пустым массивом по умолчанию', () => {
            const team = new Team();
            expect(team.characters).toEqual([]);
        });

        test('принимает массив персонажей', () => {
            const chars = [makeChar('bowman', 100), makeChar('swordsman', 80)];
            const team = new Team(chars);
            expect(team.characters).toHaveLength(2);
        });
    });

    describe('add', () => {
        test('добавляет персонажа в команду', () => {
            const team = new Team();
            const char = makeChar('bowman', 100);
            team.add(char);
            expect(team.characters).toContain(char);
        });

        test('добавляет нескольких персонажей', () => {
            const team = new Team();
            team.add(makeChar('bowman', 100));
            team.add(makeChar('swordsman', 80));
            expect(team.characters).toHaveLength(2);
        });
    });

    describe('remove', () => {
        test('удаляет персонажа из команды', () => {
            const char = makeChar('bowman', 100);
            const team = new Team([char]);
            team.remove(char);
            expect(team.characters).not.toContain(char);
        });

        test('удаляет только нужного персонажа', () => {
            const char1 = makeChar('bowman', 100);
            const char2 = makeChar('swordsman', 80);
            const team = new Team([char1, char2]);
            team.remove(char1);
            expect(team.characters).toContain(char2);
            expect(team.characters).toHaveLength(1);
        });

        test('не падает если персонажа нет в команде', () => {
            const team = new Team([makeChar('bowman', 100)]);
            const outsider = makeChar('magician', 50);
            expect(() => team.remove(outsider)).not.toThrow();
            expect(team.characters).toHaveLength(1);
        });

        test('не удаляет похожий объект — только тот же по ссылке', () => {
            const char = makeChar('bowman', 100);
            const lookalike = makeChar('bowman', 100);
            const team = new Team([char]);
            team.remove(lookalike);
            expect(team.characters).toHaveLength(1); // не удалился
        });
    });

    describe('getAlive', () => {
        test('возвращает только живых (health > 0)', () => {
            const alive = makeChar('bowman', 50);
            const dead = makeChar('swordsman', 0);
            const team = new Team([alive, dead]);
            expect(team.getAlive()).toEqual([alive]);
        });

        test('возвращает пустой массив если все мертвы', () => {
            const team = new Team([makeChar('bowman', 0), makeChar('swordsman', 0)]);
            expect(team.getAlive()).toHaveLength(0);
        });

        test('возвращает всех если все живы', () => {
            const team = new Team([makeChar('bowman', 100), makeChar('swordsman', 1)]);
            expect(team.getAlive()).toHaveLength(2);
        });

        test('персонаж с health = 0 считается мёртвым', () => {
            const team = new Team([makeChar('bowman', 0)]);
            expect(team.getAlive()).toHaveLength(0);
        });
    });

    describe('hasAlive', () => {
        test('возвращает true если есть живые', () => {
            const team = new Team([makeChar('bowman', 100)]);
            expect(team.hasAlive()).toBe(true);
        });

        test('возвращает false если все мертвы', () => {
            const team = new Team([makeChar('bowman', 0)]);
            expect(team.hasAlive()).toBe(false);
        });

        test('возвращает false для пустой команды', () => {
            const team = new Team();
            expect(team.hasAlive()).toBe(false);
        });

        test('один живой среди мёртвых — true', () => {
            const team = new Team([makeChar('bowman', 0), makeChar('swordsman', 1)]);
            expect(team.hasAlive()).toBe(true);
        });
    });
});