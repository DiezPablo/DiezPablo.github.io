// Lee el parámetro ?slug= de la URL, busca ese post en posts/posts.json,
// carga su archivo .md y lo convierte a HTML con marked.js.

async function renderPost() {
  const container = document.getElementById('post-container');
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  if (!slug) {
    container.innerHTML = '<p class="log-error">Falta indicar qué entrada mostrar.</p>';
    return;
  }

  try {
    const res = await fetch('posts/posts.json');
    if (!res.ok) throw new Error('No se pudo cargar posts.json');
    const posts = await res.json();

    const post = posts.find(p => p.slug === slug);
    if (!post) {
      container.innerHTML = '<p class="log-error">No se ha encontrado esa entrada.</p>';
      return;
    }

    document.getElementById('page-title').textContent = `${post.title} — Pablo Díez`;

    const mdRes = await fetch(`posts/${post.file}`);
    if (!mdRes.ok) throw new Error('No se pudo cargar el archivo markdown');
    const mdText = await mdRes.text();

    const formatter = new Intl.DateTimeFormat('es-ES', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
    const dateLabel = formatter.format(new Date(post.date));

    const htmlContent = marked.parse(mdText);

    const tagsHtml = (post.tags || []).map(tag =>
      `<a class="log-tag" href="blog.html?tag=${encodeURIComponent(tag)}">${tag}</a>`
    ).join('');

    container.innerHTML = `
      <div class="post-meta">${dateLabel}</div>
      <h1 class="post-title">${post.title}</h1>
      ${tagsHtml ? `<div class="post-tags">${tagsHtml}</div>` : ''}
      <div class="post-content">${htmlContent}</div>
    `;

  } catch (err) {
    console.error(err);
    container.innerHTML = '<p class="log-error">No se ha podido cargar esta entrada.</p>';
  }
}

renderPost();
