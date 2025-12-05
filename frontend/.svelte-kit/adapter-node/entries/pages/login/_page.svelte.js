import { c as create_ssr_component, d as add_attribute, b as escape } from "../../../chunks/ssr.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import "../../../chunks/websocket.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let email = "";
  let password = "";
  return `<div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100"><div class="w-full max-w-md"><div class="bg-white rounded-xl p-8 shadow-xl border border-gray-200"><h1 class="text-2xl font-bold text-center mb-8 text-gray-800" data-svelte-h="svelte-1bq7sst">CRM для журналистов</h1> <form class="space-y-6">${``} <div><label for="email" class="block text-sm font-medium mb-2 text-gray-700" data-svelte-h="svelte-1k6ksji">Email</label> <input id="email" type="email" class="${"w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900 placeholder-gray-400 " + escape("border-gray-300", true)}" placeholder="your@email.com"${add_attribute("value", email, 0)}> ${``}</div> <div><label for="password" class="block text-sm font-medium mb-2 text-gray-700" data-svelte-h="svelte-1b8j21">Пароль</label> <input id="password" type="password" class="${"w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900 placeholder-gray-400 " + escape("border-gray-300", true)}" placeholder="••••••••"${add_attribute("value", password, 0)}> ${``}</div> <button type="submit" ${""} class="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-all duration-200 text-white shadow-lg hover:shadow-blue-500/30">${`Войти`}</button></form> <p class="mt-6 text-center text-sm text-gray-500" data-svelte-h="svelte-1vna6ky">Нет аккаунта?
			<a href="/register" class="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200">Зарегистрироваться</a></p></div></div></div>`;
});
export {
  Page as default
};
