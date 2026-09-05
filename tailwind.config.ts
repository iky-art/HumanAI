import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Base — deep ink navy, not a flat near-black.
        ink: {
          DEFAULT: '#12141C',
          raised: '#191C26',
          card: '#1E212C',
          border: '#2A2E3B',
        },
        paper: '#F3F1EA', // used sparingly, for light-context surfaces only
        // Cool signal colors — inherited from the HumanAI logo, used
        // deliberately (borders, small accents) rather than as glows
        // washed across every surface.
        signal: {
          blue: '#3E63FF',
          magenta: '#C13FDE',
        },
        // Warm accent — reserved specifically for anything that marks
        // a *human* touch (operator badges, "human" labels, the human
        // stat card). Cool = AI-like surface. Warm = the human part.
        human: {
          DEFAULT: '#F2A65A',
          dim: '#8A5A2E',
        },
        ash: {
          100: '#E7E8ED',
          300: '#9A9EAF',
          500: '#6B6F7F',
        },
        danger: '#E5584A',
      },
      fontFamily: {
        // Serif carries headline personality; Inter stays quiet for body.
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '18px',
      },
    },
  },
  plugins: [],
} satisfies Config;
