{
  const bodyEl = document.body;
  const aEl = document.links;
  const toggleEl = document.querySelector('#color-scheme-toggle');
  const prismEl = document.querySelector('#prism-css');
  const DARK = 'dark';
  const LIGHT = 'light';
  const COLOR_SCHEME_CHANGED = 'colorSchemeChanged';

  toggleEl.addEventListener('click', () => {
    const isDark = bodyEl.classList.toggle('dark-mode');
    const mode = isDark ? DARK : LIGHT;
    sessionStorage.setItem('manojkarthickdotcom.color-scheme', mode);

    if (isDark) {
      toggleEl.src = toggleEl.src.replace(DARK, LIGHT);
      toggleEl.alt = toggleEl.alt.replace(DARK, LIGHT);
      if (prismEl) prismEl.href = prismEl.href.replace(LIGHT, DARK);
    } else {
      toggleEl.src = toggleEl.src.replace(LIGHT, DARK);
      toggleEl.alt = toggleEl.alt.replace(LIGHT, DARK);
      if (prismEl) prismEl.href = prismEl.href.replace(DARK, LIGHT);
    }

    toggleEl.dispatchEvent(new CustomEvent(
      COLOR_SCHEME_CHANGED, { detail: mode }
    ));
  });
}


{
  function init() {
    const DARK = 'dark';
    const LIGHT = 'light';
    const isSystemDarkMode = matchMedia &&
      matchMedia('(prefers-color-scheme: dark)').matches;

    let mode = sessionStorage.getItem('manojkarthickdotcom.color-scheme');

    if (!mode && isSystemDarkMode) {
      mode = DARK;
    } else {
      mode = mode || LIGHT;
    }

    if (mode === DARK) {
      document.querySelector('#color-scheme-toggle').click();
    }
  }

// run the code
  init();
}
