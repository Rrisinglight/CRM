import { c as create_ssr_component, a as subscribe, e as escape } from './ssr-Biid2e9X.js';
import { p as page } from './stores-C9yRhjuP.js';
import './ssr2-KRueQ-Mb.js';
import './state.svelte-Bbc4_9mM.js';

const Error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_page();
  return `<h1>${escape($page.status)}</h1> <p>${escape($page.error?.message)}</p>`;
});

export { Error as default };
//# sourceMappingURL=error.svelte-3HgYWHHN.js.map
