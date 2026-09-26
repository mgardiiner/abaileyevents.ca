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
        ink: '#33302B',
        gold: '#B99A5F',
      },
      fontFamily: {
        sans: ['Jost', 'Helvetica Neue', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        script: ['Great Vibes', 'cursive'],
      },
    },
  },
}
