// Lee posts/posts.json, pinta el filtro de tags y la lista de posts en
// formato "log". No hay que tocar este archivo para añadir posts o tags:
// solo hay que editar posts/posts.json (campo "tags": [...]) y crear el .md.

let allPosts = [];
let activeTag = null;

async function loadPosts() {
  const res = await fetch('posts/posts.json');
  if (!res.ok) throw new Error('No se pudo cargar posts.json');
  const posts = await res.json();
  return posts.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
}

function getAllTags(posts) {
  const counts = {};
  posts.forEach(post => {
    (post.tags || []).forEach(tag => {
      counts[tag] = (counts[tag] || 0) + 1;
    });
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]); // [ [tag, count], ... ]
}

function renderTagFilter() {
  const filterEl = document.getElementById('tag-filter');
  const tags = getAllTags(allPosts);

  if (tags.length === 0) {
    filterEl.innerHTML = '';
    return;
  }

  const allPill = `<button type="button" class="tag-pill ${activeTag === null ? 'active' : ''}" data-tag="">
      todos <span class="count">${allPosts.length}</span>
    </button>`;

  const tagPills = tags.map(([tag, count]) => `
    <button type="button" class="tag-pill ${activeTag === tag ? 'active' : ''}" data-tag="${tag}">
      ${tag} <span class="count">${count}</span>
    </button>
  `).join('');

  filterEl.innerHTML = allPill + tagPills;

  filterEl.querySelectorAll('.tag-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      const tag = btn.dataset.tag || null;
      setActiveTag(tag);
    });
  });
}

function setActiveTag(tag) {
  activeTag = tag;
  const url = new URL(window.location);
  if (tag) {
    url.searchParams.set('tag', tag);
  } else {
    url.searchParams.delete('tag');
  }
  window.history.replaceState({}, '', url);

  renderTagFilter();
  renderLog();
}

function renderLog() {
  const logEl = document.getElementById('log');
  const posts = activeTag
    ? allPosts.filter(p => (p.tags || []).includes(activeTag))
    : allPosts;

  if (posts.length === 0) {
    logEl.innerHTML = '<p class="log-empty">No hay entradas con ese tag todavía.</p>';
    return;
  }

  const formatter = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  logEl.innerHTML = posts.map(post => {
    const dateLabel = formatter.format(new Date(post.date));
    const tagsHtml = (post.tags || []).map(tag =>
      `<a class="log-tag" href="blog.html?tag=${encodeURIComponent(tag)}">${tag}</a>`
    ).join('');

    return `
      <div class="log-entry">
        <div class="log-date">${dateLabel}</div>
        <a class="log-title" href="post.html?slug=${encodeURIComponent(post.slug)}">${post.title}</a>
        <p class="log-excerpt">${post.excerpt || ''}</p>
        ${tagsHtml ? `<div class="log-tags">${tagsHtml}</div>` : ''}
      </div>
    `;
  }).join('');
}

async function renderBlog() {
  const logEl = document.getElementById('log');

  try {
    allPosts = await loadPosts();

    if (allPosts.length === 0) {
      logEl.innerHTML = '<p class="log-empty">Todavía no hay entradas. Vuelve pronto.</p>';
      return;
    }

    const params = new URLSearchParams(window.location.search);
    activeTag = params.get('tag');

    renderTagFilter();
    renderLog();

  } catch (err) {
    console.error(err);
    logEl.innerHTML = '<p class="log-error">No se han podido cargar las entradas del blog.</p>';
  }
}

renderBlog();
