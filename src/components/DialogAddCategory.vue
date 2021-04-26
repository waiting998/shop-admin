<template>
    <el-dialog
        :title="type == 'add' ? '添加分类' : '修改分类'"
        v-model="visible"
        width="400px"
    >
        <el-form :model="ruleForm" :rules="rules" ref="formRef" label-width="100px" class="good-form">
            <el-form-item label="商品名称" prop="name">
                <el-input type="text" v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="排序值" prop="rank">
                <el-input type="number" v-model="ruleForm.rank"></el-input>
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
import { hasEmoji } from '@/utils/index'
import axios from '@/utils/axios'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
export default {
    name: 'DialogAddCategory',
    props: {
        type: String,
        reload: Function
    },
    setup(props){
        const formRef = ref(null)
        const route = useRoute()
        const state = reactive({
            visible: false,
            categoryLevel: 1,
            parentId: 0,
            ruleForm: {
                name: '',
                rank: ''
            },
            rules: {
                name: [
                    { required: 'true', message: '名称不能为空', trigger: ['change'] }
                ],
                rank: [
                    { required: 'true', message: '编号不能为空', trigger: ['change'] }
                ]
            }
        })

        const getDetail = (id) => {
            axios.get(`/categories/${id}`).then(res => {
                state.ruleForm = {
                    name: res.categoryName,
                    rank: res.categoryRank
                }
                state.parentId = res.parentId
                state.categoryLevel = res.categoryLevel
            })
        }

        const openDialog = (id) => {
            state.visible = true
            if(id){
                state.id = id
                getDetail(id)
            }else{
                const { level = 1, parent_id = 0 } = route.query
                state.ruleForm = {
                    name: '',
                    rank: ''
                }
                state.parentId = parent_id
                state.categoryLevel = level
            }
        }

        const submitForm = () => {
            formRef.value.validate((valid) => {
                if(valid){
                    if(hasEmoji(state.ruleForm.name)){
                        ElMessage.error('暂不支持输入表情包')
                        return
                    }
                    if(props.type == 'add'){
                        console.log('categoryLevel:',state.categoryLevel);
                        console.log('parentId:',state.parentId);
                        axios.post('/categories',{
                            categoryLevel: state.categoryLevel,
                            parentId: state.parentId,
                            categoryName: state.ruleForm.name,
                            categoryRank: state.ruleForm.rank
                        }).then(() => {
                            ElMessage.success('添加成功')
                            state.visible = false
                            if(props.reload) props.reload()
                        })
                    }else{
                        axios.put('/categories',{
                            categoryId: state.id,
                            categoryLevel: state.categoryLevel,
                            parentId: state.parentId,
                            categoryName: state.ruleForm.name,
                            categoryRank: state.ruleForm.rank
                        }).then(() => {
                            ElMessage.success('修改成功')
                            state.visible = false
                            if(props.reload) props.reload()
                        })
                    }
                }
            })
        }

        return{
            ...toRefs(state),
            formRef,
            submitForm,
            openDialog
        }
    }
}
</script>

<style>

</style>