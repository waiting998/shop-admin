<template>
    <el-dialog
        :title="type=='add' ? '添加轮播图' : '修改轮播图' "
        v-model="visible"
        width="400px"
    >
        <el-form :model="ruleForm" :rules="rules" ref="formRef" label-width="100px" class="good-form">
            <el-form-item label="图片" prop="url">
                <el-upload
                    class="avatar-uploader"
                    :action="uploadImgServer"
                    accept="jpg,jpeg,png"
                    :headers="{
                        token: token
                    }"
                    :show-file-list="false"
                    :before-upload="handleBeforeUpload"
                    :on-success="handleUrlSuccess"
                >
                    <img style="width: 200px; height: 100px; border: 1px solid #e9e9e9;" v-if="ruleForm.url" :src="ruleForm.url" class="avatar" alt="/">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="跳转链接">
                <el-input type="text" v-model="ruleForm.link"></el-input>
            </el-form-item>
            <el-form-item label="排序值" prop="sort">
                <el-input type="number" v-model="ruleForm.sort"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script>
import { reactive, ref, toRefs } from 'vue'
import { uploadImgServer, localGet, hasEmoji } from '@/utils'
import { ElMessage } from 'element-plus'
import axios from '@/utils/axios'
export default {
    name: 'DialogAddSwiper',
    props: {
        type: String,
        reload: Function
    },
    setup(props){
        const formRef = ref(null)
        const state = reactive({
            uploadImgServer,
            token: localGet('token') || '',
            visible: false,
            ruleForm: {
                url: '',
                link: '',
                sort: ''
            },
            rules: {
                url:[
                    { required: 'true', message: '图片不能为空', trigger: ['change'] }
                ],
                sort: [
                    { required: 'true', message: '排序不能为空', trigger: ['change'] }
                ]
            },
            id: ''
        })
        // 获取详情
        const getDetail = (id) => {
            axios.get(`/carousels/${id}`).then(res => {
                state.ruleForm = {
                    url: res.carouselUrl,
                    link: res.redirectUrl,
                    sort: res.carouselRank
                }
            })
        }

        // 判断上传文件类型
        const handleBeforeUpload = (file) => {
            const sufix = file.name.split('.')[1] || ''
            if(!['jpg','jpeg','png'].includes(sufix)){
                ElMessage.error('请上传 jpg、jpeg、png格式的图片')
                return false
            }
        }
        // 文件上传成功后
        const handleUrlSuccess = (val) => {
            state.ruleForm.url = val.data || ''
        }

        // 上传提交
        const submitForm  = () => {
            formRef.value.validate((valid) => {
                if(valid){
                    console.log('state.ruleForm:',state.ruleForm)
                    console.log('props.type',props.type)
                    if(hasEmoji(state.ruleForm.link)){
                        ElMessage.error('不支持输入表情包')
                        return
                    }
                    // 新增/编辑处理
                    if(props.type == 'add'){
                        axios.post('/carousels',{
                            carouselUrl: state.ruleForm.url,
                            redirectUrl: state.ruleForm.link,
                            carouselRank: state.ruleForm.sort
                        }).then(() => {
                            ElMessage.success('添加成功')
                            state.visible = false
                            // 调用父组件传递过来的函数 完成数据刷新
                            if(props.reload) props.reload()
                        })
                    }else{
                        axios.put('/carousels',{
                            carouselId: state.id,
                            carouselUrl: state.ruleForm.url,
                            redirectUrl: state.ruleForm.link,
                            carouselRank: state.ruleForm.sort
                        }).then(() => {
                            ElMessage.success('修改成功')
                            state.visible = false
                            if(props.reload) props.reload()
                        })
                    }
                }
            })
        }

        const openDialog = (id) => {
            state.visible = true
            if(id){
                state.id =  id
                getDetail(id)
            }else{
                state.ruleForm = {
                    url: '',
                    link: '',
                    sort: ''
                }
            }
        }

        const closeDialog = () => {
            state.visible = false
        }

        return{
            ...toRefs(state),
            handleBeforeUpload,
            handleUrlSuccess,
            submitForm,
            closeDialog,
            openDialog,
            formRef
        }
    }
}
</script>

<style scoped>
  .avatar-uploader {
    width: 100px;
    height: 100px;
    color: #ddd;
    font-size: 30px;
  }
  .avatar-uploader-icon {
    display: block;
    width: 100%;
    height: 100%;
    border: 1px solid #e9e9e9;
    padding: 32px 17px;
  }
</style>