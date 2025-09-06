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
          <span class="exp-years" style="color: var(--primary); font-weight: 600; font-size: 0.9rem; margin-top: 0.5rem; display: block;">${exp.years}</span>
        </div>
        <p class="exp-description" style="margin-top: 1rem; line-height: 1.6;">${exp.description}</p>
      `;
      div.style.animationDelay = `${index * 0.15}s`;
      div.style.opacity = '0';
      div.style.transform = 'translateY(30px)';
      div.style.animation = 'fadeIn 0.8s ease forwards';
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

    if (data.bots) {
      data.bots.forEach((project, index) => {
        containers.bots.appendChild(createProjectCard(project, index));
      });
    }

    if (data.plugins) {
      data.plugins.forEach((project, index) => {
        containers.plugins.appendChild(createProjectCard(project, index));
      });
    }

    if (data.webs) {
      data.webs.forEach((project, index) => {
        containers.webs.appendChild(createProjectCard(project, index));
      });
    }
  } catch (error) {
    console.error('Error al cargar proyectos:', error);
    const containers = [
      document.getElementById('projects-bots'),
      document.getElementById('projects-plugins'),
      document.getElementById('projects-webs')
    ];

    containers.forEach(container => {
      if (container) {
        container.innerHTML = `
          <div class="error-card">
            <i class="fas fa-exclamation-triangle"></i>
            <p>No se pudo cargar la información de proyectos.</p>
            <small>${error.message}</small>
          </div>
        `;
      }
    });
  }
}

function createProjectCard(project, index) {
  const div = document.createElement('div');
  div.classList.add('project-card');

  const title = project.github
    ? `<a href="${project.github}" target="_blank" class="project-link">${project.name}</a>`
    : project.name;

  div.innerHTML = `
    <strong class="project-title">${title}</strong>
    <p style="margin-top: auto; color: var(--text-secondary); line-height: 1.6;">${project.description}</p>
  `;

  div.style.animationDelay = `${index * 0.15}s`;
  div.style.opacity = '0';
  div.style.transform = 'translateY(30px)';
  div.style.animation = 'fadeIn 0.8s ease forwards';

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

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
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

    themeToggle.style.transform = 'scale(0.8) rotate(180deg)';
    setTimeout(() => {
      themeToggle.style.transform = 'scale(1) rotate(0deg)';
    }, 200);
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

function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll('.section-block, .project-card, .skill-item');
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
  });
}

function addHoverEffects() {
  const cards = document.querySelectorAll('.project-card, .skill-item');

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = card.classList.contains('skill-item')
        ? 'translateY(-4px) scale(1.02)'
        : 'translateY(-12px) scale(1.02)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)';
    });
  });
}

function setupParallaxEffect() {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.scroll-down');

    parallaxElements.forEach(element => {
      const speed = 0.5;
      element.style.transform = `translateX(-50%) translateY(${scrolled * speed}px)`;
    });
  });
}

function initializePortfolio() {
  loadExperience();
  loadProjects();
  setupSmoothScroll();
  setupThemeToggle();
  setupScrollAnimations();
  setupParallaxEffect();

  setTimeout(() => {
    addHoverEffects();
  }, 500);
}

document.addEventListener('DOMContentLoaded', initializePortfolio);