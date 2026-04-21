/* ═══════════════════════════════════════════════════════════════
   LEVELS — the content file.
   Add new levels here. The engine reads this array in order.

   Level types:
     'blocks'   — student drags blocks to satisfy check()
     'ai-trap'  — narrative + big [ASK AI] button; AI injects aiCode
     'debug'    — student edits code to fix bugs; each bug has a check()

   ═══════════════════════════════════════════════════════════════ */

const LEVELS = [

  /* ── Level 1 ─────────────────────────────────────────────── */
  {
    id: 1,
    type: 'blocks',
    title: '01 / Bonjour, un canvas s\'il vous plait',

    story: [
      '> Tout commence par un espace de dessin.',
      '> Avant de créer des formes, il faut créer le monde où elles apparaîtront.',
    ],

    task: 'Créer un canevas.',

    // which toolbox categories to expose (see engine.js TOOLBOXES)
    toolbox: 'level_1',

    check: (s) => s.has('p5_setup') && s.has('p5_circle'),
    win: '> nice. one circle. that\'s a whole program.',
  },

  /* ── Level 2 ─────────────────────────────────────────────── */
  {
    id: 2,
    type: 'blocks',
    title: '02 / follow the mouse',

    story: [
      '> now make the circle follow the mouse.',
      '> ',
      '> ⚠ mouseX only works inside [Every frame].',
      '> setup() runs once — draw() runs forever.',
      '> put the circle inside [Every frame], not setup.',
    ],

    task: 'drag [Every frame], put circle inside it, use mouseX / mouseY for x and y',

    toolbox: 'basic',

    // mouseX and mouseY must appear inside the draw() body
    check: (s, code) => {
      const drawBody = code.match(/function draw\s*\(\s*\)\s*\{([\s\S]*)\}/);
      return drawBody && drawBody[1].includes('mouseX') && drawBody[1].includes('mouseY');
    },

    win: '> it follows. draw() runs every frame — that\'s why it works.',
  },

  /* ── Level 3 ─────────────────────────────────────────────── */
  {
    id: 3,
    type: 'ai-trap',
    title: '03 / ask the AI',

    story: [
      '> okay. next challenge: Conway\'s Game of Life.',
      '> cells live or die based on their neighbors.',
      '> 1600 cells. wrapping grid. sounds hard.',
      '> ...',
      '> or you could just ask AI.',
    ],

    task: 'click [ASK AI] to generate the code automatically',

    // Fake "AI typing" messages shown while code is injected
    aiTyping: [
      'analyzing request...',
      'generating optimal solution...',
      'adding best practices...',
      'done! here\'s your Game of Life ✓',
    ],

    // Pre-written code with 3 intentional bugs (see debug level below)
    // Students won't edit here — this flows straight into level 4
    aiCode: getBuggyGameOfLife(),

    check: (s) => s.aiUsed === true,

    win: '> wow, AI wrote 80 lines instantly. surely it works.',
  },

  /* ── Level 4 ─────────────────────────────────────────────── */
  {
    id: 4,
    type: 'debug',
    title: '04 / fix the AI',

    story: [
      '> it does not work.',
      '> the AI introduced 3 bugs.',
      '> find and fix them all.',
    ],

    task: 'fix 3 bugs — the output pane will show when it\'s working',

    // Each bug: a hint shown to the student + a check against the code string
    bugs: [
      {
        id: 'typo',
        hint: 'bug 1 — there\'s a typo in a variable name (line ~14)',
        // Bug: `widht` instead of `width`
        check: (code) => !code.includes('widht'),
        fixedMsg: '✓ typo fixed',
      },
      {
        id: 'self',
        hint: 'bug 2 — the neighbor count includes the cell itself',
        // Bug: missing `if (di===0 && dj===0) continue;`
        check: (code) => code.includes('if (di===0 && dj===0) continue'),
        fixedMsg: '✓ neighbor count fixed',
      },
      {
        id: 'swap',
        hint: 'bug 3 — the grid never actually updates (look for a commented line)',
        // Bug: swap line is commented out
        check: (code) => !code.match(/\/\/.*\[grid.*nextGrid\]|\/\/.*nextGrid.*grid/),
        fixedMsg: '✓ grid swap fixed',
      },
    ],

    check: (s, code) =>
      !code.includes('widht') &&
      code.includes('if (di===0 && dj===0) continue') &&
      !code.match(/\/\/.*\[grid.*nextGrid\]|\/\/.*nextGrid.*grid/),

    win: '> all bugs fixed. it works.\n> the AI wrote 80 lines in 2 seconds.\n> you fixed them in 10 minutes.\n> that\'s the deal.',
  },

  /* ── Level 5 ─────────────────────────────────────────────── */
  {
    id: 5,
    type: 'end',
    title: '05 / lesson learned',

    story: [
      '> AI is fast.',
      '> AI is confident.',
      '> AI is often wrong.',
      '> ',
      '> knowing how to CODE means knowing how to CHECK.',
      '> that\'s what you just did.',
      '> ',
      '> fin.',
    ],

    task: '',
    check: () => true,
    win: '',
  },

];

/* ═══════════════════════════════════════════════════════════════
   Buggy Game of Life — pre-written AI output for level 3→4.
   Contains exactly 3 bugs, clearly marked with // BUG comments
   (visible in source, not shown to student in hints).
   ═══════════════════════════════════════════════════════════════ */
function getBuggyGameOfLife() {
  return `// ── Conway's Game of Life ──────────────────────────
// generated by AI  •  do not modify  •  production ready ✓

let grid, nextGrid, cols, rows;
const CELL = 12;

function setup() {
  createCanvas(400, 400);
  cols = floor(width / CELL);
  rows = floor(height / CELL);

  // BUG 1: typo — 'widht' instead of 'width' causes ReferenceError
  let cellSize = widht / cols;

  grid     = makeGrid();
  nextGrid = makeGrid();

  // seed randomly
  for (let i = 0; i < cols; i++)
    for (let j = 0; j < rows; j++)
      grid[i][j] = random() < 0.3 ? 1 : 0;

  frameRate(12);
}

function draw() {
  background(8);

  // draw living cells
  noStroke();
  fill(57, 255, 20);
  for (let i = 0; i < cols; i++)
    for (let j = 0; j < rows; j++)
      if (grid[i][j])
        rect(i * CELL + 1, j * CELL + 1, CELL - 2, CELL - 2);

  // compute next generation
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const n = countNeighbors(i, j);
      if (grid[i][j]) {
        nextGrid[i][j] = (n === 2 || n === 3) ? 1 : 0;
      } else {
        nextGrid[i][j] = (n === 3) ? 1 : 0;
      }
    }
  }

  // BUG 3: swap commented out — grid never advances
  // [grid, nextGrid] = [nextGrid, grid];
}

function countNeighbors(x, y) {
  let sum = 0;
  for (let di = -1; di <= 1; di++) {
    for (let dj = -1; dj <= 1; dj++) {
      // BUG 2: missing skip for (0,0) — cell counts itself as a neighbor
      // if (di===0 && dj===0) continue;
      sum += grid[(x + di + cols) % cols][(y + dj + rows) % rows];
    }
  }
  return sum;
}

function makeGrid() {
  return Array.from({ length: cols }, () => new Array(rows).fill(0));
}

function mousePressed() {
  const col = floor(mouseX / CELL);
  const row = floor(mouseY / CELL);
  if (col >= 0 && col < cols && row >= 0 && row < rows)
    grid[col][row] = grid[col][row] ? 0 : 1;
}`;
}
