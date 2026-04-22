/* ═══════════════════════════════════════════════════════════════
   APP — wiring only.
   Game logic lives in engine.js / levels.js.
   ═══════════════════════════════════════════════════════════════ */
'use strict';

/* ── Blockly init ───────────────────────────────────────────── */
function initBlockly() {
  ENGINE.workspace = Blockly.inject('blockly-div', {
    toolbox:  TOOLBOXES.basic,
    grid:     { spacing: 20, length: 3, colour: '#1a3a0a', snap: true },
    trashcan: true,
    zoom:     { controls: true, wheel: true, startScale: 0.95 },
    theme:    buildBlocklyTheme(),
    move:     { scrollbars: true, drag: true, wheel: false },
  });

  ENGINE.workspace.addChangeListener((e) => {
    if (e.isUiEvent) return;
    if (ENGINE.workspace.isDragging()) return;
    const blocks = new Set();
    ENGINE.workspace.getAllBlocks(false).forEach(b => blocks.add(b.type));
    const code = generateSketchCode(ENGINE.workspace) || '';
    // update code pane for blocks steps
    if (engineCurrentStep()?.type === 'blocks') {
      ENGINE.codeEditor.setValue(code);
      runnerRun(code);
    }
    engineOnBlocksChange(blocks, code);
  });
}

function buildBlocklyTheme() {
  try {
    return Blockly.Theme.defineTheme('tui', {
      base: Blockly.Themes.Zelos,
      componentStyles: {
        workspaceBackgroundColour: '#080808',
        toolboxBackgroundColour:   '#0d0d0d',
        toolboxForegroundColour:   '#a0d890',
        flyoutBackgroundColour:    '#111111',
        flyoutForegroundColour:    '#a0d890',
        flyoutOpacity:             0.98,
        scrollbarColour:           '#1a3a0a',
        insertionMarkerColour:     '#39ff14',
      },
    });
  } catch (_) { return Blockly.Themes.Zelos; }
}

/* ── CodeMirror init ────────────────────────────────────────── */
function initCodeEditor() {
  ENGINE.codeEditor = CodeMirror.fromTextArea(
    document.getElementById('code-editor'), {
      mode: 'javascript',
      theme: 'dracula',
      lineNumbers: true,
      tabSize: 2,
      indentWithTabs: false,
      readOnly: true,
    }
  );

  function resizeCM() {
    const pane = document.getElementById('pane-code');
    const hdr  = pane.querySelector('.pane-header').offsetHeight;
    const eb   = document.getElementById('error-banner');
    const ebh  = eb.classList.contains('hidden') ? 0 : eb.offsetHeight;
    ENGINE.codeEditor.setSize('100%', (pane.offsetHeight - hdr - ebh) + 'px');
  }
  window.addEventListener('resize', resizeCM);
  setTimeout(resizeCM, 100);

  ENGINE.codeEditor.on('change', (_cm, obj) => {
    if (obj.origin === 'setValue') return;
    engineOnCodeChange(ENGINE.codeEditor.getValue());
    // live-reload sketch while debugging
    const t = engineCurrentStep()?.type;
    if (t === 'debug' || t === 'code') {
      runnerRun(ENGINE.codeEditor.getValue());
    }
  });
}

/* ── Playback controls ──────────────────────────────────────── */
function initControls() {
  const $ = (id) => document.getElementById(id);

  $('btn-play').onclick  = () => { runnerSend({action:'play'});  setActive('btn-play');  };
  $('btn-pause').onclick = () => { runnerSend({action:'pause'}); setActive('btn-pause'); };
  $('btn-step').onclick  = () => runnerSend({ action: 'step' });

  $('speed-slider').oninput = (e) => {
    const v = +e.target.value;
    $('speed-label').textContent = v + ' fps';
    runnerSend({ action: 'setSpeed', value: v });
  };

  $('btn-ask-ai').onclick  = engineAskAI;
  $('btn-prev-level').onclick = () => {
    if (ENGINE.levelIndex > 0) engineLoad(ENGINE.levelIndex - 1);
  };
  $('btn-next-level').onclick = () => {
    if (ENGINE.levelIndex < LEVELS.length - 1) engineLoad(ENGINE.levelIndex + 1);
  };
  $('btn-prev-step').onclick = () => engineStepNav(-1);
  $('btn-next-step').onclick = () => engineStepNav(+1);
}

function setActive(id) {
  ['btn-play','btn-pause'].forEach(b => document.getElementById(b)?.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
}

/* ── Boot ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initBlockly();
  initCodeEditor();
  initControls();
  setActive('btn-pause');
  engineLoad(0);
  window.addEventListener('resize', () => Blockly.svgResize(ENGINE.workspace));
});
