const baseConfig = require('./workspace.config.cjs');

module.exports = {
  ...baseConfig,
  entry: [
    ...baseConfig.entry,
    {
      path: 'manuscript/frontmatter.md',
    },
  ],
  workspaceDir: '.vs-vfm',
  vfm: {
    hardLineBreaks: true,
    disableFormatHtml: true,
  },
};
