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
          { kind: 'block', type: 'p5_create_canvas',
            inputs: {
              W: { shadow: { type: 'math_number', fields: { NUM: 400 } } },
              H: { shadow: { type: 'math_number', fields: { NUM: 400 } } },
            }},
          { kind: 'block', type: 'p5_draw'  },
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
    ]
  },

  basic: {
    kind: 'categoryToolbox',
    contents: [
      {
        kind: 'category', name: '⚙ animation', colour: '#1a7a0a',
        contents: [
          { kind: 'block', type: 'p5_setup' },
          { kind: 'block', type: 'p5_create_canvas',
            inputs: {
              W: { shadow: { type: 'math_number', fields: { NUM: 400 } } },
              H: { shadow: { type: 'math_number', fields: { NUM: 400 } } },
            }},
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

  level_2: {
    kind: 'categoryToolbox',
    contents: [
      {
        kind: 'category', name: '⚙ Setup', colour: '#1a7a0a',
        contents: [
          { kind: 'block', type: 'p5_setup' },
          { kind: 'block', type: 'p5_create_canvas',
            inputs: {
              W: { shadow: { type: 'math_number', fields: { NUM: 400 } } },
              H: { shadow: { type: 'math_number', fields: { NUM: 400 } } },
            }},
          { kind: 'block', type: 'p5_draw' },
        ]
      },
      {
        kind: 'category', name: '✏ formes', colour: '#2a5a0a',
        contents: [
          { kind: 'block', type: 'p5_circle',
            inputs: {
              X:    { shadow: { type: 'math_number', fields: { NUM: 200 } } },
              Y:    { shadow: { type: 'math_number', fields: { NUM: 200 } } },
              SIZE: { shadow: { type: 'math_number', fields: { NUM: 60  } } },
            }},
        ]
      },
      {
        kind: 'category', name: '🖱 interaction', colour: '#E040FB',
        contents: [
          { kind: 'block', type: 'p5_mouse_if' },
          { kind: 'block', type: 'p5_mousex' },
          { kind: 'block', type: 'p5_mousey' },
        ]
      },
      {
        kind: 'category', name: '🖌 couleurs', colour: '#3a6a0a',
        contents: [
          { kind: 'block', type: 'p5_background',
            inputs: { COLOR: { shadow: { type: 'colour_picker', fields: { COLOUR: '#0a0a0a' } } } }},
          { kind: 'block', type: 'p5_fill',
            inputs: { COLOR: { shadow: { type: 'colour_picker', fields: { COLOUR: '#39ff14' } } } }},
          { kind: 'block', type: 'p5_no_stroke' },
        ]
      },
    ]
  },
};

/* ── Engine state ───────────────────────────────────────────── */
const ENGINE = {
  levelIndex: 0,
  stepIndex: 0,
  level: null,
  workspace: null,
  codeEditor: null,
  blocks: new Set(),
  code: '',
  aiUsed: false,
  loading: false,
  stepPassed: false,
};

/* ── Returns the active step object (or level itself if no steps) ── */
function engineCurrentStep() {
  const lv = ENGINE.level;
  if (!lv) return null;
  if (lv.steps?.length) return lv.steps[ENGINE.stepIndex];
  return lv;
}

/* ── Start a level ──────────────────────────────────────────── */
function engineLoad(index) {
  ENGINE.levelIndex = index;
  ENGINE.stepIndex  = 0;
  ENGINE.level      = LEVELS[index];
  document.getElementById('btn-next-level').classList.remove('active');
  document.getElementById('level-title').textContent = ENGINE.level.title;

  // Reset workspace once at level start
  ENGINE.loading = true;
  ENGINE.workspace.clear();
  const firstStep = engineCurrentStep();
  if (firstStep?.initialBlocks) {
    Blockly.serialization.workspaces.load(firstStep.initialBlocks, ENGINE.workspace);
  }
  setTimeout(() => { ENGINE.loading = false; }, 100);

  engineLoadStep(firstStep);
  updateProgress();
}

/* ── Load a step (called on level start and every step advance) ── */
function engineLoadStep(step) {
  ENGINE.aiUsed     = false;
  ENGINE.stepPassed = false;

  setNarrative(step.story, step.task);
  updateStepIndicator();
  setBugList(step.type === 'debug' ? (step.bugs || []) : []);

  const blocksSection = document.getElementById('blockly-section');
  const aiSection     = document.getElementById('ai-section');
  const endSection    = document.getElementById('end-section');

  blocksSection.classList.add('hidden');
  aiSection.classList.add('hidden');
  endSection.classList.add('hidden');

  if (step.type === 'blocks') {
    blocksSection.classList.remove('hidden');
    ENGINE.workspace.updateToolbox(TOOLBOXES[step.toolbox] || TOOLBOXES.basic);
    ENGINE.codeEditor.setOption('readOnly', true);
    
  } else if (step.type === 'code') {
    ENGINE.codeEditor.setOption('readOnly', false);

   } else if (step.type === 'ai-trap') {
    aiSection.classList.remove('hidden');
    // reset the AI button so it can be clicked again
    const btn = document.getElementById('btn-ask-ai');
    btn.disabled = false;
    const log = document.getElementById('ai-log');
    log.innerHTML = '';
    log.classList.add('hidden');
    ENGINE.codeEditor.setOption('readOnly', true);

  } else if (step.type === 'debug') {
    const debugCode = typeof step.aiCode === 'function'
      ? step.aiCode(ENGINE.codeEditor.getValue())
      : (step.aiCode || '');
    ENGINE.codeEditor.setValue(debugCode);
    ENGINE.codeEditor.setOption('readOnly', false);
    runnerRun(debugCode);

  } else if (step.type === 'end') {
    endSection.classList.remove('hidden');
    ENGINE.codeEditor.setOption('readOnly', true);
  }
}

/* ── Called by workspace change listener ───────────────────── */
function engineOnBlocksChange(blocks, code) {
  ENGINE.blocks = blocks;
  ENGINE.code   = code;
  if (engineCurrentStep()?.type === 'blocks') engineCheck();
}

/* ── Called by code editor change ──────────────────────────── */
function engineOnCodeChange(code) {
  ENGINE.code = code;
  const type = engineCurrentStep()?.type;
  if (type === 'debug') {
    updateBugChecks(code);
    engineCheck();
  } else if (type === 'code') {
    engineCheck();
  }
}

/* ── Check win condition ────────────────────────────────────── */
function engineCheck() {
  if (ENGINE.loading || ENGINE.stepPassed) return;
  const lv = ENGINE.level;
  if (!lv) return;
  const step = engineCurrentStep();
  if (!step.check(ENGINE.blocks, ENGINE.code, ENGINE)) return;
  ENGINE.stepPassed = true;
  showWinMessage(step.win || '> done.');
}

function engineWin() {
  const lv = ENGINE.level;
  if (lv.win) showWinMessage(lv.win, true);
  document.getElementById('btn-next-level').classList.add('active');
}

/* ── Step navigation (prev / next) ─────────────────────────── */
function engineStepNav(dir) {
  const lv = ENGINE.level;
  if (!lv?.steps?.length) return;
  const next = ENGINE.stepIndex + dir;
  if (next < 0 || next >= lv.steps.length) return;
  ENGINE.stepIndex = next;
  document.getElementById('btn-next-level').classList.remove('active');
  engineLoadStep(engineCurrentStep());
  updateStepIndicator();
}

/* ── AI injection (step type: ai-trap and ask-ai) ──────────────────────── */
function engineAskAI() {
  const step = engineCurrentStep();
  if (step?.type !== 'ai-trap') return;

  const btn = document.getElementById('btn-ask-ai');
  btn.disabled = true;

  const log = document.getElementById('ai-log');
  log.innerHTML = '';
  log.classList.remove('hidden');

  let i = 0;
  const msgs = step.aiTyping || ['thinking...', 'done.'];
  const tick = setInterval(() => {
    if (i < msgs.length) {
      const line = document.createElement('div');
      line.textContent = '> ' + msgs[i++];
      log.appendChild(line);
      log.scrollTop = log.scrollHeight;
    } else {
      clearInterval(tick);
      const injected = typeof step.aiCode === 'function'
        ? step.aiCode(ENGINE.codeEditor.getValue())
        : step.aiCode;
      ENGINE.codeEditor.setValue(injected);
      ENGINE.codeEditor.setOption('readOnly', true);
      runnerRun(injected);
      ENGINE.aiUsed = true;
      engineCheck();
    }
  }, 600);
}

/* ── Step indicator (shown below task text when level has steps) ─ */
function updateStepIndicator() {
  const lv = ENGINE.level;
  const el = document.getElementById('step-indicator');
  if (!el) return;
  if (lv?.steps?.length > 1) {
    el.textContent = 'step ' + (ENGINE.stepIndex + 1) + ' / ' + lv.steps.length;
    el.classList.remove('hidden');
  } else {
    el.classList.add('hidden');
  }
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
  const step = engineCurrentStep();
  if (step?.type !== 'debug') return;
  (step.bugs || []).forEach((bug) => {
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
let narrativeTimer = null;

function setNarrative(lines, task) {
  if (narrativeTimer) clearTimeout(narrativeTimer);

  const story   = document.getElementById('story-text');
  const taskEl  = document.getElementById('task-text');
  const section = document.getElementById('story-section');

  // flash blink
  section.classList.remove('narrative-flash');
  void section.offsetWidth; // force reflow to restart animation
  section.classList.add('narrative-flash');
  setTimeout(() => section.classList.remove('narrative-flash'), 200);

  story.innerHTML  = '';
  taskEl.textContent = '';

  // build a flat queue: each entry is { el, char }
  const queue = [];
  lines.forEach(line => {
    const div = document.createElement('div');
    div.className = 'story-line';
    story.appendChild(div);
    for (const ch of line) queue.push({ el: div, ch });
    queue.push(null); // line separator (no-op tick)
  });
  if (task) {
    const full = '// task: ' + task;
    for (const ch of full) queue.push({ el: taskEl, ch });
  }

  let i = 0;
  const SPEED = 9; // ms per char
  function tick() {
    if (i >= queue.length) return;
    const entry = queue[i++];
    if (entry) entry.el.textContent += entry.ch;
    narrativeTimer = setTimeout(tick, SPEED);
  }
  tick();
}

/* ── Win message ────────────────────────────────────────────── */
let winTimer;
function showWinMessage(msg, isLast = false) {
  const el = document.getElementById('win-message');
  const lines = msg.split('\n').map(l => `<div>${l}</div>`).join('');
  const lv = ENGINE.level;
  const hasNextStep  = lv?.steps && ENGINE.stepIndex < lv.steps.length - 1;
  const hasNextLevel = ENGINE.levelIndex < LEVELS.length - 1;
  const btnLabel = isLast
    ? (hasNextLevel ? 'niveau suivant' : 'fin')
    : (hasNextStep  ? 'étape suivante' : 'niveau suivant');
  const btn = `<button class="win-next-btn" onclick="winAdvance()">> ${btnLabel} &gt;</button>`;
  el.innerHTML = lines + btn;
  el.classList.remove('hidden');
  clearTimeout(winTimer);
  winTimer = setTimeout(() => el.classList.add('hidden'), 30000);
}

function winAdvance() {
  const lv = ENGINE.level;
  document.getElementById('win-message').classList.add('hidden');
  const isLastStep = !lv?.steps || ENGINE.stepIndex >= lv.steps.length - 1;
  if (!isLastStep) {
    ENGINE.stepIndex++;
    engineLoadStep(engineCurrentStep());
    updateStepIndicator();
  } else {
    engineWin();
  }
}
