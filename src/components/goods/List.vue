<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table border stripe :data="goodsList" style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" width="95px" label="商品价格"></el-table-column>
        <el-table-column prop="goods_weight" width="70px" label="商品重量"></el-table-column>
        <el-table-column prop="add_time" width="140px" label="创建时间">
          <template slot-scope="scope">{{ scope.row.add_time | dateFormat }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="delGoodsById(scope.row.goods_id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total"
        background
      ></el-pagination>
      <!-- 分页结束 -->
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'list',
  data() {
    return {  //传入的信息
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      goodsList: [],
      delGoodsDialogVisible: false
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    goAddPage() {
      this.$router.push('/goods/add')
    },
    //获取数据 存到data中
    getGoodsList() {
      this.axios.get('goods', { params: this.queryInfo }).then(res => {
        //console.log(res.data)
        if (res.data.meta.status !== 200) {
          return this.$message.error('请求数据失败')
        }
        //this.$message.success('请求数据成功')
        this.total = res.data.data.total
        this.goodsList = res.data.data.goods
        //console.log(this.goodsList);
      })
    },
    //分页规定的一页多少条
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    //点击分页数字跳转对应页
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getGoodsList()
    },
    //根据id删除对应项
    async delGoodsById(id) {
      const conformResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (conformResult !== 'confirm') {
        //console.log(conformResult)
        return this.$message.info('已取消删除')
      }
      this.axios.delete(`goods/${id}`).then(res => {
        //console.log(res)
        if (res.data.meta.status !== 200) {
          return this.$message.error('删除失败')
        }
        this.$message.success('删除成功')
        this.getGoodsList()
      })
    }
  }
}
</script>
<style></style>
