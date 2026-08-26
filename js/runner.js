/* ═══════════════════════════════════════════════════════════════
   RUNNER — iframe sketch execution.
   Extracted from app.js so engine.js can call it cleanly.
   ═══════════════════════════════════════════════════════════════ */

const SKETCH_HTML = (code) => `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
  <style>
    *{margin:0px;padding:2px}
    body{background:#080808;overflow:hidden ; center; display:flex;align-items:center;justify-content:center}
    canvas{outline:1px solid #39ff14}
  </style>
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.4/p5.min.js"><\/script>
</head><body>
<script>
window.onerror = function(msg, _src, line) {
  window.parent.postMessage({ type: 'error', message: msg + ' (line ' + line + ')' }, '*');
  return true;
};
<\/script>
<script>
${code}
<\/script>
<script>
window.addEventListener('message', function(e) {
  if (!e.data) return;
  try {
    if (e.data.action === 'play')     loop();
    if (e.data.action === 'pause')    noLoop();
    if (e.data.action === 'step')     redraw();
    if (e.data.action === 'setSpeed') frameRate(e.data.value);
  } catch (_) {}
});
setInterval(function() {
  try { window.parent.postMessage({ type: 'fps', value: Math.round(frameRate()) }, '*'); }
  catch (_) {}
}, 1000);
<\/script>
</body></html>`;

let _blobUrl = null;

function runnerRun(code) {
  const frame = document.getElementById('sketch-frame');

  // clear error banner
  const eb = document.getElementById('error-banner');
  if (eb) { eb.textContent = ''; eb.classList.add('hidden'); }

  const blob = new Blob([SKETCH_HTML(code)], { type: 'text/html' });
  const url  = URL.createObjectURL(blob);

  frame.onload = () => {
    if (_blobUrl) URL.revokeObjectURL(_blobUrl);
    _blobUrl = url;
  };
  frame.src = url;
}

function runnerSend(msg) {
  try {
    document.getElementById('sketch-frame').contentWindow.postMessage(msg, '*');
  } catch (_) {}
}

// Wire up messages from iframe
window.addEventListener('message', (e) => {
  if (!e.data) return;
  if (e.data.type === 'fps') {
    const el = document.getElementById('fps-display');
    if (el) el.textContent = e.data.value + ' fps';
  }
  if (e.data.type === 'error') {
    const el = document.getElementById('error-banner');
    if (el) { el.textContent = '// ERR: ' + e.data.message; el.classList.remove('hidden'); }
    // also flag in engine if debug level
    if (ENGINE?.level?.type === 'debug') {
      const errLine = document.getElementById('err-indicator');
      if (errLine) errLine.textContent = '// ERR: ' + e.data.message;
    }
  }
});
