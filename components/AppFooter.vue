<template>
  <footer class="app-footer">
    <div class="wrap app-footer__inner">
      <div class="app-footer__logos">
        <img src="/img/Cygnus_Logo.png" alt="Cygnus" class="app-footer__logo" />
        <img
          src="/img/IA-COOP-LAB.jpeg"
          alt="IA-COOP-LAB"
          class="app-footer__logo app-footer__logo--square"
        />
      </div>
      <p class="app-footer__legal">
        IA-COOP-LAB ® , CYGNUS ®, y todos los productos entregados son propiedad
        de ETHOS TECH LIFE, su uso so y sus empresas.
      </p>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background: white;
  border-top: 1px solid var(--brd);
  padding: 28px 0;
}
.app-footer__inner {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.app-footer__logos {
  display: flex;
  align-items: center;
  gap: 16px;
}
.app-footer__logo {
  height: 36px;
  width: auto;
  object-fit: contain;
  filter: saturate(0.9);
}
.app-footer__logo--square {
  height: 40px;
  border-radius: 6px;
}
.app-footer__legal {
  font-size: 12px;
  color: var(--txt3);
  line-height: 1.6;
}

@media (max-width: 640px) {
  .app-footer__logos {
    flex-wrap: wrap;
  }
}
</style>
