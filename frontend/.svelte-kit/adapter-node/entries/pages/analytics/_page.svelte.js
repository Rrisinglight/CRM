import { c as create_ssr_component, a as subscribe, e as each, d as add_attribute, b as escape } from "../../../chunks/ssr.js";
import { a as auth } from "../../../chunks/websocket.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_auth;
  $$unsubscribe_auth = subscribe(auth, (value) => value);
  const periodLabels = {
    month: "Месяц",
    quarter: "Квартал",
    half_year: "Полгода",
    year: "Год"
  };
  $$unsubscribe_auth();
  return `${$$result.head += `<!-- HEAD_svelte-dr2szy_START -->${$$result.title = `<title>Аналитика | CRM</title>`, ""}<!-- HEAD_svelte-dr2szy_END -->`, ""} <div class="p-8"><div class="flex items-center justify-between mb-8"><h1 class="text-2xl font-bold" data-svelte-h="svelte-1s1cnbs">Аналитика</h1>  <div class="flex items-center gap-4"><select class="px-4 py-2 pr-8 bg-gray-100 border border-gray-300 rounded-lg appearance-none bg-no-repeat cursor-pointer" style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%236b7280%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e'); background-position: right 0.5rem center; background-size: 1.25rem;">${each(Object.entries(periodLabels), ([value, label]) => {
    return `<option${add_attribute("value", value, 0)}>${escape(label)}</option>`;
  })}</select> <select class="px-4 py-2 pr-8 bg-gray-100 border border-gray-300 rounded-lg appearance-none bg-no-repeat cursor-pointer" style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%236b7280%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e'); background-position: right 0.5rem center; background-size: 1.25rem;"><option value="" data-svelte-h="svelte-hv9vpz">Сравнить с...</option>${each(Object.entries(periodLabels), ([value, label]) => {
    return `<option${add_attribute("value", value, 0)}>${escape(label)}</option>`;
  })}</select></div></div> ${`<div class="flex items-center justify-center py-20" data-svelte-h="svelte-1kc2l0f"><div class="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div></div>`}</div>`;
});
export {
  Page as default
};
