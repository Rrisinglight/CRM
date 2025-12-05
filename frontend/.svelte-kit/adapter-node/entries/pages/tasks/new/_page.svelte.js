import { c as create_ssr_component, a as subscribe, e as each, d as add_attribute, b as escape } from "../../../../chunks/ssr.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/state.svelte.js";
import { a as auth, A as API_BASE } from "../../../../chunks/websocket.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $auth, $$unsubscribe_auth;
  $$unsubscribe_auth = subscribe(auth, (value) => $auth = value);
  let formData = {
    title: "",
    google_doc_url: "",
    google_forms_url: ""
  };
  let clients = [];
  let mediaList = [];
  async function loadData() {
    try {
      const [clientsRes, mediaRes] = await Promise.all([
        fetch(`${API_BASE}/api/clients/`, {
          headers: { "Authorization": `Bearer ${$auth.token}` }
        }),
        fetch(`${API_BASE}/api/media/`, {
          headers: { "Authorization": `Bearer ${$auth.token}` }
        })
      ]);
      clients = await clientsRes.json();
      mediaList = await mediaRes.json();
    } catch (e) {
      console.error("Failed to load data:", e);
    }
  }
  loadData();
  $$unsubscribe_auth();
  return `${$$result.head += `<!-- HEAD_svelte-8azaqu_START -->${$$result.title = `<title>Новая задача | CRM</title>`, ""}<!-- HEAD_svelte-8azaqu_END -->`, ""} <div class="p-8 max-w-2xl mx-auto"><div class="flex items-center gap-4 mb-8" data-svelte-h="svelte-1l7ie9v"><a href="/tasks" class="p-2 hover:bg-gray-100 rounded-lg transition-colors"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></a> <h1 class="text-2xl font-bold">Новая задача</h1></div> <form class="space-y-6">${``}  <div><label class="block text-sm font-medium mb-2" data-svelte-h="svelte-8v7qhg">Клиент *</label> <select required class="w-full px-4 py-3 pr-10 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 appearance-none bg-no-repeat cursor-pointer" style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%236b7280%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e'); background-position: right 0.75rem center; background-size: 1.25rem;"><option value="" data-svelte-h="svelte-1s1t1ip">Выберите клиента</option>${each(clients, (client) => {
    return `<option${add_attribute("value", client.id, 0)}>${escape(client.first_name)} ${escape(client.last_name)}</option>`;
  })}</select></div>  <div><label class="block text-sm font-medium mb-2" data-svelte-h="svelte-mgqc4i">Заголовок *</label> <input type="text" required placeholder="ФИ клиента или название задачи" class="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"${add_attribute("value", formData.title, 0)}></div>  <div><label class="block text-sm font-medium mb-2" data-svelte-h="svelte-548fvh">Описание</label> <textarea rows="3" placeholder="Краткое описание задачи..." class="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 resize-none">${escape("")}</textarea></div>  <div class="grid grid-cols-2 gap-4"><div><label class="block text-sm font-medium mb-2" data-svelte-h="svelte-raokxg">Тип задачи</label> <select class="w-full px-4 py-3 pr-10 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 appearance-none bg-no-repeat cursor-pointer" style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%236b7280%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e'); background-position: right 0.75rem center; background-size: 1.25rem;"><option value="article" data-svelte-h="svelte-5xkg7f">Статья для СМИ</option><option value="recommendation" data-svelte-h="svelte-bkok3i">Рекомендательное письмо</option><option value="cover_letter" data-svelte-h="svelte-1k3sqtq">Сопроводительное письмо</option></select></div> <div><label class="block text-sm font-medium mb-2" data-svelte-h="svelte-segy0q">Язык</label> <select class="w-full px-4 py-3 pr-10 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 appearance-none bg-no-repeat cursor-pointer" style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%236b7280%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e'); background-position: right 0.75rem center; background-size: 1.25rem;"><option value="RU" data-svelte-h="svelte-1xj7rlc">🇷🇺 Русский</option><option value="EN" data-svelte-h="svelte-1q4rti8">🇬🇧 English</option></select></div></div>  <div><label class="block text-sm font-medium mb-2" data-svelte-h="svelte-1dus88o">СМИ</label> <select class="w-full px-4 py-3 pr-10 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 appearance-none bg-no-repeat cursor-pointer" style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%236b7280%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e'); background-position: right 0.75rem center; background-size: 1.25rem;"><option value="" data-svelte-h="svelte-fyb273">Не выбрано</option>${each(mediaList, (media) => {
    return `<option${add_attribute("value", media.id, 0)}>${escape(media.name)}</option>`;
  })}</select></div>  <div class="space-y-4"><div><label class="block text-sm font-medium mb-2" data-svelte-h="svelte-1vse9ok">Google Doc</label> <input type="url" placeholder="https://docs.google.com/..." class="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"${add_attribute("value", formData.google_doc_url, 0)}></div> <div><label class="block text-sm font-medium mb-2" data-svelte-h="svelte-8z7m2f">Google Forms (ответы клиента)</label> <input type="url" placeholder="https://docs.google.com/forms/..." class="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"${add_attribute("value", formData.google_forms_url, 0)}></div></div>  <div class="flex gap-4 pt-4"><a href="/tasks" class="flex-1 py-3 text-center border border-gray-300 hover:bg-gray-100 rounded-lg transition-colors" data-svelte-h="svelte-moivuc">Отмена</a> <button type="submit" ${""} class="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg font-medium transition-colors text-white">${`Создать задачу`}</button></div></form></div>`;
});
export {
  Page as default
};
