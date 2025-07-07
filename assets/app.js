async function loadExperience() {
  try {
    const res = await fetch('./data/experience.json');
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    const container = document.getElementById('experience-container');

    container.innerHTML = '';

    data.forEach((exp, index) => {
      const div = document.createElement('div');
      div.classList.add('project-card');
      div.innerHTML = `
        <div class="exp-header">
          <strong>${exp.title}</strong>
          <span class="exp-years">${exp.years}</span>
        </div>
        <p class="exp-description">${exp.description}</p>
      `;
      div.style.animationDelay = `${index * 0.1}s`;
      container.appendChild(div);
    });
  } catch (error) {
    console.error('Error al cargar experiencia:', error);
    const container = document.getElementById('experience-container');
    container.innerHTML = `
      <div class="error-card">
        <i class="fas fa-exclamation-triangle"></i>
        <p>No se pudo cargar la información de experiencia.</p>
        <small>${error.message}</small>
      </div>
    `;
  }
}

async function loadProjects() {
  try {
    const res = await fetch('./data/projects.json');
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    const containers = {
      bots: document.getElementById('projects-bots'),
      plugins: document.getElementById('projects-plugins'),
      webs: document.getElementById('projects-webs')
    };

    Object.values(containers).forEach(container => {
      container.innerHTML = '';
    });

    data.bots.forEach((project, index) => {
      containers.bots.appendChild(createProjectCard(project, index));
    });

    data.plugins.forEach((project, index) => {
      containers.plugins.appendChild(createProjectCard(project, index));
    });

    data.webs.forEach((project, index) => {
      containers.webs.appendChild(createProjectCard(project, index));
    });
  } catch (error) {
    console.error('Error al cargar proyectos:', error);
    const containers = [
      document.getElementById('projects-bots'),
      document.getElementById('projects-plugins'),
      document.getElementById('projects-webs')
    ];
    
    containers.forEach(container => {
      container.innerHTML = `
        <div class="error-card">
          <i class="fas fa-exclamation-triangle"></i>
          <p>No se pudo cargar la información de proyectos.</p>
          <small>${error.message}</small>
        </div>
      `;
    });
  }
}

function createProjectCard(project, index) {
  const div = document.createElement('div');
  div.classList.add('project-card');
  div.innerHTML = `
    <h4 class="project-title">${project.name}</h4>
    <p>${project.description}</p>
  `;
  div.style.animationDelay = `${index * 0.1}s`;
  return div;
}

function setupSmoothScroll() {
  const scrollDown = document.querySelector('.scroll-down');
  if (scrollDown) {
    scrollDown.addEventListener('click', () => {
      document.querySelector('#sobre-mi').scrollIntoView({
        behavior: 'smooth'
      });
    });
  }
}

function setupThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'dark';
  
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  updateThemeIcon(currentTheme);
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('#theme-toggle i');
  if (theme === 'dark') {
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
  } else {
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadExperience();
  loadProjects();
  setupSmoothScroll();
  setupThemeToggle();
});