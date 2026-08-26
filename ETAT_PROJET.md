# Creative Coding Lab — État du projet

> Dernière mise à jour : juin 2026

---

## Concept

Jeu pédagogique pour lycéens. Le fil rouge en trois actes :
1. **Coder soi-même** avec des blocs visuels, puis directement dans le code
2. **Confier à l'IA** une tâche — elle la fait parfois bien, parfois mal
3. **Débugger** le code de l'IA et comprendre que maîtriser le code, c'est savoir vérifier

Esthétique terminal vert sur fond noir. Vanilla JS, pas de framework, pas de build.

---

## Architecture

```
blockly/
├── index.html              — page unique, charge tout en CDN + scripts locaux
│
├── js/
│   ├── blocks.js           — définitions des blocs Blockly custom (p5.js)
│   ├── generators.js       — code JS généré par chaque bloc
│   ├── levels.js           — tableau LEVELS[] vide + helper getBuggyGameOfLife()
│   ├── engine.js           — machine à états (charge levels, gère steps, checks)
│   ├── runner.js           — exécution p5.js dans un iframe blob isolé
│   └── app.js              — init Blockly, CodeMirror, resize, boot
│
├── levels/                 — un fichier = un niveau (LEVELS.push({...}))
│   ├── level_01.js         ✅ actif
│   ├── level_02.js         ✅ actif
│   └── level_03.js         ✅ actif
│
├── css/styles.css
├── package.json            — `npm run dev` → serve sur :3000
│
└── notes & misc/
    ├── pensées.md          — idées / design / AI gamble
    └── todo.md             — retours post-présentation Namur
```

### Fichiers à ignorer / archivés
- `levels/level_033.js` — ancienne version anglaise du niveau 2 (non chargée)
- `levels/level_04.js` — écran de fin "lesson learned" (non chargée dans index.html)
- `js/levels/level1.js` — doublon du level 1 stocké comme `const` (non chargé)

---

## Stack technique

| Lib | Version | Usage |
|-----|---------|-------|
| [Blockly](https://developers.google.com/blockly) | 10.4.3 | éditeur de blocs (CDN) |
| [p5.js](https://p5js.org) | 1.9.4 | dessin/animation dans un iframe blob |
| [CodeMirror](https://codemirror.net/5/) | 5 (thème Dracula) | éditeur de code |

Aucun build. Tout tourne avec `npx serve .`.

---

## Moteur (engine.js)

### État global `ENGINE`
```js
{ levelIndex, stepIndex, level, workspace, codeEditor, blocks, code, aiUsed, loading, stepPassed }
```

### Cycle de vie
```
engineLoad(index)
  └─ ENGINE.level = LEVELS[index]
  └─ engineLoadStep(step)
       └─ affiche narrative (typewriter)
       └─ active la bonne section UI (blocks / code / ai-trap / debug / end)
       └─ configure CodeMirror (readOnly ou non)
       └─ runnerRun(code) si du code est déjà présent

Changement Blockly  → engineOnBlocksChange() → engineCheck()
Changement code     → engineOnCodeChange()   → engineCheck() + updateBugChecks()

engineCheck() → si step.check() passe → showWinMessage()
winAdvance()  → step suivant ou engineWin() si dernier step
```

### Types de step

| Type | Comportement |
|------|-------------|
| `blocks` | Blockly visible, CodeMirror read-only (miroir du code généré) |
| `code` | Blockly masqué, CodeMirror éditable, code injecté via `step.aiCode` |
| `ai-trap` | Bouton [ASK AI] visible, animation de typing, puis injection de code (potentiellement bugué) |
| `debug` | CodeMirror éditable, checklist de bugs, `updateBugChecks()` à chaque changement |
| `end` | Écran de conclusion, aucune interaction |

### Runner (iframe isolé)
- Chaque `runnerRun(code)` crée un blob HTML avec p5.js + le code utilisateur
- Erreurs remontées par `postMessage` → bannière rouge
- FPS affiché en temps réel via `postMessage`

---

## Niveaux actuels

### Level 01 — *Bonjour, un canevas s'il vous plait* (9 steps)
| Step | Type | Objectif |
|------|------|---------|
| 1 | blocks | Créer un canevas (setup + draw) |
| 2 | blocks | Ajouter un cercle dans draw() |
| 3 | blocks | Utiliser le bloc background |
| 4 | blocks | Changer la couleur du fond |
| 5 | blocks | Changer la couleur du cercle |
| 6 | **code** | Modifier le fill() directement dans le code → rouge `(255,0,0)` |
| 7 | **ai-trap** | Demander à l'IA de changer en bleu → IA réussit correctement |
| 8 | **ai-trap** | Demander à l'IA de changer le fond en blanc → IA injecte du code **bugué** |
| 9 | **debug** | Corriger la parenthèse manquante dans `background(255, 255, 255` |

**Bug niveau 1** : `background(255, 255, 255 ;` — parenthèse fermante manquante

---

### Level 02 — *quelque chose clique* (4 steps)
| Step | Type | Objectif |
|------|------|---------|
| 1 | blocks | Ajouter le bloc `p5_mouse_if` dans le workspace |
| 2 | blocks | Mettre un `fill()` dans le `if (mouseIsPressed)` |
| 3 | blocks | Remplir les deux branches `alors` + `sinon` |
| 4 | blocks | Remplacer les coords du cercle par `mouseX` / `mouseY` |

Toolbox : `level_2` (Setup, formes, interaction, couleurs)

---

### Level 03 — *game of life* (1 step, showcase)
- Type `code`, check toujours `false` → pas de condition de victoire
- Code du Game of Life (correct, non bugué) injecté directement
- L'élève observe et peut cliquer sur le canvas pour ajouter des cellules
- Sert de transition narrative vers le niveau debug (le vrai code sera bugué)

---

### Level 04 — *lesson learned* (non chargé)
- Écran de fin type `end`
- Existe dans `levels/level_04.js` mais **pas inclus** dans `index.html`
- À connecter quand le niveau debug du Game of Life sera prêt

---

## Blocs custom disponibles

Définis dans `blocks.js`, générateurs dans `generators.js` :

**Setup/Animation** : `p5_setup`, `p5_create_canvas`, `p5_draw`, `p5_framerate`  
**Dessin** : `p5_background`, `p5_fill`, `p5_stroke`, `p5_no_stroke`, `p5_circle`, `p5_rect`  
**Valeurs** : `p5_mousex`, `p5_mousey`, `p5_random`, `math_number`, `math_arithmetic`  
**Interaction** : `p5_mouse_if`  
**Game of Life** (définis mais peu utilisés) : `p5_grid_create`, `p5_grid_show`, `p5_grid_seed`, `p5_life_rules`...

---

## Ce qui manque / TODO

### Bugs connus (post-présentation Namur)
- [ ] Faute de frappe "dessinner" dans un texte
- [ ] Canvas pas centré dans la fenêtre / pas noir par défaut
- [ ] Checks parfois bancals (conditions trop strictes ou trop laxes)
- [ ] Erreurs affichées ≠ erreurs réelles (le message d'erreur peut être trompeur)
- [ ] Textes trop petits
- [ ] Nav des blocs peu intuitive (drag & drop pas évident pour les novices)

### Contenu manquant
- [ ] Level 03 "Game of Life debug" : le vrai niveau `ai-trap` → `debug` avec les 3 bugs du GoL (`widht`, self-count voisin, swap commenté)
- [ ] Level 04 "lesson learned" : brancher dans index.html
- [ ] Tutoriels entre les levels (popup d'explication)
- [ ] Tutoriel initial (interface + creative coding)

### UX / Interface
- [ ] Fenêtre win améliorée (modal à dismiss plutôt que timer)
- [ ] Progress bar plus claire (steps visibles)
- [ ] Proportions des panes (redimensionnement par défaut)
- [ ] Hints / indices progressifs (clippy-like)
- [ ] Griser les bugs déjà corrigés dans la checklist
- [ ] Navigation header mieux intégrée
- [ ] TTS (text-to-speech) pour la narration et les tâches

### Idée design : AI Gamble
Voir `notes & misc/pensées.md`. En résumé :
- 3 niveaux de demande IA (facile / moyen / "fais tout")
- Plus la demande est grosse, plus le risque de bugs augmente
- Option "go back" si catastrophe
- Bibliothèque de bugs réutilisable (déjà commencée dans `levels.js` avec `getBuggyGameOfLife()`)

---

## Déploiement

```bash
npm run dev   # local sur :3000
```

Site statique, zéro build. Hébergeable sur n'importe quelle plateforme (Netlify, GitHub Pages…) — `netlify.toml` est déjà configuré avec les redirects.

---

## Prochain chantier prioritaire

1. **Terminer le niveau 3** : transformer le step `code` (showcase) en enchaînement `code` → `ai-trap` → `debug` avec les 3 bugs du Game of Life
2. **Brancher level_04.js** dans index.html
3. **Corriger les checks** du level 2 (bancals selon commit)
4. **Fenêtre win** en modal (retour Namur)
