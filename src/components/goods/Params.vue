<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-alert
        show-icon
        :closable="false"
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cate_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择框 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="catelist"
            :props="cateProps"
            expand-trigger="hover"
            @change="handleChange"
          >
          </el-cascader>
        </el-col>
      </el-row>
      <!-- tab 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button @click="addDialogVisible = true" :disabled="isBtnDisabled" type="primary" size="mini"
            >添加参数</el-button>
            <!-- 动态参数表格 -->
            <el-table border stripe :data="manyTabData">
                <!-- 展开行 -->
                <el-table-column type="expand"></el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                <el-table-column label="操作">
                    <template>
                        <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
        <!-- 静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button @click="addDialogVisible = true" :disabled="isBtnDisabled" type="primary" size="mini"
            >添加属性</el-button>
            <!-- 静态属性表格 -->
            <el-table border stripe :data="onlyTabData">
                <!-- 展开行 -->
                <el-table-column type="expand"></el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                <el-table-column label="操作">
                    <template>
                        <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数的对话框 -->
    <el-dialog
        :title="'添加' + titleText"
        :visible.sync="addDialogVisible"
        width="50%">
        <!-- 添加属性或者参数的form表单 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
            <el-form-item :label="titleText" prop="attr_name">
                <el-input v-model="addForm.attr_name"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //添加表单的验证规则对象
      addFormRules: {
        attr_name: [
           { required: true,message: "请输入参数名称", trigger: 'blur' },
        ]
      },
      //添加参数的表单数据对象
      addForm: {
        attr_name: ''
      },
      //商品分类数据
      catelist: [],
      //级联选择框的配置
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //级联选择框双向绑定的数组
      selectedCateKeys: [],
      //被激活的页签名称
      activeName: 'many',
      //动态参数的数据
      manyTabData: [],
      //静态属性的数据
      onlyTabData: [],
      //控制添加属性弹框的显示与隐藏
      addDialogVisible: false
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //获取商品分类的方法
    getCateList() {
      this.axios.get('categories').then(res => {
        if (res.status !== 200) {
          return this.$message.error('获取商品分类失败')
        }
        this.catelist = res.data.data
        //console.log(this.catelist)
      })
    },
    //级联选择框发生变化，触发的函数
    handleChange() {
        this.getParamsData();
    },
    getParamsData(){
        //console.log(this.selectedCateKeys);
        //证明选中的不是三级分类
        if (this.selectedCateKeys.length !== 3) {
            this.selectedCateKeys = []
            return
        }
        //选中的是三级分类
        //console.log(this.selectedCateKeys);
        //根据所选分类的id，和当前所处的面板，获取对应的参数
        this.axios.get(`categories/${this.cateId}/attributes`,{
            params: {
                sel: this.activeName
            }
        }).then(res=>{
            if(res.status !== 200){
                return this.$message.error('获取参数列表失败')
            }
            //console.log(res.data)
            if(this.activeName === 'many'){
                this.manyTabData = res.data.data
            }else{
                this.onlyTabData = res.data.data
            }
            //this.$message.success('获取参数列表成功')
            
        })
    },
    //tab 切换触发的方法
    handleTabClick() {
        this.getParamsData();
    }
  },
  computed: {
    //如果按钮需要禁用返回true，否则返回false
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    //当前选中的三级分类的id
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    //动态计算标题的文本
    titleText(){
        if(this.activeName === 'many'){
            return '动态参数'
        }else{
            return '静态属性'
        }
    }
  }
}
</script>
<style scoped>
.cate_opt {
  margin: 15px 0;
}
</style>
