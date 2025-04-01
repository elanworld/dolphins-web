<template>
  <div class="background-container">
    <div class="circle top-left"></div>
    <div class="circle bottom-right"></div>
    <div class="green-accent"></div>
  </div>
</template>

<script setup lang="ts">
// No props or logic needed for this component
</script>

<style scoped>
.background-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background-color: #9feaea;
  overflow: hidden;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
}

.top-left {
  width: 300px;
  height: 300px;
  top: 20%;
  left: 15%;
}

.bottom-right {
  width: 200px;
  height: 200px;
  bottom: 10%;
  right: 10%;
}

.green-accent {
  position: absolute;
  width: 60px;
  height: 60px;
  background-color: rgba(130, 255, 130, 0.6);
  bottom: 20%;
  left: 15%;
  clip-path: polygon(0 0, 100% 100%, 0 100%);
}
</style>
