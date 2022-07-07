<template>
    <div>
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="部门管理" name="depMana">
                <DepMana></DepMana>
            </el-tab-pane>
            <el-tab-pane label="职位管理" name="posMana">
                <PosMana></PosMana>
            </el-tab-pane>
            <el-tab-pane label="职称管理" name="jobLevleMana">
                <JobLevleMana></JobLevleMana>
            </el-tab-pane>
            <el-tab-pane label="奖惩规则" name="ecMana">
                <EcMana></EcMana>
            </el-tab-pane>
            <el-tab-pane label="权限组" name="permissionMana">
                <PermissionMana></PermissionMana>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
// 引入组件
import DepMana from '../../components/sys/basic/DepMana.vue';
import EcMana from '../../components/sys/basic/EcMana.vue';
import JobLevleMana from '../../components/sys/basic/JobLevleMana.vue';
import PosMana from '../../components/sys/basic/PosMana.vue';
import PermissionMana from '../../components/sys/basic/PermissionMana.vue';
export default {
    data() {
        return {
            activeName: 'posMana',
        };
    },
    methods: {
    },
    components: {
        DepMana,
        EcMana,
        JobLevleMana,
        PosMana,
        PermissionMana
    }
}
</script>