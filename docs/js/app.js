import { getState, setState, subscribe } from './state.js';
import { renderNav } from './ui/nav.js';
import { SCREENS } from './screens/index.js';
import { renderEditor } from './screens/editor.js';

const screenEl = document.getElementById('screen');
const navEl = document.getElementById('nav');

function render(state) {
  renderNav(navEl, state.tab, (tab) => setState({ tab, editingDate: null }));

  if (state.editingDate) {
    renderEditor(screenEl, state.editingDate);
  } else {
    SCREENS[state.tab](screenEl);
  }
}

export function startApp() {
  subscribe(render);
  render(getState());
}
