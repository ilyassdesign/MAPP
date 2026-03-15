# MapLeads — Local Business Lead Generator

A dark-themed SaaS landing page + dashboard for generating local business leads.

## Project Structure

```
mapleads/
├── index.html        ← Main HTML (all views: landing, dashboard, billing)
├── style.css         ← All styles & CSS custom properties
├── script.js         ← Lead generation logic, view switching, CSV export
├── assets/
│   ├── favicon.svg   ← Site favicon
│   └── (add og-image.png, logo.svg, etc.)
└── README.md
```

## How to Use

**Option 1 — Open directly**
Just double-click `index.html` in your browser. No build step needed.

**Option 2 — Local server (recommended)**
```bash
# Python
python3 -m http.server 3000

# Node (npx)
npx serve .

# VS Code
Install "Live Server" extension → Right-click index.html → Open with Live Server
```
Then visit `http://localhost:3000`

## Views

| Tab            | Description                                |
|----------------|--------------------------------------------|
| Landing Page   | Hero, features, pricing, testimonials, CTA |
| Dashboard      | Lead generator with table + CSV export     |
| Billing        | Plan management + upgrade UI               |
| Upgrade Modal  | Paywall modal (triggers at 20 lead limit)  |

## Customisation

### Change brand colours
Edit the CSS variables at the top of `style.css`:
```css
:root {
  --blue:  #1a73e8;   /* Primary blue */
  --green: #34a853;   /* Success / website badge */
  --red:   #ea4335;   /* Error / warning */
}
```

### Change free plan limit
Edit line 6 of `script.js`:
```js
const FREE_LIMIT = 20;  // ← change this number
```

### Add real lead data
Replace the `MOCK` object in `script.js` with your API call inside `generateLeads()`.

## Tech Stack

- Vanilla HTML5 / CSS3 / JavaScript (ES6+)
- Google Fonts: Plus Jakarta Sans + DM Sans
- No frameworks, no dependencies, no build step
