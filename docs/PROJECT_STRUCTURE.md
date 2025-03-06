# Project structure

```zsh
my-project/
├── public/                          # Static files served as-is at the root (for Vercel/GitHub Pages)
│   ├── index.html                   # Main HTML file
│   ├── favicon.ico
│   └── assets/                      # Public assets (images, fonts, etc.)
│       ├── images/
│       └── fonts/
├── src/                             # All application source code
│   ├── assets/                      # Asset files managed via import in your code
│   │   ├── css/                     # Custom CSS files
│   │   │   └── main.css             # Global stylesheet with Tailwind directives (@tailwind base, components, utilities)
│   │   └── images/                  # Images used inside components/pages
│   ├── components/                  # Reusable UI components
│   │   ├── common/                  # Common elements (Button, Card, Modal, etc.)
│   │   ├── layout/                  # Layout components (Header, Footer, Navbar, etc.)
│   │   └── animations/              # Animation wrappers or motion components (e.g., Framer Motion)
│   ├── context/                     # React Context providers (global state, themes, etc.)
│   ├── hooks/                       # Custom hooks for reusability (e.g., useAuth, useFetch)
│   ├── pages/                       # Page-level components for routing (each file represents a page)
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   └── Contact.jsx
│   ├── routes/                      # Route configuration (if using react-router-dom)
│   │   └── AppRoutes.jsx
│   ├── styles/                      # Additional global styles or Tailwind overrides
│   │   └── variables.css
│   ├── App.jsx                      # Root component (handles layout, global providers, etc.)
│   └── main.jsx                     # Entry point (renders application into the DOM)
├── .eslintrc.js                     # ESLint configuration for code quality
├── tailwind.config.js               # Tailwind CSS configuration (include content paths)
├── postcss.config.js                # PostCSS configuration (includes autoprefixer, cssnano for production)
├── vite.config.js                   # Vite configuration (adjust base path for GitHub Pages if necessary)
├── package.json                     # npm scripts and dependencies
└── README.md                        # Project documentation
```
