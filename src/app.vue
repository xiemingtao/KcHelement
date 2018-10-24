<template>
  <div id="main" class="app-main">
    <router-view />
  </div>
</template>

<style>
html,
body {
  width: 100%;
  height: 100%;
  background: url("/static/images/bg.png") 0 0 / 100% 100% no-repeat;
  overflow: hidden;
}
.app-main {
  width: 100%;
  height: 100%;
}
</style>
