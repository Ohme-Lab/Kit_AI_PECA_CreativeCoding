/* ═══════════════════════════════════════════════════════════════
   LEVELS — the content file.
   Add new levels here. The engine reads this array in order.

   Each level has: id, title, win, steps[]
   Each step has:  type, story[], task, check(), and type-specific fields:
     type 'blocks'  → toolbox
     type 'ai-trap' → aiTyping[], aiCode
     type 'debug'   → aiCode, bugs[]
     type 'end'     → (no extras)

   ═══════════════════════════════════════════════════════════════ */

const LEVELS = [

  /* ── Level 1 ─────────────────────────────────────────────── */
  {
    id: 1,
    title: '01 / Bonjour, un canvas s\'il vous plait',
    steps: [
      {
        //step 1: create canvas (setup() and draw() functions already on place)
        type: 'blocks',
        toolbox: 'level_1',
        story: [
          '> Tout commence par un espace de dessin.',
          '> Avant de créer des formes, il faut créer le monde où elles apparaîtront.',
        ],
        task: 'Créer un canvas.',

        check: (s, code) =>
          /function setup\s*\(\s*\)\s*\{[\s\S]*\}/.test(code) &&
          /function draw\s*\(\s*\)\s*\{[\s\S]*\}/.test(code),

        win: '> Parfait. Ton monde existe maintenant.',
        initialBlocks: {
          blocks: {
            languageVersion: 0,
            blocks: [
              {type: 'p5_setup', x: 20, y: 20,
                next: {block : {type: 'p5_draw', x: 20, y: 100,}}
              },
            ],
          },
        },
      },
      {
        //step 2: add a circle in draw()
        type: 'blocks',
        toolbox: 'level_1',
        story: [
          '> Une seule forme peut déjà devenir un programme. On commence par afficher un rond simple.',
        ],
        task: 'Faire apparaître un rond au centre du canevas.',

        check: (s, code) => {                        
            const draw = code.match(/function draw\s*\(\s*\)\s*\{([\s\S]*?)\}/);                                                          
            return draw && draw[1].includes('circle(');                                                                                                                                                                                     
          },   
        win: '> Bien. Une première forme apparaît.',
      },
     {
        //step 3: add background
        type: 'blocks',
        toolbox: 'level_1',
        story: [
          '> Préparons le monde pour nos formes. Un fond sombre fera mieux ressortir les couleurs vives de nos cercles.',
          '> Place le block background dans [setup] pour qu\'il s\'applique une fois au début.',
        ],
        task: 'Utiliser le bloc [Background].',
        

        check: (s, code) => /background\(/.test(code), 
        win: '> Parfait. Plus qu\'à changer la couleur.',
      },
     {
        //step 4: add background color
        type: 'blocks',
        toolbox: 'level_1',
        story: [
          '> Changeons la couleur du fond, le noir est un peu triste.',
        ],
        task: 'Changer la couleur du background (🎨).',

        check: (s, code) => /background\(/.test(code) && !code.includes('10, 10, 10'),
        win: '> Parfait. Le canevas est maintenant bien visible.',
      },
      {
        //step 5: change fill color
        type: 'blocks',
        toolbox: 'level_1',
        story: [
          '> Une même forme peut avoir plusieurs apparences. Une petite modification peut changer toute l’ambiance.',
          '> Essayons une autre couleur pour le cercle',
        ],
        task: 'Changer la couleur du cercle',

        check: (s, code) =>                                                                                                                                           
          /fill\(/.test(code) && !code.includes('57, 255, 20'),
        win: '> Oui. Même forme, nouvelle couleur.',
      },
      {
        //step 6: fill color via code instead of blocks
        type: 'code',
        toolbox: 'level_1',
        story: [
            '> Les blocs et le code racontent la même chose de deux façons différentes. Cette fois, la modification se fait dans le code.',
            '> Changeons la couleur du cercle en modifiant le code de draw(), comment avoir du rouge ?',
        ],
        task: 'Changer la couleur du cercle',

        check: (s, code) => /fill\(/.test(code) && code.includes('255, 0, 0'),
        win: '> Très bien. Tu changes maintenant directement le code.',
      },
      {
        //step 7: ask ai
        type: 'ai-trap',
        story: [
            '> Tu peux aussi demander à l’IA de modifier un programme très simple. Ici, on lui demande un petit changement facile à vérifier.',
        ],
        task: 'Demander à l\'IA de changer la couleur du cercle en bleu.',

        aiTyping: [
          'analyzing request...',
          'generating optimal solution...',
          'adding best practices...',
          'blip bloup ! J\'ai changé le code pour que le cercle soit bleu. C\'est fait !',
        ],
        aiCode: (code) => code.replace(/fill\([^)]*\)/, 'fill(0, 0, 255)'),

        check: (s) => s.aiUsed === true,
        win: '> Nickel. L\'IA a fait le changement pour toi, et c\'est exactement ce que tu voulais.',

      },
      {
        //step 8: ask ai with a buggy request
        type: 'ai-trap',
        story: [
          '> okay. On va essayer autre chose, demande à la machine de changer le fond en blanc !',
        ],
        task: 'click [ASK AI] to generate the code automatically',
        aiTyping: [
          'Réflexion hyper intense en cours...',
          'Génération des meilleures lignes de code pour ce changement...',
          'Optimisation du code pour une performance maximale...',
          'C\'est fait ! Le fond est maintenant blanc, admire le résultat !',
        ],
        aiCode: (code) => code.replace(/background\([^)]*\)/, 'background(255, 255, 255'),
        
        check: (s) => s.aiUsed === true,
        win: "> Ah nan ! On dirait qu'il y a un bug. J'ai l'impression qu'il manque une parenthèse. Tu peux vérifier ça ?",
      },
      {
        //step 9: debug ai code
        type: 'debug',
        story: [
          "> Bon, le changement est là, mais il y a un bug dans le code que l\'IA a généré.",
          "> Ça devrait aller vite, il suffit de trouver la parenthèse manquante. C\'est un bug facile à repérer",
        ],
        task: 'Trouver et corriger le bug dans le code généré par l\'IA.',
        bugs: [
          {
            id: 'parenthese',
            hint: 'bug 1 — il manque une parenthèse dans background(255, 255, 255',
            check: (code) => !code.includes('background(255, 255, 255)'), // check du bug
          },
        ],
        check: (code) => !code.includes('background(255, 255, 255)'), // check de la step

        win: '> Ok on a quelque chose qui marche ! On a compris les bases, passons au niveau suivant.',
      },
    ],
  },

  /* ── Level 2 ─────────────────────────────────────────────── */
  {
    id: 2,
    title: '02 / follow the mouse',
    win: '> it follows. draw() runs every frame — that\'s why it works.',
    steps: [
      {
        type: 'blocks',
        toolbox: 'basic',
        story: [
          '> first, add the [Every frame] block.',
        ],
        task: 'drag [Every frame] into the workspace',
        check: (s) => s.has('p5_draw'),
        win: '> good. now use it.',
      },
      {
        type: 'blocks',
        toolbox: 'basic',
        story: [
          '> now put the circle inside [Every frame].',
          '> use mouseX / mouseY for x and y.',
          '> ⚠ mouseX only works inside [Every frame], not setup.',
        ],
        task: 'circle inside draw() with mouseX and mouseY',
        check: (s, code) => {
          const body = code.match(/function draw\s*\(\s*\)\s*\{([\s\S]*)\}/);
          return body && body[1].includes('mouseX') && body[1].includes('mouseY');
        },
        win: '> mouse controls the circle. setup() runs once — draw() runs forever.',
      },
    ],
  },

  /* ── Level 3 ─────────────────────────────────────────────── */
  {
    id: 3,
    title: '03 / ask the AI, then fix it',
    win: '> all bugs fixed. it works.\n> the AI wrote 80 lines in 2 seconds.\n> you fixed them in 10 minutes.\n> that\'s the deal.',
    steps: [
      {
        type: 'ai-trap',
        story: [
          '> okay. next challenge: Conway\'s Game of Life.',
          '> cells live or die based on their neighbors.',
          '> 1600 cells. wrapping grid. sounds hard.',
          '> ...',
          '> or you could just ask AI.',
        ],
        task: 'click [ASK AI] to generate the code automatically',
        aiTyping: [
          'analyzing request...',
          'generating optimal solution...',
          'adding best practices...',
          'done! here\'s your Game of Life ✓',
        ],
        aiCode: getBuggyGameOfLife(),
        check: (s) => s.aiUsed === true,
        win: '> wow, AI wrote 80 lines instantly. surely it works.',
      },
      {
        type: 'debug',
        aiCode: getBuggyGameOfLife(),
        story: [
          '> it does not work.',
          '> the AI introduced 3 bugs.',
          '> find and fix them all.',
        ],
        task: 'fix 3 bugs — the output pane will show when it\'s working',
        bugs: [
          {
            id: 'typo',
            hint: 'bug 1 — there\'s a typo in a variable name (line ~14)',
            check: (code) => !code.includes('widht'),
          },
          {
            id: 'self',
            hint: 'bug 2 — the neighbor count includes the cell itself',
            check: (code) => code.includes('if (di===0 && dj===0) continue'),
          },
          {
            id: 'swap',
            hint: 'bug 3 — the grid never actually updates (look for a commented line)',
            check: (code) => !code.match(/\/\/.*\[grid.*nextGrid\]|\/\/.*nextGrid.*grid/),
          },
        ],
        check: (s, code) =>
          !code.includes('widht') &&
          code.includes('if (di===0 && dj===0) continue') &&
          !code.match(/\/\/.*\[grid.*nextGrid\]|\/\/.*nextGrid.*grid/),
        win: '> 3/3. it runs. you understood code that AI got wrong.',
      },
    ],
  },

  /* ── Level 4 ─────────────────────────────────────────────── */
  {
    id: 4,
    title: '04 / lesson learned',
    win: '',
    steps: [
      {
        type: 'end',
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
      },
    ],
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
