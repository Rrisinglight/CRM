import { c as create_ssr_component, v as validate_component, a as subscribe, b as each, f as createEventDispatcher, d as add_attribute, e as escape, o as onDestroy, m as missing_component } from './ssr-Biid2e9X.js';
import { t as tasksByStatus } from './websocket-wnrQWROL.js';
import './index-o6C5pnWt.js';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
var FEATURE_FLAG_NAMES = Object.freeze({
  // This flag exists as a workaround for issue 454 (basically a browser bug) - seems like these rect values take time to update when in grid layout. Setting it to true can cause strange behaviour in the REPL for non-grid zones, see issue 470
  USE_COMPUTED_STYLE_INSTEAD_OF_BOUNDING_RECT: "USE_COMPUTED_STYLE_INSTEAD_OF_BOUNDING_RECT"
});
_defineProperty({}, FEATURE_FLAG_NAMES.USE_COMPUTED_STYLE_INSTEAD_OF_BOUNDING_RECT, false);
var _ID_TO_INSTRUCTION;
var INSTRUCTION_IDs$1 = {
  DND_ZONE_ACTIVE: "dnd-zone-active",
  DND_ZONE_DRAG_DISABLED: "dnd-zone-drag-disabled"
};
_ID_TO_INSTRUCTION = {}, _defineProperty(_ID_TO_INSTRUCTION, INSTRUCTION_IDs$1.DND_ZONE_ACTIVE, "Tab to one the items and press space-bar or enter to start dragging it"), _defineProperty(_ID_TO_INSTRUCTION, INSTRUCTION_IDs$1.DND_ZONE_DRAG_DISABLED, "This is a disabled drag and drop list");
const NewCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { task } = $$props;
  let { daysInStage } = $$props;
  let { isOverdue } = $$props;
  const typeLabels = {
    article: "Статья",
    recommendation: "Рекомендательное",
    cover_letter: "Сопроводительное"
  };
  const typeColors = {
    article: "bg-blue-100 text-blue-700",
    recommendation: "bg-green-100 text-green-700",
    cover_letter: "bg-amber-100 text-amber-700"
  };
  if ($$props.task === void 0 && $$bindings.task && task !== void 0) $$bindings.task(task);
  if ($$props.daysInStage === void 0 && $$bindings.daysInStage && daysInStage !== void 0) $$bindings.daysInStage(daysInStage);
  if ($$props.isOverdue === void 0 && $$bindings.isOverdue && isOverdue !== void 0) $$bindings.isOverdue(isOverdue);
  return `<div class="space-y-3"> <h4 class="font-semibold text-lg text-gray-800">${escape(task.title)}</h4>  ${task.description ? `<p class="text-sm text-gray-600 line-clamp-2">${escape(task.description)}</p>` : ``}  <span class="${"inline-block px-2 py-1 text-xs rounded " + escape(typeColors[task.task_type], true)}">${escape(typeLabels[task.task_type])}</span>  ${task.media ? `<div class="flex items-center gap-2">${task.media.logo_url ? `<img${add_attribute("src", task.media.logo_url, 0)}${add_attribute("alt", task.media.name, 0)} class="w-5 h-5 rounded">` : ``} <span class="text-sm text-gray-600">${escape(task.media.name)}</span></div>` : ``}  <div class="flex items-center justify-between pt-2 border-t border-gray-200"> <span class="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">${escape(task.language === "RU" ? "🇷🇺 RU" : "🇬🇧 EN")}</span>  <div class="${[
    "flex items-center gap-1 text-sm text-gray-600",
    "time-badge " + (isOverdue ? "text-red-500" : "")
  ].join(" ").trim()}"><svg class="${["w-4 h-4", isOverdue ? "text-red-500" : ""].join(" ").trim()}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <span>${escape(daysInStage)} дн.</span></div></div>  <button class="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors text-white" data-svelte-h="svelte-1so3rc1">Взять в работу</button></div>`;
});
const InProgressCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { task } = $$props;
  let { daysInStage } = $$props;
  let { isOverdue } = $$props;
  if ($$props.task === void 0 && $$bindings.task && task !== void 0) $$bindings.task(task);
  if ($$props.daysInStage === void 0 && $$bindings.daysInStage && daysInStage !== void 0) $$bindings.daysInStage(daysInStage);
  if ($$props.isOverdue === void 0 && $$bindings.isOverdue && isOverdue !== void 0) $$bindings.isOverdue(isOverdue);
  return `<div class="space-y-3"> <h4 class="font-semibold text-gray-800">${escape(task.title)}</h4>  <span class="text-xs text-gray-500" data-svelte-h="svelte-983jol">В работе</span>  ${task.author ? `<div class="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">${task.author.avatar_url ? `<img${add_attribute("src", task.author.avatar_url, 0)} alt="" class="w-10 h-10 rounded-full">` : `<div class="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">${escape(task.author.first_name[0])}${escape(task.author.last_name[0])}</div>`} <div class="flex-1"><div class="font-medium text-gray-800">${escape(task.author.first_name)} ${escape(task.author.last_name)}</div> <div class="text-xs text-gray-500" data-svelte-h="svelte-1vy6t5t">Автор</div></div> ${task.author.telegram_username ? `<a href="${"https://t.me/" + escape(task.author.telegram_username, true)}" target="_blank" class="p-2 hover:bg-blue-100 rounded-full transition-colors"><svg class="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"></path></svg></a>` : ``}</div>` : ``}  <div class="flex gap-2">${task.editor ? `<div class="flex items-center gap-2 flex-1 p-1.5 bg-purple-50 rounded"><div class="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs">${escape(task.editor.first_name[0])}</div> <span class="text-xs truncate text-gray-700">${escape(task.editor.first_name)}</span></div>` : ``} ${task.manager ? `<div class="flex items-center gap-2 flex-1 p-1.5 bg-cyan-50 rounded"><div class="w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center text-xs">${escape(task.manager.first_name[0])}</div> <span class="text-xs truncate text-gray-700">${escape(task.manager.first_name)}</span></div>` : ``}</div>  ${task.google_doc_url ? `<a${add_attribute("href", task.google_doc_url, 0)} target="_blank" class="flex items-center gap-2 p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm transition-colors text-gray-700"><svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> <span data-svelte-h="svelte-o9gjkj">Google Doc</span></a>` : ``}  <div class="flex justify-end"><div class="${[
    "flex items-center gap-1 text-xs text-gray-500",
    isOverdue ? "text-red-500" : ""
  ].join(" ").trim()}"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <span>${escape(daysInStage)} дн.</span></div></div></div>`;
});
const EditorReviewCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { task } = $$props;
  let { daysInStage } = $$props;
  let { isOverdue } = $$props;
  if ($$props.task === void 0 && $$bindings.task && task !== void 0) $$bindings.task(task);
  if ($$props.daysInStage === void 0 && $$bindings.daysInStage && daysInStage !== void 0) $$bindings.daysInStage(daysInStage);
  if ($$props.isOverdue === void 0 && $$bindings.isOverdue && isOverdue !== void 0) $$bindings.isOverdue(isOverdue);
  return `<div class="space-y-3"> <h4 class="font-semibold">${escape(task.title)}</h4>  ${task.media ? `<div class="flex items-center gap-2 text-sm text-gray-600">${task.media.logo_url ? `<img${add_attribute("src", task.media.logo_url, 0)} alt="" class="w-4 h-4 rounded">` : ``} <span>${escape(task.media.name)}</span></div>` : ``}  ${task.editor ? `<div class="flex items-center gap-3 p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg">${task.editor.avatar_url ? `<img${add_attribute("src", task.editor.avatar_url, 0)} alt="" class="w-10 h-10 rounded-full">` : `<div class="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center font-medium">${escape(task.editor.first_name[0])}${escape(task.editor.last_name[0])}</div>`} <div class="flex-1"><div class="font-medium">${escape(task.editor.first_name)} ${escape(task.editor.last_name)}</div> <div class="text-xs text-purple-400" data-svelte-h="svelte-71lqcs">Редактор</div></div> ${task.editor.telegram_username ? `<a href="${"https://t.me/" + escape(task.editor.telegram_username, true)}" target="_blank" class="p-2 hover:bg-purple-500/20 rounded-full transition-colors"><svg class="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"></path></svg></a>` : ``}</div>` : ``}  ${task.author ? `<div class="flex items-center gap-2 text-sm"><span class="text-gray-500" data-svelte-h="svelte-1dv9ugq">Автор:</span> <span>${escape(task.author.first_name)} ${escape(task.author.last_name)}</span> ${task.author.telegram_username ? `<a href="${"https://t.me/" + escape(task.author.telegram_username, true)}" target="_blank" class="text-blue-400 hover:text-blue-300">@${escape(task.author.telegram_username)}</a>` : ``}</div>` : ``}  ${task.google_doc_url ? `<a${add_attribute("href", task.google_doc_url, 0)} target="_blank" class="flex items-center gap-2 p-2 bg-gray-200/50 hover:bg-gray-200 rounded-lg text-sm transition-colors"><svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> <span data-svelte-h="svelte-o9gjkj">Google Doc</span></a>` : ``}  <div class="flex justify-end"><div class="${["flex items-center gap-1 text-xs", isOverdue ? "text-red-500" : ""].join(" ").trim()}"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <span>${escape(daysInStage)} дн.</span></div></div></div>`;
});
const ClientApprovalCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { task } = $$props;
  let { daysInStage } = $$props;
  let { isOverdue } = $$props;
  if ($$props.task === void 0 && $$bindings.task && task !== void 0) $$bindings.task(task);
  if ($$props.daysInStage === void 0 && $$bindings.daysInStage && daysInStage !== void 0) $$bindings.daysInStage(daysInStage);
  if ($$props.isOverdue === void 0 && $$bindings.isOverdue && isOverdue !== void 0) $$bindings.isOverdue(isOverdue);
  return `<div class="space-y-3"> <h4 class="font-semibold">${escape(task.title)}</h4>  ${task.media ? `<div class="flex items-center gap-2 text-sm text-gray-600">${task.media.logo_url ? `<img${add_attribute("src", task.media.logo_url, 0)} alt="" class="w-4 h-4 rounded">` : ``} <span>${escape(task.media.name)}</span></div>` : ``}  ${task.client ? `<div class="flex items-center gap-3 p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">${task.client.avatar_url ? `<img${add_attribute("src", task.client.avatar_url, 0)} alt="" class="w-10 h-10 rounded-full">` : `<div class="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center font-medium text-black">${escape(task.client.first_name[0])}${escape(task.client.last_name[0])}</div>`} <div class="flex-1"><div class="font-medium">${escape(task.client.first_name)} ${escape(task.client.last_name)}</div> <div class="text-xs text-amber-400" data-svelte-h="svelte-102c341">Клиент</div></div> ${task.client.telegram_username ? `<a href="${"https://t.me/" + escape(task.client.telegram_username, true)}" target="_blank" class="p-2 hover:bg-amber-500/20 rounded-full transition-colors"><svg class="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"></path></svg></a>` : ``}</div>` : ``}  ${task.description ? `<p class="text-sm text-gray-600 line-clamp-2">${escape(task.description)}</p>` : ``}  ${task.author ? `<div class="text-sm text-gray-500">Автор: ${escape(task.author.first_name)} ${escape(task.author.last_name)}</div>` : ``}  ${task.google_doc_url ? `<a${add_attribute("href", task.google_doc_url, 0)} target="_blank" class="flex items-center gap-2 p-2 bg-gray-200/50 hover:bg-gray-200 rounded-lg text-sm transition-colors"><svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> <span data-svelte-h="svelte-o9gjkj">Google Doc</span></a>` : ``}  <div class="flex justify-end"><div class="${["flex items-center gap-1 text-xs", isOverdue ? "text-red-500" : ""].join(" ").trim()}"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <span>${escape(daysInStage)} дн.</span></div></div></div>`;
});
const ClientApprovedCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { task } = $$props;
  let { daysInStage } = $$props;
  let { isOverdue } = $$props;
  if ($$props.task === void 0 && $$bindings.task && task !== void 0) $$bindings.task(task);
  if ($$props.daysInStage === void 0 && $$bindings.daysInStage && daysInStage !== void 0) $$bindings.daysInStage(daysInStage);
  if ($$props.isOverdue === void 0 && $$bindings.isOverdue && isOverdue !== void 0) $$bindings.isOverdue(isOverdue);
  return `<div class="space-y-3"> <h4 class="font-semibold">${escape(task.title)}</h4>  ${task.media ? `<div class="p-3 bg-green-500/10 border border-green-500/30 rounded-lg"><div class="flex items-center gap-3">${task.media.logo_url ? `<img${add_attribute("src", task.media.logo_url, 0)} alt="" class="w-12 h-12 rounded-lg object-cover">` : `<div class="w-12 h-12 rounded-lg bg-green-500/30 flex items-center justify-center" data-svelte-h="svelte-29xq5f"><svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg></div>`} <div class="flex-1"><div class="font-medium">${escape(task.media.name)}</div> ${task.media.website_url ? `<a${add_attribute("href", task.media.website_url, 0)} target="_blank" class="text-xs text-green-400 hover:text-green-300">${escape(task.media.website_url)}</a>` : ``}</div></div></div>` : ``}  ${task.author ? `<div class="flex items-center gap-2 text-sm"><span class="text-gray-500" data-svelte-h="svelte-1dv9ugq">Автор:</span> <span>${escape(task.author.first_name)} ${escape(task.author.last_name)}</span> ${task.author.telegram_username ? `<a href="${"https://t.me/" + escape(task.author.telegram_username, true)}" target="_blank" class="text-blue-400 hover:text-blue-300 text-xs">TG</a>` : ``}</div>` : ``}  ${task.google_doc_url ? `<a${add_attribute("href", task.google_doc_url, 0)} target="_blank" class="flex items-center gap-2 p-2 bg-gray-200/50 hover:bg-gray-200 rounded-lg text-sm transition-colors"><svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> <span data-svelte-h="svelte-elz43t">Финальная версия</span></a>` : ``}  <div class="flex justify-end"><div class="${["flex items-center gap-1 text-xs", isOverdue ? "text-red-500" : ""].join(" ").trim()}"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <span>${escape(daysInStage)} дн.</span></div></div></div>`;
});
const SentToMediaCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { task } = $$props;
  let { daysInStage } = $$props;
  let { isOverdue } = $$props;
  if ($$props.task === void 0 && $$bindings.task && task !== void 0) $$bindings.task(task);
  if ($$props.daysInStage === void 0 && $$bindings.daysInStage && daysInStage !== void 0) $$bindings.daysInStage(daysInStage);
  if ($$props.isOverdue === void 0 && $$bindings.isOverdue && isOverdue !== void 0) $$bindings.isOverdue(isOverdue);
  return `<div class="space-y-3"> <h4 class="font-semibold">${escape(task.title)}</h4>  ${task.media ? `<div class="flex items-center gap-2">${task.media.logo_url ? `<img${add_attribute("src", task.media.logo_url, 0)} alt="" class="w-8 h-8 rounded">` : ``} <div><div class="font-medium">${escape(task.media.name)}</div> ${task.media.website_url ? `<a${add_attribute("href", task.media.website_url, 0)} target="_blank" class="text-xs text-blue-400">Сайт</a>` : ``}</div></div>` : ``}  ${task.manager ? `<div class="flex items-center gap-3 p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">${task.manager.avatar_url ? `<img${add_attribute("src", task.manager.avatar_url, 0)} alt="" class="w-10 h-10 rounded-full">` : `<div class="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center font-medium text-black">${escape(task.manager.first_name[0])}${escape(task.manager.last_name[0])}</div>`} <div class="flex-1"><div class="font-medium">${escape(task.manager.first_name)} ${escape(task.manager.last_name)}</div> <div class="text-xs text-cyan-400" data-svelte-h="svelte-64lpu2">Менеджер</div></div> ${task.manager.telegram_username ? `<a href="${"https://t.me/" + escape(task.manager.telegram_username, true)}" target="_blank" class="p-2 hover:bg-cyan-500/20 rounded-full transition-colors"><svg class="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"></path></svg></a>` : ``}</div>` : ``}  ${task.sent_to_whom || task.sent_method ? `<div class="text-sm text-gray-600 space-y-1">${task.sent_to_whom ? `<div>Кому: ${escape(task.sent_to_whom)}</div>` : ``} ${task.sent_method ? `<div>Способ: ${escape(task.sent_method)}</div>` : ``}</div>` : ``}  ${task.author ? `<div class="text-sm text-gray-500">Автор: ${escape(task.author.first_name)} ${escape(task.author.last_name)}</div>` : ``}  <div class="flex justify-between items-center text-sm"><span class="text-gray-500" data-svelte-h="svelte-1l2dp29">В редакции:</span> <div class="${["flex items-center gap-1", isOverdue ? "text-red-500" : ""].join(" ").trim()}"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <span>${escape(daysInStage)} дн.</span></div></div></div>`;
});
function formatDate$1(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("ru-RU");
}
const PublishedCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { task } = $$props;
  let { daysInStage } = $$props;
  let { isOverdue } = $$props;
  if ($$props.task === void 0 && $$bindings.task && task !== void 0) $$bindings.task(task);
  if ($$props.daysInStage === void 0 && $$bindings.daysInStage && daysInStage !== void 0) $$bindings.daysInStage(daysInStage);
  if ($$props.isOverdue === void 0 && $$bindings.isOverdue && isOverdue !== void 0) $$bindings.isOverdue(isOverdue);
  return `<div class="space-y-3"> <h4 class="font-semibold">${escape(task.title)}</h4>  ${task.media ? `<div class="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg"><div class="flex items-center gap-3">${task.media.logo_url ? `<img${add_attribute("src", task.media.logo_url, 0)} alt="" class="w-10 h-10 rounded-lg object-cover">` : ``} <div class="flex-1"><div class="font-medium">${escape(task.media.name)}</div> ${task.publication_date ? `<div class="text-xs text-emerald-400">Опубликовано: ${escape(formatDate$1(task.publication_date))}</div>` : ``}</div></div> ${task.publication_url ? `<a${add_attribute("href", task.publication_url, 0)} target="_blank" class="mt-2 flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg> <span data-svelte-h="svelte-ywc1wl">Открыть публикацию</span></a>` : ``}</div>` : ``}  <div class="flex flex-wrap gap-2 text-xs">${task.author ? `<div class="px-2 py-1 bg-blue-500/20 rounded">Автор: ${escape(task.author.first_name)}</div>` : ``} ${task.editor ? `<div class="px-2 py-1 bg-purple-500/20 rounded">Редактор: ${escape(task.editor.first_name)}</div>` : ``} ${task.manager ? `<div class="px-2 py-1 bg-cyan-500/20 rounded">Менеджер: ${escape(task.manager.first_name)}</div>` : ``}</div>  ${task.client_gratitude ? `<div class="p-2 bg-gray-200/50 rounded-lg italic text-sm text-gray-600">&quot;${escape(task.client_gratitude)}&quot;</div>` : ``}  ${task.description ? `<p class="text-sm text-gray-500 line-clamp-2">${escape(task.description)}</p>` : ``}  <button class="w-full py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm transition-colors" data-svelte-h="svelte-1qu6iro">В архив</button></div>`;
});
function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("ru-RU");
}
const PostponedCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let resumeApproaching;
  let { task } = $$props;
  let { daysInStage } = $$props;
  let { isOverdue } = $$props;
  if ($$props.task === void 0 && $$bindings.task && task !== void 0) $$bindings.task(task);
  if ($$props.daysInStage === void 0 && $$bindings.daysInStage && daysInStage !== void 0) $$bindings.daysInStage(daysInStage);
  if ($$props.isOverdue === void 0 && $$bindings.isOverdue && isOverdue !== void 0) $$bindings.isOverdue(isOverdue);
  resumeApproaching = task.postpone_resume_date && new Date(task.postpone_resume_date).getTime() - Date.now() < 3 * 24 * 60 * 60 * 1e3 && new Date(task.postpone_resume_date) > /* @__PURE__ */ new Date();
  return `<div class="space-y-3"> <h4 class="font-semibold text-gray-800">${escape(task.title)}</h4>  ${task.postpone_reason ? `<div class="p-2 bg-red-50 border border-red-200 rounded-lg"><div class="text-xs text-red-600 mb-1" data-svelte-h="svelte-12rw7jw">Причина остановки:</div> <p class="text-sm text-gray-700">${escape(task.postpone_reason)}</p></div>` : ``}  ${task.postpone_resume_date ? `<div class="${"flex items-center justify-between p-2 rounded-lg " + escape(
    resumeApproaching ? "bg-amber-50 border border-amber-200" : "bg-gray-50",
    true
  )}"><div><div class="text-xs text-gray-500" data-svelte-h="svelte-86gria">Дата возобновления:</div> <div class="${"font-medium text-gray-800 " + escape(resumeApproaching ? "text-amber-600" : "", true)}">${escape(formatDate(task.postpone_resume_date))}</div></div> ${resumeApproaching ? `<div class="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></div>` : ``}</div>` : ``}  ${task.manager ? `<div class="flex items-center gap-2 text-sm"><span class="text-gray-500" data-svelte-h="svelte-i31cuv">Ответственный:</span> <span class="text-gray-800">${escape(task.manager.first_name)} ${escape(task.manager.last_name)}</span></div>` : `${task.author ? `<div class="flex items-center gap-2 text-sm"><span class="text-gray-500" data-svelte-h="svelte-i31cuv">Ответственный:</span> <span class="text-gray-800">${escape(task.author.first_name)} ${escape(task.author.last_name)}</span></div>` : ``}`}  <div class="flex justify-end"><div class="flex items-center gap-1 text-xs text-gray-500"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <span>Отложено ${escape(daysInStage)} дн.</span></div></div>  <button class="w-full py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors text-white" data-svelte-h="svelte-1mmmicp">Вернуть в работу</button></div>`;
});
const TaskCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let daysInStage;
  let isOverdue;
  let { task } = $$props;
  let { stage } = $$props;
  createEventDispatcher();
  const stageComponents = {
    new: NewCard,
    in_progress: InProgressCard,
    editor_review: EditorReviewCard,
    client_approval: ClientApprovalCard,
    client_approved: ClientApprovedCard,
    sent_to_media: SentToMediaCard,
    published: PublishedCard,
    postponed: PostponedCard
  };
  const typeColors = {
    article: "bg-task-article",
    recommendation: "bg-task-recommendation",
    cover_letter: "bg-task-cover"
  };
  onDestroy(() => {
  });
  if ($$props.task === void 0 && $$bindings.task && task !== void 0) $$bindings.task(task);
  if ($$props.stage === void 0 && $$bindings.stage && stage !== void 0) $$bindings.stage(stage);
  daysInStage = Math.floor((Date.now() - new Date(task.status_changed_at).getTime()) / (1e3 * 60 * 60 * 24));
  isOverdue = daysInStage > 3;
  return `<div class="${[
    "task-card bg-white rounded-lg overflow-hidden cursor-pointer relative border border-gray-200 shadow-sm",
    " " + (isOverdue ? "overdue" : "")
  ].join(" ").trim()}" role="button" tabindex="0"> <div class="${"h-1 " + escape(typeColors[task.task_type] || "bg-gray-500", true)}"></div>  <div class="p-3">${validate_component(stageComponents[stage] || missing_component, "svelte:component").$$render($$result, { task, daysInStage, isOverdue }, {}, {})}</div>  ${``}  ${task.iteration > 0 ? `<div class="absolute bottom-2 right-2 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">${escape(task.iteration)}</div>` : ``}</div>`;
});
const Column = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { column } = $$props;
  let { tasks: tasks$1 = [] } = $$props;
  if ($$props.column === void 0 && $$bindings.column && column !== void 0) $$bindings.column(column);
  if ($$props.tasks === void 0 && $$bindings.tasks && tasks$1 !== void 0) $$bindings.tasks(tasks$1);
  return `<div class="kanban-column w-80 flex-shrink-0"><div class="kanban-column-header"><div class="flex items-center gap-2"><div class="${"w-3 h-3 rounded-full " + escape(column.color, true)}"></div> <span>${escape(column.label)}</span></div> <span class="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">${escape(tasks$1.length)}</span></div> <div class="kanban-column-content">${each(tasks$1, (task) => {
    return `<div>${validate_component(TaskCard, "TaskCard").$$render($$result, { task, stage: column.id }, {}, {})} </div>`;
  })}</div></div> ${``}`;
});
const SearchBar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  createEventDispatcher();
  let inputValue = "";
  let tokens = [];
  return `<div class="relative"><div class="flex items-center gap-2 px-4 py-3 bg-white rounded-lg border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 shadow-sm"> <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>  <div class="flex items-center gap-2 flex-wrap flex-1">${each(tokens, (token, index) => {
    return `<span class="${"search-token " + escape(token.type, true)}">${escape(token.value)} <button type="button" class="ml-1 hover:text-gray-800" data-svelte-h="svelte-1xcpk4o">×</button> </span>`;
  })}  <input type="text"${add_attribute(
    "placeholder",
    tokens.length === 0 ? "Поиск... (@сотрудник, #СМИ, автор:, редактор:)" : "",
    0
  )} class="flex-1 min-w-[200px] bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400"${add_attribute("value", inputValue, 0)}></div>  ${tokens.length > 0 || inputValue ? `<button type="button" class="p-1 hover:bg-gray-100 rounded transition-colors text-gray-500" data-svelte-h="svelte-1y7crf6"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>` : ``}</div>  ${``}</div>`;
});
const Board = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $tasksByStatus, $$unsubscribe_tasksByStatus;
  $$unsubscribe_tasksByStatus = subscribe(tasksByStatus, (value) => $tasksByStatus = value);
  const columns = [
    {
      id: "new",
      label: "Новые",
      color: "bg-gray-500"
    },
    {
      id: "in_progress",
      label: "В работе",
      color: "bg-blue-500"
    },
    {
      id: "editor_review",
      label: "На проверке редактора",
      color: "bg-purple-500"
    },
    {
      id: "client_approval",
      label: "На согласовании у клиента",
      color: "bg-amber-500"
    },
    {
      id: "client_approved",
      label: "Согласовано клиентом",
      color: "bg-green-500"
    },
    {
      id: "sent_to_media",
      label: "Отправлено в СМИ",
      color: "bg-cyan-500"
    },
    {
      id: "published",
      label: "Опубликовано",
      color: "bg-emerald-500"
    },
    {
      id: "postponed",
      label: "Отложено",
      color: "bg-red-500"
    }
  ];
  $$unsubscribe_tasksByStatus();
  return `<div class="flex flex-col h-full"> <div class="p-4 border-b border-gray-200 bg-white">${validate_component(SearchBar, "SearchBar").$$render($$result, {}, {}, {})}</div>  <div class="flex-1 overflow-x-auto p-4"><div class="flex gap-4 min-w-max h-full">${each(columns, (column) => {
    return `${validate_component(Column, "Column").$$render(
      $$result,
      {
        column,
        tasks: $tasksByStatus[column.id] || []
      },
      {},
      {}
    )}`;
  })}</div></div></div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `<!-- HEAD_svelte-1nzkjl4_START -->${$$result.title = `<title>Задачи | CRM</title>`, ""}<!-- HEAD_svelte-1nzkjl4_END -->`, ""} <div class="h-screen">${validate_component(Board, "Board").$$render($$result, {}, {}, {})}</div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-COpDfFAB.js.map
