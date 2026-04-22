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
        .appendField('setup');
    this.appendStatementInput('BODY')
        .setCheck(null);
    this.setColour('#4C97FF');
    this.setTooltip('Ce code s\'exécute une fois au début. C\'est l\'endroit idéal pour créer votre canevas et faire les préparatifs initiaux.');
    this.setPreviousStatement(false);   // top-level blocko
    this.setNextStatement(true, null);
  }
};

Blockly.Blocks['p5_create_canvas'] = {
  init() {
    this.appendValueInput('W').setCheck('Number').appendField('🖼 Créer un canevas. Largeur : ');
    this.appendValueInput('H').setCheck('Number').appendField('hauteur');
    this.setInputsInline(true);
    this.setColour('#4C97FF');
    this.setTooltip("Crée le canevas où tout se passe. Placez ce bloc dans setup() pour qu'il s'exécute une fois au début.");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};

Blockly.Blocks['p5_draw'] = {
  init() {
    this.appendDummyInput()
        .appendField('draw');
    this.appendStatementInput('BODY')
        .setCheck(null);
    this.setColour('#4C97FF');
    this.setTooltip('S\'exécute ~30 fois par seconde — comme les pages d\'un livre d\'animation. Dessinez et mettez à jour tout ici!');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};

// ── Drawing ──────────────────────────────────────────────────
Blockly.Blocks['p5_background'] = {
  init() {
    this.appendValueInput('COLOR')
        .setCheck('Colour')
        .appendField('background  🎨');
    this.setInputsInline(true);
    this.setColour('#FF8C42');
    this.setTooltip('Change la couleur du fond du canevas. Placez ce bloc au début de draw() pour qu\'il s\'applique à chaque frame, ou dans setup() pour qu\'il s\'applique une fois au début.');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};

Blockly.Blocks['p5_fill'] = {
  init() {
    this.appendValueInput('COLOR')
        .setCheck('Colour')
        .appendField('remplir les formes avec');
    this.setInputsInline(true);
    this.setColour('#FF8C42');
    this.setTooltip("Remplis les formes avec une couleur. Placez ce bloc avant les blocs de dessin pour qu'il s'applique à ceux-ci et tous les blocs suivants, jusqu'à ce que vous changiez la couleur à nouveau.");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};

Blockly.Blocks['p5_stroke'] = {
  init() {
    this.appendValueInput('COLOR')
        .setCheck('Colour')
        .appendField('dessiner les contours avec ');
    this.setInputsInline(true);
    this.setColour('#FF8C42');
    this.setTooltip('Dessine les contours des formes avec une couleur. Placez ce bloc avant les blocs de dessin pour qu\'il s\'applique à ceux-ci et tous les blocs suivants, jusqu\'à ce que vous changiez la couleur à nouveau.');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};

Blockly.Blocks['p5_no_stroke'] = {
  init() {
    this.appendDummyInput().appendField('Pas de contours');
    this.setColour('#FF8C42');
    this.setTooltip('Dessine les formes sans contours — juste le remplissage.');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};

Blockly.Blocks['p5_no_fill'] = {
  init() {
    this.appendDummyInput().appendField('Pas de remplissage');
    this.setColour('#FF8C42');
    this.setTooltip('Dessine les formes sans remplissage — juste les contours restent.');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};

Blockly.Blocks['p5_circle'] = {
  init() {
    this.appendDummyInput().appendField('Dessinner un cercle');
    this.appendValueInput('X').setCheck('Number').appendField('x');
    this.appendValueInput('Y').setCheck('Number').appendField('y');
    this.appendValueInput('SIZE').setCheck('Number').appendField('size');
    this.setInputsInline(true);
    this.setColour('#FF6B6B');
    this.setTooltip('Dessine un cercle à la position (x, y) avec le diamètre donné.');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};

Blockly.Blocks['p5_rect'] = {
  init() {
    this.appendDummyInput().appendField('Dessiner un rectangle');
    this.appendValueInput('X').setCheck('Number').appendField('x');
    this.appendValueInput('Y').setCheck('Number').appendField('y');
    this.appendValueInput('W').setCheck('Number').appendField('width');
    this.appendValueInput('H').setCheck('Number').appendField('height');
    this.setInputsInline(true);
    this.setColour('#FF6B6B');
    this.setTooltip('Dessine un rectangle à la position (x, y) avec la largeur et la hauteur données.');
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

Blockly.Blocks['p5_mouse_if'] = {
  init() {
    this.appendDummyInput().appendField('🖱 si clic de souris');
    this.appendStatementInput('DO').appendField('alors');
    this.appendStatementInput('ELSE').appendField('sinon');
    this.setColour('#E040FB');
    this.setTooltip('Exécute les blocs "alors" quand la souris est cliquée, "sinon" autrement.');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};
