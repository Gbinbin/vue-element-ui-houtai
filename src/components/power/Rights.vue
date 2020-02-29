<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片管理 -->
        <el-card>
            <el-table :data="rightsList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="权限名称" prop="authName"></el-table-column>
                <el-table-column label="路径" prop="path"></el-table-column>
                <el-table-column label="权限等级" prop="level">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level == 0">一级</el-tag>
                        <el-tag type="success" v-else-if="scope.row.level == 1">二级</el-tag>
                        <el-tag type="warning" v-else>三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>
<script>
export default {
    name: 'Rights',
    data(){
        return {
            //权限列表数据
            rightsList: []
        }
    },
    created(){
        //获取权限数据的函数
        this.getRightsList();
    },
    methods: {
        //获取权限列表数据的方法
        getRightsList(){
            this.axios.get('rights/list').then(res=>{
                //console.log(res);
                if(res.status !== 200){
                    return this.$message.error('请求数据失败.');
                }
                //请求成功
                this.rightsList = res.data.data;
            })
        }
    } 
}
</script>
<style lang="less" scoped>

</style>