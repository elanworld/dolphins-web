<template>
    <el-select ref="selectRef" :model-value="props.modelValue"
        @update:modelValue="val => emit('update:modelValue', val)" :filterable="isCreatable" :allow-create="isCreatable"
        placeholder="请选择或长按输入" @change="handleChange" @focus="handleFocus">
        <el-option v-for="t in options" :key="t" :label="t" :value="t" />
    </el-select>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted, nextTick } from 'vue';

const props = defineProps({
    modelValue: String,
    options: Array,
});

const emit = defineEmits(['update:modelValue']);

const selectRef = ref();
const isCreatable = ref(false);

const handleChange = (val) => {
    emit('update:modelValue', val);
};

const handleFocus = () => {
    // isCreatable.value = true;
};
function bindLongPress(el, callback, delay = 800) {
    let timer;
    const start = () => {
        timer = setTimeout(() => callback(), delay);
    };
    const cancel = () => clearTimeout(timer);

    el.addEventListener("mousedown", start);
    el.addEventListener("mouseup", cancel);
    el.addEventListener("mouseleave", cancel);

    el.addEventListener("touchstart", start);
    el.addEventListener("touchend", cancel);
}

onMounted(() => {
    nextTick(() => {
        const el = selectRef.value?.$el 
        bindLongPress(el, () => {
            isCreatable.value = true;
        }, 300)
    })
});
</script>