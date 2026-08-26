/* ═══════════════════════════════════════════════════════════════
   RUNNER — iframe sketch execution.
   Extracted from app.js so engine.js can call it cleanly.
   ═══════════════════════════════════════════════════════════════ */

// Marker used to auto-compute how many lines precede student code in the blob.
// If the template changes, the offset recalculates itself automatically.
const _CODE_MARKER = '/*__CODE_START__*/';

function _buildHTML(code, offset) {
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
  <style>
    *{margin:0;padding:0}
    body{background:#fff;overflow:hidden;display:flex;align-items:center;justify-content:center}
    canvas{outline:1px solid rgba(17,17,17,.12)}
  </style>
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.4/p5.min.js"><\/script>
</head><body>
<script>
window.__codeOffset = ${offset};
window.onerror = function(msg, src, line) {
  var isP5 = src && src.indexOf('cdnjs.cloudflare.com') !== -1;
  var cleanMsg = msg.replace(/blob:[^\s)"]+/g, '').trim();
  if (isP5) {
    window.parent.postMessage({ type: 'error', message: cleanMsg + ' (erreur interne p5.js)' }, '*');
  } else {
    var studentLine = Math.max(1, line - window.__codeOffset);
    window.parent.postMessage({ type: 'error', message: cleanMsg + ' — ligne ' + studentLine }, '*');
  }
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
}

// Lines in the blob before student code — computed once from the template itself.
const _CODE_OFFSET = (() => {
  const probe = _buildHTML(_CODE_MARKER, 0);
  return probe.slice(0, probe.indexOf(_CODE_MARKER)).split('\n').length - 1;
})();

const SKETCH_HTML = (code) => _buildHTML(code, _CODE_OFFSET);

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
    if (el) { el.textContent = '// ' + e.data.message; el.classList.remove('hidden'); }
    if (ENGINE?.level?.type === 'debug') {
      const errLine = document.getElementById('err-indicator');
      if (errLine) errLine.textContent = '// ' + e.data.message;
    }
  }
});
