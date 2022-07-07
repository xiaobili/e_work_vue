<template>
  <div>
    <h1>部门管理</h1>
    <el-card>
      <el-tree
        :data="depData"
        node-key="id"
        :props="defaultProps"
        size="mini"
        default-expand-all
      >
        <span
          class="custom-tree-node"
          slot-scope="{ node, data }"
          size="small"
          style="display: flex;justify-content: space-between;width: 100%;"
        >
          <span>{{ node.label }}</span>
          <span>
            <el-button
              type="danger"
              size="mini"
              @click="handleRemove(data)"
              class="el_btn"
            >
              <i class="el-icon-delete">删除部门</i>
            </el-button>
            <el-button
              type="primary"
              size="mini"
              @click="handleAdd(data)"
              class="el_btn"
            >
              <i class="el-icon-add">新增部门</i>
            </el-button>
          </span>
        </span>
      </el-tree>
    </el-card>
    <el-card>
      <!-- 新增部门Dialog -->
      <el-dialog
        title="新增部门"
        :visible.sync="addDepDialogVisible"
        width="30%"
        @close="addDepDialogVisible = false"
      >
        <el-form
          :model="addDepForm"
          :rules="addDepFormRules"
          ref="addDepForm"
          label-width="100px"
        >
          <el-form-item label="部门名称" prop="name">
            <el-input
              v-model="addDepForm.name"
              placeholder="请输入部门名称"
              style="width: 200px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="上级部门" prop="parentid">
            {{ addDepForm.parentid }}
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addDep">提交</el-button>
            <el-button @click="addDepDialogVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  mounted() {
    this.initDepData();
  },
  data() {
    return {
      depData: [],
      defaultProps: {
        children: "children",
        label: "name",
        value: "id",
        checkStrictly: true
      },
      addDepForm: {
        name: "",
        parentid: ""
      },
      addDepFormRules: {
        name: [{ required: true, message: "请输入部门名称", trigger: "blur" }]
      },
      addDepDialogVisible: false
    };
  },
  methods: {
    // 初始化部门数据
    initDepData() {
      this.getRequest("/system/basic/department/").then(res => {
        this.depData = res;
      });
    },
    // 删除部门
    handleRemove(data) {
      this.$confirm("确定删除该部门吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.removeDep(data.id);
        })
        .catch(() => {
          this.$message({
            message: "已取消删除",
            type: "info"
          });
        });
      console.log(data);
    },
    removeDep(id) {
      this.deleteRequest("/system/basic/department/" + id).then(res => {
        if (res.code == 200) {
          this.initDepData();
        }
      });
    },
    // 新增部门
    handleAdd(data) {
      this.addDepDialogVisible = true;
      console.log(data);
      console.log(data.id);
      this.addDepForm.parentid = data.id;
    },
    addDep() {
      this.$refs.addDepForm.validate(valid => {
        if (valid) {
          this.postRequest("/system/basic/department/", this.addDepForm).then(
            res => {
              if (res.code == 200) {
                this.initDepData();
                this.addDepDialogVisible = false;
                this.addDepForm = {
                  name: "",
                  parentid: ""
                };
              }
            }
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
<style>
.el_btn {
  margin-bottom: 2px;
}
</style>
