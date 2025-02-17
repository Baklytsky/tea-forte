module.exports = {
  stories: [
    '../src/docs/**/*.@(js|jsx|mdx)',
    '../src/**/*.stories.@(js|jsx|mdx)',
  ],
  addons: ['@storybook/addon-essentials', '@ljcl/storybook-addon-cssprops'],
  babel: async (options) => ({
    ...options,
    plugins: [['@babel/plugin-proposal-class-properties', { loose: true }]],
  }),
}
