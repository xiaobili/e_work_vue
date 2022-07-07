<template>
  <div>
    <div>
      <el-input placeholder="请输入内容" v-model="perInput" clearable>
      </el-input>
      <el-button type="primary">搜索</el-button>

      <el-button type="primary" @click="handleAdd">新增</el-button>
    </div>
    <!-- 表格 -->
    <div>
      <el-table :data="perTableData" style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="编号" width="120"> </el-table-column>
        <el-table-column prop="name" label="角色" width="120">
        </el-table-column>
        <el-table-column prop="namezh" label="角色名称" width="120">
        </el-table-column>
        <el-table-column prop="menus" label="菜单列表" width="800">
          <template slot-scope="scope">
            <el-tag
              type="success"
              v-for="item in scope.row.menus"
              :key="item.id"
              @click="handleLabelClick(item.id)"
              size="medium"
            >
              {{ item.name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增Dialog -->
    <el-dialog
      title="新增角色"
      :visible.sync="perDialogVisible"
      :close-on-click-modal="false"
    >
      <div>
        <el-form
          label-width="120px"
          ref="perForm"
          :model="perForm"
          :rules="perFormRules"
        >
          <el-form-item label="角色名称" prop="name">
            <el-input
              v-model="perForm.name"
              placeholder="请输入角色名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="角色名称(中文)" prop="namezh">
            <el-input
              v-model="perForm.namezh"
              placeholder="请输入角色名称(中文)"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="perDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="perFormAddSubmit()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="perTagDialogVisible">
      <!-- 描述信息 -->
      <el-descriptions title="详细信息">
        <el-descriptions-item label="ID">
          <el-tag size="small">{{ perTagMenu.id }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="Url">
          <el-tag size="small">{{ perTagMenu.url }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="路径">
          <el-tag size="small">{{ perTagMenu.path }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="组件">
          <el-tag size="small">{{ perTagMenu.component }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="名称">
          <el-tag size="small">{{ perTagMenu.name }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="图标">
          <el-tag size="small">{{ perTagMenu.iconcls }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="是否需要权限">
          <el-tag size="small">{{ perTagMenu.requireauth }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="父ID">
          <el-tag size="small">{{ perTagMenu.parentid }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="是否启用">
          <el-tag size="small">{{ perTagMenu.enabled }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!-- 编辑Dialog -->
    <el-dialog
      title="编辑角色"
      :visible.sync="perEditDialogVisible"
      :close-on-click-modal="false"
    >
      <div>
        <el-form
          label-width="120px"
          ref="perEditForm"
          :model="perEditForm"
          :rules="perFormRules"
        >
          <el-form-item label="角色名称" prop="name">
            <el-input
              v-model="perEditForm.name"
              placeholder="请输入角色名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="角色名称(中文)" prop="namezh">
            <el-input
              v-model="perEditForm.namezh"
              placeholder="请输入角色名称(中文)"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-tree
              :data="menus"
              :props="defaultProps"
              v-model="perEditForm.menus"
              @check="handleCheckNode"
              ref="tree"
              show-checkbox
              :default-checked-keys="menusByrole"
              node-key="id"
            >
            </el-tree>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="perEditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="perFormEditSubmit()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- "id": 7,
  "url": "/employee/basic/**",
  "path": "/emp/basic",
  "component": "EmpBasic",
  "name": "基本资料",
  "iconcls": null,
  "keepalive": null,
  "requireauth": 1,
  "parentid": 2,
  "enabled": 1,
  "children": null, -->
  </div>
</template>
<script>
export default {
  mounted() {
    this.getPerTableData();
    console.log(this.perTableData);
  },
  data() {
    return {
      perInput: "",
      perTableData: [],
      perDialogVisible: false,
      perTagDialogVisible: false,
      perEditDialogVisible: false,
      perForm: {
        id: "",
        name: "ROLE_",
        namezh: "",
        menus: []
      },
      perEditForm: {
        id: "",
        name: "",
        namezh: "",
        menus: []
      },
      perTagMenu: [],
      defaultProps: {
        children: "children",
        label: "name",
        value: "id",
        multiple: true
      },
      menus: [],
      menuIds: [],
      menusByrole: [],
      nodeIds: [],
      perFormRules: {
        name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
        namezh: [
          { required: true, message: "请输入角色名称(中文)", trigger: "blur" }
        ],
        menus: [{ required: true, message: "请选择菜单列表", trigger: "blur" }]
      }
    };
  },
  methods: {
    // 编辑框点击事件
    handleEdit(index, row) {
      this.perEditDialogVisible = true;
      this.perEditForm = row;
      this.getMenus();
      this.getMenusByRoleId(row.id);
    },
    // 级联选择器回调事件
    handleChange(value) {
      this.perForm.menus = value;
    },
    // 删除角色
    handleDelete(index, row) {
      this.$confirm("确定删除该角色吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (row.menus.length > 0) {
            this.$message({
              message: "该角色下有菜单，请先删除菜单",
              type: "warning"
            });
            return;
          }
          this.deleteRequest("/system/basic/permission/role/" + row.id).then(
            res => {
              if (res) {
                this.getPerTableData();
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              }
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 编辑角色提交
    perFormSubmit() {
      this.$refs["perForm"].validate(valid => {
        if (valid) {
          this.$message({
            type: "success",
            message: "提交成功!"
          });
          this.perDialogVisible = false;
        } else {
          this.$message({
            type: "error",
            message: "提交失败!"
          });
        }
      });
    },

    // 获取菜单列表
    getMenus() {
      this.getRequest("/system/basic/permission/menu/").then(res => {
        this.menus = res;
      });
    },
    // 根据角色ID获取菜单列表
    getMenusByRoleId(id) {
      this.getRequest("/system/basic/permission/mid/" + id).then(res => {
        this.menusByrole = res;
      });
    },
    // 初始化数据
    getPerTableData() {
      this.getRequest("/system/basic/permission/role/menu").then(res => {
        this.perTableData = res;
      });
    },
    // 新增角色提交
    perFormAddSubmit() {
      this.$refs["perForm"].validate(valid => {
        if (valid) {
          if (this.perForm.name.startsWith("ROLE_")) {
            this.postRequest(
              "/system/basic/permission/role/",
              this.perForm
            ).then(res => {
              if (res) {
                this.getPerTableData();
                this.$message({
                  type: "success",
                  message: "新增成功!"
                });
              }
            });
          } else {
            this.$message({
              type: "error",
              message: "角色名称必须以ROLE_开头!"
            });
          }
          this.perDialogVisible = false;
        } else {
          this.$message({
            type: "error",
            message: "提交失败!"
          });
        }
      });
      this.perForm = {
        id: "",
        name: "ROLE_",
        namezh: "",
        menus: []
      };
    },
    // 新增
    handleAdd() {
      this.perDialogVisible = true;
      this.getMenus();
    },
    // 菜单标签点击事件
    handleLabelClick(id) {
      this.getRequest("/system/basic/permission/menu/role/" + id).then(res => {
        this.perTagMenu = res;
        this.perTagDialogVisible = true;
      });
    },
    handleCheckNode(val) {
      //console.log(val);
      let nodes = this.$refs["tree"].getCheckedNodes();
      nodes.forEach(item => {
        // 将children不为空的节点删除
        if (item.children != null) {
          nodes.splice(nodes.indexOf(item), 1);
        }
        // 将节点id添加到数组中
        this.nodeIds.push(item.id);
      });
    },
    perFormEditSubmit() {
      this.putRequest(
        "/system/basic/permission/?roleId=" +
          this.perEditForm.id +
          "&menuIds=" +
          this.nodeIds
      ).then(res => {
        if (res.code == 200) {
          this.getPerTableData();
          this.$message({
            type: "success",
            message: "修改成功!"
          });
          this.nodeIds = [];
          this.perEditDialogVisible = false;
        }
      });
    }
  }
};
</script>
<style></style>
