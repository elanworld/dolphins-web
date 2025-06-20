<template>
    <div style="margin: auto; padding: 20px;">
        <!-- <h2>📁 Element Plus 文件管理器示例</h2> -->

        <el-upload ref="uploadRef" multiple :file-list="fileList" :on-remove="handleRemove" :on-preview="handlePreview"
            :before-upload="beforeUpload" :http-request="dummyRequest" list-type="text" accept="*">
            <el-button type="primary" size="small">选择文件上传</el-button>
        </el-upload>

        <!-- 图片预览弹窗 -->
        <el-dialog :visible.sync="previewVisible" width="50%" :before-close="closePreview">
            <img :src="previewImage" alt="预览图片" style="width: 100%" />
        </el-dialog>

        <!-- 自定义文件列表 -->
        <el-table :data="fileResList" style="margin-top: 20px;" border size="small">
            <el-table-column prop="name" label="文件名"></el-table-column>
            <el-table-column prop="date" label="日期"></el-table-column>
            <el-table-column label="操作" width="150">
                <template #default="{ row }">
                    <el-button type="text" size="small" @click="downloadFile(row)">⬇ 下载</el-button>
                    <el-button type="text" size="small" @click="removeFile(row)">❌ 删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-if="fileResList.length > 0" style="margin-top: 10px; text-align: right;" background layout="prev, pager, next"
            :total="fileResList.length" :page-size="pageSize" v-model:current-page="currentPage"
            @current-change="getFileList" />
        <el-dialog :visible.sync="previewVisible" width="50%" :before-close="closePreview">
            <img v-if="previewImage" :src="previewImage" style="width: 100%" />
            <p v-else>无法预览该文件</p>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { service, setStorage, getStorage } from "@/service/Service";
import api from "@/service/Api.vue";
const currentPage = ref(1)
const pageSize = ref(0)
const fileList = ref([])
const fileResList = ref([])

// 图片预览状态
const previewVisible = ref(false)
const previewImage = ref('')

function getFileList() {
    try {
        service.get(api.filesRecordUser, {
            params: {
                page: 20, // 分页参数
                page: currentPage.value -1,
            }
        },
        ).then(res => {
            fileResList.value = res.data?.data?.records.map(file => ({
                name: file.fileName,
                url: file.fileUrl ? file.fileUrl : `${api.fileDown}/${file?.fileName}${file?.password ? "?password=" + file?.password : ""}`,
                date: file.modifyTime,
                origin: file,
            }))
            pageSize.value = fileResList.length
        })
        return true
    } catch (error) {
        console.error('获取文件列表失败:', error)
    }
}

onMounted(async () => {
    getFileList()
})
// 上传前校验（可扩展）
function beforeUpload(file) {
    // 例如限制文件大小 <= 5MB
    const isLt5M = file.size / 1024 / 1024 <= 5
    if (!isLt5M) {
        ElMessage.error('文件大小不能超过 5MB')
    }
    return isLt5M
}

// 上传成功后处理
function handleUploadSuccess(fileName, urlPath) {
    console.log(`上传成功: ${fileName}, 可访问地址: ${urlPath}`)
    ElMessage.success(`文件 ${fileName} 上传成功`)
}

// 上传文件函数
async function uploadFile(formData, file, redirect) {
    try {
        if (!redirect && !formData.has("file")) {
            formData.append('file', file, formData.get("name"))
        }

        const response = await service.post(api.fileUpload, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 600000,
            params: { redirect }
        })

        if (!redirect) return true

        // 重定向上传逻辑
        const location = response.headers['location']
        const path = response.headers['file-path']
        const method = response.headers['method']
        const authorization = response.headers['token']

        if (location && method) {
            if (!formData.has("file")) {
                formData.append('file', file, formData.get("name"))
            }

            const redirectResponse = await service.request({
                url: location,
                headers: {
                    Authorization: authorization,
                    'File-Path': path
                },
                data: formData,
                method
            })

            if (
                redirectResponse.status === 200 &&
                redirectResponse.data?.code === 200
            ) {
                const url = new URL(location)
                const urlPath = location.replace(url.pathname, '') + '/d/' + path
                handleUploadSuccess(formData.get('name'), urlPath)
                return true
            }
            return false
        }
    } catch (error) {
        console.error('上传失败:', error)
        return false
    }
}

// 模拟上传接口
async function dummyRequest({ file, onSuccess }) {
    setTimeout(() => {
        onSuccess('ok')
    }, 1000)
    try {
        if (file) {
            const formData = new FormData()
            formData.append('name', file.name)
            // formData.append('password', password.value)

            let success = await uploadFile(formData, file, 1)
            if (!success) {
                success = await uploadFile(formData, file, 0)
            }

            if (success) {
                onSuccess('ok')
                ElMessage.success('上传成功')
                getFileList()

            } else {
                ElMessage.error('上传失败')
            }
        }
    } catch (err) {
        console.error('选择/上传文件失败:', err)
        ElMessage.error(`上传失败：${err.message}`)
    }
}

// 删除文件回调
function handleRemove(file, fileListNew) {
    fileList.value = fileListNew
}

// 文件预览（只预览图片）
function handlePreview(file) {
    if (!file.url && !file.raw) {
        ElMessage.warning('没有可预览的文件')
        return
    }
    const isImage = file.type && file.type.startsWith('image/')
    if (!isImage) {
        return
    }
    previewImage.value = file.url || URL.createObjectURL(file.raw)
    previewVisible.value = true
}

// 关闭预览时释放 URL 对象
function closePreview() {
    if (previewImage.value.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage.value)
    }
    previewVisible.value = false
}


function downloadFile(row) {
  if (!row.url) {
    ElMessage.warning('该文件暂无链接');
    return;
  }
  window.open(row.url, '_blank');
}

function removeFile(row) {
    console.log("delete")
    service.delete(api.filesRecord, { params: { id: row.origin?.id } }).then(res => {
        const index = fileResList.value.findIndex((f) => f.name === row.name && f.size === row.size)
        if (index !== -1) fileResList.value.splice(index, 1)
        ElMessage.info(`已删除文件：${row.name}`)
    })
}

</script>