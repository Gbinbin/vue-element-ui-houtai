<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <!-- 警告区域 -->
            <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
            <!-- 步骤条 -->
            <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <!-- tab栏 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
                <el-tabs :before-leave='beforeTabLeave' v-model="activeIndex" :tab-position="'left'" @tab-click="tabClicked">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader
                                :options="cateList"
                                :props="cateProps"
                                v-model="addForm.goods_cat"
                                @change="handleChange">
                            </el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <!-- 渲染表单item项 -->
                        <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.id">
                            <!-- 复选框组 -->
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox border :label="cb" v-for="(cb,i) in item.attr_vals" :key="i"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="4">
                        <!-- action 图片上传后台API地址 -->
                        <el-upload
                            :on-success="handleSuccess"
                            :headers='headersObj'
                            :action="uploadUrl"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            list-type="picture">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="5">
                        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                        <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <!-- 图片放大对话框 -->
        <el-dialog
            title="图片放大"
            :visible.sync="previewDialogVisible"
            width="50%"
            >
            <img :src="previewPath" alt="" class="previewImg">
        </el-dialog>

    </div>
</template>
<script>
export default {
    name: 'add',
    data(){
        return {
            previewDialogVisible: false,
            cateProps: {
                label: 'cat_name',
                value: 'cat_id',
                children: 'children'
            },
            activeIndex: '0',
            addForm: {
                goods_name: '',
                goods_price: 0,
                goods_weight: 0,
                goods_number: 0,
                //商品所属的分类数组
                goods_cat: [],
                pics: []
            },
            //校验规则
            addFormRules: {
                goods_name: [
                    { required: true,message: "请输入商品名称", trigger: 'blur' }
                ],
                goods_price: [
                    { required: true,message: "请输入商品价格", trigger: 'blur' }
                ],
                goods_weight: [
                    { required: true,message: "请输入商品重量", trigger: 'blur' }
                ],
                goods_number: [
                    { required: true,message: "请输入商品数量", trigger: 'blur' }
                ],
                goods_cat: [
                    { required: true,message: "请选择商品分类", trigger: 'blur' }
                ],
            },
            cateList: [],
            //动态参数列表数据
            manyTableData: [],
            //静态属性数据列表
            onlyTableData: [],
            uploadUrl: 'https://www.liulongbin.top:8888/api/private/v1/upload',
            headersObj: {
                Authorization: window.sessionStorage.getItem('token')
            },
            previewPath: '',
            goods_introduce: ''
            
        }
    },
    created(){
        this.getCateList();
    },
    methods: {
        add(){
            //form表单校验
            this.$refs.addFormRef.validate(valid=>{
                if(!valid){
                    return this.$message.error('请填写必要项')
                }

            })
        },
        //图片上传成功
        handleSuccess(response){
            //console.log(response);
            //拼接得到一个数据对象
            const picInfo = { pic : response.data.tem_path }
            //将图片信息对象push到pics数组中
            this.addForm.pics.push(picInfo)
            //console.log(this.addForm)
        },
        //放大图片
        handlePreview(file){
            this.previewPath = file.response.data.url
            this.previewDialogVisible = true
        },
        //删除图片
        handleRemove(file){
            //console.log(file)  //图片的信息
            const filePath = file.response.data.tem_path
            const i = this.addForm.pics.findIndex(x=>
                x.pic === filePath
            )
            this.addForm.pics.splice(i,1)
            //console.log(this.addForm)
        },
        getCateList(){
            this.axios.get('categories').then(res=>{
                if(res.data.meta.status !== 200){
                    return this.$message.error('获取分类失败')
                }
                this.cateList = res.data.data
                //console.log(this.cateList)
            })
        },
        //级联选择器选中项变化，会触发这个函数
        handleChange(){
            if(this.addForm.goods_cat.length !== 3){
                return this.addForm.goods_cat = []
            }
        },
        //即将离开的页 和 即将进入的标签页
        beforeTabLeave(activeName,oldActiveName){
            if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3){
                this.$message.error('情选择商品分类')
                return false
            }
        },
        tabClicked(){
            //证明点击的是商品参数面板
            if(this.activeIndex === '1'){
                this.axios.get(`categories/${this.catId}/attributes`,
                {
                    params: { sel:'many' }
                }).then(res=>{
                    if(res.data.meta.status !== 200){
                        return this.$message.error('获取动态参数数据失败')
                    }
                    //循环让attr_vlas变成数组
                    res.data.data.forEach(item=>{
                        item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
                    })
                    this.manyTableData = res.data.data
                    console.log(res.data.data)

                })
            }else if(this.activeIndex === '2'){
                this.axios.get(`categories/${this.catId}/attributes`,
                {
                    params: { sel:'only' }
                }).then(res=>{
                    if(res.data.meta.status !== 200){
                        return this.$message.error('获取静态数据失败')
                    }
                    console.log(res.data.data)
                    this.onlyTableData = res.data.data
                })
            }
        }
    },
    computed: {
        catId(){
            if(this.addForm.goods_cat.length === 3){
                return this.addForm.goods_cat[2]
            }
            return null
        }
    }
}
</script>
<style scoped>
.el-checkbox {
    margin: 5px 10px 0 0 !important;
}
.previewImg {
    width: 100%;
}
.btnAdd {
    margin-top: 15px;
}
</style>