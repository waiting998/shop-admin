<template>
    <el-card class="guest-container">
        <template #header>
            <div class="header">
                <el-button type="primary" size="small" icon="el-icon-plus" @click="handleSolve">解除禁用</el-button>
                <el-button type="danger" size="small" icon="el-icon-delete" @click="handleForbid">禁用账户</el-button>
            </div>
        </template>
        <el-table
            v-loading="loading"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
        >
            <el-table-column
                type="selection"
                width="55"
            >
            </el-table-column>
            <el-table-column
                prop="nickName"
                label="昵称"
            >
            </el-table-column>
            <el-table-column
                prop="loginName"
                label="登录名"
            >
            </el-table-column>
            <el-table-column
                label="身份状态"
            >
                <template #default="scope">
                    <span :style="scope.row.lockedFlag == 0 ? 'color: green;' : 'color: red'">
                        {{ scope.row.lockedFlag == 0 ? '正常' : '禁用' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                label="是否注销"
            >
                <template #default="scope">
                    <span :style="scope.row.isDeleted == 0 ? 'color: green;' : 'color: red'">
                        {{ scope.row.isDeleted == 0 ? '正常' : '注销' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                prop="createTime"
                label="注册时间"
            ></el-table-column>
        </el-table>
        <el-pagination
            background
            layout="prev,pager,next"
            :total="total"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="changePage"
        ></el-pagination>
    </el-card>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue'
import axios from '@/utils/axios'
import { ElMessage } from 'element-plus'

export default {
    name: 'Guest',
    setup(){
        const state =reactive({
            loading: false,
            tableData: [],
            currentPage: 1,
            pageSize: 10,
            total: 0,
            multipleSelection: []

        })

        onMounted(() => {
            getGuestList()
        })

        const getGuestList = () => {
            state.loading = true
            axios.get('/users',{
                params: {
                    pageNumber: state.currentPage,
                    pageSize: state.pageSize
                }
            }).then(res => {
                state.tableData = res.list
                state.total = res.totalCount
                state.currentPage = res.currPage
                state.loading = false
            })
        }

        const handleSelectionChange = (val) => {
            state.multipleSelection = val
        }


        const changePage = (val) => {
            state.currentPage = val
            getGuestList()
        }

        const handleSolve = () => {
            if(!state.multipleSelection.length){
                ElMessage.error('请选择项')
                return
            }

            axios.put(`/users/0`,{
                ids: state.multipleSelection.map( item => item.userId )
            }).then(() => {
                ElMessage.success('解除成功')
                getGuestList()
            })

        }

        const handleForbid = () => {
            if(!state.multipleSelection.length){
                ElMessage.error('请选择项')
                return
            }

            axios.put(`/users/1`,{
                ids: state.multipleSelection.map(item => item.userId)
            }).then(()=>{
                ElMessage.success('禁用成功')
                getGuestList()
            })
        }

        return{
            ...toRefs(state),
            handleSelectionChange,
            changePage,
            handleSolve,
            handleForbid
        }
    }
}
</script>

<style>

</style>