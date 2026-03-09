import type { ThemeRegistration } from 'shiki'

/**
 * Custom Shiki theme that maps syntax highlighting colors to the app's
 * Tailwind CSS custom properties (defined in themes.css).
 *
 * This ensures the YAML output display matches the shadcn/ui aesthetic
 * and responds to light/dark theme switching.
 */
export const equithermTheme: ThemeRegistration = {
  name: 'equitherm',
  type: 'dark',

  // Editor colors - using CSS custom properties
  colors: {
    'editor.background': 'hsl(var(--card))',
    'editor.foreground': 'hsl(var(--foreground))',
    'editorLineNumber.foreground': 'hsl(var(--muted-foreground))',
    'editor.selectionBackground': 'hsl(var(--primary) / 0.2)',
    'editor.inactiveSelectionBackground': 'hsl(var(--primary) / 0.1)',
    'editor.lineHighlightBackground': 'hsl(var(--muted) / 0.5)',
    'editorCursor.foreground': 'hsl(var(--primary))',
    'editorWhitespace.foreground': 'hsl(var(--muted-foreground) / 0.3)',
  },

  // TextMate scope theming
  tokenColors: [
    {
      scope: ['comment', 'punctuation.definition.comment'],
      settings: {
        foreground: 'hsl(var(--muted-foreground))',
        fontStyle: 'italic',
      },
    },
    {
      scope: ['keyword', 'keyword.control', 'keyword.other'],
      settings: {
        foreground: 'hsl(var(--primary))',
      },
    },
    {
      scope: ['string', 'string.quoted', 'string.unquoted'],
      settings: {
        foreground: 'hsl(var(--accent))',
      },
    },
    {
      scope: ['constant.numeric', 'number'],
      settings: {
        foreground: 'hsl(var(--ring))',
      },
    },
    {
      scope: ['entity.name.tag', 'variable.other'],
      settings: {
        foreground: 'hsl(var(--foreground))',
      },
    },
    {
      scope: ['punctuation', 'punctuation.separator', 'punctuation.accessor'],
      settings: {
        foreground: 'hsl(var(--muted-foreground))',
      },
    },
    {
      scope: ['entity.other.attribute-name'],
      settings: {
        foreground: 'hsl(var(--primary) / 0.9)',
      },
    },
    {
      scope: ['meta.property-list', 'meta.mapping'],
      settings: {
        foreground: 'hsl(var(--foreground))',
      },
    },
    // YAML-specific scopes
    {
      scope: ['entity.name.tag.yaml'],
      settings: {
        foreground: 'hsl(var(--primary))',
      },
    },
    {
      scope: ['string.quoted.double.yaml', 'string.unquoted.yaml'],
      settings: {
        foreground: 'hsl(var(--accent))',
      },
    },
    {
      scope: ['constant.language.boolean.yaml', 'constant.language.null.yaml'],
      settings: {
        foreground: 'hsl(var(--ring))',
        fontStyle: 'bold',
      },
    },
  ],
}
