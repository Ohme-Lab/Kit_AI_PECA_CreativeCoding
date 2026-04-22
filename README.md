# Creative Coding Lab

Un jeu pédagogique pour apprendre les bases de la programmation créative — et comprendre les limites de l'IA.

## Concept

Les élèves progressent à travers des niveaux linéaires. Chaque niveau est divisé en étapes. L'interface est volontairement minimaliste : terminal vert sur fond noir.

Le fil rouge : on commence par coder soi-même, puis on confie tout à l'IA, puis on réalise que son code est bogué — et on le corrige. C'est ça, la leçon.

## Types d'étapes

| Type | Description |
|------|-------------|
| `blocks` | L'élève assemble des blocs visuels (Blockly). Le code généré s'exécute en direct. |
| `code` | L'élève modifie directement le code dans l'éditeur. |
| `ai-trap` | Un bouton [ASK AI] injecte du code pré-écrit (potentiellement bogué). |
| `debug` | L'élève corrige des bugs dans le code. Une checklist indique la progression. |
| `end` | Écran de conclusion, pas d'interaction. |

## Ajouter du contenu

Tout le contenu est dans `js/levels.js`. Un niveau ressemble à ça :

```js
{
  id: 3,
  title: '03 / mon niveau',
  win: '> Bravo.',
  steps: [
    {
      type: 'blocks',
      toolbox: 'basic',
      story: ['> Texte narratif affiché à gauche.'],
      task: 'Instruction courte pour l\'élève.',
      check: (s, code) => s.has('p5_draw'),
      win: '> Message affiché quand l\'étape est réussie.',
    },
  ],
}
```

### Blocs disponibles

Définis dans `js/blocks.js`, générateurs dans `js/generators.js` :
- **Setup / animation** : `p5_setup`, `p5_create_canvas`, `p5_draw`, `p5_framerate`
- **Dessin** : `p5_background`, `p5_fill`, `p5_stroke`, `p5_no_stroke`, `p5_circle`, `p5_rect`
- **Valeurs** : `p5_mousex`, `p5_mousey`, `p5_random`, `math_number`, `math_arithmetic`
- **Grille / Game of Life** : `p5_grid_create`, `p5_grid_show`, `p5_grid_seed`, `p5_life_rules`, ...

### Blocs pré-placés au démarrage d'un niveau

```js
initialBlocks: {
  blocks: {
    languageVersion: 0,
    blocks: [
      { type: 'p5_setup', x: 20, y: 20,
        next: { block: { type: 'p5_draw' } } }
    ],
  },
},
```

## Stack technique

- **[Blockly v10](https://developers.google.com/blockly)** — éditeur de blocs visuels (CDN)
- **[p5.js 1.9](https://p5js.org)** — dessin et animation, exécuté dans un iframe isolé (blob URL)
- **[CodeMirror 5](https://codemirror.net/5/)** — éditeur de code (thème Dracula)
- Vanilla JS, pas de framework, pas de build

## Lancer en local

```bash
npx serve .
```

Puis ouvrir `http://localhost:3000`.

> `node_modules/` n'est pas nécessaire pour l'application — tout charge depuis CDN. Il est uniquement présent pour `serve`.
