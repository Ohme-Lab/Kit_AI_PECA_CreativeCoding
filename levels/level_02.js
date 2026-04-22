LEVELS.push({
  id: 2,
  title: '02 / quelque chose clique',
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
