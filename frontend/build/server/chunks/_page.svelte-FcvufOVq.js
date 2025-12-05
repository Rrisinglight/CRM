import { c as create_ssr_component, a as subscribe } from './ssr-Biid2e9X.js';
import './ssr2-KRueQ-Mb.js';
import './state.svelte-Bbc4_9mM.js';
import { a as auth } from './websocket-wnrQWROL.js';
import './index-o6C5pnWt.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_auth;
  $$unsubscribe_auth = subscribe(auth, (value) => value);
  $$unsubscribe_auth();
  return `<div class="flex items-center justify-center min-h-screen" data-svelte-h="svelte-n46gcv"><div class="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div></div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-FcvufOVq.js.map
