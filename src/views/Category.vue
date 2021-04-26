<template>
    <el-card class="category-container">
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
            ></el-table-column>
            <el-table-column
                prop="categoryName"
                label="分类名称"
            ></el-table-column>
            <el-table-column
                prop="categoryRank"
                label="排序值"
                width="120"
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
                width="220"
            >
                <template #default="scope">
                    <a style="cursor: pointer; margin-right: 10px" @click="handleEdit(scope.row.categoryId)">修改</a>
                    <a style="cursor: pointer; margin-right: 10px" @click="handleNext(scope.row)">下级分类</a>
                    <el-popconfirm
                        title="确定删除吗？"
                        @confirm="handleDeleteOne(scope.row.categoryId)"
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
        ></el-pagination>
    </el-card>
    <DialogAddCategory ref="addGood" :type="type" :reload="getCategory"></DialogAddCategory>
</template>

<script>
import { onMounted, reactive, ref, toRefs } from 'vue'
import DialogAddCategory from '@/components/DialogAddCategory.vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/utils/axios'
import { ElMessage } from 'element-plus'
export default {
    name: 'category',
    components: {
        DialogAddCategory
    },
    setup(){
        const route = useRoute()
        const router = useRouter()
        const multipleTable = ref(null)
        const addGood = ref(null)
        const state = reactive({
            loading: false,
            tableData: [],
            total: 0,
            currentPage: 1,
            pageSize: 10,
            level: 1,
            parent_id: 0,
            type: 'add',
            multipleSelection: []
        })

        onMounted(() => {
            getCategory()
        })

        // 路由发生变化，即二三级分类切换时 更新数据
        router.afterEach((to) => {
            if(['category','level2','level3'].includes(to.name)){
                getCategory()
            }
        })
        // 获取列表数据
        const getCategory = () => {
            const { level = 1, parent_id = 0 } = route.query
            state.loading = true
            axios.get('/categories',{
                params: {
                    pageNumber: state.currentPage,
                    pageSize: state.pageSize,
                    categoryLevel: level,
                    parentId: parent_id
                }
            }).then(res => {
                state.tableData = res.list
                state.total = res.totalCount
                state.currentPage = res.currPage
                state.level = level
                state.parentId = parent_id
                state.loading = false
            })
        }
        // 添加分类
        const handleAdd = () => {
            state.type = 'add'
            addGood.value.openDialog()
        }

        const handleDelete = () => {
            if(!state.multipleSelection.length){
                ElMessage.error('请选择项')
                return
            }
            axios.delete('/categories',{
                data: {
                    ids: state.multipleSelection.map(item => item.categoryId)
                }
            }).then(() => {
                ElMessage.success('删除成功')
                getCategory()
            })
        }

        const handleSelectionChange = (val) => {
            state.multipleSelection = val
        }

        const handleEdit = (id) => {
            state.type="edit"
            addGood.value.openDialog(id)
        } 

        const handleNext = (item) => {
            const levelNumber = item.categoryLevel + 1
            if(levelNumber == 4){
                ElMessage.error('没有下一级')
                return
            }
            router.push({
                name: `level${levelNumber}`,
                query: {
                    level: levelNumber,
                    parent_id: item.categoryId
                }
            })
        }

        const handleDeleteOne = (id) => {
            axios.delete('/categories',{
                data: {
                    ids: [id]
                }
            }).then(() => {
                ElMessage.success('删除成功')
                getCategory()
            })
        }

        const changePage = (val) => {
            state.currentPage = val
            getCategory()
        }

        return{
            ...toRefs(state),
            handleAdd,
            handleDelete,
            multipleTable,
            handleSelectionChange,
            handleEdit,
            handleNext,
            handleDeleteOne,
            changePage,
            addGood,
            getCategory
        }
    }
}
</script>

<style scoped>
  .category-container {
    min-height: 100%;
  }
  .el-card.is-always-shadow {
    min-height: 100%!important;
  }
</style>