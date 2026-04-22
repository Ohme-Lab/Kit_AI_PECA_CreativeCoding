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

jsGen['p5_mouse_if'] = function(block) {
  const doCode   = stmtArg(block, 'DO');
  const elseCode = stmtArg(block, 'ELSE');
  let out = `if (mouseIsPressed) {\n${doCode}}`;
  if (elseCode) out += ` else {\n${elseCode}}`;
  return out + '\n';
};

/* ════════════════════════════════════════════════════════════
   generateSketchCode(workspace)
   The single export that app.js calls.
   ════════════════════════════════════════════════════════════ */
window.generateSketchCode = function(workspace) {
  if (!jsGen) { console.warn('jsGen not ready'); return null; }
  try {
    return jsGen.workspaceToCode(workspace);
  } catch (e) {
    console.warn('Generator error:', e);
    return null;
  }
};
