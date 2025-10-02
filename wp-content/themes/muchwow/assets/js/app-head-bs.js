// global options
let
DEFAULT_BREAKPOINTS = { xs: 0, sm: 576, md: 768, lg: 992, xl: 1200, xxl: 1400 };

// add dom-ready class
document.addEventListener('DOMContentLoaded', () => {
    html.classList.add('dom-ready');
});

// body scroll width
const updateScrollWidth = () => document.documentElement.style.setProperty('--body-scroll-width', `${window.innerWidth - document.documentElement.clientWidth}px`);
window.addEventListener('resize', updateScrollWidth);
updateScrollWidth();

// default breakpoints classes
const html = document.documentElement,
      setupBp = (bp, bpSize, type = 'min') => {
          const media = matchMedia(`(${type}-width: ${bpSize}px)`),
                cls = `bp-${bp}${type === 'max' ? '-max' : ''}`,
                update = () => html.classList.toggle(cls, media.matches);
          media.onchange = update;
          update();
      };
Object.entries(DEFAULT_BREAKPOINTS).forEach(([bp, bpSize]) => {
    setupBp(bp, bpSize, 'min');
    setupBp(bp, bpSize - 1, 'max');
});

const dark = new URLSearchParams(location.search).get('dark');
if (dark) html.classList.toggle('uc-dark', dark === '1');