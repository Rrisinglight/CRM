import { c as create_ssr_component, a as subscribe, d as add_attribute } from "../../../chunks/ssr.js";
import { a as auth } from "../../../chunks/websocket.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_auth;
  $$unsubscribe_auth = subscribe(auth, (value) => value);
  let search = "";
  $$unsubscribe_auth();
  return `${$$result.head += `<!-- HEAD_svelte-1oitcmz_START -->${$$result.title = `<title>Архив | CRM</title>`, ""}<!-- HEAD_svelte-1oitcmz_END -->`, ""} <div class="p-8"><h1 class="text-2xl font-bold mb-8" data-svelte-h="svelte-984p9d">Архив задач</h1>  <div class="mb-6"><input type="text" placeholder="Поиск по названию, описанию..." class="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"${add_attribute("value", search, 0)}></div> ${`<div class="flex justify-center py-20" data-svelte-h="svelte-zif7fd"><div class="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div></div>`}</div>`;
});
export {
  Page as default
};
