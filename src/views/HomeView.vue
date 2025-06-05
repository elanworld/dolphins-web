<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import TheWelcome from '../components/TheWelcome.vue';

// 响应式数据
const count = ref(0);
const message = ref('home page');

// 计算属性
const reversedMessage = computed(() => {
  return message.value.split('').reverse().join('');
});

// 方法
const increment = () => {
  count.value++;
};

// 生命周期钩子
onMounted(() => {
  console.log('Component mounted!');
});

// 隐藏的内容
const showHiddenContent = ref(false);
const toggleHiddenContent = () => {
  showHiddenContent.value = !showHiddenContent.value;
};
</script>

<template>
  <main class="container">
    <!-- 页面内容 -->
    <h1>{{ message }}</h1>

    <!-- 计数器 -->
    <div class="counter">
      <p>Count: {{ count }}</p>
      <button @click="increment">Increment</button>
    </div>

    <!-- 隐藏的内容 -->
    <div v-if="showHiddenContent" class="hidden-content">
      <p>This is hidden content!</p>
      <p>Reversed Message: {{ reversedMessage }}</p>
    </div>

    <!-- 切换隐藏内容的按钮 -->
    <button @click="toggleHiddenContent">
      {{ showHiddenContent ? 'Hide' : 'Show' }} Hidden Content
    </button>
  </main>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 10%;
  padding: 5%;
  text-align: center;
  font-family: Arial, sans-serif;
  gap: 5px;
}

.route {
  display: inline-block;
  margin: 10px;
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.route:hover {
  background-color: #3aa876;
}

.counter {
  margin-top: 20px;
}

.counter button {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.counter button:hover {
  background-color: #3aa876;
}

.hidden-content {
  margin-top: 20px;
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 5px;
}
</style>