# CI/CD (GitHub Actions)

## Что делает pipeline

| Job | Когда | Действие |
|-----|--------|----------|
| **Validate** | push / PR в `main` | `npm ci`, проверка HTML, наличие ключевых файлов |
| **Deploy** | push в `main` | публикация статики на **GitHub Pages** |

## Первый запуск

1. Создайте репозиторий на GitHub и привяжите его:

```bash
cd "/home/amind/Документы/agrosis"
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/ВАШ_АККАУНТ/agrosis.git
git push -u origin main
```

2. **Включите GitHub Pages** (обязательно, иначе деплой падает с `HttpError: Not Found`):

   **Settings → Pages → Build and deployment → Source: `GitHub Actions`**

   Workflow также пытается включить Pages через API при первом деплое; если ошибка остаётся — включите вручную в настройках и перезапустите workflow (**Actions → CI/CD → Re-run**).

3. После успешного workflow сайт будет по адресу:

`https://ВАШ_АККАУНТ.github.io/agrosis/`

(имя репозитория в URL).

4. Для своего домена (`agrosistemy.ru`): **Settings → Pages → Custom domain**.

## Локально

```bash
npm install
npm run validate   # та же проверка, что в CI
npm run dev        # http://localhost:3000
```

## Примечание

На GitHub Pages ссылки вида `href="/"` ведут на корень домена, а не в папку репозитория. Для project site при необходимости замените их на `index.html` или настройте custom domain на корне.
