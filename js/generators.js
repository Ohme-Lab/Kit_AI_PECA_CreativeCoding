/* ═══════════════════════════════════════════════
   Blockly → p5.js code generators
   ═══════════════════════════════════════════════ */

// Shim: Blockly v10 UMD exposes the generator at Blockly.JavaScript
const jsGen = (typeof Blockly !== 'undefined' && Blockly.JavaScript)
  ? Blockly.JavaScript
  : null;

function hexToRgb(hex) {
  // hex is a JS string literal like "'#39ff14'" — strip quotes then parse
  const m = hex.match(/['"]#([0-9a-fA-F]{6})['"]/);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

function colorArg(block, name, fallback = "'#ffffff'") {
  if (!jsGen) return hexToRgb(fallback);
  return hexToRgb(jsGen.valueToCode(block, name, jsGen.ORDER_ATOMIC) || fallback);
}
function numArg(block, name, fallback = '0') {
  if (!jsGen) return fallback;
  return jsGen.valueToCode(block, name, jsGen.ORDER_ATOMIC) || fallback;
}
function stmtArg(block, name) {
  if (!jsGen) return '';
  return jsGen.statementToCode(block, name) || '';
}

// ── Phase 1 generators ───────────────────────────────────────

jsGen['p5_setup'] = function(block) {
  const body = stmtArg(block, 'BODY');
  return `function setup() {\n${body}}\n`;
};

jsGen['p5_create_canvas'] = function(block) {
  const w = numArg(block, 'W', '400');
  const h = numArg(block, 'H', '400');
  return `createCanvas(${w}, ${h});\n`;
};

jsGen['p5_draw'] = function(block) {
  const body = stmtArg(block, 'BODY');
  return `function draw() {\n${body}}\n`;
};

jsGen['p5_background'] = function(block) {
  return `background(${colorArg(block, 'COLOR', "'#1a1a2e'")});\n`;
};

jsGen['p5_fill'] = function(block) {
  return `fill(${colorArg(block, 'COLOR')});\n`;
};

jsGen['p5_stroke'] = function(block) {
  return `stroke(${colorArg(block, 'COLOR')});\n`;
};

jsGen['p5_no_stroke'] = function() { return `noStroke();\n`; };
jsGen['p5_no_fill']   = function() { return `noFill();\n`;   };

jsGen['p5_circle'] = function(block) {
  const x = numArg(block, 'X', '200'), y = numArg(block, 'Y', '200'), s = numArg(block, 'SIZE', '50');
  return `circle(${x}, ${y}, ${s});\n`;
};

jsGen['p5_rect'] = function(block) {
  const x = numArg(block, 'X', '0'), y = numArg(block, 'Y', '0');
  const w = numArg(block, 'W', '50'), h = numArg(block, 'H', '50');
  return `rect(${x}, ${y}, ${w}, ${h});\n`;
};

jsGen['p5_framerate'] = function(block) {
  return `frameRate(${numArg(block, 'RATE', '10')});\n`;
};

jsGen['p5_mousex'] = function() { return ['mouseX', jsGen.ORDER_ATOMIC]; };
jsGen['p5_mousey'] = function() { return ['mouseY', jsGen.ORDER_ATOMIC]; };

jsGen['p5_random'] = function(block) {
  const min = numArg(block, 'MIN', '0'), max = numArg(block, 'MAX', '100');
  return [`random(${min}, ${max})`, jsGen.ORDER_FUNCTION_CALL];
};

// ── Phase 2 generators ───────────────────────────────────────

// Grid blocks use a sentinel comment so generateSketchCode()
// knows to prepend the grid helper library.
jsGen['p5_grid_create'] = function(block) {
  const cols  = numArg(block, 'COLS',  '40');
  const rows  = numArg(block, 'ROWS',  '40');
  const color = colorArg(block, 'COLOR', "'#64ff64'");
  return `// @GRID ${cols} ${rows} ${color}\ncreateGrid(${cols}, ${rows}, ${color});\n`;
};

jsGen['p5_grid_show'] = function() { return `showGrid();\n`; };

jsGen['p5_grid_seed'] = function(block) {
  const pct = numArg(block, 'DENSITY', '30');
  return `seedGrid(${pct});\n`;
};

// ── Phase 2: Rule generators ─────────────────────────────────

jsGen['p5_life_rules'] = function() {
  return `applyLifeRules();\n`;
};

jsGen['p5_neighbors'] = function(block) {
  const x = numArg(block, 'X', '0'), y = numArg(block, 'Y', '0');
  return [`countNeighbors(${x}, ${y})`, jsGen.ORDER_FUNCTION_CALL];
};

jsGen['p5_cell_alive'] = function(block) {
  const x = numArg(block, 'X', '0'), y = numArg(block, 'Y', '0');
  return [`isAlive(${x}, ${y})`, jsGen.ORDER_FUNCTION_CALL];
};

jsGen['p5_set_cell'] = function(block) {
  const x     = numArg(block, 'X', '0');
  const y     = numArg(block, 'Y', '0');
  const state = block.getFieldValue('STATE') || '1';
  return `setCell(${x}, ${y}, ${state});\n`;
};

// Custom rule: emits a standalone function call that applies ONE extra rule
// on top of the built-in apply step. We use a global rules array.
jsGen['p5_custom_rule'] = function(block) {
  const n   = numArg(block, 'N', '2');
  const op  = block.getFieldValue('OP')     || '===';
  const res = block.getFieldValue('RESULT') || 'survive';
  const outcome = res === 'survive' ? '1' : '0';
  return `addCustomRule(function(alive, neighbors) {\n  if (alive && neighbors ${op} ${n}) return ${outcome};\n  return null;\n});\n`;
};

// ── Phase 3 ──────────────────────────────────────────────────
jsGen['p5_ai_magic'] = function() {
  return `// ✨ AI Magic block — variation will be injected here\n`;
};

/* ════════════════════════════════════════════════════════════
   generateSketchCode(workspace)
   The single export that app.js calls.
   Assembles raw generator output + injects grid library if needed.
   ════════════════════════════════════════════════════════════ */
window.generateSketchCode = function(workspace) {
  if (!jsGen) { console.warn('jsGen not ready'); return null; }

  let raw = '';
  try {
    raw = jsGen.workspaceToCode(workspace);
  } catch (e) {
    console.warn('Generator error:', e);
    return null;
  }

  // Detect @GRID sentinel — injected by p5_grid_create generator
  const gridMatch = raw.match(/\/\/ @GRID (\S+) (\S+) (\S+)/);
  let preamble = '';

  if (gridMatch) {
    const cols  = gridMatch[1];
    const rows  = gridMatch[2];
    const color = gridMatch[3];
    preamble = buildGridLibrary(cols, rows, color);
    raw = raw.replace(/\/\/ @GRID.*\n/, '');
  }

  return preamble + raw;
};

/* ─── Grid helper library (injected as preamble) ───────────── */
function buildGridLibrary(cols, rows, color) {
  return `
// ─── Grid library (auto-generated by blocks) ─────────────────
let _G = {
  cols:     ${cols},
  rows:     ${rows},
  color:    ${color},
  grid:     [],
  next:     [],
  cellPx:   0,
  rules:    [],   // custom rule functions added by Custom Rule block
};

function createGrid(cols, rows, color) {
  _G.cols  = cols;
  _G.rows  = rows;
  _G.color = color;
  _G.cellPx = width / cols;
  _G.grid = [];
  _G.next = [];
  _G.rules = [];
  for (let i = 0; i < cols; i++) {
    _G.grid[i] = new Array(rows).fill(0);
    _G.next[i]  = new Array(rows).fill(0);
  }
}

// Randomly seed density% of cells alive
function seedGrid(densityPct) {
  for (let i = 0; i < _G.cols; i++)
    for (let j = 0; j < _G.rows; j++)
      _G.grid[i][j] = random(100) < densityPct ? 1 : 0;
}

// Draw every living cell as a rectangle
function showGrid() {
  noStroke();
  fill(_G.color);
  for (let i = 0; i < _G.cols; i++) {
    for (let j = 0; j < _G.rows; j++) {
      if (_G.grid[i][j] === 1) {
        rect(i * _G.cellPx, j * _G.cellPx, _G.cellPx - 1, _G.cellPx - 1);
      }
    }
  }
}

// Count the 8 neighbours (toroidal / wrapping grid)
function countNeighbors(x, y) {
  let n = 0;
  for (let di = -1; di <= 1; di++)
    for (let dj = -1; dj <= 1; dj++) {
      if (di === 0 && dj === 0) continue;
      n += _G.grid[(x + di + _G.cols) % _G.cols][(y + dj + _G.rows) % _G.rows];
    }
  return n;
}

// Standard Conway rules + any custom rules added by blocks
function applyLifeRules() {
  for (let i = 0; i < _G.cols; i++) {
    for (let j = 0; j < _G.rows; j++) {
      const alive = _G.grid[i][j] === 1;
      const n     = countNeighbors(i, j);

      // Check custom rules first (first one that returns non-null wins)
      let customResult = null;
      for (const rule of _G.rules) {
        const r = rule(alive ? 1 : 0, n);
        if (r !== null) { customResult = r; break; }
      }

      if (customResult !== null) {
        _G.next[i][j] = customResult;
      } else {
        // Conway defaults
        if (alive) {
          _G.next[i][j] = (n === 2 || n === 3) ? 1 : 0;
        } else {
          _G.next[i][j] = (n === 3) ? 1 : 0;
        }
      }
    }
  }
  // Swap buffers
  let tmp = _G.grid; _G.grid = _G.next; _G.next = tmp;
}

// Helpers exposed to other blocks
function isAlive(x, y) { return _G.grid[x] && _G.grid[x][y] === 1; }
function setCell(x, y, state) { if (_G.grid[x]) _G.grid[x][y] = state; }
function addCustomRule(fn) { _G.rules.push(fn); }

// Click canvas to toggle a cell
function mousePressed() {
  const col = floor(mouseX / _G.cellPx);
  const row = floor(mouseY / _G.cellPx);
  if (col >= 0 && col < _G.cols && row >= 0 && row < _G.rows) {
    _G.grid[col][row] = _G.grid[col][row] === 1 ? 0 : 1;
  }
}
// ─────────────────────────────────────────────────────────────
`;
}
