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

    // Fix MDX file:// URL resolution issue in Storybook 10 with pnpm
    config.plugins?.push({
      name: 'fix-mdx-react-shim',
      enforce: 'pre',
      resolveId(source) {
        if (source.startsWith('file://') && source.includes('mdx-react-shim.js')) {
          return new URL(source).pathname
        }
        return null
      },
    })

    // Set base path for GitHub Pages deployment
    if (process.env.STORYBOOK_BASE) {
      config.base = process.env.STORYBOOK_BASE
    }

    return config
  }
}

export default config