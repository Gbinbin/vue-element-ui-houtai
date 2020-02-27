<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 表格 -->
            <tree-table class="treeTable" show-index index-text="#" border :show-row-hover="false" :expand-type="false" :selection-type="false" :data="cateList" :columns="columns">
                <!-- 是否有效 -->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" style="color:lightgreen;" v-if="scope.row.cat_deleted === false"></i>
                    <i class="el-icon-error" v-else></i>
                </template>
                <!-- 排序 -->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag size="mini" type="warning" v-else>三级</el-tag>
                </template>
                <!-- 操作 -->
                <template slot="opt">
                    <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                </template>
            </tree-table>
            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[3, 5, 10, 15]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加分类对话框 -->
        <el-dialog
            @close="addCateDialogClosed"
            title="添加分类"
            :visible.sync="addCateDialogVisible"
            width="50%">
            <!-- 添加分类表单 -->
            <el-form :model="addCateFrom" :rules="addCateFromRules" ref="addCateFromRef" label-width="100px">
                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input v-model="addCateFrom.cat_name"></el-input>
                </el-form-item>
                 <el-form-item label="父及分类">
                    <el-cascader
                        clearable
                        change-on-select
                        v-model="selectedKeys"
                        :options="parentCateList"
                        :props="cascaderProps"
                        @change="parentCateChange">
                    </el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'cate',
    data(){
        return {
            //查询条件
            queryInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5
            },
            //商品分类总数据
            cateList: [],
            //总数据条数
            total: 0,
            //为table指定列的定义
            columns: [
                {
                    label: '商品名称',
                    prop: 'cat_name'
                },
                {
                    label: '是否有效',
                    //当模板列定义为模板列
                    type: 'template',
                    //当前这一列使用模板名称
                    template: 'isok'
                },
                {
                    label: '排序',
                    //当模板列定义为模板列
                    type: 'template',
                    //当前这一列使用模板名称
                    template: 'order'
                },
                {
                    label: '操作',
                    //当模板列定义为模板列
                    type: 'template',
                    //当前这一列使用模板名称
                    template: 'opt'
                }
            ],
            //控制添加分类对话框的显示与隐藏
            addCateDialogVisible: false,
            //添加分类表单数据
            addCateFrom: {
                cat_name: '',
                cat_pid: 0,
                cat_level: 0
            },
            //添加分类对话框的验证规则
            addCateFromRules : {
                cat_name: [
                    { required: true,message: "请输入分类的名称", trigger: 'blur' }
                ]
            },
            //父级分类的列表
            parentCateList: [],
            //指定级联选择器的配置对象
            cascaderProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            },
            //选中的父类的id数组
            selectedKeys: []
        }
    },
    created(){
        this.getCateList();
    },
    methods: {
        //获取商品分类数据的方法
        getCateList(){
            this.axios.get('categories',{params:this.queryInfo}).then(res=>{
                //console.log(res);
                if(res.status !== 200){
                    return this.$message.error('获取商品分类数据失败');
                }
                this.cateList = res.data.data.result;
                //为总数据条数赋值
                this.total = res.data.data.total;
                //console.log(this.total)
            })
        },
        //监听pageszie分页
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize;
            this.getCateList();
        },
        //监听pagenum改变
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage;
            this.getCateList();
        },
        //添加分类按钮事件
        showAddCateDialog(){
            //先获取父级分类的数据列表
            this.getParentCateList();
            //在展示列表
            this.addCateDialogVisible = true;
        },
        //获取父及分类的数据列表
        getParentCateList(){
            this.axios.get('categories',{type:2}).then(res=>{
                if(res.status !== 200){
                    return this.$message.error('获取父级分类数据失败');
                }
                //console.log(res.data)
                this.parentCateList = res.data.data;
                //console.log(this.parentCateList)
            })
        },
        //选择项发生变化触发这个函数
        parentCateChange(){
            //console.log(this.selectedKeys);
            //如果selectedKeys数组中的length的长度大于0，证明有选中的父类项
            //反之没有选中的父类
            if(this.selectedKeys.length>0){
                //父及分类的ID
                this.addCateFrom.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
                //为父及分类的等级赋值
                this.addCateFrom.cat_level = this.selectedKeys.length
                return 
            }else{
                //父及分类的ID
                this.addCateFrom.cat_pid = 0
                //为父及分类的等级赋值
                this.addCateFrom.cat_level = 0
            }
        },
        //点击按钮添加新的分类
        addCate(){
            //console.log(this.addCateFrom);
            this.$refs.addCateFromRef.validate(valid=>{
                if(!valid) return;
                this.axios.post('categories',this.addCateFrom).then(res=>{
                    //console.log(res);
                    if(res.status !== 200){
                        return this.$message.error('添加分类失败');
                    }
                    this.$message.success('添加分类成功');
                    this.getCateList();
                    this.addCateDialogVisible = false;
                })
            })
        },
        //关闭弹框，重置表单数据为空
        addCateDialogClosed(){
            this.$refs.addCateFromRef.resetFields();
            this.selectedKeys = [];
            this.addCateFrom.cat_pid = 0
            this.addCateFrom.cat_level = 0
        }
    }

}
</script>
<style lang="less">
.treeTable {
    margin-top: 15px;
}
.el-cascader {
    width: 100%;
}
</style>