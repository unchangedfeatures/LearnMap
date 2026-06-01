---
name: LearnMap Lumina
colors:
  surface: '#0d1323'
  surface-dim: '#0d1323'
  surface-bright: '#33394a'
  surface-container-lowest: '#080e1d'
  surface-container-low: '#151b2b'
  surface-container: '#191f30'
  surface-container-high: '#242a3a'
  surface-container-highest: '#2e3446'
  on-surface: '#dde2f9'
  on-surface-variant: '#c4c5d7'
  inverse-surface: '#dde2f9'
  inverse-on-surface: '#2a3041'
  outline: '#8e8fa1'
  outline-variant: '#444655'
  surface-tint: '#bac3ff'
  primary: '#bac3ff'
  on-primary: '#00218d'
  primary-container: '#4361ee'
  on-primary-container: '#f4f2ff'
  inverse-primary: '#2e4edc'
  secondary: '#ccbdff'
  on-secondary: '#350097'
  secondary-container: '#4f1cc8'
  on-secondary-container: '#bfadff'
  tertiary: '#84d98f'
  on-tertiary: '#003914'
  tertiary-container: '#297f3f'
  on-tertiary-container: '#d5ffd5'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dee1ff'
  primary-fixed-dim: '#bac3ff'
  on-primary-fixed: '#001159'
  on-primary-fixed-variant: '#0031c4'
  secondary-fixed: '#e7deff'
  secondary-fixed-dim: '#ccbdff'
  on-secondary-fixed: '#1f0060'
  on-secondary-fixed-variant: '#4d17c5'
  tertiary-fixed: '#9ff6a9'
  tertiary-fixed-dim: '#84d98f'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005320'
  background: '#0d1323'
  on-background: '#dde2f9'
  surface-variant: '#2e3446'
  space-deep: '#0F1525'
  space-indigo: '#1A2456'
  glass-border: rgba(255, 255, 255, 0.2)
  glass-fill: rgba(255, 255, 255, 0.1)
  synapse-glow: rgba(67, 97, 238, 0.4)
  text-on-dark: '#ffffff'
  text-muted: '#eef0f9'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  guide-text:
    fontFamily: Literata
    fontSize: 17px
    fontWeight: '400'
    lineHeight: '1.8'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  stack-sm: 8px
  stack-md: 16px
  gutter: 16px
  margin-mobile: 20px
  stack-lg: 24px
  safe-area-bottom: 34px
---

## Brand & Style
LearnMap is an immersive educational platform designed to make complex knowledge feel interconnected and accessible. The brand identity sits at the intersection of **Futuristic Science** and **Academic Elegance**, evoking a sense of wonder, clarity, and personalized growth.

The visual style is a sophisticated blend of **Glassmorphism** and **Modern Corporate**. It utilizes deep, celestial backgrounds, vibrant glowing accents, and high-transparency layers to create a "digital cockpit" for learning. The interface should feel like a premium, quiet space for focus, illuminated by the light of discovery. Key visual motifs include node-graph particle systems, ambient blue glows (representing "synapses"), and subtle floating animations that suggest a living, breathing knowledge base.

## Colors
The palette is dominated by a **Deep Space Gradient** moving from a near-black foundation (`#0F1525`) to a rich, saturated indigo (`#1A2456`). This provides a high-contrast stage for the interactive elements.

- **Primary Highlighting:** The "Lumina Blue" (`#4361ee`) is used for core actions, branding, and connectivity indicators. It is often accompanied by a glow effect to simulate light emission.
- **Glass Surfaces:** Interactive secondary elements use a translucent white stack (10% fill, 20% border) to maintain the depth of the background while providing clear hit areas.
- **Typography Colors:** Pure white is reserved for high-level headings, while `inverse-on-surface` (`#eef0f9`) at 80% opacity is used for instructional text to reduce eye strain in dark mode.

## Typography
The system uses a functional pairing of **Inter** and **Literata**.

- **Inter** handles the structural UI, heavy-hitting displays, and compact labels. Its high x-height ensures legibility even when rendered on translucent glass backgrounds.
- **Literata** is introduced for "Guide Text" or "Narrative Text." This serif addition adds a scholarly, human touch to the high-tech aesthetic, making instructions feel like a conversation rather than a manual.
- **Letter Spacing:** Display headings use tight tracking (`-0.02em`) for a modern, impactful look, while labels use wide tracking (`0.05em`) to ensure clarity at small sizes.

## Layout & Spacing
The layout follows a **Fluid Grid** model with strict horizontal margins and a vertical "Safe Stack" rhythm.

- **Mobile Constraint:** Content is optimized for a 390px fluid container.
- **Horizontal Rhythm:** Standard 20px side margins (`margin-mobile`) ensure content doesn't bleed into device edges.
- **Vertical Rhythm:** Elements are grouped using an 8px base grid. `stack-lg` (24px) separates major sections (e.g., Logo to Headline), while `stack-sm` (8px) handles internal grouping (e.g., Button to Button).
- **Masking:** Horizontal scrolling areas (like subject pills) use a gradient mask on the edges to signal continuity without breaking the clean vertical alignment of the page.

## Elevation & Depth
Depth is created through **Light and Transparency** rather than traditional drop shadows.

- **Atmospheric Depth:** A particle canvas sits behind the UI, creating a sense of infinite z-space.
- **Luminous Elevation:** The primary action buttons use a tinted blue shadow (`rgba(67, 97, 238, 0.2)`) to appear as if they are resting on a bed of light. 
- **Backdrop Blurs:** Secondary elements like pills use `backdrop-blur-md` to "lift" them from the background while maintaining a color connection to the indigo gradient beneath.
- **The Glow:** Central brand icons utilize an `icon-glow` effect (40px blur) to serve as a focal point and light source for the screen.

## Shapes
The shape language is **Soft-Geometric**.

- **Containers:** Buttons and main cards use `rounded-xl` (12px or 0.75rem) to balance modern sharpness with approachable softness.
- **Subject Pills:** These use the `full` (pill) radius to distinguish them as categorized, selectable tags.
- **App Icon:** A custom `16px` radius is used for the central icon container, creating a distinct "Squircle-lite" appearance that feels proprietary and polished.

## Components

### Buttons
- **Primary:** High-contrast background (`primary-container`), bold Inter typography, and a luminous shadow.
- **Secondary/Ghost:** 1.5px border using `inverse-primary`, with a subtle `white/5` hover state and backdrop blur.

### Subject Pills
- Rounded-full containers with a `white/10` fill and `white/20` border. Text is `label-caps` for a technical, organized feel. They should feel light and airy.

### Icons
- Utilize **Material Symbols Outlined**. In branding contexts, icons are paired with a background container and a glow effect. In functional contexts, they maintain a thin 100-200 weight to match the refined Inter typography.

### Interactives
- **Particles:** A canvas-based node-graph system with connections that fade based on distance, reinforcing the "interconnected learning" metaphor.
- **Animations:** A 6-second "float" animation for central content blocks to give the UI a weightless, premium feel.