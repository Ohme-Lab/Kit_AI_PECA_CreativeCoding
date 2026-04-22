LEVELS.push({
  id: 3,
  title: '03 / ask the AI, then fix it',
  win: '> all bugs fixed. it works.\n> the AI wrote 80 lines in 2 seconds.\n> you fixed them in 10 minutes.\n> that\'s the deal.',
  steps: [
    {
      type: 'ai-trap',
      story: [
        '> okay. next challenge: Conway\'s Game of Life.',
        '> cells live or die based on their neighbors.',
        '> 1600 cells. wrapping grid. sounds hard.',
        '> ...',
        '> or you could just ask AI.',
      ],
      task: 'click [ASK AI] to generate the code automatically',
      aiTyping: [
        'analyzing request...',
        'generating optimal solution...',
        'adding best practices...',
        'done! here\'s your Game of Life ✓',
      ],
      aiCode: getBuggyGameOfLife(),
      check: (s, code, engine) => engine.aiUsed === true,
      win: '> wow, AI wrote 80 lines instantly. surely it works.',
    },
    {
      type: 'debug',
      aiCode: getBuggyGameOfLife(),
      story: [
        '> it does not work.',
        '> the AI introduced 3 bugs.',
        '> find and fix them all.',
      ],
      task: 'fix 3 bugs — the output pane will show when it\'s working',
      bugs: [
        {
          id: 'typo',
          hint: 'bug 1 — there\'s a typo in a variable name (line ~14)',
          check: (code) => !code.includes('widht'),
        },
        {
          id: 'self',
          hint: 'bug 2 — the neighbor count includes the cell itself',
          check: (code) => code.includes('if (di===0 && dj===0) continue'),
        },
        {
          id: 'swap',
          hint: 'bug 3 — the grid never actually updates (look for a commented line)',
          check: (code) => !code.match(/\/\/.*\[grid.*nextGrid\]|\/\/.*nextGrid.*grid/),
        },
      ],
      check: (s, code) =>
        !code.includes('widht') &&
        code.includes('if (di===0 && dj===0) continue') &&
        !code.match(/\/\/.*\[grid.*nextGrid\]|\/\/.*nextGrid.*grid/),
      win: '> 3/3. it runs. you understood code that AI got wrong.',
    },
  ],
});
