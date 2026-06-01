---
name: Cognitive Flow
colors:
  surface: '#f9f9ff'
  surface-dim: '#d7dae2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3fc'
  surface-container: '#ebeef6'
  surface-container-high: '#e6e8f1'
  surface-container-highest: '#e0e2eb'
  on-surface: '#181c22'
  on-surface-variant: '#444655'
  inverse-surface: '#2d3037'
  inverse-on-surface: '#eef0f9'
  outline: '#747686'
  outline-variant: '#c4c5d7'
  surface-tint: '#2e4edc'
  primary: '#2346d5'
  on-primary: '#ffffff'
  primary-container: '#4361ee'
  on-primary-container: '#f4f2ff'
  inverse-primary: '#bac3ff'
  secondary: '#6339db'
  on-secondary: '#ffffff'
  secondary-container: '#7d56f5'
  on-secondary-container: '#fffbff'
  tertiary: '#006529'
  on-tertiary: '#ffffff'
  tertiary-container: '#0d8038'
  on-tertiary-container: '#d1ffd1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dee1ff'
  primary-fixed-dim: '#bac3ff'
  on-primary-fixed: '#001159'
  on-primary-fixed-variant: '#0031c4'
  secondary-fixed: '#e7deff'
  secondary-fixed-dim: '#ccbdff'
  on-secondary-fixed: '#1f005f'
  on-secondary-fixed-variant: '#4d17c5'
  tertiary-fixed: '#92f9a1'
  tertiary-fixed-dim: '#77dc87'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005320'
  background: '#f9f9ff'
  on-background: '#181c22'
  surface-variant: '#e0e2eb'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  guide-text:
    fontFamily: Literata
    fontSize: 17px
    fontWeight: '400'
    lineHeight: '1.8'
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
  margin-mobile: 20px
  gutter: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
  safe-area-bottom: 34px
---

## Brand & Style
The design system focuses on a **Modern Corporate** aesthetic with a "Smart Assistant" personality. It prioritizes clarity and cognitive ease to support an AI-driven learning environment. The interface uses high-quality whitespace and intentional typographic hierarchy to organize complex educational data into digestible "learning paths."

The style is defined by:
- **Clarity:** Uncluttered layouts that reduce learning fatigue.
- **Intelligence:** Systematic use of color to denote progress and AI-generated insights.
- **Approachability:** Softened geometry and fluid transitions that make the AI feel like a mentor rather than a machine.

## Colors
The palette is rooted in a "Logic Blue" and "Insight Purple" pairing. Blue represents the foundational platform stability, while Purple is used exclusively for AI-driven features, personalized recommendations, and "Aha!" moments. 

**Semantic Usage:**
- **Primary (Blue):** Primary actions, navigation, and system-level feedback.
- **Secondary (Purple):** AI interactions, path milestones, and premium content.
- **Success/Warning/Danger:** Used sparingly for progress completion, time-sensitive reminders, and error states respectively.
- **Surface Strategy:** In Light Mode, use the App Background (#F4F6FF) to create natural depth behind white cards. In Dark Mode, use the Surface (#1A1D27) to provide contrast against the deep black background.

## Typography
This design system employs a dual-typeface strategy. **Inter** is the workhorse font, used for all functional UI elements, headers, and system feedback to maintain a professional, tech-forward feel.

For long-form educational content (Guide Content), the system switches to **Literata**. This serif face is specifically optimized for digital reading, reducing eye strain during deep learning sessions.

**Key Rules:**
- Use **Display-LG** for welcome screens and major section starts.
- Use **Guide-text** exclusively for the primary learning content area to distinguish "content" from "interface."
- **Label-caps** should be used for category tags and small metadata.

## Layout & Spacing
The layout follows a **Fluid Grid** model optimized for the iPhone 14 Pro (390px width). 

- **Grid:** Use a 4-column layout for mobile content.
- **Margins:** A strict 20px side margin ensures content does not feel cramped against the bezel.
- **Vertical Rhythm:** Elements are stacked using multiples of 8px. Use 24px (stack-lg) to separate major sections and 16px (stack-md) for internal card components.
- **AI-Personalization:** Content blocks that are "AI-Recommended" should utilize a slightly wider 24px gutter to stand out from standard curriculum items.

## Elevation & Depth
Hierarchy is established through **Tonal Layers** and **Ambient Shadows**.

- **Level 0 (Background):** #F4F6FF. The canvas.
- **Level 1 (Cards/Surface):** White (#FFFFFF) with a soft 10% opacity shadow (Blur: 20px, Y: 4px). This is for standard learning modules.
- **Level 2 (Active/Floating):** Use a slightly more pronounced shadow (15% opacity) for elements currently being interacted with or floating action buttons.
- **Glassmorphism (Overlay):** Bottom sheets and top navigation bars use a background-blur (20px) with 90% surface opacity to maintain context of the content underneath.

## Shapes
The shape language is "Friendly-Geometric." We use varying radii to imply container hierarchy:

- **12px (Medium):** Standard for interactive components like Buttons and Input fields. It provides a modern, approachable look without being overly "bubbly."
- **16px (Large):** Reserved for Cards and content containers. This larger radius helps distinguish "passive" content from "active" buttons.
- **20px (Extra Large):** Applied to the top corners of Bottom Sheets and Modals to signify a distinct layer change in the application flow.

## Components

### Buttons
- **Primary:** Filled with Blue (#4361EE), 12px radius, Inter Bold.
- **Ghost:** 1.5px border matching the primary color, 12px radius.
- **Text:** No container, Purple (#7048E8) for AI-related actions, Blue for system actions.

### Inputs
- **Standard:** 1.5px border in Light Gray (or Surface-2 in dark mode), 12px radius. 
- **Focus State:** Border color shifts to Primary Blue with a 2px outer glow.

### Cards
- 16px radius. Subtle shadow (Level 1).
- Use a 2px top-accent bar in Purple for "AI-Generated" lessons.

### Progress Bars
- 8px height, fully rounded ends. 
- Background is a 10% opacity version of the accent color; fill is the 100% solid accent.

### Bottom Sheets
- 20px top-left and top-right radius.
- Include a 40x4px centered "drag handle" at the top with 20% opacity.

### Badges & Chips
- 4px radius (small) or Pill-shaped (status).
- Backgrounds should be 12% opacity of the semantic color (e.g., Light Success Green) with 100% opacity text for maximum readability.