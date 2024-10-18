// component-loader.js

const components = [
  { id: "navigation-content", file: "js/components/navigation.js", critical: true },
  { id: "splash-content", file: "js/components/splash.js", critical: true },
  { id: "video-content", file: "js/components/video.js", critical: false },
  { id: "ball-content", file: "js/components/ball.js", critical: false },
  { id: "diablo-content", file: "js/components/diablo.js", critical: false },
  { id: "cta-content", file: "js/components/cta.js", critical: false },
];

function showLoader() {
  const loader = document.createElement('div');
  loader.id = 'component-loader';
  loader.innerHTML = 'Loading...';
  document.body.appendChild(loader);
}

function hideLoader() {
  const loader = document.getElementById('component-loader');
  if (loader) {
    loader.remove();
  }
}

function loadComponent(component) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = component.file;
    script.onload = () => {
      const content = window[component.id];
      if (content) {
        const element = document.getElementById(component.id);
        if (element) {
          element.innerHTML = content;
          resolve(component);
        } else {
          reject(new Error(`Element with id ${component.id} not found`));
        }
      } else {
        reject(new Error(`Component ${component.id} not found`));
      }
    };
    script.onerror = () => reject(new Error(`Failed to load script for ${component.id}`));
    document.body.appendChild(script);
  });
}

function initializeWebflowAndLenis() {
  if (window.Webflow) {
    window.Webflow.destroy();
    window.Webflow.ready();
    window.Webflow.require("ix2").init();
  }
  if (window.initSmoothScrolling) {
    window.initSmoothScrolling();
  }
}

async function loadComponents() {
  showLoader();

  try {
    // Load critical components first
    await Promise.all(components.filter(c => c.critical).map(loadComponent));
    
    // Initialize after critical components are loaded
    initializeWebflowAndLenis();

    // Then load non-critical components
    await Promise.all(components.filter(c => !c.critical).map(loadComponent));

    // Re-initialize after all components are loaded
    initializeWebflowAndLenis();

    hideLoader();
    document.body.classList.add('components-loaded');
  } catch (error) {
    console.error("Failed to load components:", error);
    hideLoader();
    // Handle the error (e.g., show an error message to the user)
  }
}

document.addEventListener("DOMContentLoaded", loadComponents);

// Expose loadComponents globally
window.loadComponents = loadComponents;