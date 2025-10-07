async function loadExperience() {
  try {
    const response = await fetch('./data/experience.json');
    if (!response.ok) throw new Error('Error al cargar experience.json');

    const experienceData = await response.json();
    const container = document.getElementById('experience-container');
    container.innerHTML = '';

    experienceData.sort((a, b) => a.order - b.order);

    experienceData.forEach((exp, index) => {
      const div = document.createElement('div');
      div.classList.add('timeline-item');
      div.innerHTML = `
        <div class="exp-header">
          <h3 class="exp-title">${exp.title}</h3>
          <span class="exp-years">${exp.years}</span>
        </div>
        <p class="exp-description">${exp.description}</p>
      `;
      div.style.animationDelay = `${index * 0.2}s`;
      container.appendChild(div);
    });
  } catch (error) {
    console.error('Error al cargar experiencia:', error);
    const container = document.getElementById('experience-container');
    container.innerHTML = `
      <div class="error-card">
        <i class="fas fa-exclamation-triangle"></i>
        <p>No se pudo cargar la información de experiencia.</p>
      </div>
    `;
  }
}

async function loadProjects() {
  try {
    const response = await fetch('./data/projects.json');
    if (!response.ok) throw new Error('Error al cargar projects.json');

    const projectsData = await response.json();
    const container = document.getElementById('projects-grid');
    container.innerHTML = '';

    const allProjects = [
      ...projectsData.bots,
      ...projectsData.plugins,
      ...projectsData.webs
    ];

    allProjects.forEach((project, index) => {
      const card = createProjectCard(project, index);
      container.appendChild(card);
    });

    setupProjectFilters();
  } catch (error) {
    console.error('Error al cargar proyectos:', error);
    const container = document.getElementById('projects-grid');
    container.innerHTML = `
      <div class="error-card">
        <i class="fas fa-exclamation-triangle"></i>
        <p>No se pudo cargar la información de proyectos.</p>
      </div>
    `;
  }
}

function createProjectCard(project, index) {
  const card = document.createElement('div');
  card.classList.add('project-card');
  card.setAttribute('data-type', project.type);
  card.style.animationDelay = `${index * 0.1}s`;

  const typeLabels = {
    bots: 'Bot',
    plugins: 'Plugin',
    webs: 'Web'
  };

  card.innerHTML = `
    <div class="project-image">
      <i class="${project.icon}"></i>
    </div>
    <div class="project-content">
      <div class="project-header">
        <h3 class="project-title">${project.name}</h3>
        <span class="project-type ${project.type}">${typeLabels[project.type]}</span>
      </div>
      <p class="project-description">${project.description}</p>
      ${project.github ? `
        <div class="project-footer">
          <a href="${project.github}" target="_blank" class="project-link">
            Ver en GitHub <i class="fas fa-external-link-alt"></i>
          </a>
        </div>
      ` : ''}
    </div>
  `;

  return card;
}

function setupProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      projectCards.forEach((card, index) => {
        const cardType = card.getAttribute('data-type');

        if (filter === 'all' || cardType === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'none';
          setTimeout(() => {
            card.style.animation = `fadeInUp 0.6s ease forwards ${index * 0.1}s`;
          }, 10);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
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
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = target.offsetTop - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
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
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll('.section-block');
  animatedElements.forEach(el => {
    observer.observe(el);
  });
}

function setupNavbarScroll() {
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

function addHoverEffects() {
  const cards = document.querySelectorAll('.project-card, .skill-item');

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'all 0.4s ease';
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
      element.style.opacity = Math.max(0, 1 - scrolled / 500);
    });
  });
}

function setupCursorEffect() {
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    const diffX = mouseX - cursorX;
    const diffY = mouseY - cursorY;

    cursorX += diffX * 0.1;
    cursorY += diffY * 0.1;

    requestAnimationFrame(animateCursor);
  }

  animateCursor();
}

function initializePortfolio() {
  loadExperience();
  loadProjects();
  setupSmoothScroll();
  setupThemeToggle();
  setupScrollAnimations();
  setupNavbarScroll();
  setupParallaxEffect();

  setTimeout(() => {
    addHoverEffects();
  }, 500);
}

document.addEventListener('DOMContentLoaded', initializePortfolio);