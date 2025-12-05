import { c as create_ssr_component, a as subscribe, d as add_attribute, e as escape, b as each } from './ssr-Biid2e9X.js';
import './ssr2-KRueQ-Mb.js';
import './state.svelte-Bbc4_9mM.js';
import { a as auth } from './websocket-wnrQWROL.js';
import './index-o6C5pnWt.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_auth;
  $$unsubscribe_auth = subscribe(auth, (value) => value);
  let formData = {
    name: "",
    website_url: ""
  };
  const categories = [
    { value: "деловое", label: "Деловое" },
    { value: "lifestyle", label: "Lifestyle" },
    { value: "IT", label: "IT" },
    {
      value: "региональное",
      label: "Региональное"
    }
  ];
  $$unsubscribe_auth();
  return `${$$result.head += `<!-- HEAD_svelte-497a8z_START -->${$$result.title = `<title>Новое СМИ | CRM</title>`, ""}<!-- HEAD_svelte-497a8z_END -->`, ""} <div class="p-8 max-w-2xl mx-auto"><div class="flex items-center gap-4 mb-8" data-svelte-h="svelte-1jpnk58"><a href="/media" class="p-2 hover:bg-gray-100 rounded-lg transition-colors"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></a> <h1 class="text-2xl font-bold">Новое СМИ</h1></div> <form class="space-y-6">${``}  <div><label class="block text-sm font-medium mb-2" data-svelte-h="svelte-4gozwv">Название *</label> <input type="text" required placeholder="Forbes, РБК, Ведомости..." class="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"${add_attribute("value", formData.name, 0)}></div>  <div><label class="block text-sm font-medium mb-2" data-svelte-h="svelte-548fvh">Описание</label> <textarea rows="3" placeholder="Краткое описание издания..." class="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none">${escape("")}</textarea></div>  <div class="grid grid-cols-2 gap-4"><div><label class="block text-sm font-medium mb-2" data-svelte-h="svelte-1n14pm8">Категория</label> <select class="w-full px-4 py-3 pr-10 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 appearance-none bg-no-repeat cursor-pointer" style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%236b7280%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e'); background-position: right 0.75rem center; background-size: 1.25rem;"><option value="" data-svelte-h="svelte-1feyef5">Не выбрана</option>${each(categories, (cat) => {
    return `<option${add_attribute("value", cat.value, 0)}>${escape(cat.label)}</option>`;
  })}</select></div> <div><label class="block text-sm font-medium mb-2" data-svelte-h="svelte-15z9jmh">Язык публикаций</label> <select class="w-full px-4 py-3 pr-10 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 appearance-none bg-no-repeat cursor-pointer" style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%236b7280%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e'); background-position: right 0.75rem center; background-size: 1.25rem;"><option value="RU" data-svelte-h="svelte-1xj7rlc">🇷🇺 Русский</option><option value="EN" data-svelte-h="svelte-1q4rti8">🇬🇧 English</option></select></div></div>  <div><label class="block text-sm font-medium mb-2" data-svelte-h="svelte-14b8gfn">Сайт</label> <input type="url" placeholder="https://example.com" class="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"${add_attribute("value", formData.website_url, 0)}></div>  <div><label class="block text-sm font-medium mb-2" data-svelte-h="svelte-ds4jk8">Примечания</label> <textarea rows="3" placeholder="Особые условия, формат публикации, требования..." class="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none">${escape("")}</textarea></div>  <div class="flex gap-4 pt-4"><a href="/media" class="flex-1 py-3 text-center border border-gray-300 hover:bg-gray-100 rounded-lg transition-colors" data-svelte-h="svelte-dycuge">Отмена</a> <button type="submit" ${""} class="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg font-medium transition-colors text-white">${`Добавить СМИ`}</button></div></form></div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-al3iwe-8.js.map
