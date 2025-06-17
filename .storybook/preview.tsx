import type { Preview } from '@storybook/react'
import React from 'react'
import './preview.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="p-8 min-h-screen bg-gray-50">
        <Story />
      </div>
    ),
  ],
}

export default preview