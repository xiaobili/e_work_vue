<template>
  <div>
    <!-- 输入框 -->
    <div>
      <el-input
        placeholder="请输入职称"
        v-model="jobAddData.name"
        clearable
        class="el-input"
      >
      </el-input>
      <el-select v-model="jobAddData.titlelevel" placeholder="请选择职级">
        <el-option
          v-for="item in jobLevleData"
          :key="item"
          :label="item"
          :value="item"
        >
        </el-option>
      </el-select>
      <el-button type="primary" @click="handleAdd" plain>添加职位</el-button>
    </div>
    <!-- 表格 -->
    <div class="tableClass">
      <el-table
        :data="jobTableData"
        height="500"
        border
        style="width: 100%"
        @selection-change="handleSelection"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="编号" width="180"> </el-table-column>
        <el-table-column prop="name" label="职称" width="180">
        </el-table-column>
        <el-table-column prop="titlelevel" label="职级" width="180">
        </el-table-column>
        <el-table-column prop="enabled" label="是否启用">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.enabled">启用</el-tag>
            <el-tag type="danger" v-else>禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdate" label="创建时间"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="medium"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑
            </el-button>
            <el-button
              type="danger"
              size="medium"
              @click="handleDelete(scope.$index, scope.row)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 批量删除按钮 -->
    <div class="footerClass">
      <el-button
        type="danger"
        @click="handleDeleteAll"
        :disabled="selection.length == 0"
        >批量删除</el-button
      >
    </div>
    <!-- 编辑dialog -->
    <el-dialog title="编辑职位" :visible.sync="editDialogVisible" width="30%">
      <div class="dialogClass">
        <el-form :model="jobEditData" :rules="editRules">
          <el-form-item label="职称" prop="name">
            <el-input
              v-model="jobEditData.name"
              clearable
              class="input_cls"
            ></el-input>
          </el-form-item>
          <el-form-item label="职级" prop="titlelevel">
            <el-input
              v-model="jobEditData.titlelevel"
              clearable
              class="input_cls"
            ></el-input>
          </el-form-item>
          <el-form-item label="是否启用" prop="enabled">
            <el-switch
              v-model="jobEditData.enabled"
              active-value="1"
              inactive-value="0"
            ></el-switch>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditSubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  mounted() {
    this.initJoblevle();
  },
  data() {
    return {
      jobTableData: [],
      jobLevleData: [
        "初级",
        "中级",
        "副高级",
        "正高级",
        "高级",
        "资深",
        "首席"
      ],
      selection: [],
      editDialogVisible: false,
      jobAddData: {
        name: "",
        titlelevel: ""
      },
      jobEditData: {
        name: "",
        titlelevel: "",
        enabled: ""
      },
      editRules: {
        name: [{ required: true, message: "请输入职位名称", trigger: "blur" }],
        titlelevel: [
          { required: true, message: "请输入职级名称", trigger: "blur" }
        ],
        enabled: [
          { required: true, message: "请选择是否启用", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 编辑职位
    handleEdit(index, row) {
      this.jobEditData = row;
      this.editDialogVisible = true;
    },
    // 删除单条职位提示框
    handleDelete(index, row) {
      this.$confirm("确认删除该职位吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteJoblevel(row.id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 删除单条职位
    deleteJoblevel(id) {
      this.deleteRequest("/system/basic/joblevel/" + id).then(res => {
        if (res.code == 200) {
          this.initJoblevle();
        }
      });
    },
    // 处理多选框的选中事件
    handleSelection(val) {
      this.selection = val;
    },
    // 批量删除
    handleDeleteAll() {
      const ids = [];
      this.selection.forEach(item => {
        // 将选中的数据id追加到数组中
        ids.push(item.id);
      });
      const obj = Array.from(Object.values(ids), x => x);
      console.log(obj);
      this.$confirm("确定删除所有数据吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.batchDeleteRequest("/system/basic/position/batch", obj).then(
            res => {
              this.initJoblevle();
              // 清空数组
              this.selectionIds = [];
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
    // 初始化职位列表
    initJoblevle() {
      this.getRequest("/system/basic/joblevel/").then(res => {
        this.jobTableData = res.data;
      });
    },
    // 添加职位
    handleAdd() {
      this.postRequest("/system/basic/joblevel/", this.jobAddData).then(res => {
        if (res.code === 200) {
          this.initJoblevle();
        }
      });
    },
    handleEditSubmit() {
      this.putRequest("/system/basic/joblevel/", this.jobEditData).then(res => {
        if (res.code == 200) {
          this.initJoblevle();
          this.editDialogVisible = false;
          this.jobEditData = {
            id: "",
            name: "",
            titlelevle: "",
            enabled: "",
            createdate: ""
          };
        }
      });
    }
  }
  // 编辑职位提交
};
</script>
<style>
.el-input {
  width: 20%;
}

.tableClass {
  width: 100%;
  margin-top: 20px;
}

.footerClass {
  margin-top: 20px;
}

.input_cls {
  width: 180px;
}
</style>
