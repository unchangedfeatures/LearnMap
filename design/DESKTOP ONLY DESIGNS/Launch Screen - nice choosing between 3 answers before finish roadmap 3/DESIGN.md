---
name: Cognitive Flow Desktop
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#444655'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#747686'
  outline-variant: '#c4c5d7'
  surface-tint: '#2e4edc'
  primary: '#2346d5'
  on-primary: '#ffffff'
  primary-container: '#4361ee'
  on-primary-container: '#f4f2ff'
  inverse-primary: '#bac3ff'
  secondary: '#4c45d5'
  on-secondary: '#ffffff'
  secondary-container: '#6561f0'
  on-secondary-container: '#fffbff'
  tertiary: '#933c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#ba4e00'
  on-tertiary-container: '#fff1eb'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dee1ff'
  primary-fixed-dim: '#bac3ff'
  on-primary-fixed: '#001159'
  on-primary-fixed-variant: '#0031c4'
  secondary-fixed: '#e2dfff'
  secondary-fixed-dim: '#c2c1ff'
  on-secondary-fixed: '#0e006a'
  on-secondary-fixed-variant: '#352ac0'
  tertiary-fixed: '#ffdbcb'
  tertiary-fixed-dim: '#ffb692'
  on-tertiary-fixed: '#341100'
  on-tertiary-fixed-variant: '#793000'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-xl:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.02em
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: '0'
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: '0'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: '0'
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 0.5rem
  sm: 1rem
  md: 1.5rem
  lg: 2.5rem
  xl: 4rem
  gutter: 24px
  margin: 48px
  max-width: 1440px
---

## Brand & Style
The brand personality focuses on mental clarity, productivity, and streamlined cognitive processing. The target audience consists of knowledge workers and power users who require a high-information-density environment that remains legible and low-friction.

The design style is **Corporate / Modern** with a lean towards **Minimalism**. It prioritizes extreme functional clarity through generous whitespace, a systematic grid, and a focus on high-quality typography. The UI should evoke a sense of calm efficiency and technical precision, using subtle depth to organize complex information without overwhelming the user's focus.

## Colors
The color palette is anchored by a vibrant, high-energy primary blue (#4361EE) used for core actions and active states. The secondary blue provides depth for hover states and secondary emphasis. 

The neutral palette is biased toward cool slates and off-whites to maintain a clean, "laboratory" aesthetic. Surface colors use slight tonal shifts rather than heavy lines to distinguish between different functional areas of the interface.

## Typography
The typography system uses **Inter** across all roles to maintain a systematic, utilitarian feel. For desktop, the scale is expanded to accommodate larger viewing distances and monitor sizes.

- **Display levels** are reserved for landing pages and high-impact dashboards.
- **Body-lg** is the default for long-form reading to ensure a comfortable line-length (60-75 characters) and optimal legibility.
- **Letter spacing** is slightly tightened on larger headings to maintain visual tension and loosened on labels for clarity at small sizes.

## Layout & Spacing
This design system utilizes a **12-column Fixed Grid** for desktop environments. The layout is centered on the screen once the viewport exceeds 1440px.

- **Grid Logic:** 12 columns with 24px gutters. Content should span columns in increments of 3, 4, 6, or 12 to maintain mathematical harmony.
- **Spacing Rhythm:** An 8px linear scale is used. For desktop, internal component padding is increased (md/1.5rem) to provide a more premium, airy feel compared to compact mobile views.
- **Margins:** Outer page margins are set to a minimum of 48px to prevent content from touching the edges of the browser window.

## Elevation & Depth
Depth is communicated through **Tonal Layers** supplemented by **Ambient Shadows**. 

- **Surface Levels:** The background uses the neutral base. Cards and primary containers use a pure white surface to "pop" forward.
- **Shadow Character:** Shadows are extremely diffused with low opacity (maximum 8%) and a subtle blue tint derived from the primary color to maintain brand cohesion. 
- **Interaction:** On hover, elements slightly increase their shadow spread and lift (Y-axis offset) to provide tactile feedback without utilizing heavy borders.

## Shapes
The shape language is defined by the `rounded-xl` standard. This softens the technical nature of the Inter typeface and the rigid 12-column grid.

- **Containers:** Large layout sections and cards use 1.5rem (24px) corner radii.
- **Components:** Buttons and input fields use 0.5rem (8px) to maintain a professional, clickable appearance.
- **Consistency:** Never mix sharp corners with rounded corners; all visible containers must adhere to the defined radius tokens.

## Components
- **Buttons:** Primary buttons use the primary color with white text. Desktop buttons have a minimum height of 48px and horizontal padding of 24px.
- **Input Fields:** Use a 1px border in a light neutral shade. On focus, the border transitions to the primary color with a 3px soft focus ring.
- **Cards:** Cards are the primary container. They feature a 1.5rem corner radius and the "Ambient Shadow" for elevation. Internal padding should be at least 32px (lg).
- **Navigation:** A persistent sidebar or top navigation bar should use a slightly greyed background (Neutral #F8FAFC) to distinguish the "tool" area from the "workspace" area.
- **Chips/Badges:** Use highly rounded (pill-shaped) borders with low-saturation backgrounds of the primary color for status indicators.