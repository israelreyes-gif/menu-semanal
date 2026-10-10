import { getState, setState, subscribe } from './state.js';
import { renderNav } from './ui/nav.js';
import { SCREENS } from './screens/index.js';

const screenEl = document.getElementById('screen');
const navEl = document.getElementById('nav');

function render(state) {
  renderNav(navEl, state.tab, (tab) => setState({ tab }));
  SCREENS[state.tab](screenEl);
}

export function startApp() {
  subscribe(render);
  render(getState());
}
