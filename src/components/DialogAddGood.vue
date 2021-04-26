<template>
    <el-dialog
        :title="type == 'add' ? '添加商品' : '修改商品'"
        v-model="visible"
        width="400px"
    >
        <el-form :model="ruleForm" relus="rules" ref="formRef" label-width="100px" class="good-form">
            <el-form-item label="商品名称" prop="name">
                <el-input type="text" v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="跳转链接" prop="link">
                <el-input type="text" v-model="ruleForm.link"></el-input>
            </el-form-item>
            <el-form-item label="商品编号"> 
                <el-input type="number" min="0" v-model="ruleForm.id"></el-input>
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
import axios from '@/utils/axios'
import { hasEmoji } from '@/utils/index'
import { ElMessage } from 'element-plus'
export default {
    name: 'DialogAddGood',
    props: {
        type: String,
        configType: Number,
        reload: Function
    },
    setup(props){
        const formRef = ref(null)
        const state = reactive({
            visible: false,
            ruleForm: {
                name: '',
                link: '',
                id: '',
                sort: ''
            },
            rules: {
                name: [
                    { required: 'true', message: '名称不能为空', trigger: ['change'] }
                ],
                id: [
                    { required: 'true', message: '编号不能为空', trigger: ['change'] }
                ],
                sort: [
                    { required: 'true', message: '排序不能为空', trigger: ['change']  }
                ]
            }
        })

        const submitForm = () => {
            formRef.value.validate((valid) => {
                if(valid){
                    
                    if(hasEmoji(state.ruleForm.name) || hasEmoji(state.ruleForm.link)){
                        ElMessage.error('不支持输入表情包')
                        return
                    }
                    
                    if(state.ruleForm.id < 0 || state.ruleForm.id > 200){
                        ElMessage.error('商品编号不能小于0或大于200')
                        return
                    }

                    if(props.type == 'add'){
                        axios.post('/indexConfigs',{
                            configType: props.configType || 3,
                            configName: state.ruleForm.name,
                            redirectUrl: state.ruleForm.link,
                            goodsId: state.ruleForm.id,
                            configRank: state.ruleForm.sort
                        }).then(() => {
                            ElMessage.success('添加成功')
                            state.visible = false
                            if(props.reload) props.reload()
                        })
                    }else{
                        axios.put('/indexConfigs',{
                            configId: state.id,
                            configType: props.configType || 3,
                            configName: state.ruleForm.name,
                            redirectUrl: state.ruleForm.link,
                            goodsId: state.ruleForm.id,
                            configRank: state.ruleForm.sort
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
            if (id) {
                state.id = id
                getDetail(id)
            } else {
                state.ruleForm = {
                    name: '',
                    id: '',
                    link: '',
                    sort: ''
                }
            }
        }

        const getDetail = (id) => {
            axios.get(`/indexConfigs/${id}`).then(res => {
                state.ruleForm = {
                    name: res.configName,
                    id: res.goodsId,
                    link: res.redirectUrl,
                    sort: res.configRank
                }
            })
        }


        return{
            ...toRefs(state),
            submitForm,
            openDialog,
            formRef
        }
    }

}
</script>

<style>

</style>