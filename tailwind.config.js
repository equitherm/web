import fluid, { extract, screens, fontSize } from 'fluid-tailwind'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: {
    files: [
      './index.html',
      './src/**/*.{js,ts,jsx,tsx}',
    ],
    extract,
  },
  theme: {
  	extend: {
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			success: {
  				DEFAULT: 'hsl(var(--success))',
  				foreground: 'hsl(var(--success-foreground))'
  			},
  			hot: 'hsl(var(--hot))',
  			cold: 'hsl(var(--cold))',
  			cool: 'hsl(var(--cool))',
  			warning: {
  				DEFAULT: 'hsl(var(--warning))',
  				foreground: 'hsl(var(--warning-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontFamily: {
  			display: [
  				'JetBrains Mono',
  				'SF Mono',
  				'monospace'
  			],
  			ui: [
  				'DM Sans',
  				'Inter',
  				'sans-serif'
  			],
  			mono: [
  				'IBM Plex Mono',
  				'JetBrains Mono',
  				'monospace'
  			]
  		},
  		fontSize: {
  			'2xs': [
  				'0.6875rem',
  				{
  					lineHeight: '1rem'
  				}
  			]
  		},
  		transitionDuration: {
  			fast: 'var(--duration-fast)',
  			normal: 'var(--duration-normal)',
  			medium: '300ms',
  			slow: 'var(--duration-slow)'
  		},
  		boxShadow: {
  			'glow-heating': 'var(--glow-heating)',
  			'glow-cooling': 'var(--glow-cooling)',
  			'glow-focus': 'var(--glow-focus)',
  			'card': 'var(--shadow-card)',
  		},
  		zIndex: {
  			dropdown: '100',
  			sticky: '500',
  			modal: '1000',
  			tooltip: '9999'
  		},
  		containers: {
  			xs: '320px',
  			sm: '384px',
  			md: '448px',
  			lg: '512px',
  			xl: '576px',
  			'2xl': '672px'
  		},
  		height: {
  			dvh: '100dvh',
  			svh: '100svh',
  			lvh: '100lvh'
  		},
  		minHeight: {
  			touch: '2.75rem'
  		},
  		maxHeight: {
  			dvh: '100dvh',
  			svh: '100svh',
  			lvh: '100lvh'
  		},
  		spacing: {
  			touch: '2.75rem'
  		},
  		minWidth: {
  			touch: '2.75rem'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [
    fluid, // Add fluid-tailwind plugin
    require('@tailwindcss/container-queries'),
  ],
}
