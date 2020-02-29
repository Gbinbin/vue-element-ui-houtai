<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加角色按钮区域 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddRoles">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 角色列表区域 -->
            <el-table :data="rolesList" border stripe>
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['bdbottom',i1 === 0 ? 'bdtop' : '','vcenter']" v-for="(item1,i1) in scope.row.children" :key="i1"> 
                            <!-- 一级权限 -->
                            <el-col :span="5">
                                <el-tag @close="removeRightById(scope.row,item1.id)" closable>{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 二级和三级权限 -->
                            <el-col :span="19">
                                <!-- 通过for循环 嵌套渲染二级权限 -->
                                <el-row :class="[index === 0 ? '' : 'bdtop','vcenter']" v-for="(item2,index) in item1.children" :key="index">
                                    <el-col :span="6">
                                        <el-tag @close="removeRightById(scope.row,item2.id)" closable type="success">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag @close="removeRightById(scope.row,item3.id)" closable type="warning" v-for="(item3,index) in item2.children" :key="index">{{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button @click="showRoleDialog(scope.row.id)" size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                        <el-button @click="removeRoleById(scope.row.id)" size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                        <el-button @click="showSetRightDialog(scope.row)" size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 分配权限对话框 -->
        <el-dialog
            title="分配权限"
            :visible.sync="setRightDialogVisible"
            width="50%"
            @close="setRightDialogClosed">
            <!-- 树形控件 -->
            <el-tree ref="treeRef" :default-checked-keys="defkeys" default-expand-all show-checkbox node-key="id" :data="rightList" :props="treeProps"></el-tree>

            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 添加用户对话框 -->
        <el-dialog
            title="修改用户"
            :visible.sync="editDialogVisible"
            width="50%"
            @close="editDialogClosed">
            <el-form :model="editForm" ref="editFormRef" label-width="70px" >
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRoleInfo">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 添加角色对话框 -->
        <el-dialog
            title="添加角色"
            :visible.sync="addRoleDialogVisible"
            width="50%"
            @close="addRoleFormClose">
            <el-form :rules="addRoleFormRule" ref="addRoleFormRef"  :model="addRoleForm" label-width="80px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addRoleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addRoleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRoles">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'Roles',
    data(){
        return {
            //添加角色弹出框的判断信息规则
            addRoleFormRule: {
                roleName: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' }
                ],
                roleDesc: [
                    { required: true, message: '请输入角色描述', trigger: 'blur' }
                ]

            },
            //添加角色的数据
            addRoleForm: {
                roleName: '',
                roleDesc: ''
            },
            //添加角色对话框的现示与隐藏
            addRoleDialogVisible: false,
            rolesList: [],
            editDialogVisible: false,
            editForm: {},
            //控制分配权限的对话框的显示与隐藏
            setRightDialogVisible: false,
            //所有权限的数据
            rightList: [],
            //树形结构的绑定属性对象
            treeProps: {
                label: 'authName',
                children: 'children'
            },
            //默认选中的节点ID值
            defkeys: [],
            //当前即将分配权限的ID
            roleId: ''
        }
    },
    created(){
        this.getRolesList();
    },
    methods: {
        //添加角色对话框的重置
        addRoleFormClose(){
            this.$refs.addRoleFormRef.resetFields();
        },
        //添加角色的方法
        addRoles(){
            this.$refs.addRoleFormRef.validate(valid=>{
                if(!valid) return;
                this.axios.post('roles',this.addRoleForm).then(res=>{
                    if(res.data.meta.status !== 201){
                        return this.$message.error('添加角色失败')
                    }
                    this.$message.success('添加角色成功')
                    this.getRolesList();
                    this.addRoleDialogVisible = false
                })
            })
        },
        //显示添加角色弹出框
        showAddRoles(){
            this.addRoleDialogVisible = true

        },
        //获取数据方法
        getRolesList(){
            this.axios.get('roles').then(res=>{
                //console.log(res);
                if(res.status !== 200){
                    return this.$message.error('请求数据失败。');
                }
                this.rolesList = res.data.data;
                    //console.log(this.rolesList)
            })
        },
        //点击删除数据
        async removeRoleById(id){
            const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err);
            if(confirmResult !== 'confirm'){
                return this.$message.info('已取消删除');
            }
            //console.log('确认了删除')
            this.axios.delete('roles/'+id).then(res=>{
                if(res.status !== 200) return this.$message.error('删除数据失败');
                this.$message.success('成功删除数据');
                this.getRolesList();
            })
        },
        //展示编辑数据事件
        showRoleDialog(id){
            this.axios.get('roles/'+id).then(res=>{
                if(res.status !== 200){
                    return this.$message.error('请求数据失败');
                }
                this.editForm = res.data.data;
                //console.log(this.editForm);
            });
            this.editDialogVisible = true;
        },
        //修改数据
        editRoleInfo(){
           this.$refs.editFormRef.validate(valid=>{
                //console.log(valid);  返回true
                if(!valid) return;
                //验证通过，发起修改用户信息的数据请求
                this.axios.put('roles/'+ this.editForm.roleId,{
                    roleName : this.editForm.roleName,
                    roleDesc: this.editForm.roleDesc
                }).then(res=>{
                    if(res.status !== 200) return this.$message.error('修改数据失败.');
                    //关闭对话框
                    this.editDialogVisible = false;
                    //刷新数据
                    this.getRolesList();
                    //console.log(res);
                    //提示修改成功
                    this.$message.success('数据修改成功.');
                })
            })
        },
        //重置数据为空
        editDialogClosed(){
            this.$refs.editFormRef.resetFields();
        },
        //根据ID删除对应的权限
        async removeRightById(role,rightId){
            const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err=>err)
            if(confirmResult !== 'confirm'){
                return this.$message.info('取消了删除');
            }
            //console.log('确认了删除');
            const {data:res} = await this.axios.delete(`roles/${role.id}/rights/${rightId}`)
                //删除失败的方法
                if(res.meta.status !== 200){
                    return this.$message.error('删除失败');
                }
                //删除成功之后刷新下列表，会重新渲染数据，用户体验不好
                //this.getRolesList();
                role.children = res.data;
                //console.log(res.data);
        
        },
        //展示分配权限的对话框
        async showSetRightDialog(role){
            this.roleId = role.id;
            //获取权限列表的数据
            const {data:res} = await this.axios.get('rights/tree');
            if(res.meta.status !== 200){
                return this.$message.error('获取权限列表失败。');
            }
            //console.log(res);
            //把获取到的权限数据保存到data中
            this.rightList = res.data;
            //递归获取三级节点的ID
            this.getLeafKeys(role,this.defkeys);
            this.setRightDialogVisible = true;
        },
        //通过递归的形式，获取角色下三级权限的id并保存得到defkeys中
        getLeafKeys(node,arr){
            //如果node节点不包含children属性，则是三级节点
            if(!node.children){
                return arr.push(node.id)
            }
            node.children.forEach(item=>{
                this.getLeafKeys(item,arr)
            })
        },
        //关闭对话框，重置数据
        setRightDialogClosed(){
            this.defkeys = []
        },
        //点击为角色分配权限
        async allotRights(){
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            //获取到的ID值
            //console.log(keys)
            const idStr = keys.join(',');
            const {data:res} = await this.axios.post(`roles/${this.roleId}/rights`,{rids:idStr})
            if(res.meta.status !== 200){
                return this.$message.error('分配权限失败')
            }
            this.$message.success('分配权限成功');
            this.getRolesList();
            this.setRightDialogVisible = false;
        }
    }
}
</script>
<style lang="less">
.el-tag {
    margin: 7px;
}
.bdtop {
    border-top: 1px solid #eee;
}
.bdbottom {
    border-bottom: 1px solid #eee;
}
.vcenter {
    display: flex;
    align-items: center;
}
</style>