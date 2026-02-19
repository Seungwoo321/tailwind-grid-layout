import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|ts|tsx)',
  ],

  addons: ['@storybook/addon-links', '@storybook/addon-docs'],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  viteFinal: async (config) => {
    // Add Tailwind CSS v4 plugin
    const tailwindcss = await import('@tailwindcss/vite').then(m => m.default)
    config.plugins?.push(tailwindcss())

    // Set base path for GitHub Pages deployment
    if (process.env.STORYBOOK_BASE) {
      config.base = process.env.STORYBOOK_BASE
    }

    return config
  }
}

export default config