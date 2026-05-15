import { calcTileType, calcHealthLevel, getCharacterInfo, canMove, canAttack } from '../js/utils';

// ─── calcTileType ────────────────────────────────────────────────────────────

describe('calcTileType', () => {
    describe('углы', () => {
        test('верхний левый угол (индекс 0)', () => {
            expect(calcTileType(0, 8)).toBe('top-left');
        });

        test('верхний правый угол (индекс 7)', () => {
            expect(calcTileType(7, 8)).toBe('top-right');
        });

        test('нижний левый угол (индекс 56)', () => {
            expect(calcTileType(56, 8)).toBe('bottom-left');
        });

        test('нижний правый угол (индекс 63)', () => {
            expect(calcTileType(63, 8)).toBe('bottom-right');
        });
    });

    describe('стороны', () => {
        test('верхняя сторона', () => {
            expect(calcTileType(3, 8)).toBe('top');
        });

        test('нижняя сторона', () => {
            expect(calcTileType(59, 8)).toBe('bottom');
        });

        test('левая сторона', () => {
            expect(calcTileType(16, 8)).toBe('left');
        });

        test('правая сторона', () => {
            expect(calcTileType(23, 8)).toBe('right');
        });
    });

    describe('центр', () => {
        test('центральная ячейка', () => {
            expect(calcTileType(27, 8)).toBe('center');
        });

        test('другая центральная ячейка', () => {
            expect(calcTileType(36, 8)).toBe('center');
        });
    });

    describe('другой размер поля', () => {
        test('верхний левый угол на поле 4x4', () => {
            expect(calcTileType(0, 4)).toBe('top-left');
        });

        test('нижний правый угол на поле 4x4', () => {
            expect(calcTileType(15, 4)).toBe('bottom-right');
        });

        test('центр на поле 4x4', () => {
            expect(calcTileType(5, 4)).toBe('center');
        });
    });
});

// ─── calcHealthLevel ─────────────────────────────────────────────────────────

describe('calcHealthLevel', () => {
    test('критический уровень (меньше 15)', () => {
        expect(calcHealthLevel(1)).toBe('critical');
        expect(calcHealthLevel(14)).toBe('critical');
    });

    test('граница критического (ровно 15 — уже normal)', () => {
        expect(calcHealthLevel(15)).toBe('normal');
    });

    test('нормальный уровень (15–49)', () => {
        expect(calcHealthLevel(30)).toBe('normal');
        expect(calcHealthLevel(49)).toBe('normal');
    });

    test('граница нормального (ровно 50 — уже high)', () => {
        expect(calcHealthLevel(50)).toBe('high');
    });

    test('высокий уровень (50 и выше)', () => {
        expect(calcHealthLevel(75)).toBe('high');
        expect(calcHealthLevel(100)).toBe('high');
    });
});

// ─── getCharacterInfo ─────────────────────────────────────────────────────────

describe('getCharacterInfo', () => {
    test('формат строки с целыми числами', () => {
        const character = { level: 1, attack: 25, defence: 25, health: 100 };
        expect(getCharacterInfo(character)).toBe('🎖1 ⚔25 🛡25 ❤100');
    });

    test('дробные значения округляются', () => {
        const character = { level: 2, attack: 23.6, defence: 18.4, health: 75.9 };
        expect(getCharacterInfo(character)).toBe('🎖2 ⚔24 🛡18 ❤76');
    });

    test('персонаж другого уровня', () => {
        const character = { level: 4, attack: 10, defence: 40, health: 50 };
        expect(getCharacterInfo(character)).toBe('🎖4 ⚔10 🛡40 ❤50');
    });
});

// ─── canMove ─────────────────────────────────────────────────────────────────

describe('canMove', () => {
    test('стоять на месте нельзя', () => {
        expect(canMove(0, 0, 4)).toBe(false);
    });

    test('ход по горизонтали в пределах дистанции', () => {
        expect(canMove(0, 3, 4)).toBe(true);   // 3 клетки вправо
    });

    test('ход по вертикали в пределах дистанции', () => {
        expect(canMove(0, 24, 4)).toBe(true);  // 3 клетки вниз
    });

    test('ход по диагонали в пределах дистанции', () => {
        expect(canMove(0, 27, 4)).toBe(true);  // 3 клетки по диагонали
    });

    test('слишком далеко по горизонтали', () => {
        expect(canMove(0, 5, 4)).toBe(false);  // 5 клеток, дистанция 4
    });

    test('слишком далеко по вертикали', () => {
        expect(canMove(0, 40, 4)).toBe(false); // 5 строк вниз
    });

    test('ход буквой Г недопустим', () => {
        expect(canMove(0, 17, 4)).toBe(false); // 2 вниз + 1 вправо
        expect(canMove(0, 10, 4)).toBe(false); // 1 вниз + 2 вправо
    });

    test('мечник (дистанция 4) — ровно на границе', () => {
        expect(canMove(0, 4, 4, 8)).toBe(true);   // 4 клетки вправо — можно
        expect(canMove(0, 5, 4, 8)).toBe(false);  // 5 клеток вправо — нельзя
    });

    test('лучник (дистанция 2)', () => {
        expect(canMove(18, 20, 2)).toBe(true);   // 2 вправо
        expect(canMove(18, 21, 2)).toBe(false);  // 3 вправо
    });

    test('маг (дистанция 1)', () => {
        expect(canMove(18, 19, 1)).toBe(true);   // 1 вправо
        expect(canMove(18, 20, 1)).toBe(false);  // 2 вправо
    });
});

// ─── canAttack ───────────────────────────────────────────────────────────────

describe('canAttack', () => {
    test('атака на свою клетку невозможна', () => {
        expect(canAttack(0, 0, 2)).toBe(false);
    });

    test('мечник (дистанция 1) — соседняя клетка', () => {
        expect(canAttack(18, 19, 1)).toBe(true);   // вправо
        expect(canAttack(18, 17, 1)).toBe(true);   // влево
        expect(canAttack(18, 10, 1)).toBe(true);   // вверх
        expect(canAttack(18, 26, 1)).toBe(true);   // вниз
        expect(canAttack(18, 27, 1)).toBe(true);   // диагональ
    });

    test('мечник (дистанция 1) — слишком далеко', () => {
        expect(canAttack(18, 20, 1)).toBe(false);  // 2 клетки вправо
    });

    test('лучник (дистанция 2) — достаёт на 2 клетки', () => {
        expect(canAttack(18, 20, 2)).toBe(true);   // 2 вправо
        expect(canAttack(18, 2, 2)).toBe(true);    // 2 вверх
        expect(canAttack(18, 0, 2)).toBe(true);    // диагональ 2x2
    });

    test('лучник (дистанция 2) — не достаёт на 3 клетки', () => {
        expect(canAttack(18, 21, 2)).toBe(false);
    });

    test('маг (дистанция 4) — достаёт на 4 клетки по квадрату', () => {
        expect(canAttack(27, 31, 4)).toBe(true);   // 4 вправо
        expect(canAttack(27, 3, 4)).toBe(true);    // 3 вверх
        expect(canAttack(27, 59, 4)).toBe(true);   // 4 вниз
    });

    test('маг (дистанция 4) — не достаёт за пределы квадрата', () => {
        expect(canAttack(0, 40, 4)).toBe(false);   // 5 строк вниз
    });

    test('атака бьёт по квадрату, не только по линиям', () => {
        // позиция 18 (строка 2, col 2), цель 5 (строка 0, col 5) — rowDiff=2, colDiff=3
        expect(canAttack(18, 5, 4)).toBe(true);    // оба diff <= 4
        expect(canAttack(18, 5, 2)).toBe(false);   // colDiff=3 > 2
    });
});