# CI/CD (GitHub Actions)

Репозиторий: [Amindlog/agrosis](https://github.com/Amindlog/agrosis)

## Pipeline

| Job | Когда | Действие |
|-----|--------|----------|
| **Validate** | push / PR в `main` | проверка HTML и ключевых файлов |
| **Deploy** | push в `main` | публикация в ветку `gh-pages` |

## Ошибка `Get Pages site failed` / `HttpError: Not Found`

Она возникает, если в workflow используется `actions/configure-pages`, а в репозитории **не включён** GitHub Pages с источником «GitHub Actions».

Сейчас деплой идёт через **[peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages)** — ветка `gh-pages`, без `configure-pages`.

### Один раз в настройках GitHub

1. **Settings → Pages**
2. **Build and deployment → Source:** `Deploy from a branch`
3. **Branch:** `gh-pages` → папка `/ (root)`
4. **Settings → Actions → General → Workflow permissions:** `Read and write permissions`

### Запуск

```bash
git add .
git commit -m "Fix deploy: use gh-pages branch"
git push origin main
```

После успешного workflow сайт: **https://amindlog.github.io/agrosis/**

### Локально

```bash
npm install
npm run validate
npm run dev   # http://localhost:3000
```
