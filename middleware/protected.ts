export default defineNuxtRouteMiddleware((to, from) => {
  if (!useNuxtApp().$auth.loggedIn) {
    return navigateTo("/api/login", { external: true });
  }
});
