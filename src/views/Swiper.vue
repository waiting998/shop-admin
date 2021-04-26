<template>
    <el-card class="swiper-container">
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
            :data="tableData"
            style="width: 100%"
            @selection-change="handleSelectionChange"
        >
            <el-table-column
                type="selection"
                width="55"
            >
            </el-table-column>
            <el-table-column
                lable="轮播图"
                width="200"
            >
                <template #default="scope">
                    <img style="width: 200px " :src="scope.row.carouselUrl" alt="轮播图">
                </template>
            </el-table-column>
            <el-table-column
                label="跳转链接"
            >
                <template #default="scope">
                    <a :href="scope.row.redirectUrl" target="_blank">{{ scope.row.redirectUrl }}</a>
                </template>
            </el-table-column>
            <el-table-column
                prop="carouselRank"
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
                width="100"
            >
                <template #default="scope">
                    <a style="cursor: pointer;margin-right:10px" @click="handleEdit(scope.row.carouselId)">修改</a>
                    <el-popconfirm
                        title="确定删除吗？"
                        @confirm="handleDeleteOne(scope.row.carouselId)"
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
    <DialogAddSwiper ref="addGood" :reload="getCarousels" :type="type"></DialogAddSwiper>
</template>

<script>
import { onMounted, reactive, toRefs, ref } from 'vue'
import { ElMessage } from 'element-plus'
import axios from '@/utils/axios'
import DialogAddSwiper from '@/components/DialogAddSwiper.vue'
export default {
    name: 'swiper',
    components:{ 
        DialogAddSwiper
    },
    setup(){
        const addGood = ref(null)
        const state = reactive({
            loading: false,
            tableData: [],//数据列表
            multipleSelection: [],//选中项
            total: 0,
            currentPage: 1,//当前页
            pageSize: 10,//分页大小
            type: 'add',//记录新增还是修改 
            
        })

        onMounted(() => {
            getCarousels()
        })

        // 获取table的数据列表
        const getCarousels = () => {
            state.loading = true
            console.log('state.currentPage:',state.currentPage)
            axios.get('/carousels',{
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
        // 新增
        const handleAdd = () => {
            state.type = "add"
            //调用子组件函数
            addGood.value.openDialog()
        }
        // 记录选中项
        const handleSelectionChange = (val) => {
            state.multipleSelection = val
        }
        // 批量删除
        const handleDelete = () => {
            if(!state.multipleSelection.length){
                ElMessage.error('请选择要删除的项')
                return
            }
            axios.delete('/carousels',{
                data: {
                    ids: state.multipleSelection.map( i => i.carouselId)
                }
            }).then(() => {
                ElMessage.success('删除成功')
                getCarousels()
            })
        }
        // 修改
        const handleEdit = (id) => {
            state.type = 'edit'
            addGood.value.openDialog(id)
        }
        // 删除单个
        const handleDeleteOne = (id) => {
            axios.delete('/carousels',{
                data: {
                    ids: [id]
                }
            }).then(() => {
                ElMessage.success('删除成功!')
                getCarousels()
            })
        }
     
        // 每次翻页时执行，记录当前页数，然后重新加载对应的数据
        const changePage = (val) => {
            state.currentPage = val
            getCarousels()
        }

        return{
            ...toRefs(state),
            handleAdd,
            handleDelete,
            handleEdit,
            handleDeleteOne,
            handleSelectionChange,
            getCarousels,
            changePage,
            addGood
        }
    }
}
</script>

<style scoped>
  .swiper-container {
    min-height: 100%;
  }
  .el-card.is-always-shadow {
    min-height: 100%!important;
  }
</style>