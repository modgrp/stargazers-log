// Safe rendering: create elements and use textContent to avoid XSS.
// Also checks for missing container and shows loading / empty states.

const repoList = document.getElementById('starred-repos');
if (!repoList) {
  // If the list isn't present, bail out gracefully.
  console.warn('No element with id "starred-repos" found.');
} else {
  // show a simple loading item
  repoList.innerHTML = '<li class="loading">Loading…</li>';

  fetch('events.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    })
    .then((events) => {
      repoList.innerHTML = '';

      if (!Array.isArray(events) || events.length === 0) {
        repoList.innerHTML = '<li class="error-message">No starred repositories found.</li>';
        return;
      }

      events.forEach((event) => {
        const li = document.createElement('li');
        li.className = 'repo-item';

        // Title / link
        const h2 = document.createElement('h2');
        h2.className = 'repo-name';
        const a = document.createElement('a');
        a.href = event.html_url || '#';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = event.full_name || 'Unknown repository';
        h2.appendChild(a);
        li.appendChild(h2);

        // Description (if present)
        if (event.description) {
          const p = document.createElement('p');
          p.className = 'repo-description';
          p.textContent = event.description;
          li.appendChild(p);
        }

        // Meta
        const meta = document.createElement('div');
        meta.className = 'repo-meta';

        const lang = document.createElement('span');
        lang.className = 'repo-language';
        const dot = document.createElement('span');
        dot.className = 'language-dot';
        dot.setAttribute('aria-hidden', 'true');
        lang.appendChild(dot);
        lang.appendChild(document.createTextNode(event.language || 'Unknown'));
        meta.appendChild(lang);

        const stars = document.createElement('span');
        stars.textContent = `★ ${Number(event.stargazers_count || 0).toLocaleString()}`;
        meta.appendChild(stars);

        const forks = document.createElement('span');
        forks.textContent = `Forks ${Number(event.forks_count || 0).toLocaleString()}`;
        meta.appendChild(forks);

        const issues = document.createElement('span');
        issues.textContent = `Issues ${Number(event.open_issues_count || 0).toLocaleString()}`;
        meta.appendChild(issues);

        if (event.updated_at) {
          const updated = new Date(event.updated_at);
          if (!Number.isNaN(updated.getTime())) {
            const status = document.createElement('span');
            status.className = 'status';
            status.textContent = `Updated ${updated.toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}`;
            meta.appendChild(status);
          }
        }

        li.appendChild(meta);
        repoList.appendChild(li);
      });
    })
    .catch((error) => {
      console.error('Failed to load starred repositories:', error);
      repoList.innerHTML = '<li class="error-message">Unable to load the starred repositories right now.</li>';
    });
}
