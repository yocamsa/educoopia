<template>
  <header class="app-header" :class="{ 'app-header--stuck': isStuck }">
    <div class="wrap app-header__inner">
      <NuxtLink to="/" class="brand">
        <span class="brand__mark">EC</span>
        <span class="brand__text">EduCoop-IA</span>
      </NuxtLink>
      <nav class="nav">
        <NuxtLink to="/" class="nav__link">Inicio</NuxtLink>
        <NuxtLink to="/login" class="nav__link">Plataforma</NuxtLink>
        <NuxtLink to="/login" class="btn btn-p btn-sm">Entrar →</NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const isStuck = ref(false)

onMounted(() => {
  const onScroll = () => { isStuck.value = window.scrollY > 20 }
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', onScroll))
})
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 200;
  background: rgba(246,244,239,.7);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid transparent;
  transition: border-color .2s ease, background .2s ease;
}
.app-header--stuck {
  border-color: var(--brd);
  background: rgba(246,244,239,.9);
}
.app-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-family: var(--fd);
  font-weight: 800;
  color: var(--txt);
  text-decoration: none;
  letter-spacing: -.02em;
}
.brand__mark {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--grn), var(--gld));
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 900;
}
.brand__text { font-size: 18px; }
.nav {
  display: flex;
  align-items: center;
  gap: 18px;
}
.nav__link {
  font-size: 14px;
  font-weight: 600;
  color: var(--txt2);
  text-decoration: none;
  transition: color .2s ease;
}
.nav__link:hover { color: var(--grn); }

@media (max-width: 720px) {
  .nav__link { display: none; }
  .brand__text { font-size: 16px; }
}
</style>
