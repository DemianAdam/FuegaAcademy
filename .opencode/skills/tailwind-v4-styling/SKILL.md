# tailwind-v4-styling

## Overview
Guidelines and rules for styling components using Tailwind CSS v4 and Material Design 3 tokens in Fuega Academy.

## Key Rules
1. **CSS-First Configuration:** Use Tailwind v4 `@import "tailwindcss";` in `src/index.css`. Custom theme variables and color tokens must be defined via CSS custom properties (`@theme`).
2. **Material Design 3 Tokens:** Adhere strictly to M3 color palettes, elevation shadows, and rounded radius tokens established in the project.
3. **Responsive Design:** Utilize mobile-first responsive utilities (`sm:`, `md:`, `lg:`, `xl:`).
4. **Clean Utility Composition:** Prefer semantic utility classes and avoid arbitrary values (`[]`) unless strictly necessary for exact dimensions or brand assets.
