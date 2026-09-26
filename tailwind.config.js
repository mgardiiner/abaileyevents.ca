/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FAF6F0',
        cream: '#F3ECE2',
        blush: {
          DEFAULT: '#E8CFC4',
          deep: '#CFA294',
        },
        sage: {
          DEFAULT: '#7D8B74',
          deep: '#55624D',
        },
        forest: '#3C4637',
        ink: {
          DEFAULT: '#33302B',
          soft: '#4C483F',
          muted: '#5A564E',
          faint: '#8A857B',
        },
        gold: '#B99A5F',
      },
      fontFamily: {
        sans: ['Jost', 'Helvetica Neue', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        script: ['Great Vibes', 'cursive'],
      },
      maxWidth: {
        wrap: '1100px',
      },
      boxShadow: {
        nav: '0 1px 0 rgba(60,70,55,0.12)',
        menu: '0 14px 24px rgba(60,70,55,0.12)',
        lift: '0 18px 40px rgba(60,70,55,0.13)',
        featured: '0 12px 34px rgba(85,98,77,0.16)',
      },
      keyframes: {
        bob: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(8px)' },
        },
      },
      animation: {
        bob: 'bob 2.6s ease-in-out infinite',
      },
    },
  },
}
