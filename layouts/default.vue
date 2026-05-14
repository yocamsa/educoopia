<template>
  <div class="page-shell">
    <AppHeader />
    <main class="page-shell__main">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.page-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.page-shell__main { flex: 1; }
</style>
