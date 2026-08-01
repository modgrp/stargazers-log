const repoList = document.querySelector('#starred-repos');

fetch('events.json')
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    return response.json();
  })
  .then((events) => {
    repoList.innerHTML = events
      .map(
        (event) => `
          <li class="repo-item">
            <h2 class="repo-name">
              <a href="${event.html_url}" target="_blank" rel="noreferrer">${event.full_name}</a>
            </h2>
            <p class="repo-description">${event.description}</p>
            <div class="repo-meta">
              <span class="repo-language">
                <span class="language-dot" aria-hidden="true"></span>
                ${event.language}
              </span>
              <span>★ ${event.stargazers_count.toLocaleString()}</span>
              <span>Forks ${event.forks_count.toLocaleString()}</span>
              <span>Issues ${event.open_issues_count.toLocaleString()}</span>
              <span class="status">Updated ${new Date(event.updated_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}</span>
            </div>
          </li>
        `
      )
      .join('');
  })
  .catch((error) => {
    console.error('Failed to load starred repositories:', error);
    repoList.innerHTML = '<li class="error-message">Unable to load the starred repositories right now.</li>';
  });
