LEVELS.push({
        id: 1,
        title: "01 / Bonjour, un canevas s'il vous plait",
        steps: [
        {
            //step 1: create canevas (setup() and draw() functions already on place)
            type: 'blocks',
            toolbox: 'level_1',
            initialBlocks: {
                blocks: {
                    languageVersion: 0,
                    blocks: [
                        {type: 'p5_setup', x: 20, y: 20,
                            next: {block : {type: 'p5_draw', x: 20, y: 100,}}
                        },
                    ],
                },
            },
            story: [
            '> Tout commence par un espace de dessin.',
            '> Avant de créer des formes, il faut créer le monde où elles apparaîtront.',
            ],
            task: 'Créer un canevas.',

            check: (s, code) =>
            /function setup\s*\(\s*\)\s*\{[\s\S]*\}/.test(code) &&
            /function draw\s*\(\s*\)\s*\{[\s\S]*\}/.test(code),

            win: '> Parfait. Ton monde existe maintenant.',
        },
        {
            //step 2: add a circle in draw()
            type: 'blocks',
            toolbox: 'level_1',
            story: [
            '> Une seule forme peut déjà devenir un programme. On commence par afficher un rond simple.',
            ],
            task: 'Faire apparaître un rond au centre du canevas.',

            check: (s, code) => {                        
                const draw = code.match(/function draw\s*\(\s*\)\s*\{([\s\S]*?)\}/);                                                          
                return draw && draw[1].includes('circle(');                                                                                                                                                                                     
            },   
            win: '> Bien. Une première forme apparaît.',
        },
        {
            //step 3: add background
            type: 'blocks',
            toolbox: 'level_1',
            story: [
            '> Préparons le monde pour nos formes. Un fond sombre fera mieux ressortir les couleurs vives de nos cercles.',
            '> Place le block background dans [setup] pour qu\'il s\'applique une fois au début.',
            ],
            task: 'Utiliser le bloc [Background].',
            

            check: (s, code) => /background\(/.test(code), 
            win: '> Parfait. Plus qu\'à changer la couleur.',
        },
        {
            //step 4: add background color
            type: 'blocks',
            toolbox: 'level_1',
            story: [
            '> Changeons la couleur du fond, le noir est un peu triste.',
            ],
            task: 'Changer la couleur du background (🎨).',

            check: (s, code) => /background\(/.test(code) && !code.includes('10, 10, 10'),
            win: '> Parfait. Le canevas est maintenant bien visible.',
        },
        {
            //step 5: change fill color
            type: 'blocks',
            toolbox: 'level_1',
            story: [
            '> Une même forme peut avoir plusieurs apparences. Une petite modification peut changer toute l’ambiance.',
            '> Essayons une autre couleur pour le cercle',
            ],
            task: 'Changer la couleur du cercle',

            check: (s, code) =>                                                                                                                                           
            /fill\(/.test(code) && !code.includes('57, 255, 20'),
            win: '> Oui. Même forme, nouvelle couleur.',
        },
        {
            //step 6: fill color via code instead of blocks
            type: 'code',
            toolbox: 'level_1',
            story: [
                '> Les blocs et le code racontent la même chose de deux façons différentes. Cette fois, la modification se fait dans le code.',
                '> Changeons la couleur du cercle en modifiant le code de draw(), comment avoir du rouge ?',
            ],
            task: 'Changer la couleur du cercle',

            check: (s, code) => /fill\(/.test(code) && code.includes('255, 0, 0'),
            win: '> Très bien. Tu changes maintenant directement le code.',
        },
        {
            //step 7: ask ai normally
            type: 'ai-trap',
            story: [
                '> Tu peux aussi demander à l’IA de modifier un programme très simple. Ici, on lui demande un petit changement facile à vérifier.',
            ],
            task: 'Demander à l\'IA de changer la couleur du cercle en bleu.',

            aiTyping: [
            'analyse de la demande...',
            'lecture des fichiers...',
            'génération intense...',
            'blip bloup ! J\'ai changé le code pour que le cercle soit bleu. C\'est fait !',
            ],
            aiCode: (code) => code.replace(/fill\([^)]*\)/, 'fill(0, 0, 255)'),

            check: (s, code, engine) => engine.aiUsed === true,
            win: '> Nickel. L\'IA a fait le changement pour toi, et c\'est exactement ce que tu voulais.',

        },
        {
            //step 8: ask ai with a buggy request
            type: 'ai-trap',
            story: [
            '> okay. On va essayer autre chose, demande à la machine de changer le fond en blanc !',
            ],
            task: 'click [ASK AI] to generate the code automatically',
            aiTyping: [
            'Réflexion hyper intense en cours...',
            'Génération des meilleures lignes de code pour ce changement...',
            'Optimisation du code pour une performance maximale...',
            'C\'est fait ! Le fond est maintenant blanc, admire le résultat !',
            ],
            aiCode: getBuggyLevel1(),

            check: (s, code, engine) => engine.aiUsed === true,
            win: "> Ah nan ! On dirait qu'il y a un bug. J'ai l'impression qu'il manque une parenthèse. Tu peux vérifier ça ?",
        },
        {
            //step 9: debug ai code
            type: 'debug',
            story: [
            "> Bon, le changement est là, mais il y a un bug dans le code que l\'IA a généré.",
            "> Ça devrait aller vite, il suffit de trouver la parenthèse manquante. C\'est un bug facile à repérer",
            ],
            task: 'Trouver et corriger le bug dans le code généré par l\'IA.',
            aiCode: getBuggyLevel1(),
            bugs: [
            {
                id: 'parenthese',
                hint: 'bug 1 — il manque une parenthèse dans background(255, 255, 255',
                check: (code) => code.includes('background(255, 255, 255)'),
            },
            ],
            check: (s, code) => code.includes('background(255, 255, 255)'),

            win: '> Ok on a quelque chose qui marche ! On a compris les bases, passons au niveau suivant.',
        },
        ],
    },
  );

function getBuggyLevel1() {
  return `function setup() {
  createCanvas(400, 400);
  background(255, 255, 255 ;
}
function draw() {
  fill(0, 0, 255);
  circle(200, 200, 60);
}`;
}