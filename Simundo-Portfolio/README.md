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

## Rule

Frontend files and skills go in `frontend/`; backend files and skills go in `backend/`.
