/* ═══════════════════════════════════════════════
   Custom Blockly block definitions
   Organised around the Game of Life narrative:
   Phase 1 → drawing primitives (always visible)
   Phase 2 → grid + life rules (unlock after setup+draw placed)
   Phase 3 → AI magic (unlock after Game of Life milestone)
   ═══════════════════════════════════════════════ */

// ── PHASE 1 ───────────────────────────────────────────────────

// ── Animation ────────────────────────────────────────────────
Blockly.Blocks['p5_setup'] = {
  init() {
    this.appendDummyInput()
        .appendField('⚙️  Départ du sketch');
    this.appendStatementInput('BODY')
        .setCheck(null);
    this.setColour('#4C97FF');
    this.setTooltip('Ce code s\'exécute une fois au début. C\'est l\'endroit idéal pour créer votre canevas et faire les préparatifs initiaux.');
    this.setPreviousStatement(false);   // top-level blocko
    this.setNextStatement(true, null);
  }
};

Blockly.Blocks['p5_draw'] = {
  init() {
    this.appendDummyInput()
        .appendField('🔁  Every frame');
    this.appendStatementInput('BODY')
        .setCheck(null);
    this.setColour('#4C97FF');
    this.setTooltip('Runs ~30 times per second — like the pages of a flipbook. Draw and update everything here!');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};

// ── Drawing ──────────────────────────────────────────────────
Blockly.Blocks['p5_background'] = {
  init() {
    this.appendValueInput('COLOR')
        .setCheck('Colour')
        .appendField('🎨  Clear screen to');
    this.setInputsInline(true);
    this.setColour('#FF8C42');
    this.setTooltip('Wipes the canvas with this color. Put it at the top of Every Frame so each frame starts fresh!');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};

Blockly.Blocks['p5_fill'] = {
  init() {
    this.appendValueInput('COLOR')
        .setCheck('Colour')
        .appendField('🖌  Fill shapes with');
    this.setInputsInline(true);
    this.setColour('#FF8C42');
    this.setTooltip('Sets the fill color for all shapes drawn after this block.');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};

Blockly.Blocks['p5_stroke'] = {
  init() {
    this.appendValueInput('COLOR')
        .setCheck('Colour')
        .appendField('✏️  Outline shapes with');
    this.setInputsInline(true);
    this.setColour('#FF8C42');
    this.setTooltip('Sets the outline (stroke) color for shapes.');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};

Blockly.Blocks['p5_no_stroke'] = {
  init() {
    this.appendDummyInput().appendField('🚫  Remove shape outlines');
    this.setColour('#FF8C42');
    this.setTooltip('Draws shapes without an outline — looks cleaner for grids!');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};

Blockly.Blocks['p5_no_fill'] = {
  init() {
    this.appendDummyInput().appendField('🚫  Make shapes transparent');
    this.setColour('#FF8C42');
    this.setTooltip('Draws shapes with no fill — just the outline remains.');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};

Blockly.Blocks['p5_circle'] = {
  init() {
    this.appendDummyInput().appendField('⭕  Draw circle');
    this.appendValueInput('X').setCheck('Number').appendField('x');
    this.appendValueInput('Y').setCheck('Number').appendField('y');
    this.appendValueInput('SIZE').setCheck('Number').appendField('size');
    this.setInputsInline(true);
    this.setColour('#FF6B6B');
    this.setTooltip('Draw a circle at position (x, y) with the given diameter.');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};

Blockly.Blocks['p5_rect'] = {
  init() {
    this.appendDummyInput().appendField('▭  Draw rectangle');
    this.appendValueInput('X').setCheck('Number').appendField('x');
    this.appendValueInput('Y').setCheck('Number').appendField('y');
    this.appendValueInput('W').setCheck('Number').appendField('width');
    this.appendValueInput('H').setCheck('Number').appendField('height');
    this.setInputsInline(true);
    this.setColour('#FF6B6B');
    this.setTooltip('Draw a rectangle at (x, y) with the given width and height.');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};

Blockly.Blocks['p5_framerate'] = {
  init() {
    this.appendValueInput('RATE')
        .setCheck('Number')
        .appendField('⏱  Set speed to');
    this.appendDummyInput().appendField('frames/sec');
    this.setInputsInline(true);
    this.setColour('#4C97FF');
    this.setTooltip('Controls how fast the animation runs. Try 10 for Game of Life — slow enough to watch!');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};

Blockly.Blocks['p5_mousex'] = {
  init() {
    this.appendDummyInput().appendField('mouseX');
    this.setColour('#9966FF');
    this.setOutput(true, 'Number');
    this.setTooltip('The current X position of the mouse cursor.');
  }
};

Blockly.Blocks['p5_mousey'] = {
  init() {
    this.appendDummyInput().appendField('mouseY');
    this.setColour('#9966FF');
    this.setOutput(true, 'Number');
    this.setTooltip('The current Y position of the mouse cursor.');
  }
};

Blockly.Blocks['p5_random'] = {
  init() {
    this.appendValueInput('MIN').setCheck('Number').appendField('🎲 random number between');
    this.appendValueInput('MAX').setCheck('Number').appendField('and');
    this.setInputsInline(true);
    this.setColour('#9966FF');
    this.setOutput(true, 'Number');
    this.setTooltip('Returns a random number between min and max. Different every time it runs!');
  }
};

// ── PHASE 2 ───────────────────────────────────────────────────

// ── Grid ─────────────────────────────────────────────────────
Blockly.Blocks['p5_grid_create'] = {
  init() {
    this.appendDummyInput()
        .appendField('🔲  Create grid');
    this.appendValueInput('COLS')
        .setCheck('Number')
        .appendField('columns');
    this.appendValueInput('ROWS')
        .setCheck('Number')
        .appendField('rows');
    this.appendValueInput('COLOR')
        .setCheck('Colour')
        .appendField('cell color');
    this.setColour('#00C853');
    this.setTooltip(
      'Sets up a grid of cells — the "world" where Game of Life happens. ' +
      '40×40 is a good start. Each cell can be alive (1) or dead (0). ' +
      'The grid wraps around at the edges!'
    );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};

Blockly.Blocks['p5_grid_show'] = {
  init() {
    this.appendDummyInput()
        .appendField('🖼  Show living cells');
    this.setColour('#00C853');
    this.setTooltip(
      'Draws every cell that is currently alive. ' +
      'Place this inside Every Frame so the grid is redrawn each tick!'
    );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};

Blockly.Blocks['p5_grid_seed'] = {
  init() {
    this.appendValueInput('DENSITY')
        .setCheck('Number')
        .appendField('🌱  Randomly seed');
    this.appendDummyInput()
        .appendField('% of cells alive');
    this.setInputsInline(true);
    this.setColour('#00C853');
    this.setTooltip(
      'Randomly turns on a percentage of cells. Try 30%! ' +
      'Put this in When Sketch Starts so the grid is seeded once at the beginning.'
    );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};

// ── Life Rules ───────────────────────────────────────────────
Blockly.Blocks['p5_life_rules'] = {
  init() {
    this.appendDummyInput()
        .appendField('🧬  Apply Conway\'s rules');
    this.setColour('#00BCD4');
    this.setTooltip(
      'The heart of Game of Life! Applies these rules to every cell:\n' +
      '• A living cell with 2 or 3 neighbors SURVIVES\n' +
      '• A living cell with < 2 or > 3 neighbors DIES\n' +
      '• A dead cell with exactly 3 neighbors becomes ALIVE\n\n' +
      'Put this at the end of Every Frame!'
    );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};

Blockly.Blocks['p5_neighbors'] = {
  init() {
    this.appendValueInput('X').setCheck('Number').appendField('👥 neighbors of cell  col');
    this.appendValueInput('Y').setCheck('Number').appendField('row');
    this.setInputsInline(true);
    this.setColour('#00BCD4');
    this.setOutput(true, 'Number');
    this.setTooltip(
      'Returns how many of the 8 surrounding cells are currently alive. ' +
      'This is the number Conway\'s rules are based on!'
    );
  }
};

Blockly.Blocks['p5_cell_alive'] = {
  init() {
    this.appendValueInput('X').setCheck('Number').appendField('❓ is cell  col');
    this.appendValueInput('Y').setCheck('Number').appendField('row');
    this.appendDummyInput().appendField('alive?');
    this.setInputsInline(true);
    this.setColour('#00BCD4');
    this.setOutput(true, 'Boolean');
    this.setTooltip('Returns true if the cell at (col, row) is currently alive.');
  }
};

Blockly.Blocks['p5_set_cell'] = {
  init() {
    this.appendValueInput('X').setCheck('Number').appendField('⚡ Set cell  col');
    this.appendValueInput('Y').setCheck('Number').appendField('row  →');
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['alive', '1'],
          ['dead',  '0'],
        ]), 'STATE');
    this.setInputsInline(true);
    this.setColour('#00BCD4');
    this.setTooltip('Manually set a cell to alive (1) or dead (0). Useful for custom patterns!');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};

Blockly.Blocks['p5_custom_rule'] = {
  init() {
    this.appendDummyInput().appendField('📏  Custom rule: if living cell has');
    this.appendValueInput('N').setCheck('Number');
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['exactly',       '==='],
          ['fewer than',    '<'],
          ['more than',     '>'],
          ['at least',      '>='],
          ['at most',       '<='],
        ]), 'OP')
        .appendField('neighbors →');
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['it SURVIVES', 'survive'],
          ['it DIES',     'die'],
        ]), 'RESULT');
    this.setColour('#00BCD4');
    this.setTooltip(
      'Add a custom survival rule! Conway\'s classic rules are: survive with 2 or 3 neighbors. ' +
      'What happens if you change them?'
    );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};

// ── PHASE 3 ───────────────────────────────────────────────────
Blockly.Blocks['p5_ai_magic'] = {
  init() {
    this.appendDummyInput()
        .appendField('✨  AI Magic');
    this.appendDummyInput()
        .appendField('generates a creative twist on your sketch');
    this.setColour('#E040FB');
    this.setTooltip(
      'Sends your current sketch to an AI and asks it to add a creative visual effect. ' +
      'What will it come up with?'
    );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};
