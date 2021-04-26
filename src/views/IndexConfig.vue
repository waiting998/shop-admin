<template>
    <el-card class="index-container">
        <template #header>
            <div class="header">
                <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd">增加</el-button>
                <el-popconfirm
                    title="确定删除吗？"
                    @confirm="handleDelete"
                >
                    <template #reference>
                        <el-button type="danger" size="small" icon="el-icon-delete">批量删除</el-button>
                    </template>
                </el-popconfirm>
            </div>
        </template>
        <el-table
            v-loading="loading"
            ref="multipleTable"
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
                prop="configName"
                label="商品名称"
            >
            </el-table-column>
            <el-table-column
                label="跳转链接"
            >
                <template #default="scope">
                    <a :href="scope.row.redirectUrl" target="_blank">{{ scope .row.redirectUrl }}</a>
                </template>
            </el-table-column>
            <el-table-column
                prop="configRank"
                label="排序值"
                width="120"
            >
            </el-table-column>
            <el-table-column
                prop="goodsId"
                label="商品编号"
                width="200"
            >
            </el-table-column>
            <el-table-column
                prop="createTime"
                label="添加时间"
                width="200"
            >
            </el-table-column>
            <el-table-column
                label="操作"
                width="100"
            >
                <template #default="scope">
                    <a style="cursor: pointer;margin-right: 10px" @click="handleEdit(scope.row.configId)">修改</a>
                    <el-popconfirm
                        title="确定删除吗？"
                        @confirm="handleDeleteOne(scope.row.configId)"
                    >
                        <template #reference>
                            <a style="cursor: pointer">删除</a>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="changePage"
        >
        </el-pagination>
    </el-card>
    <DialogAddGood ref="addGood" :type="type" :reload="getIndexConfig" :configType="configType"></DialogAddGood>
</template>

<script>
import { onMounted, reactive, ref, toRefs } from 'vue'
import DialogAddGood from '@/components/DialogAddGood.vue'
import axios from '@/utils/axios'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
// 设置不同页面对应的数据 参数
const configTypeMap = {
    hot: 3,
    new: 4,
    recommend: 5
}
export default {
    components: {
        DialogAddGood
    },
    setup(){
        const router = useRouter()
        const route = useRoute()
        const addGood = ref(null)
        const state = reactive({
            loading: false,
            type: "add",
            tableData: [],
            total: 0,
            currentPage: 1,
            pageSize: 10,
            multipleSelection: [],
            configType: 3//3-热销商品 4-新品上线 5-为你推荐
        })

        // 监听路由变化，获取路由名字判断是哪个页面，用configType记录，取出对应的数据
        router.beforeEach((to) => {
            if (['hot','new','recommend'].includes(to.name)) {
                state.configType = configTypeMap[to.name]
                state.currentPage = 1
                getIndexConfig()
            }
        })

        // 初始化
        onMounted(() => {
            state.configType = configTypeMap[route.name]
            getIndexConfig()
        })

        // 获取数据列表
        const getIndexConfig = () => {
            state.loading = true
            axios.get('/indexConfigs',{
                params:{
                    pageNumber: state.currentPage,
                    pageSize: state.pageSize,
                    configType: state.configType
                }
            }).then(res => {
                state.tableData = res.list
                state.total = res.totalCount
                state.currentPage = res.currPage
                state.loading = false
            })
        }

        // 记录多选
        const handleSelectionChange = (val) => {
            state.multipleSelection = val
        }

        //新增
        const handleAdd = () => {
            state.type = 'add'
            addGood.value.openDialog()
        } 

        const handleEdit = (id) => {
            state.type = 'edit'
            addGood.value.openDialog(id)
        }

        // 批量删除
        const handleDelete = () => {
            if(!state.multipleSelection.length){
                ElMessage.error('请选择项')
                return
            }
            axios.post('/indexConfigs/delete',{
                ids: state.multipleSelection.map(i => i.configId)
            }).then(() => {
                ElMessage.success('删除成功')
                getIndexConfig()
            })
        }


        // 删除单个
        const handleDeleteOne = (id) => {
            axios.post('/indexConfigs/delete',{
                ids: [id]
            }).then(() => {
                ElMessage.success('删除成功')
                getIndexConfig()
            })
        }

        // 翻页
        const changePage = (val) => {
            state.currentPage = val
            getIndexConfig()
        }

        return {
            ...toRefs(state),
            handleAdd,
            addGood,
            getIndexConfig,
            handleDelete,
            changePage,
            handleSelectionChange,
            handleDeleteOne,
            handleEdit
        }
    }

}
</script>
<style scoped>
  .index-container {
    min-height: 100%;
  }
  .el-card.is-always-shadow {
    min-height: 100%!important;
  }
</style>