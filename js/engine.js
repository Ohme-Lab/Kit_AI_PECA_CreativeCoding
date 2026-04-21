/* ═══════════════════════════════════════════════════════════════
   ENGINE — level state machine.
   Reads LEVELS[], drives the UI, talks to the runner.
   ═══════════════════════════════════════════════════════════════ */

/* ── Toolbox presets ────────────────────────────────────────── */
const TOOLBOXES = {
  level_1: {
    kind: 'categoryToolbox',
    contents: [
      {
        kind: 'category', name: '⚙ Setup', colour: '#1a7a0a',
        contents: [
          { kind: 'block', type: 'p5_setup' },
        ]
      },
      {
        kind: 'category', name: '🖌 dessin', colour: '#3a6a0a',
        contents: [
          { kind: 'block', type: 'p5_background',
            inputs: { COLOR: { shadow: { type: 'colour_picker', fields: { COLOUR: '#0a0a0a' } } } }},
          { kind: 'block', type: 'p5_fill',
            inputs: { COLOR: { shadow: { type: 'colour_picker', fields: { COLOUR: '#39ff14' } } } }},
          { kind: 'block', type: 'p5_no_stroke' },
          { kind: 'block', type: 'p5_circle',
            inputs: {
              X:    { shadow: { type: 'math_number', fields: { NUM: 200 } } },
              Y:    { shadow: { type: 'math_number', fields: { NUM: 200 } } },
              SIZE: { shadow: { type: 'math_number', fields: { NUM: 60  } } },
            }},
        ]
      },
      {
        kind: 'category', name: '# values', colour: '#1a4a0a',
        contents: [
          { kind: 'block', type: 'p5_mousex' },
          { kind: 'block', type: 'p5_mousey' },
          { kind: 'block', type: 'math_number' },
          { kind: 'block', type: 'math_arithmetic' },
          { kind: 'block', type: 'p5_random',
            inputs: {
              MIN: { shadow: { type: 'math_number', fields: { NUM: 0   } } },
              MAX: { shadow: { type: 'math_number', fields: { NUM: 400 } } },
            }},
        ]
      },
    ]
  },

  basic: {
    kind: 'categoryToolbox',
    contents: [
      {
        kind: 'category', name: '⚙ animation', colour: '#1a7a0a',
        contents: [
          { kind: 'block', type: 'p5_setup' },
          { kind: 'block', type: 'p5_draw'  },
          { kind: 'block', type: 'p5_framerate',
            inputs: { RATE: { shadow: { type: 'math_number', fields: { NUM: 30 } } } } },
        ]
      },
      {
        kind: 'category', name: '✏ shapes', colour: '#2a5a0a',
        contents: [
          { kind: 'block', type: 'p5_circle',
            inputs: {
              X:    { shadow: { type: 'math_number', fields: { NUM: 200 } } },
              Y:    { shadow: { type: 'math_number', fields: { NUM: 200 } } },
              SIZE: { shadow: { type: 'math_number', fields: { NUM: 60  } } },
            }},
          { kind: 'block', type: 'p5_rect',
            inputs: {
              X: { shadow: { type: 'math_number', fields: { NUM: 100 } } },
              Y: { shadow: { type: 'math_number', fields: { NUM: 100 } } },
              W: { shadow: { type: 'math_number', fields: { NUM: 80  } } },
              H: { shadow: { type: 'math_number', fields: { NUM: 80  } } },
            }},
        ]
      },
      {
        kind: 'category', name: '🖌 drawing', colour: '#3a6a0a',
        contents: [
          { kind: 'block', type: 'p5_background',
            inputs: { COLOR: { shadow: { type: 'colour_picker', fields: { COLOUR: '#0a0a0a' } } } }},
          { kind: 'block', type: 'p5_fill',
            inputs: { COLOR: { shadow: { type: 'colour_picker', fields: { COLOUR: '#39ff14' } } } }},
          { kind: 'block', type: 'p5_no_stroke' },
        ]
      },
      {
        kind: 'category', name: '# values', colour: '#1a4a0a',
        contents: [
          { kind: 'block', type: 'p5_mousex' },
          { kind: 'block', type: 'p5_mousey' },
          { kind: 'block', type: 'math_number' },
          { kind: 'block', type: 'math_arithmetic' },
          { kind: 'block', type: 'p5_random',
            inputs: {
              MIN: { shadow: { type: 'math_number', fields: { NUM: 0   } } },
              MAX: { shadow: { type: 'math_number', fields: { NUM: 400 } } },
            }},
        ]
      },
    ]
  },
};

/* ── Engine state ───────────────────────────────────────────── */
const ENGINE = {
  levelIndex: 0,
  level: null,
  workspace: null,
  codeEditor: null,
  blocks: new Set(),
  code: '',
  aiUsed: false,
};

/* ── Start a level ──────────────────────────────────────────── */
function engineLoad(index) {
  ENGINE.levelIndex = index;
  ENGINE.level      = LEVELS[index];
  ENGINE.aiUsed     = false;
  document.getElementById('btn-next-level').classList.remove('active');

  const lv = ENGINE.level;

  // narrative
  setNarrative(lv.story, lv.task);
  setBugList(lv.type === 'debug' ? lv.bugs : []);

  // header title
  document.getElementById('level-title').textContent = lv.title;

  // show/hide left-pane sections
  const blocksSection = document.getElementById('blockly-section');
  const aiSection     = document.getElementById('ai-section');
  const endSection    = document.getElementById('end-section');

  blocksSection.classList.add('hidden');
  aiSection.classList.add('hidden');
  endSection.classList.add('hidden');

  if (lv.type === 'blocks') {
    blocksSection.classList.remove('hidden');
    ENGINE.workspace.updateToolbox(TOOLBOXES[lv.toolbox] || TOOLBOXES.basic);
    ENGINE.workspace.clear();
  } else if (lv.type === 'ai-trap') {
    aiSection.classList.remove('hidden');
  } else if (lv.type === 'debug') {
    // load the AI code into the editor
    ENGINE.codeEditor.setValue(LEVELS[index - 1]?.aiCode || '');
    ENGINE.codeEditor.setOption('readOnly', false);
    runnerRun(ENGINE.codeEditor.getValue());
  } else if (lv.type === 'end') {
    endSection.classList.remove('hidden');
    setNarrative(lv.story, '');
  }

  // code pane readonly for non-debug levels
  if (lv.type !== 'debug') {
    ENGINE.codeEditor.setOption('readOnly', lv.type !== 'end');
  }

  updateProgress();
}

/* ── Called by workspace change listener ───────────────────── */
function engineOnBlocksChange(blocks, code) {
  ENGINE.blocks = blocks;
  ENGINE.code   = code;
  if (ENGINE.level?.type === 'blocks') engineCheck();
}

/* ── Called by code editor change ──────────────────────────── */
function engineOnCodeChange(code) {
  ENGINE.code = code;
  if (ENGINE.level?.type === 'debug') {
    updateBugChecks(code);
    engineCheck();
  }
}

/* ── Check win condition ────────────────────────────────────── */
function engineCheck() {
  const lv = ENGINE.level;
  if (!lv) return;
  const passed = lv.check(ENGINE.blocks, ENGINE.code, ENGINE);
  if (passed) engineWin();
}

function engineWin() {
  const lv = ENGINE.level;
  showWinMessage(lv.win);
  document.getElementById('btn-next-level').classList.add('active');
}

/* ── AI injection (level type: ai-trap) ─────────────────────── */
function engineAskAI() {
  const lv = ENGINE.level;
  if (lv.type !== 'ai-trap') return;

  const btn = document.getElementById('btn-ask-ai');
  btn.disabled = true;

  // show fake typing messages
  const log = document.getElementById('ai-log');
  log.innerHTML = '';
  log.classList.remove('hidden');

  let i = 0;
  const msgs = lv.aiTyping || ['thinking...', 'done.'];
  const tick = setInterval(() => {
    if (i < msgs.length) {
      const line = document.createElement('div');
      line.textContent = '> ' + msgs[i++];
      log.appendChild(line);
      log.scrollTop = log.scrollHeight;
    } else {
      clearInterval(tick);
      // inject the buggy code
      ENGINE.codeEditor.setValue(lv.aiCode);
      ENGINE.codeEditor.setOption('readOnly', true);
      runnerRun(lv.aiCode);
      ENGINE.aiUsed = true;
      engineCheck();
    }
  }, 600);
}

/* ── Progress bar ───────────────────────────────────────────── */
function updateProgress() {
  const pct = Math.round((ENGINE.levelIndex / (LEVELS.length - 1)) * 100);
  document.getElementById('progress-fill').style.width  = pct + '%';
  document.getElementById('progress-label').textContent =
    (ENGINE.levelIndex + 1) + ' / ' + LEVELS.length;
}

/* ── Bug checklist (debug levels) ──────────────────────────── */
function updateBugChecks(code) {
  const lv = ENGINE.level;
  if (lv?.type !== 'debug') return;
  lv.bugs.forEach((bug) => {
    const el = document.getElementById('bug-' + bug.id);
    if (!el) return;
    const fixed = bug.check(code);
    el.classList.toggle('bug-fixed', fixed);
    el.querySelector('.bug-status').textContent = fixed ? '✓' : '○';
  });
}

function setBugList(bugs) {
  const container = document.getElementById('bug-list');
  container.innerHTML = '';
  bugs.forEach((bug) => {
    const div = document.createElement('div');
    div.id        = 'bug-' + bug.id;
    div.className = 'bug-item';
    div.innerHTML =
      `<span class="bug-status">○</span>` +
      `<span class="bug-hint">${bug.hint}</span>`;
    container.appendChild(div);
  });
  document.getElementById('bugs-section').classList.toggle('hidden', bugs.length === 0);
}

/* ── Narrative ──────────────────────────────────────────────── */
function setNarrative(lines, task) {
  const story = document.getElementById('story-text');
  story.innerHTML = lines.map(l => `<div class="story-line">${l}</div>`).join('');

  const taskEl = document.getElementById('task-text');
  taskEl.textContent = task ? '// task: ' + task : '';
}

/* ── Win message ────────────────────────────────────────────── */
let winTimer;
function showWinMessage(msg) {
  const el = document.getElementById('win-message');
  el.innerHTML = msg.split('\n').map(l => `<div>${l}</div>`).join('');
  el.classList.remove('hidden');
  clearTimeout(winTimer);
  winTimer = setTimeout(() => el.classList.add('hidden'), 2400);
}
