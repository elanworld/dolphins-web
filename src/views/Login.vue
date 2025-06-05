<template>
  <div class="index">
    <div class="box">
      <h1 class="login-title">{{ loginPage ? "登录" : "修改密码" }}</h1>

      <div class="input-view">
        <label class="label">账号</label>
        <input
          class="input-box"
          type="text"
          v-model="userName"
        >
      </div>

      <div class="input-view">
        <label class="label">密码</label>
        <input
          class="input-box"
          type="password"
          v-model="password"
          @keyup.enter="loginPage ? onClickLogin() : onClickSubmit()"
        >
      </div>

      <a class="changePasswd" @click="loginPage = !loginPage">
        {{ loginPage ? "修改密码" : "登录页面" }}
      </a>

      <div class="btn-box">
        <template v-if="loginPage">
          <button class="btn login-btn" @click="onClickLogin">登录</button>
          <button class="btn register-btn" @click="onClickReg">注册</button>
          <button class="btn forgot-btn" @click="onClickAnno">匿名</button>
        </template>
        <template v-else>
          <button class="btn" @click="onClickSubmit">修改</button>
        </template>
      </div>
    </div>

    <a class="beian" href="https://beian.miit.gov.cn" target="_blank" v-if="beian">
      {{ beian }}
    </a>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Background from '../components/Background.vue';
import api from '../service/Api.vue';
import {service, setStorage} from '../service/Service';
import { useRouter } from 'vue-router';

// State variables
const loginPage = ref(true);
const userName = ref('');
const password = ref('');
const beian = ref('');
const router = useRouter();
// Check if running in browser and set beian number
onMounted(() => {
  if (typeof window !== 'undefined') {
    beian.value = '备案号:黔ICP备2021009251号-1';
  }
});

// Input handlers
const onClickLogin = () => {
  const url_data = `?username=${userName.value}&password=${password.value}`;

  fetch(`${api.login}${url_data}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    const auth = response.headers.get('Authorization') || response.headers.get('authorization');
    if (auth) {
      setStorage('Authorization', auth);
      router.push('/');
    }
  })
  .catch(error => {
    console.error(error);
    alert('登录失败');
  });
};

const onClickAnno = () => {
  userName.value = 'test';
  password.value = 'password123';
  onClickLogin();
};

const onClickReg = () => {
  fetch(api.register, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userName: userName.value,
      password: password.value
    }),
    credentials: 'include'
  })
  .then(async response => {
    const data = await response.json();
    if (data?.code === 0) {
      // Assuming the authorization header is returned in the response
      const auth = response.headers.get('authorization');
      if (auth) {
        setStorage('Authorization', auth);
      }
      alert('注册成功');
    } else {
      alert(data?.msg || '注册失败');
    }
  })
  .catch(() => {
    alert('注册失败');
  });
};

const onClickSubmit = () => {
  fetch(api.register, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userName: userName.value,
      password: password.value
    }),
    credentials: 'include'
  })
  .then(async response => {
    const data = await response.json();
    if (data?.code === 0) {
      // Assuming the authorization header is returned in the response
      const auth = response.headers.get('authorization');
      if (auth) {
        setStorage('Authorization', auth);
      }
      alert('修改成功');
    } else {
      alert(data?.msg || '修改失败');
    }
  })
  .catch(() => {
    alert('修改失败');
  });
};
</script>

<style scoped>
/* Login page styles */
.index {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.box {
  width: 80%;
  background-color: rgba(148, 197, 197, 0.7);
  position: relative;
}

.login-title {
  text-align: center;
  color: #3fe73f;
  font-size: 24px;
  padding: 10px 0;
  margin: 0;
  font-weight: normal;
}

.input-view {
  padding: 10px;
  background-color: rgba(148, 197, 197, 0.9);
}

.input-view:first-of-type {
  margin-top: 10px;
}

.label {
  display: block;
  margin-bottom: 5px;
  color: #333;
}

.input-box {
  width: 90%;
  padding-inline-end: 5%;
  border: none;
  background-color: #f0f0f0;
  border-radius: 0;
  font-size: 16px;
}

.changePasswd {
  display: block;
  text-align: right;
  padding: 5px 10px;
  font-size: 14px;
  color: #333;
  text-decoration: none;
  cursor: pointer;
}

.changePasswd:hover {
  color: #3fe73f;
}

.btn-box {
  display: flex;
  justify-content: space-between;
  padding: 15px 10px;
}

.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  background-color: #f0f0f0;
  font-size: 14px;
  flex: 1;
}

.btn:hover {
  background-color: #e0e0e0;
}

.login-btn {
  margin-right: 5px;
}

.register-btn {
  margin: 0 5px;
}

.forgot-btn {
  margin-left: 5px;
}

.beian {
  position: absolute;
  bottom: 10px;
  font-size: 12px;
  color: #333;
  text-decoration: none;
}

</style>