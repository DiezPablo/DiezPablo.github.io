# Tu sitio personal — guía rápida

## Estructura

```
personal-site/
├── index.html          → página de inicio (tu BIO)
├── blog.html            → listado del blog (se genera solo)
├── post.html            → plantilla de "una entrada", se rellena sola
├── css/style.css        → todo el diseño
├── js/render-blog.js    → lee posts.json y pinta la lista
├── js/render-post.js    → lee un .md y lo convierte a HTML
└── posts/
    ├── posts.json       → índice de entradas (metadatos)
    ├── bienvenida.md
    └── notas-tanzania.md
```

## Cómo añadir una entrada nueva al blog

1. Crea un archivo `.md` dentro de `posts/`, por ejemplo `posts/mi-nuevo-post.md`, y escribe el contenido en Markdown normal (títulos con `##`, listas con `-`, negritas con `**texto**`, etc.).
2. Abre `posts/posts.json` y añade un bloque nuevo al principio de la lista:

```json
{
  "slug": "mi-nuevo-post",
  "title": "Título de la entrada",
  "date": "2026-08-05",
  "excerpt": "Una frase corta que resume el post.",
  "file": "mi-nuevo-post.md",
  "tags": ["ml", "genai"]
}
```

3. Guarda, sube los cambios a GitHub (ver abajo) y listo — aparece solo en `blog.html`, ordenado por fecha.

No hay que tocar `blog.html`, `post.html` ni el JS para nada de esto.

## Tags

Cada post puede tener cualquier número de tags en el campo `"tags"` de `posts.json` (usa palabras en minúscula, sin espacios: `genai`, `mlops`, `fotografia`, `viajes`...). No hace falta declararlos en ningún sitio — en cuanto aparecen en un post, se generan solos:

- El filtro de píldoras arriba del blog se construye automáticamente a partir de los tags que existan, con el número de entradas de cada uno.
- Al hacer clic en un tag, la lista se filtra sin recargar la página, y la URL cambia a `blog.html?tag=fotografia` (puedes compartir ese enlace directamente).
- Cada entrada y cada post individual muestran sus tags como enlaces a ese filtro.

Si un post no tiene tags, simplemente omite el campo `"tags"` o déjalo como `[]`.

## Cómo editar tu BIO

Abre `index.html` y edita directamente el texto entre las etiquetas `<h1>`, `<p class="role">`, `<div class="bio-text">`, `<div class="now-block">` y `<div class="links-row">`. Está todo comentado en el propio archivo para que sea fácil localizarlo.

## Cómo publicarlo gratis en GitHub Pages

1. Crea una cuenta en [github.com](https://github.com) si no tienes.
2. Crea un repositorio nuevo. Si quieres que la URL sea `tu-usuario.github.io`, llama al repositorio exactamente `tu-usuario.github.io` (sustituyendo por tu nombre de usuario real). Si prefieres otro nombre, la URL será `tu-usuario.github.io/nombre-del-repo`.
3. Sube todos los archivos de esta carpeta (`personal-site/`) al repositorio. Dos formas de hacerlo:
   - **Sin usar terminal**: en la página del repo, botón "Add file" → "Upload files", y arrastras todo el contenido de la carpeta.
   - **Con git** (ya que vienes de backend, esto te será natural):
     ```bash
     cd personal-site
     git init
     git add .
     git commit -m "Primer commit del sitio"
     git branch -M main
     git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
     git push -u origin main
     ```
4. En GitHub, ve a **Settings → Pages**.
5. En "Build and deployment", elige **Deploy from a branch**, rama `main`, carpeta `/ (root)`.
6. Guarda. En 1-2 minutos tu sitio estará en `https://tu-usuario.github.io` (o la URL que corresponda).

Cada vez que quieras publicar un cambio (nuevo post, retoque de la bio), solo tienes que subir los archivos modificados otra vez (o hacer `git add . && git commit -m "..." && git push`) y GitHub Pages lo actualiza solo.

## Dominio propio (opcional)

Si más adelante compras un dominio (ej. `pablodiez.dev`), en **Settings → Pages → Custom domain** lo introduces y sigues las instrucciones de GitHub para apuntar los DNS. Esto ya no es gratis (~10-15€/año), pero no es obligatorio: `tu-usuario.github.io` funciona perfectamente y gratis para siempre.
