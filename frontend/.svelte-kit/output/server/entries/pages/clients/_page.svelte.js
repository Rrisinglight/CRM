import { c as create_ssr_component, a as subscribe, d as add_attribute } from "../../../chunks/ssr.js";
import { a as auth } from "../../../chunks/websocket.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_auth;
  $$unsubscribe_auth = subscribe(auth, (value) => value);
  let search = "";
  $$unsubscribe_auth();
  return `${$$result.head += `<!-- HEAD_svelte-13jhk0o_START -->${$$result.title = `<title>Клиенты | CRM</title>`, ""}<!-- HEAD_svelte-13jhk0o_END -->`, ""} <div class="p-8"><div class="flex items-center justify-between mb-8" data-svelte-h="svelte-1oput4x"><h1 class="text-2xl font-bold">Клиенты</h1> <a href="/clients/new" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">+ Добавить клиента</a></div>  <div class="mb-6"><div class="flex gap-2"><input type="text" placeholder="Поиск по имени, компании..." class="flex-1 px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"${add_attribute("value", search, 0)}> <button class="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg" data-svelte-h="svelte-vov7su">Найти</button></div></div> ${`<div class="flex justify-center py-20" data-svelte-h="svelte-zif7fd"><div class="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div></div>`}</div>`;
});
export {
  Page as default
};
