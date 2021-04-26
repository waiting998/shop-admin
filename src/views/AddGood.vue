<template>
    <div class="add">
        <el-card class="add-container">
            <el-form :model="goodForm" :rules="rules" ref="goodRef" label-width="100px" class="goodForm">
                <el-form-item required label="商品分类">
                    <el-cascader :placeholder="defaultCate" style="width: 300px" :props="category" @change="handleChangeCate"></el-cascader>
                </el-form-item>
                <el-form-item label="商品名称" prop="goodsName">
                    <el-input style="width: 300px" placeholder="请输入商品名称" v-model="goodForm.goodsName"></el-input>
                </el-form-item>
                <el-form-item label="商品简介" prop="goodsIntro">
                    <el-input type="textarea" style="width: 300px" placeholder="请输入商品简介" v-model="goodForm.goodsIntro"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="originalPrice">
                    <el-input type="number" min="0" style="width: 300px" placeholder="请输入商品价格" v-model="goodForm.originalPrice"></el-input>
                </el-form-item>
                <el-form-item label="商品售价" prop="sellingPrice">
                    <el-input type="number" min="0" style="width: 300px" placeholder="请输入商品售价" v-model="goodForm.sellingPrice"></el-input>
                </el-form-item>
                <el-form-item label="商品库存" prop="stockNum">
                    <el-input type="number" min="0" style="width: 300px" placeholder="请输入商品库存" v-model="goodForm.stockNum"></el-input>
                </el-form-item>
                <el-form-item label="商品标签">
                    <el-input style="width: 300px" placeholder="请输入商品小标签" v-model="goodForm.tag"></el-input>
                </el-form-item>
                <el-form-item label="上架状态" >
                   <el-radio-group v-model="goodForm.goodsSellStatus">
                    <el-radio label="0">上架</el-radio>
                    <el-radio label="1">下架</el-radio>
                   </el-radio-group>
                </el-form-item>
                <el-form-item required label="商品主图" prop="goodsCoverImg">
                    <el-upload
                        class="avatar-uploader"
                        accept="jpg,jpeg,png"
                        :action="uploadImgServer"
                        :headers="{
                            token: token
                        }"
                        :show-file-list="false"
                        :before-upload="handleBeforeUpload"
                        :on-success="handleUrlSuccess"
                    >   
                        <img v-if="goodForm.goodsCoverImg" class="avatar" style="width:100px;height:100px;border:1px solid #e9e9e9;" :src="goodForm.goodsCoverImg" alt="">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="详情内容">
                    <div ref="editor"></div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitAdd()">{{ id ? '立即修改' : '立即创建' }}</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import { onBeforeUnmount, onMounted, reactive, ref, toRefs, getCurrentInstance } from 'vue'
import WangEditor from 'wangeditor'
import axios from '@/utils/axios'
import { ElMessage } from 'element-plus'
import { useRoute,useRouter } from 'vue-router'
import { localGet, uploadImgsServer, hasEmoji, uploadImgServer } from '@/utils'
export default { 
    name: 'AddGood',
    setup(){
        const { proxy } = getCurrentInstance()
        const editor = ref(null)
        const goodRef = ref(null)
        const route = useRoute()
        const router = useRouter()
        const { id } = route.query
        const state = reactive({
            uploadImgServer,
            token: localGet('token') || '',
            goodForm: {
                goodsName: '',
                goodsIntro: '',
                originalPrice: '',
                sellingPriceL: '',
                stockNum: '',
                goodsSellStatus: '0',
                goodsCoverImg: '',
                tag: '',
                id: id
            },
            rules:{
                goodsName: [
                    { required: 'true', message: '请填写商品名称', trigger: ['change'] }
                ],
                originalPrice: [
                    { required: 'true', message: '请填写商品价格', trigger: ['change'] }
                ],
                sellingPrice: [
                    { required: 'true', message: '请填写商品售价', trigger: ['change'] }
                ],
                stockNum: [
                    { required: 'true', message: '请填写商品库存', trigger: ['change'] }
                ],
            },
            defaultCate: '请选择商品分类',
            categoryId: '',
            // 商品分类下拉列表的props
            category: {
                //cascader选择器，加载动态数据的方法，仅在 lazy 为 true 时有效
                lazy: true,
                lazyLoad(node, resolve) {
                // node为当前点击的节点
                const { level = 0, value } = node
                
                axios.get('/categories', {
                    params: {
                        pageNumber: 1,
                        pageSize: 1000,
                        categoryLevel: level + 1,//通过点击节点 与接口参数对应，返回对应层级的数据
                        parentId: value || 0//通过点击节点的值跟层级来确定下一级该返回的数据
                    }
                }).then(res => {
                    const list = res.list
                    // 遍历返回 item => ({}) {}中的三个元素
                    const nodes = list.map(item => ({
                        value: item.categoryId,
                        label: item.categoryName,
                        leaf: level > 1// leaf为true 就是没有子节点 就完事了
                    }))
                    console.log('nodes:',nodes);                
                    resolve(nodes)//通过调用resolve将子节点数据返回，通知组件数据加载完成 相当于return
                })
                }
            }


        })

        const handleChangeCate = (val) => {
            state.categoryId = val[2] || 0
        }

        const submitAdd = () => {
            goodRef.value.validate((vaid) => {
                if(vaid){
                    // 默认是新增商品,所以默认使用post方法
                    let httpOption = axios.post
                    let params = {
                        goodsCategoryId: state.categoryId,
                        goodsCoverImg: state.goodForm.goodsCoverImg,
                        goodsDetailContent: instance.txt.html(),
                        goodsIntro: state.goodForm.goodsIntro,
                        goodsName: state.goodForm.goodsName,
                        goodsSellStatus: state.goodForm.goodsSellStatus,
                        originalPrice: state.goodForm.originalPrice,
                        sellingPrice: state.goodForm.sellingPrice,
                        stockNum: state.goodForm.stockNum,
                        tag: state.goodForm.tag
                    }

                    // 后台处理表情包有bug，所以暂时判断禁止输入表情包
                    if( hasEmoji(params.goodsIntro) || hasEmoji(params.goodsName) || hasEmoji(params.tag) || hasEmoji(params.goodsDetailContent)){
                        ElMessage.error('暂不支持输入表情包！')
                        return
                    }
                    console.log('params',params)
                    // 如果有id说明是编辑商品 则需要改变提交方式
                    if(id){
                        console.log('change httpOption')
                        params.goodsId = id
                        httpOption = axios.put
                    }
                    httpOption('/goods',params).then(() => {
                        ElMessage.success(id ? '修改成功':'添加成功')
                        router.push( { path: '/good'} )
                    })
                }
            })
        }
        // 图片上传校验
        const handleBeforeUpload = (file) => {
            console.log('file:',file)
        }

        // 图片上传后赋值到变量 显示出图片
        const handleUrlSuccess = (val) => {
            state.goodForm.goodsCoverImg = val.data || ''
            console.log('state.goodForm.goodsCoverImg:',state.goodForm.goodsCoverImg)
        }

        let instance
        onMounted(() => {

            // 配置编辑器
            instance = new WangEditor(editor.value)
            instance.config.showLinkImg = false
            instance.config.showLinkImgAlt = false
            instance.config.showLinkImgHref = false
            instance.config.uploadImgMaxSize = 2 * 1024 * 1024 // 2M
            instance.config.uploadFileName = 'file'
            instance.config.uploadImgHeaders = {
                token: state.token//上传图片时添加 http 请求的 header 。
            }
            // 设置上传接口
            instance.config.uploadImgServer = uploadImgsServer
            // 回调函数
            instance.config.uploadImgHooks = {
                // 图片上传并返回了结果，想要自己把图片插入到编辑器中
                // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
                customInsert: function(insertImgFn, result) {
                    // result 即服务端返回的接口
                    console.log('customInsert', result)

                    // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
                    if(result.data && result.data.length){
                        result.data.forEach(item => insertImgFn(item))
                    }
                }
            }

            // Object.assign(instance.config, {//?????????
            //     onchange() {
            //     console.log('change')
            //     },
            // })
            instance.create()
            // 如果有id 则是修改商品
            if(id){
                axios.get(`/goods/${id}`).then(res => {
                    console.log('res:',res)
                    const { goods, firstCategory, secondCategory, thirdCategory } = res
                    state.goodForm = {
                        goodsName: goods.goodsName,
                        goodsIntro: goods.goodsIntro,
                        originalPrice: goods.originalPrice,
                        sellingPrice: goods.sellingPrice,
                        stockNum: goods.stockNum,
                        goodsSellStatus: String(goods.goodsSellStatus),
                        goodsCoverImg: proxy.$filters.prefix(goods.goodsCoverImg),
                        tag: goods.tag
                    }
                    state.categoryId = goods.goodsCategoryId
                    state.defaultCate = `${firstCategory.categoryName}/${secondCategory.categoryName}/${thirdCategory.categoryName}`
                    if(instance){
                        // 详情页
                        instance.txt.html(goods.goodsDetailContent)
                    }
                })
            }
        })

        onBeforeUnmount(() => {
            instance.destroy()
            instance = null
        })

        return{
            goodRef,
            ...toRefs(state),
            handleChangeCate,
            editor,
            submitAdd,
            handleBeforeUpload,
            handleUrlSuccess
            
        }
    }
}
</script>

<style scoped>
  .add {
    display: flex;
  }
  .add-container {
    flex: 1;
    height: 100%;
  }
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