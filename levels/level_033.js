LEVELS.push({
  id: 2,
  title: '02 / follow the mouse',
  win: '> it follows. draw() runs every frame — that\'s why it works.',
  steps: [
    {
      type: 'blocks',
      toolbox: 'basic',
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
        '> first, add the [Every frame] block.',
      ],
      task: 'drag [Every frame] into the workspace',
      check: (s) => s.has('p5_draw'),
      win: '> good. now use it.',
    },
    {
      type: 'blocks',
      toolbox: 'basic',
      story: [
        '> now put the circle inside [Every frame].',
        '> use mouseX / mouseY for x and y.',
        '> ⚠ mouseX only works inside [Every frame], not setup.',
      ],
      task: 'circle inside draw() with mouseX and mouseY',
      check: (s, code) => {
        const body = code.match(/function draw\s*\(\s*\)\s*\{([\s\S]*)\}/);
        return body && body[1].includes('mouseX') && body[1].includes('mouseY');
      },
      win: '> mouse controls the circle. setup() runs once — draw() runs forever.',
    },
  ],
});
