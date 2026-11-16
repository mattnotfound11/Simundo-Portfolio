# Simundo Portfolio

## Structure

```
Simundo-Portfolio/
├── frontend/   UI code, components, styles, assets, skills
└── backend/    Server code, routes, config, uploads, skills
```

### frontend/
| Folder        | What goes here                                  |
| ------------- | ----------------------------------------------- |
| `src/`        | Main application code (pages, entry point)      |
| `components/` | Reusable UI components                          |
| `styles/`     | CSS / SCSS / theme files                        |
| `public/`     | Static files served as-is (favicon, index.html) |
| `assets/`     | `images/`, `fonts/`, `icons/`                   |
| `skills/`     | Skills / skill files related to the frontend    |

### backend/
| Folder     | What goes here                                 |
| ---------- | ---------------------------------------------- |
| `src/`     | Main server code (entry point, logic, models)  |
| `routes/`  | API route definitions                          |
| `config/`  | Configuration (never commit real secrets)      |
| `uploads/` | User-uploaded files (contents are git-ignored) |
| `skills/`  | Skills / skill files related to the backend    |

## Running the frontend

No build step. From the project root:

```bash
cd frontend && python3 -m http.server 5173
# open http://localhost:5173
```

Pages (follow `Simundo-Portfolio-Sitemap.pdf`):

| URL                  | File                                | Contents                                                     |
| -------------------- | ----------------------------------- | ------------------------------------------------------------ |
| `/`                  | `index.html`                        | Home: hero, #about, #experience, #work, #credentials        |
| `/contact/`          | `contact/index.html`                | Email, GitHub, LinkedIn                                      |
| `/work/mind-bridge/` | `work/mind-bridge/index.html`       | Mind Bridge case study                                       |

- **Edit content:** `frontend/src/content.js` holds every word, link and project. Empty links are hidden.
- **App:** `frontend/src/app.js` renders the pages and runs every animation (GSAP 3.15 via CDN).
- **Loader:** `frontend/src/preloader.js` with `preload-init.js`; plays once per browser session.
- **Styles:** `frontend/styles/tailwind.css` (utilities) and `frontend/styles/theme.css` (white and light-blue colour tokens).
- **Resume:** put the PDF at `frontend/resume.pdf` (the footer links to it).

## Rule

Frontend files and skills go in `frontend/`; backend files and skills go in `backend/`.
