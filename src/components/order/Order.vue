<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片管理 -->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                <el-input placeholder="请输入内容"  clearable v-model="queryInfo.query" @clear="getOrderList">
                    <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
                </el-input>
                </el-col>
            </el-row>
            <!-- table表格 -->
            <el-table border stripe :data='orderList'>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="订单编号" prop="order_number" width="260px"></el-table-column>
                <el-table-column label="订单价格" prop="order_price" width="80px"></el-table-column>
                <el-table-column label="是否付款" prop="pay_status">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
                        <el-tag type="danger" v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" prop="is_send">
                </el-table-column>
                <el-table-column label="下单时间" prop="create_time">
                    <template slot-scope="scope">
                        {{scope.row.create_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template>
                        <el-button size="mini" type="primary" icon="el-icon-edit" @click="showBox"></el-button>
                        <el-button size="mini" type="success" icon="el-icon-location" @click="showProgressBox"></el-button>
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
        <!-- 修改地址对话框 -->
        <el-dialog
            title="修改地址"
            :visible.sync="addressDialogVisible"
            width="50%"
            @close="addressDialogClose">
            <el-form :rules="addressFormRule" ref="addressFormRef" :model="addressForm" label-width="80px">
                <el-form-item label="省市/区" prop="address1">
                    <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                    <el-input v-model="addressForm.address2"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addressDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addressDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改地址对话框 -->
        <!-- 物流信息对话框 -->
            <el-dialog
                title="修改地址"
                :visible.sync="progressDialogVisible"
                width="50%">
                
            </el-dialog>
        <!-- 物流信息对话框 -->
    </div>
</template>

<script>
import cityData from './citydata.js'
 export default {
    name: 'order',
    data() {
        return {
            progressDialogVisible: false,
            cityData,
            orderList: [],
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 5
            },
            total: 0,
            addressDialogVisible: false,
            addressForm: {
                address1: [],
                address2: ''
            },
            addressFormRule: {
                address1: [
                    { required: true,message: "请选择省市区", trigger: 'blur' }
                ],
                address2: [
                    { required: true,message: "请输入详细地址", trigger: 'blur' }
                ]
            },
            progressInfo: []
        }
    },
    created(){
        this.getOrderList()
    },
    methods: {
        getOrderList(){
            this.axios.get('orders',{params:this.queryInfo}).then(res=>{
                if(res.data.meta.status !== 200){
                    return this.$message.error('请求数据失败')
                }
                this.orderList = res.data.data.goods
                this.total = res.data.data.total
            })
        },
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getOrderList()
        },
        handleCurrentChange(newNum){
            this.queryInfo.pagenum = newNum
            this.getOrderList()
        },
        showBox(){
            this.addressDialogVisible = true
        },
        addressDialogClose(){
            this.$refs.addressFormRef.resetFields()
        },
        showProgressBox(){
            this.axios.get('/kuadi/804909574412544580').then(res=>{
                if(res.data.meta.status !== 200){
                    return  this.$message.error('获取物流信息失败')
                }
                this.progressInfo = res.data.data
            })
            this.progressDialogVisible = true
        }
    }
 }
</script>

<style scoped>
.el-cascader {
    width: 100%;
}
 
</style>
