import React, { useState } from 'react';
import { Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../../store/themeStore';
//Modern Tech Minimal,Royal Premium,  Ocean Blue,  Forest Green,  Midnight Dark,  
// Sunset Orange,  Lavender Purple,  Arctic White,  Emerald Green,  Crimson Red,  
// Golden Yellow,  Steel Gray,  Coral Pink,  Sky Blue
const presetThemes = [
  {
    name: 'Modern Tech Minimal',
    colors: {
      bg: '#fefae0',
      surface: '#e9edc9',
      card: '#faedcd',
      primary: '#d4a373',
      secondary: '#ccd5ae',
      accent: '#777567',
      text: '#33312b',
      muted: '#545248',
      border: '#c4c0ab',
    },
  },
  // {
  //   name: 'Royal Premium',
  //   colors: {
  //     bg: '#ede8d0',
  //     surface: '#c4c0ab',
  //     card: '#9d9988',
  //     primary: '#777567',
  //     secondary: '#545248',
  //     accent: '#33312b',
  //     text: '#141410',
  //     muted: '#545248',
  //     border: '#777567',
  //   },
  // },
  {
    "name": "Ocean Blue",
    "colors": {
      "bg": "#f0f8ff",
      "surface": "#d6eaf8",
      "card": "#aed6f1",
      "primary": "#3498db",
      "secondary": "#2874a6",
      "accent": "#1b4f72",
      "text": "#154360",
      "muted": "#5499c7",
      "border": "#85c1e9"
    }
  },{
    "name": "Forest Green",
    "colors": {
      "bg": "#e8f8f5",
      "surface": "#d5f4e6",
      "card": "#a9dfbf",
      "primary": "#27ae60",
      "secondary": "#229954",
      "accent": "#1e8449",
      "text": "#145a32",
      "muted": "#52be80",
      "border": "#7dcea0"
    }
  },{
    "name": "Midnight Dark",
    "colors": {
      "bg": "#1a1a2e",
      "surface": "#16213e",
      "card": "#0f3460",
      "primary": "#e94560",
      "secondary": "#0f4c75",
      "accent": "#533483",
      "text": "#ffffff",
      "muted": "#a8a8a8",
      "border": "#533483"
    }
  },
  // {
  //   "name": "Sunset Orange",
  //   "colors": {
  //     "bg": "#fff5eb",
  //     "surface": "#ffe0cc",
  //     "card": "#ffccaa",
  //     "primary": "#ff8c42",
  //     "secondary": "#ff6b1a",
  //     "accent": "#c73e1d",
  //     "text": "#5d4037",
  //     "muted": "#bcaaa4",
  //     "border": "#ffab91"
  //   }
  // },
  {
    "name": "Lavender Purple",
    "colors": {
      "bg": "#f3e5f5",
      "surface": "#e1bee7",
      "card": "#ce93d8",
      "primary": "#9c27b0",
      "secondary": "#7b1fa2",
      "accent": "#4a148c",
      "text": "#4a148c",
      "muted": "#ba68c8",
      "border": "#ab47bc"
    }
  },{
    "name": "Arctic White",
    "colors": {
      "bg": "#f5f7fa",
      "surface": "#e9ecef",
      "card": "#dee2e6",
      "primary": "#006ba6",
      "secondary": "#0496ff",
      "accent": "#ffbc42",
      "text": "#212529",
      "muted": "#6c757d",
      "border": "#adb5bd"
    }
  },{
    "name": "Emerald Green",
    "colors": {
      "bg": "#e8f5e9",
      "surface": "#c8e6c9",
      "card": "#a5d6a7",
      "primary": "#00897b",
      "secondary": "#00796b",
      "accent": "#004d40",
      "text": "#1b5e20",
      "muted": "#66bb6a",
      "border": "#81c784"
    }
  },
  // {
  //   "name": "Golden Yellow",
  //   "colors": {
  //     "bg": "#fffde7",
  //     "surface": "#fff9c4",
  //     "card": "#fff59d",
  //     "primary": "#fbc02d",
  //     "secondary": "#f9a825",
  //     "accent": "#f57f17",
  //     "text": "#f57f17",
  //     "muted": "#ffd54f",
  //     "border": "#ffeb3b"
  //   }
  // },
  {
    "name": "Steel Gray",
    "colors": {
      "bg": "#eceff1",
      "surface": "#cfd8dc",
      "card": "#b0bec5",
      "primary": "#546e7a",
      "secondary": "#455a64",
      "accent": "#263238",
      "text": "#263238",
      "muted": "#78909c",
      "border": "#90a4ae"
    }
  },
  // {
  //   "name": "Coral Pink",
  //   "colors": {
  //     "bg": "#fce4ec",
  //     "surface": "#f8bbd0",
  //     "card": "#f48fb1",
  //     "primary": "#ec407a",
  //     "secondary": "#d81b60",
  //     "accent": "#880e4f",
  //     "text": "#880e4f",
  //     "muted": "#f06292",
  //     "border": "#f48fb1"
  //   }
  // },
  // {
  //   "name": "Sky Blue",
  //   "colors": {
  //     "bg": "#e1f5fe",
  //     "surface": "#b3e5fc",
  //     "card": "#81d4fa",
  //     "primary": "#039be5",
  //     "secondary": "#0288d1",
  //     "accent": "#01579b",
  //     "text": "#01579b",
  //     "muted": "#4fc3f7",
  //     "border": "#29b6f6"
  //   }
  // },
];

const ThemeSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { applyTheme, currentTheme } = useThemeStore();

  const handleThemeSelect = (theme: typeof presetThemes[0]) => {
    applyTheme(theme.colors);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-muted hover:text-primary transition-colors rounded-lg hover:bg-surface/50"
        aria-label="Switch theme"
      >
        <Palette size={20} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
  initial={{ opacity: 0, scale: 0.95, y: -10 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.95, y: -10 }}
  transition={{ duration: 0.15 }}
  className="absolute top-full right-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-lg z-50
              max-md:left-1/2 max-md:-translate-x-1/2 max-md:right-auto"
>
  <div className="p-4">
    <h3 className="text-sm font-semibold text-text mb-3">
      Choose Theme
    </h3>

    {/* Scrollable Container */}
    <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
      {presetThemes.map((theme, index) => (
        <motion.button
          key={index}
          onClick={() => handleThemeSelect(theme)}
          className="w-full flex items-center justify-between p-3 md:p-3 rounded-lg hover:bg-surface/50 transition-colors"
          whileHover={{ x: 2 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1">
              {Object.values(theme.colors).slice(0, 4).map((color, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-full border border-border/20"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <span className="text-sm text-text">{theme.name}</span>
          </div>

          {JSON.stringify(currentTheme) === JSON.stringify(theme.colors) && (
            <div className="w-2 h-2 bg-primary rounded-full" />
          )}
        </motion.button>
      ))}
    </div>
  </div>
</motion.div>

        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSwitcher;