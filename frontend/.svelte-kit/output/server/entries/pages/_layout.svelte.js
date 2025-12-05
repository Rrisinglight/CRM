import { c as create_ssr_component, a as subscribe, e as each, b as escape, d as add_attribute, v as validate_component } from "../../chunks/ssr.js";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../chunks/state.svelte.js";
import { p as page } from "../../chunks/stores.js";
import { a as auth } from "../../chunks/websocket.js";
const Sidebar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  let $auth, $$unsubscribe_auth;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_auth = subscribe(auth, (value) => $auth = value);
  let { collapsed = false } = $$props;
  const navItems = [
    {
      href: "/tasks",
      icon: "kanban",
      label: "Задачи"
    },
    {
      href: "/clients",
      icon: "users",
      label: "Клиенты"
    },
    {
      href: "/media",
      icon: "newspaper",
      label: "СМИ"
    },
    {
      href: "/archive",
      icon: "archive",
      label: "Архив"
    },
    {
      href: "/analytics",
      icon: "chart",
      label: "Аналитика"
    }
  ];
  const icons = {
    kanban: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />`,
    users: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />`,
    newspaper: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />`,
    archive: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />`,
    chart: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />`,
    plus: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />`,
    settings: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />`,
    logout: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />`
  };
  if ($$props.collapsed === void 0 && $$bindings.collapsed && collapsed !== void 0) $$bindings.collapsed(collapsed);
  $$unsubscribe_page();
  $$unsubscribe_auth();
  return `<aside class="${["sidebar", collapsed ? "collapsed" : ""].join(" ").trim()}"> <div class="p-4 border-b border-gray-200"><h1 class="${["text-xl font-bold text-gray-800", collapsed ? "hidden" : ""].join(" ").trim()}" data-svelte-h="svelte-lkv8bz">CRM</h1> ${collapsed ? `<div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white" data-svelte-h="svelte-17l3jih">C</div>` : ``}</div>  <div class="${["p-4", collapsed ? "px-3" : ""].join(" ").trim()}"><a href="/tasks/new" class="${[
    "flex items-center gap-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white",
    (!collapsed ? "px-4" : "") + " " + (!collapsed ? "py-3" : "") + " " + (collapsed ? "w-10" : "") + " " + (collapsed ? "h-10" : "") + " " + (collapsed ? "justify-center" : "")
  ].join(" ").trim()}"><svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><!-- HTML_TAG_START -->${icons.plus}<!-- HTML_TAG_END --></svg> ${!collapsed ? `<span data-svelte-h="svelte-118e5gc">Создать</span>` : ``}</a></div>  <nav class="flex-1 px-2">${each(navItems, (item) => {
    return `<a${add_attribute("href", item.href, 0)} class="${[
      "sidebar-item",
      ($page.url.pathname.startsWith(item.href) ? "active" : "") + " " + (collapsed ? "justify-center" : "") + " " + (collapsed ? "px-0" : "")
    ].join(" ").trim()}"><svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><!-- HTML_TAG_START -->${icons[item.icon]}<!-- HTML_TAG_END --></svg> ${!collapsed ? `<span>${escape(item.label)}</span>` : ``} </a>`;
  })}</nav>  <div class="${["p-4 border-t border-gray-200", collapsed ? "px-3" : ""].join(" ").trim()}">${$auth.user ? `${collapsed ? ` <div class="flex justify-center mb-3"><div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-medium flex-shrink-0 text-white">${escape($auth.user.first_name?.[0])}${escape($auth.user.last_name?.[0])}</div></div> <button class="sidebar-item justify-center px-0 text-gray-600 hover:text-gray-800 hover:bg-gray-100" title="Выйти"><svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><!-- HTML_TAG_START -->${icons.logout}<!-- HTML_TAG_END --></svg></button>` : ` <div class="flex items-center gap-3"><div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-medium flex-shrink-0 text-white">${escape($auth.user.first_name?.[0])}${escape($auth.user.last_name?.[0])}</div> <div class="min-w-0 flex-1"><div class="font-medium truncate text-gray-800">${escape($auth.user.first_name)} ${escape($auth.user.last_name)}</div> <div class="text-xs text-gray-500 truncate">${escape($auth.user.email)}</div></div> <button class="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors" title="Выйти"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><!-- HTML_TAG_START -->${icons.logout}<!-- HTML_TAG_END --></svg></button></div>`}` : ``}</div>  <button class="absolute top-4 -right-3 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600 shadow-sm"><svg class="${["w-4 h-4 transition-transform", collapsed ? "rotate-180" : ""].join(" ").trim()}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></button></aside>`;
});
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let showSidebar;
  let $page, $$unsubscribe_page;
  let $auth, $$unsubscribe_auth;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_auth = subscribe(auth, (value) => $auth = value);
  let sidebarCollapsed = false;
  const publicRoutes = ["/login", "/register"];
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    showSidebar = $auth.isAuthenticated && !publicRoutes.includes($page.url.pathname);
    $$rendered = `<div class="min-h-screen bg-surface-100">${showSidebar ? `${validate_component(Sidebar, "Sidebar").$$render(
      $$result,
      { collapsed: sidebarCollapsed },
      {
        collapsed: ($$value) => {
          sidebarCollapsed = $$value;
          $$settled = false;
        }
      },
      {}
    )} <main class="transition-all duration-300" style="${"margin-left: " + escape(sidebarCollapsed ? "4rem" : "16rem", true)}">${slots.default ? slots.default({}) : ``}</main>` : `${slots.default ? slots.default({}) : ``}`}</div>`;
  } while (!$$settled);
  $$unsubscribe_page();
  $$unsubscribe_auth();
  return $$rendered;
});
export {
  Layout as default
};
