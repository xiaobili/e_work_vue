<template>
  <div>
    <!-- 上传下载/批量删除按钮 -->
    <div class="el-upload-class">
      <!-- 第一行 -->
      <el-row type="flex" justify="space-between">
        <!-- 批量删除按钮  -->
        <el-col>
          <el-button
            size="medium"
            type="danger"
            @click="handleDeleteBatch"
            icon="el-icon-delete"
            class="delete-button"
          >
            批量删除</el-button
          >
        </el-col>
        <!-- 新增按钮 -->
        <el-col>
          <el-button
            size="medium"
            type="primary"
            @click="handleAdd"
            icon="el-icon-plus"
            class="add-button"
          >
            新增</el-button
          >
        </el-col>

        <!-- 时间选择搜索 -->
        <el-col>
          <el-date-picker
            v-model="dateValue"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            style="width: 320px"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-col>
        <el-col>
          <el-button
            size="medium"
            type="primary"
            @click="handleDateSearch"
            icon="el-icon-search"
            class="search-button"
            style="margin-left: 10px"
            >按入职日期搜索</el-button
          >
        </el-col>
        <!-- 上传按钮  -->
        <el-col>
          <el-upload
            class="upload-demo"
            action
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="1"
            :on-exceed="handleExceed"
            :auto-upload="false"
            :http-request="uploadSubmit"
            ref="upload"
          >
            <el-button
              size="medium"
              type="primary"
              icon="el-icon-folder-add"
              class="upload-button"
              slot="trigger"
              >读取文件
            </el-button>
            <el-button
              size="medium"
              type="success"
              icon="el-icon-upload"
              class="upload-button"
              @click="submitUpload"
            >
              点击上传</el-button
            >
            <div slot="tip" class="el-upload__tip">
              只能上传Exel文件
            </div>
          </el-upload>
        </el-col>
        <!-- 下载按钮  -->
        <el-col>
          <el-button
            size="medium"
            type="primary"
            @click="handleDownload"
            icon="el-icon-download"
            class="download-button"
            >下载数据</el-button
          >
        </el-col>
      </el-row>
      <!-- 第二行 -->
      <el-row>
        <el-form
          :inline="true"
          :model="empQuery"
          ref="empQuery"
          class="demo-form-inline"
        >
          <el-form-item label="审批人" prop="name">
            <el-input
              v-model="empQuery.name"
              placeholder="请输入姓名"
            ></el-input>
          </el-form-item>
          <el-form-item label="政治面貌" prop="politicid">
            <el-select
              v-model="empQuery.politicid"
              placeholder="请选择政治面貌"
            >
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="(item, index) in allPolitics"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="民族" prop="nationid">
            <el-select
              v-model="empQuery.nationid"
              placeholder="请选择政民族"
              prop="nationid"
            >
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="(item, index) in allNations"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="职位" prop="posid">
            <el-select
              v-model="empQuery.posid"
              placeholder="请选择职位"
              prop="posid"
            >
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="(item, index) in allPositions"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="职称" prop="joblevelid">
            <el-select
              v-model="empQuery.joblevelid"
              placeholder="请选择职称"
              prop="joblevelid"
            >
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="(item, index) in allJoblevles"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="部门" prop="departmentid">
            <el-select
              v-model="empQuery.departmentid"
              placeholder="请选择部门"
              prop="departmentid"
            >
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="(item, index) in allDepartments"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="聘用形式" prop="engageform">
            <el-radio-group v-model="empQuery.engageform">
              <el-radio label="劳动合同">劳动合同</el-radio>
              <el-radio label="劳务合同">劳务合同</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="empQuery.gender">
              <el-radio label="男">男</el-radio>
              <el-radio label="女">女</el-radio>
              <el-radio label="未知">未知</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button
              @click="getQueryData"
              size="medium"
              type="primary"
              icon="el-icon-search"
              class="search-button"
            ></el-button>
            <!-- 重置按钮 -->
            <el-button
              @click="resetForm('empQuery')"
              size="medium"
              type="primary"
              icon="el-icon-refresh"
              class="search-button"
            ></el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </div>
    <!-- 数据表格 -->
    <div class="el-table">
      <el-table
        :data="empData"
        border
        style="width: 100%"
        @selection-change="handleSelection"
      >
        <!-- 表格 BEGIN -->
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column fixed prop="id" label="员工编号" width="80">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="120" fixed="left">
        </el-table-column>
        <el-table-column prop="gender" label="性别" width="120">
        </el-table-column>
        <el-table-column prop="birthday" label="生日" width="120">
        </el-table-column>
        <el-table-column prop="idcard" label="身份证号" width="120">
        </el-table-column>
        <el-table-column prop="wedlock" label="婚姻状况" width="120">
        </el-table-column>
        <el-table-column prop="nation.name" label="民族" width="120">
        </el-table-column>
        <el-table-column prop="nativeplace" label="籍贯" width="120">
        </el-table-column>
        <el-table-column
          prop="politicsStatus.name"
          label="政治面貌"
          width="120"
        >
        </el-table-column>
        <el-table-column prop="email" label="电子邮件" width="120">
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="120">
        </el-table-column>
        <el-table-column prop="address" label="家庭地址" width="120">
        </el-table-column>
        <el-table-column prop="department.name" label="所属部门" width="120">
        </el-table-column>
        <el-table-column prop="jobLevel.name" label="职级" width="120">
        </el-table-column>
        <el-table-column prop="position.name" label="职位" width="120">
        </el-table-column>
        <el-table-column prop="engageform" label="合同类型" width="120">
        </el-table-column>
        <el-table-column prop="tiptopdegree" label="学位" width="120">
        </el-table-column>
        <el-table-column prop="specialty" label="专业" width="120">
        </el-table-column>
        <el-table-column prop="school" label="毕业学校" width="120">
        </el-table-column>
        <el-table-column prop="begindate" label="入职日期" width="120">
        </el-table-column>
        <el-table-column prop="workstate" label="工作状态" width="120">
        </el-table-column>
        <el-table-column prop="workid" label="工号" width="120">
        </el-table-column>
        <el-table-column prop="contractterm" label="合同期限" width="120">
        </el-table-column>
        <el-table-column prop="conversiontime" label="转正时间" width="120">
        </el-table-column>
        <el-table-column prop="notworkdate" label="离职时间" width="120">
        </el-table-column>
        <el-table-column prop="begincontract" label="合同开始日期" width="120">
        </el-table-column>
        <el-table-column prop="endcontract" label="合同结束日期" width="120">
        </el-table-column>
        <el-table-column prop="workage" label="工龄" width="120">
        </el-table-column>
        <el-table-column prop="salaryid" label="工资" width="120">
        </el-table-column>
        <!-- 表格 END -->
        <el-table-column fixed="right" label="操作" width="220">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)"
            >
              编辑
            </el-button>
            <el-button
              size="mini"
              type="info"
              @click="handleView(scope.$index, scope.row)"
            >
              查看
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页标签-->
    <div class="el-pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <!-- 描述列表 -->
    <div>
      <el-dialog title="员工信息" :visible.sync="empDialogVisible">
        <el-descriptions
          class="margin-top"
          :column="4"
          :size="describeSize"
          border
        >
          <el-descriptions-item label="员工编号">
            <span class="font-red">{{ describeList.id }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="姓名">
            <span class="font-red">{{ describeList.name }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="性别">
            <span class="font-red">{{ describeList.gender }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="生日">
            <span class="font-red">{{ describeList.birthday }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="身份证号">
            <span class="font-red">{{ describeList.idcard }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="婚姻状态">
            <span class="font-red">{{ describeList.wedlock }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="籍贯">
            <span class="font-red">{{ describeList.nativeplace }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="民族" v-if="describeList.nation">
            <span class="font-red">{{ describeList.nation.name }}</span>
          </el-descriptions-item>
          <el-descriptions-item
            label="政治面貌"
            v-if="describeList.politicsStatus"
          >
            <span class="font-red">{{ describeList.politicsStatus.name }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="电子邮箱">
            <span class="font-red">{{ describeList.email }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="手机号">
            <span class="font-red">{{ describeList.phone }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="家庭住址">
            <span class="font-red">{{ describeList.address }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="所属部门" v-if="describeList.department">
            <span class="font-red">{{ describeList.department.name }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="职级" v-if="describeList.jobLevel">
            <span class="font-red">{{ describeList.jobLevel.name }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="职位" v-if="describeList.position">
            <span class="font-red">{{ describeList.position.name }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="合同类型">
            <span class="font-red">{{ describeList.engageform }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="学位">
            <span class="font-red">{{ describeList.tiptopdegree }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="专业">
            <span class="font-red">{{ describeList.specialty }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="毕业学校">
            <span class="font-red">{{ describeList.school }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="入职日期">
            <span class="font-red">{{ describeList.begindate }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="工作状态">
            <span class="font-red">{{ describeList.workstate }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="工号">
            <span class="font-red">{{ describeList.workid }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="合同期限">
            <span class="font-red">{{ describeList.contractterm }}年</span>
          </el-descriptions-item>
          <el-descriptions-item label="转正日期">
            <span class="font-red">{{ describeList.conversiontime }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="离职日期">
            <span class="font-red">{{ describeList.notworkdate }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="合同开始日期">
            <span class="font-red">{{ describeList.begincontract }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="合同结束日期">
            <span class="font-red">{{ describeList.endcontract }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="工龄">
            <span class="font-red">{{ describeList.workage }}</span>
          </el-descriptions-item>
        </el-descriptions>
      </el-dialog>
    </div>
    <!-- 编辑表单 -->
    <div>
      <el-dialog
        title="编辑员工"
        :visible.sync="editDialogFormVisible"
        class="el-dialog-class"
      >
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editForm"
          label-width="80px"
          status-icon="true"
          class="el-form-class"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item label="姓名" prop="name">
                <el-input
                  v-model="editForm.name"
                  placeholder="请输入姓名"
                ></el-input>
              </el-form-item>
              <el-form-item label="性别" prop="gender">
                <el-radio-group v-model="editForm.gender">
                  <el-radio label="男">男</el-radio>
                  <el-radio label="女">女</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="生日" prop="birthday">
                <el-date-picker
                  v-model="editForm.birthday"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="身份证号" prop="idcard">
                <el-input
                  v-model="editForm.idcard"
                  placeholder="请输入身份证号"
                ></el-input>
              </el-form-item>
              <el-form-item label="婚姻状态" prop="wedlock">
                <el-radio-group v-model="editForm.wedlock">
                  <el-radio label="已婚">已婚</el-radio>
                  <el-radio label="未婚">未婚</el-radio>
                  <el-radio label="离异">离异</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="合同形式" prop="engageform">
                <el-radio-group v-model="editForm.engageform">
                  <el-radio label="劳动合同">劳动合同</el-radio>
                  <el-radio label="劳务合同">劳务合同</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="籍贯" prop="nativeplace">
                <el-input
                  v-model="editForm.nativeplace"
                  placeholder="请输入籍贯"
                ></el-input>
              </el-form-item>
              <el-form-item label="民族" prop="nation">
                <el-select v-model="editForm.nationid" placeholder="请选择民族">
                  <el-option
                    :label="item.name"
                    :value="item.id"
                    v-for="(item, index) in allNations"
                    :key="index"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="政治面貌" prop="politics">
                <el-select
                  v-model="editForm.politicid"
                  placeholder="请选择政治面貌"
                >
                  <el-option
                    :label="item.name"
                    :value="item.id"
                    v-for="(item, index) in allPolitics"
                    :key="index"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="学历" prop="tiptopdegree">
                <el-select
                  v-model="editForm.tiptopdegree"
                  placeholder="请选择学历"
                >
                  <el-option
                    :label="item"
                    :value="item"
                    v-for="(item, index) in allDegrees"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="毕业学校" prop="school">
                <el-input
                  v-model="editForm.school"
                  placeholder="请输入毕业学校"
                ></el-input>
              </el-form-item>
              <el-form-item label="专业" prop="specialty">
                <el-input
                  v-model="editForm.specialty"
                  placeholder="请输入专业"
                ></el-input>
              </el-form-item>
              <el-form-item label="入职时间" prop="begindate">
                <el-date-picker
                  v-model="editForm.begindate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="电子邮箱" prop="email">
                <el-input
                  v-model="editForm.email"
                  placeholder="请输入电子邮箱"
                ></el-input>
              </el-form-item>

              <el-form-item label="合同结束日期" prop="endcontract">
                <el-date-picker
                  v-model="editForm.endcontract"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工作状态" prop="workstate">
                <el-radio-group v-model="editForm.workstate">
                  <el-radio label="在职">在职</el-radio>
                  <el-radio label="离职">离职</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="工号" prop="workid">
                <el-input
                  v-model="editForm.workid"
                  placeholder="请输入工号"
                ></el-input>
              </el-form-item>
              <el-form-item label="职位" prop="posid">
                <el-select v-model="editForm.posid" placeholder="请选择职位">
                  <el-option
                    :label="item.name"
                    :value="item.id"
                    v-for="(item, index) in allPositions"
                    :key="index"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="职称" prop="joblevleid">
                <el-select
                  v-model="editForm.joblevelid"
                  placeholder="请选择职称"
                >
                  <el-option
                    :label="item.name"
                    :value="item.id"
                    v-for="(item, index) in allJoblevles"
                    :key="index"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="转正日期" prop="conversiontime">
                <el-date-picker
                  v-model="editForm.conversiontime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="离职日期" prop="notworkdate">
                <el-date-picker
                  v-model="editForm.notworkdate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="合同开始日期" prop="begincontract">
                <el-date-picker
                  v-model="editForm.begincontract"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <div>
            <el-button type="primary" @click="editEmp">
              提交
            </el-button>
          </div>
        </el-form>
      </el-dialog>
    </div>
    <!-- 新增表单 -->
    <div>
      <el-dialog
        title="编辑员工"
        :visible.sync="addDialogFormVisible"
        class="el-dialog-class"
      >
        <el-form
          :model="addForm"
          :rules="editFormRules"
          ref="addForm"
          label-width="80px"
          class="el-form-class"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item label="姓名" prop="name">
                <el-input
                  v-model="addForm.name"
                  placeholder="请输入姓名"
                ></el-input>
              </el-form-item>
              <el-form-item label="性别" prop="gender">
                <el-radio-group v-model="addForm.gender">
                  <el-radio label="男">男</el-radio>
                  <el-radio label="女">女</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="生日" prop="birthday">
                <el-date-picker
                  v-model="addForm.birthday"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="身份证号" prop="idcard">
                <el-input
                  v-model="addForm.idcard"
                  maxlength="18"
                  placeholder="请输入身份证号"
                ></el-input>
              </el-form-item>
              <el-form-item label="婚姻状态" prop="wedlock">
                <el-radio-group v-model="addForm.wedlock">
                  <el-radio label="已婚">已婚</el-radio>
                  <el-radio label="未婚">未婚</el-radio>
                  <el-radio label="离异">离异</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="合同形式" prop="engageform">
                <el-radio-group v-model="addForm.engageform">
                  <el-radio label="劳动合同">劳动合同</el-radio>
                  <el-radio label="劳务合同">劳务合同</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="籍贯" prop="nativeplace">
                <el-input
                  v-model="addForm.nativeplace"
                  placeholder="请输入籍贯"
                ></el-input>
              </el-form-item>
              <el-form-item label="民族" prop="nation">
                <el-select v-model="addForm.nationid" placeholder="请选择民族">
                  <el-option
                    :label="item.name"
                    :value="item.id"
                    v-for="(item, index) in allNations"
                    :key="index"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="政治面貌" prop="politics">
                <el-select
                  v-model="addForm.politicid"
                  placeholder="请选择政治面貌"
                >
                  <el-option
                    :label="item.name"
                    :value="item.id"
                    v-for="(item, index) in allPolitics"
                    :key="index"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="学历" prop="tiptopdegree">
                <el-select
                  v-model="addForm.tiptopdegree"
                  placeholder="请选择学历"
                >
                  <el-option
                    :label="item"
                    :value="item"
                    v-for="(item, index) in allDegrees"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="毕业学校" prop="school">
                <el-input
                  v-model="addForm.school"
                  placeholder="请输入毕业学校"
                ></el-input>
              </el-form-item>
              <el-form-item label="专业" prop="specialty">
                <el-input
                  v-model="addForm.specialty"
                  placeholder="请输入专业"
                ></el-input>
              </el-form-item>
              <el-form-item label="入职时间" prop="begindate">
                <el-date-picker
                  v-model="addForm.begindate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="电子邮箱" prop="email">
                <el-input
                  v-model="addForm.email"
                  placeholder="请输入电子邮箱"
                ></el-input>
              </el-form-item>
              <el-form-item label="电话" prop="phone">
                <el-input
                  v-model="addForm.phone"
                  placeholder="请输入电话"
                ></el-input>
              </el-form-item>
              <el-form-item label="合同结束日期" prop="endcontract">
                <el-date-picker
                  v-model="addForm.endcontract"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工作状态" prop="workstate">
                <el-radio-group v-model="addForm.workstate">
                  <el-radio label="在职">在职</el-radio>
                  <el-radio label="离职">离职</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="工号" prop="workid">
                <el-input
                  v-model="addForm.workid"
                  placeholder="请输入工号"
                ></el-input>
              </el-form-item>
              <el-form-item label="部门" prop="departmentid">
                <el-select
                  v-model="addForm.departmentid"
                  placeholder="请选择部门"
                >
                  <el-option
                    :label="item.name"
                    :value="item.id"
                    v-for="(item, index) in allDepartments"
                    :key="index"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="职位" prop="posid">
                <el-select v-model="addForm.posid" placeholder="请选择职位">
                  <el-option
                    :label="item.name"
                    :value="item.id"
                    v-for="(item, index) in allPositions"
                    :key="index"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="职称" prop="joblevleid">
                <el-select
                  v-model="addForm.joblevelid"
                  placeholder="请选择职称"
                >
                  <el-option
                    :label="item.name"
                    :value="item.id"
                    v-for="(item, index) in allJoblevles"
                    :key="index"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="转正日期" prop="conversiontime">
                <el-date-picker
                  v-model="addForm.conversiontime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="离职日期" prop="notworkdate">
                <el-date-picker
                  v-model="addForm.notworkdate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="合同开始日期" prop="begincontract">
                <el-date-picker
                  v-model="addForm.begincontract"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <div>
            <!-- 提交按钮 -->
            <el-button type="primary" @click="addEmp('addForm')">
              提交
            </el-button>
            <!-- 重置按钮 -->
            <el-button @click="resetForm('addForm')">重置</el-button>
          </div>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.getEmpData();
    this.getAllNations();
    this.getAllPolitics();
    this.getAllPositions();
    this.getAllJobLevel();
    this.getAllDepartments();
  },

  data() {
    return {
      // 搜索框
      search: "",
      // 员工列表
      empData: [],
      // 员工字段
      empQuery: {
        id: null,
        name: null,
        gender: null,
        birthday: null,
        idcard: null,
        wedlock: null,
        nationid: null,
        nativeplace: null,
        politicid: null,
        email: null,
        phone: null,
        address: null,
        departmentid: null,
        joblevelid: null,
        posid: null,
        engageform: null,
        tiptopdegree: null,
        specialty: null,
        school: null,
        begindate: null,
        workstate: null,
        workid: null,
        contractterm: null,
        conversiontime: null,
        notworkdate: null,
        begincontract: null,
        endcontract: null,
        workage: null,
        salaryid: null,
        nation: null,
        jobLevel: null,
        politicsStatus: null,
        position: null,
        department: null
      },
      searchEmpData: [],
      // 员工详细信息
      describeList: {},
      // 编辑员工表单
      editForm: {
        name: "",
        birthday: "",
        gender: "",
        idcard: "",
        wedlock: "",
        nativeplace: "",
        nationid: "",
        politicid: "",
        departmentid: "",
        posid: "",
        joblevelid: "",
        engageform: "",
        tiptopdegree: "",
        specialty: "",
        school: "",
        begindate: "",
        workstate: "",
        workid: "",
        contractterm: "",
        conversiontime: "",
        notworkdate: "",
        begincontract: "",
        endcontract: "",
        workage: ""
      },
      // 添加员工表单
      addForm: {
        name: "",
        birthday: "",
        gender: "",
        idcard: "",
        wedlock: "",
        nativeplace: "",
        nationid: "",
        politicid: "",
        departmentid: "",
        posid: "",
        joblevelid: "",
        engageform: "",
        tiptopdegree: "",
        specialty: "",
        school: "",
        begindate: "",
        workstate: "",
        workid: "",
        contractterm: "",
        conversiontime: "",
        notworkdate: "",
        begincontract: "",
        endcontract: "",
        workage: ""
      },
      // 所有民族
      allNations: [],
      // 所有政治面貌
      allPolitics: [],
      // 所有部门
      allDepartments: [],
      // 所有学历
      allDegrees: [
        "博士",
        "硕士",
        "本科",
        "大专",
        "高中",
        "初中",
        "小学",
        "其他"
      ],
      // 所有职位
      allPositions: [],
      // 所有职称
      allJoblevles: [],
      // 员工表字段
      empColumns: [
        {
          title: "ID",
          value: "id"
        },
        {
          title: "姓名",
          value: "name"
        },
        {
          title: "身份证号",
          value: "idcard"
        },
        {
          title: "籍贯",
          value: "nativeplace"
        },
        {
          title: "毕业学校",
          value: "school"
        },
        {
          title: "专业",
          value: "specialty"
        }
      ],
      // 搜索框显示字样
      placeHolder: "请输入ID/姓名/身份证号搜索",
      // 当前页
      currentPage: 1,
      // 单页条数
      pageSize: 10,
      // 总条数
      total: 0,
      // 单页条数选项
      pageSizes: [10, 20, 30, 40, 50, 100, 200, 300, 400, 500],
      // 文件列表
      fileList: [],
      // 被选中的员工id
      selectedEmpIds: [],
      // 条件查询标记
      searchFlag: "",
      // 大学接口地址
      //school_address:
      //  "/api?app_key=EBFC7BA8CE15537ED76748E3C583356F&s=App.Common_University.Search&top_num=10&school_name=",

      // 描述信息Dialog
      empDialogVisible: false,
      // 编辑员工Dialog
      editDialogFormVisible: false,
      addDialogFormVisible: false,
      describeSize: "small",
      // 编辑员工表单验证规则
      editFormRules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" }
        ],
        gender: [{ required: true, message: "请选择性别", trigger: "blur" }],
        birthday: [{ required: true, message: "请选择生日", trigger: "blur" }],
        idcard: [
          { required: true, message: "请输入身份证号", trigger: "blur" },
          { min: 18, max: 18, message: "请输入18位身份证号", trigger: "blur" }
        ],
        wedlock: [
          { required: true, message: "请选择婚姻状态", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱", trigger: "blur" }
        ],
        nativeplace: [
          { required: true, message: "请输入籍贯", trigger: "blur" }
        ],
        nationid: [{ required: true, message: "请选择民族", trigger: "blur" }],
        politicid: [
          { required: true, message: "请选择政治面貌", trigger: "blur" }
        ],
        departmentid: [
          { required: true, message: "请选择部门", trigger: "blur" }
        ],
        posid: [{ required: true, message: "请选择职位", trigger: "blur" }],
        joblevelid: [
          { required: true, message: "请选择职级", trigger: "blur" }
        ],
        engageform: [
          { required: true, message: "请选择工作性质", trigger: "blur" }
        ],
        tiptopdegree: [
          { required: true, message: "请选择最高学历", trigger: "blur" }
        ],
        specialty: [{ required: true, message: "请输入专业", trigger: "blur" }],
        school: [
          { required: true, message: "请输入毕业学校", trigger: "blur" }
        ],
        begindate: [
          { required: true, message: "请选择入职时间", trigger: "blur" }
        ],
        workstate: [
          { required: true, message: "请选择在职状态", trigger: "blur" }
        ],
        workid: [{ required: true, message: "请输入工号", trigger: "blur" }],
        contractterm: [
          { required: true, message: "请选择合同期限", trigger: "blur" }
        ],
        conversiontime: [
          { required: true, message: "请选择转正时间", trigger: "blur" }
        ],
        begincontract: [
          { required: true, message: "请选择合同开始时间", trigger: "blur" }
        ],
        endcontract: [
          { required: true, message: "请选择合同结束时间", trigger: "blur" }
        ]
      },
      // 事件选择器自定义配置
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      // 时间选择器绑定的值
      dateValue: []
    };
  },
  methods: {
    /*---------------------------员工分页---------------------------*/
    // 初始化获取员工数据
    getEmpData() {
      this.getRequest(
        "/employee/basic/?currentPage=" +
          this.currentPage +
          "&size=" +
          this.pageSize +
          "&dateScope=" +
          this.dateValue,
        this.empQuery
      ).then(response => {
        this.empData = response.data;
        this.total = response.total;
      });
    },
    // 分页改变事件
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getEmpData();
    },
    // 分页大小改变事件
    handleSizeChange(val) {
      this.pageSize = val;
      this.getEmpData();
    },
    /*---------------------------表单重置---------------------------*/

    // 清空表单数据
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    /*---------------------------编辑修改员工信息---------------------------*/
    // 编辑员工详情
    editEmp() {
      // 判断表单数据是被修改过
      this.putRequest("/employee/basic/", this.editForm).then(response => {
        if (response.code == 200) {
          this.editDialogFormVisible = false;
          this.getEmpData();
        }
      });
    },
    // 打开编辑员工弹窗
    handleEdit(index, row) {
      this.editDialogFormVisible = true;
      this.editForm = row;
      this.editFormOld = this.editForm;
    },
    /*---------------------------删除员工信息---------------------------*/
    // 删除员工
    deleteEmp(row) {},
    // 批量删除员工
    deleteBatchEmp() {
      this.batchDeleteRequest("/employee/basic/", this.selectedEmpIds).then(
        response => {
          if (response.code == 200) {
            this.getEmpData();
          }
        }
      );
    },
    // 删除员工
    handleDelete(index, row) {
      // 弹出删除确认框
      this.$confirm("确认删除该员工吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.deleteRequest("/employee/basic/" + row.id).then(response => {
          if (response.code == 200) {
            this.getEmpData();
          }
        });
      });
    },
    // 批量删除员工
    handleDeleteBatch() {
      // 判断是否有选中的员工
      if (this.selectedEmpIds.length == 0) {
        this.$message({
          message: "请选择要删除的员工"
        });
        type: "warning";
      } else {
        this.$confirm("确认删除选中的员工吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.deleteBatchEmp();
        });
      }
    },
    /*---------------------------添加员工信息---------------------------*/
    // 新增员工
    addEmp(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.postRequest("/employee/basic/", this.addForm).then(response => {
            if (response.code == 200) {
              this.addDialogFormVisible = false;
              this.getEmpData();
            }
          });
        } else {
          return false;
        }
      });
      console.log(this.addForm);
    },
    // 打开新增员工弹窗
    handleAdd() {
      this.addDialogFormVisible = true;
    },

    /*----------------------------员工查询--------------------------------*/
    // 条件查询员工

    // 查看员工详情
    viewEmp(row) {},
    // 查询员工
    searchEmp() {},

    // 打开查看员工弹窗
    handleView(index, row) {
      this.empDialogVisible = true;
      this.describeList = this.empData[index];
      console.log(this.describeList.nation.name);
    },

    // 查询所有民族
    getAllNations() {
      this.getRequest("/employee/basic/nations").then(response => {
        if (response.code == 200) {
          this.allNations = response.data;
        }
      });
    },
    // 查询所有政治面貌
    getAllPolitics() {
      this.getRequest("/employee/basic/politicsstatus").then(response => {
        if (response.code == 200) {
          this.allPolitics = response.data;
        }
      });
    },
    // 查询所有职位
    getAllPositions() {
      this.getRequest("/employee/basic/positions").then(response => {
        if (response.code == 200) {
          this.allPositions = response.data;
        }
      });
    },
    // 表格多选框事件
    handleSelection(row) {
      this.selectedEmpIds = [];
      row.forEach(item => {
        this.selectedEmpIds.push(item.id);
      });
      console.log(this.selectedEmpIds);
    },
    // 查询所有职级
    getAllJobLevel() {
      this.getRequest("/employee/basic/titles").then(response => {
        if (response.code == 200) {
          this.allJoblevles = response.data;
        }
      });
    },
    // 查询所有部门
    getAllDepartments() {
      this.getRequest("/employee/basic/departments").then(response => {
        if (response.code == 200) {
          this.allDepartments = response.data;
        }
      });
    },
    // 查询下拉框回调函数
    handleDropDown(data) {
      console.log(data);
      this.placeHolder = "请输入要查询的" + data.title;
      this.searchFlag = data.title;
    },

    // 按照入职日期查询员工
    handleDateSearch() {
      console.log(this.dateValue);
      this.getRequest("/employee/basic/?dateScope=" + this.dateValue).then(
        response => {
          if (response) {
            this.empData = response.data;
            this.total = response.total;
          }
        }
      );
    },
    // 条件查询
    getQueryData() {
      this.getEmpData();
    },
    // {
    //       title: "身份证号",
    //       value: "idcard"
    //     },
    //     {
    //       title: "籍贯",
    //       value: "nativeplace"
    //     },
    //     {
    //       title: "毕业学校",
    //       value: "school"
    //     },
    //     {
    //       title: "专业",
    //       value: "specialty"
    //     }

    /*----------------------------文件上传/下载--------------------------------*/

    // 移除上传文件回调方法
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    // 文件上传前回调方法
    handlePreview(file) {
      console.log(file);
    },
    // 文件上传回调方法
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    // 文件移除前回调方法
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    // 文件下载方法
    handleDownload() {
      this.downloadRequest("/employee/basic/export").then(response => {
        if (response) {
          this.$message.success("导出成功");
        }
      });
    },
    // 文件上传方法
    uploadSubmit(param) {
      var file = param.file;
      // 判断文件类型
      if (
        file.type !=
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        this.$message.error("请上传excel文件");
        return;
      } else {
        var formData = new FormData();
        formData.append("file", file);
        this.uploadRequest("/employee/basic/import", formData).then(
          response => {
            if (response.code == 200) {
              this.getEmpData();
            }
          }
        );
      }
      this.formData = formData;
    },
    // 文件上传提交方法
    submitUpload() {
      this.$refs.upload.submit();
      this.$refs.upload.clearFiles();
    }
  }
};
</script>

<style>
.el-pagination {
  margin-top: 20px;
}

.el-form-class {
  margin: auto 40px;
}

.el-form-class .el-input {
  width: 200px;
}

.el-dialog-class {
  width: 2200px;
  margin: auto;
}

.el-upload-class {
  margin-bottom: 15px;
}

.edit-dialog-class {
  border-radius: 15px;
}
</style>
