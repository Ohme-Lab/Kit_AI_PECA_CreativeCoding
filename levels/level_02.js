LEVELS.push({
  id: 2,
  title: '02 / quelque chose clique',
  tutorial: [
    {
      title: 'Les conditions',
      text: "Jusqu'ici, le programme fait toujours la même chose en boucle. Dans ce niveau, tu vas lui apprendre à réagir : faire une chose si tu cliques, une autre sinon. C'est ce qu'on appelle une condition.",
    },
    {
      title: 'Le bloc "si clic de souris"',
      text: 'Tu vas trouver un nouveau bloc dans la boîte à outils : "si clic de souris, alors… sinon…". Glisse-le dans draw(), juste avant le cercle. Le programme choisira quel code exécuter selon ce que tu fais.',
    },
    {
      title: 'Astuce : drag & drop',
      text: 'Pour déplacer un bloc, clique dessus et glisse-le. Pour le connecter à un autre, approche-le jusqu\'à ce qu\'il s\'enclenche. Si tu te trompes, tu peux toujours le ramener dans la corbeille.',
    },
  ],
  steps: [
    {
      // step 1: place the mouse-if block inside draw()
      type: 'blocks',
      toolbox: 'level_2',
      initialBlocks: {
        blocks: {
          languageVersion: 0,
          blocks: [
            { type: 'p5_setup', x: 20, y: 20,
              inputs: {
                BODY: { block: {
                  type: 'p5_create_canvas',
                  inputs: {
                    W: { shadow: { type: 'math_number', fields: { NUM: 400 } } },
                    H: { shadow: { type: 'math_number', fields: { NUM: 400 } } },
                  },
                }},
              },
              next: { block: { type: 'p5_draw',               inputs: {
                BODY: { block: {
                  type: 'p5_circle',
                  inputs: {
                    X: { shadow: { type: 'math_number', fields: { NUM: 200 } } },
                    Y: { shadow: { type: 'math_number', fields: { NUM: 200 } } },
                    SIZE: { shadow: { type: 'math_number', fields: { NUM: 50 } } },
                  },
                }},
              }, } },
            },
          ],
        },
      },
      story: [
        "> Un programme peut réagir à l'utilisateur. Par exemple, on peut faire quelque chose quand il clique avec la souris.",
        "> On va créer une condition : 'si clic de souris, alors ... sinon ...'.",
        "> Crée le juste avant le bloc de dessin du cercle, dans draw().",
      ],
      task: "Ajoute un bloc 'si clic de souris' dans draw()",

      // just needs the block in the workspace
      check: (s) => s.has('p5_mouse_if'),

      win: '> Super, maintenant il faut lui faire faire quelque chose.',
    },
    {
      // step 2: put a fill() inside the if block
      type: 'blocks',
      toolbox: 'level_2',
      tutorial: [
        {
          title: 'Le bloc fill()',
          html: `<p class="tuto-text">Pour changer la couleur d'une forme, on utilise <code>fill()</code>. En p5.js, les couleurs sont définies en <strong>RGB</strong> : trois nombres entre 0 et 255, un pour le rouge, un pour le vert, un pour le bleu.</p>
<pre class="tuto-code">fill(255, 0, 0);   // rouge
fill(0, 255, 0);   // vert
fill(0, 0, 255);   // bleu
fill(0, 0, 0);     // noir
fill(255,255,255); // blanc</pre>`,
        },
      ],
      story: [
        "> On va faire changer la couleur quand on clique.",
        "> Dans le bloc 'si clic de souris', ajoute un bloc 'remplir les formes avec' dans 'alors'.",
        "> Et une autre couleur dans 'sinon'.",
      ],
      task: 'Dans "alors" et "sinon", mets une couleur différente',

      // if (mouseIsPressed) { ... fill( ... } — fill must appear inside the if body
      check: (s, code) => {
        const draw = code.match(/function draw\s*\(\s*\)\s*\{([\s\S]*)\}/);
        if (!draw) return false;
        return /if \(mouseIsPressed\)\s*\{[^}]*fill\(/.test(draw[1]);
      },

      win: "> Nice. Le programme fait une chose quand tu cliques, une autre quand tu ne cliques pas. C'est une condition.",
    },
    {
      // step 3: both branches must have content (else branch non-empty)
      type: 'blocks',
      toolbox: 'level_2',
      tutorial: [
        {
          title: 'Joue avec les couleurs RGB',
          render(container) {
            container.innerHTML = `
              <div class="tuto-rgb">
                <div class="tuto-rgb-row">
                  <span>R</span>
                  <input type="range" min="0" max="255" value="217" data-ch="r">
                  <span class="tuto-rgb-val">217</span>
                </div>
                <div class="tuto-rgb-row">
                  <span>G</span>
                  <input type="range" min="0" max="255" value="123" data-ch="g">
                  <span class="tuto-rgb-val">123</span>
                </div>
                <div class="tuto-rgb-row">
                  <span>B</span>
                  <input type="range" min="0" max="255" value="13" data-ch="b">
                  <span class="tuto-rgb-val">13</span>
                </div>
                <div class="tuto-rgb-preview"></div>
                <code class="tuto-rgb-code">fill(217, 123, 13);</code>
              </div>`;

            const update = () => {
              const vals = {};
              container.querySelectorAll('input[type=range]').forEach(inp => {
                vals[inp.dataset.ch] = +inp.value;
                inp.nextElementSibling.textContent = inp.value;
              });
              container.querySelector('.tuto-rgb-preview').style.background =
                `rgb(${vals.r},${vals.g},${vals.b})`;
              container.querySelector('.tuto-rgb-code').textContent =
                `fill(${vals.r}, ${vals.g}, ${vals.b});`;
            };

            container.querySelectorAll('input[type=range]')
              .forEach(inp => inp.addEventListener('input', update));
            update();
          },
        },
      ],
      story: [
        "> Essaye de mettre quelque chose dans les deux branches.",
        "> Quand on clique → une couleur. Quand on ne clique pas → une autre couleur.",
      ],
      task: 'Remplis les deux branches "alors" et "sinon"',

      // both { } must be non-empty
      check: (s, code) => {
        const draw = code.match(/function draw\s*\(\s*\)\s*\{([\s\S]*)\}/);
        if (!draw) return false;
        return /if \(mouseIsPressed\)\s*\{[^}]+\}\s*else\s*\{[^}]+\}/.test(draw[1]);
      },

      win: "> Trop beau. Maintenant on va faire bouger le cercle.",
    },
    {
      // step 4: circle follows mouse — circle(mouseX, mouseY, ...)
      type: 'blocks',
      toolbox: 'level_2',
      story: [
        "> Dernière étape : fais suivre le cercle à la souris.",
        "> Dans la catégorie 'interaction', il y a des blocs 'mouseX' et 'mouseY'.",
        "> Remplace les coordonnées du cercle par ces blocs.",
      ],
      task: 'Remplace les coordonnées du cercle par mouseX et mouseY',

      // circle() must have mouseX as first arg
      check: (s, code) => {
        const draw = code.match(/function draw\s*\(\s*\)\s*\{([\s\S]*)\}/);
        return draw && /circle\(\s*mouseX/.test(draw[1]);
      },

      win: "> Ok Picasso. Tu contrôles maintenant la position ET la couleur avec la souris.",
    },
  ],
});
