/* ═══════════════════════════════════════════════════════════════
   TUTORIAL — modal slide-show between / within levels.

   Each slide supports ONE of:
     text:   string          — plain text paragraph
     html:   string          — arbitrary HTML (innerHTML)
     render: (el) => void    — function that populates the body element

   Any slide can also include:
     title:  string          — slide heading
     image:  string          — image path, shown above text/html

   showTutorial(slides, opts) — opts.closeLabel overrides last-slide button
   ═══════════════════════════════════════════════════════════════ */

let _tutoSlides    = [];
let _tutoIndex     = 0;
let _tutoCloseLabel = '[ ok ]';

function showTutorial(slides, opts = {}) {
  if (!slides?.length) return;
  _tutoSlides     = slides;
  _tutoIndex      = 0;
  _tutoCloseLabel = opts.closeLabel || '[ ok ]';
  _tutoRender();
  document.getElementById('tutorial-modal').classList.remove('hidden');
}

function hideTutorial() {
  // Clear body so render() teardown is implicit (DOM removal)
  document.querySelector('.tuto-body').innerHTML = '';
  document.getElementById('tutorial-modal').classList.add('hidden');
}

function _tutoRender() {
  const slide   = _tutoSlides[_tutoIndex];
  const total   = _tutoSlides.length;
  const isLast  = _tutoIndex === total - 1;
  const isFirst = _tutoIndex === 0;

  // Header
  document.querySelector('.tuto-title').textContent   = slide.title || '';
  document.querySelector('.tuto-counter').textContent =
    total > 1 ? `${_tutoIndex + 1} / ${total}` : '';

  // Body — clear first, then populate
  const body = document.querySelector('.tuto-body');
  body.innerHTML = '';

  if (slide.render) {
    // Custom interactive element
    slide.render(body);

  } else {
    // Optional image
    if (slide.image) {
      const img = document.createElement('img');
      img.src   = slide.image;
      img.alt   = slide.title || '';
      img.className = 'tuto-img';
      body.appendChild(img);
    }

    // Text or HTML
    if (slide.html) {
      const div = document.createElement('div');
      div.className = 'tuto-text';
      div.innerHTML = slide.html;
      body.appendChild(div);
    } else if (slide.text) {
      const p = document.createElement('p');
      p.className   = 'tuto-text';
      p.textContent = slide.text;
      body.appendChild(p);
    }
  }

  // Nav buttons
  const prev = document.getElementById('tuto-prev');
  const next = document.getElementById('tuto-next');
  prev.classList.toggle('hidden', isFirst);
  next.textContent = isLast ? _tutoCloseLabel : '[ suivant ]';
}

function _tutoNext() {
  if (_tutoIndex < _tutoSlides.length - 1) {
    _tutoIndex++;
    _tutoRender();
  } else {
    hideTutorial();
  }
}

function _tutoPrev() {
  if (_tutoIndex > 0) {
    _tutoIndex--;
    _tutoRender();
  }
}

// Wire up once — buttons and keyboard
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('tuto-next').addEventListener('click', _tutoNext);
  document.getElementById('tuto-prev').addEventListener('click', _tutoPrev);
  document.querySelector('.tuto-backdrop').addEventListener('click', hideTutorial);

  document.addEventListener('keydown', (e) => {
    if (document.getElementById('tutorial-modal').classList.contains('hidden')) return;
    if (e.key === 'Escape')     hideTutorial();
    if (e.key === 'ArrowRight') _tutoNext();
    if (e.key === 'ArrowLeft')  _tutoPrev();
  });
});
