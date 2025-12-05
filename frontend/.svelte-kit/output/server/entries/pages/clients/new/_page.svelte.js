import { c as create_ssr_component, a as subscribe, d as add_attribute } from "../../../../chunks/ssr.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/state.svelte.js";
import { a as auth } from "../../../../chunks/websocket.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_auth;
  $$unsubscribe_auth = subscribe(auth, (value) => value);
  let formData = {
    first_name: "",
    last_name: "",
    company: "",
    position: "",
    phone: "",
    email: "",
    telegram_username: "",
    lawyer_name: "",
    lawyer_contact: ""
  };
  $$unsubscribe_auth();
  return `${$$result.head += `<!-- HEAD_svelte-7cv7si_START -->${$$result.title = `<title>Новый клиент | CRM</title>`, ""}<!-- HEAD_svelte-7cv7si_END -->`, ""} <div class="p-8 max-w-2xl mx-auto"><div class="flex items-center gap-4 mb-8" data-svelte-h="svelte-eba1gl"><a href="/clients" class="p-2 hover:bg-gray-100 rounded-lg transition-colors"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></a> <h1 class="text-2xl font-bold">Новый клиент</h1></div> <form class="space-y-6">${``}  <div class="grid grid-cols-2 gap-4"><div><label class="block text-sm font-medium mb-2" data-svelte-h="svelte-1w4180k">Имя *</label> <input type="text" required placeholder="Алексей" class="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"${add_attribute("value", formData.first_name, 0)}></div> <div><label class="block text-sm font-medium mb-2" data-svelte-h="svelte-o5o7xv">Фамилия *</label> <input type="text" required placeholder="Иванов" class="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"${add_attribute("value", formData.last_name, 0)}></div></div>  <div class="grid grid-cols-2 gap-4"><div><label class="block text-sm font-medium mb-2" data-svelte-h="svelte-1z02l6a">Компания</label> <input type="text" placeholder="ООО Компания" class="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"${add_attribute("value", formData.company, 0)}></div> <div><label class="block text-sm font-medium mb-2" data-svelte-h="svelte-1mccgzm">Должность</label> <input type="text" placeholder="Генеральный директор" class="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"${add_attribute("value", formData.position, 0)}></div></div>  <div class="border-t border-gray-200 pt-6"><h2 class="text-lg font-semibold mb-4" data-svelte-h="svelte-1vhqunn">Контакты</h2> <div class="space-y-4"><div><label class="block text-sm font-medium mb-2" data-svelte-h="svelte-4m2usq">Telegram</label> <input type="text" placeholder="@username" class="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"${add_attribute("value", formData.telegram_username, 0)}></div> <div><label class="block text-sm font-medium mb-2" data-svelte-h="svelte-e1c99t">Email</label> <input type="email" placeholder="email@example.com" class="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"${add_attribute("value", formData.email, 0)}></div> <div><label class="block text-sm font-medium mb-2" data-svelte-h="svelte-zincgb">Телефон</label> <input type="tel" placeholder="+7 (999) 123-45-67" class="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"${add_attribute("value", formData.phone, 0)}></div></div></div>  <div class="border-t border-gray-200 pt-6"><h2 class="text-lg font-semibold mb-4" data-svelte-h="svelte-mc8uz1">Юрист / Юридическое агентство</h2> <p class="text-sm text-gray-500 mb-4" data-svelte-h="svelte-1sli054">Опционально</p> <div class="grid grid-cols-2 gap-4"><div><label class="block text-sm font-medium mb-2" data-svelte-h="svelte-37vbjq">Имя юриста / Название агентства</label> <input type="text" placeholder="Юридическое бюро" class="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"${add_attribute("value", formData.lawyer_name, 0)}></div> <div><label class="block text-sm font-medium mb-2" data-svelte-h="svelte-12962n6">Контакт</label> <input type="text" placeholder="Телефон или email" class="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"${add_attribute("value", formData.lawyer_contact, 0)}></div></div></div>  <div class="flex gap-4 pt-4"><a href="/clients" class="flex-1 py-3 text-center border border-gray-300 hover:bg-gray-100 rounded-lg transition-colors" data-svelte-h="svelte-1vs8ue">Отмена</a> <button type="submit" ${""} class="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg font-medium transition-colors text-white">${`Добавить клиента`}</button></div></form></div>`;
});
export {
  Page as default
};
