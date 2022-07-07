<template>
  <el-container>
    <el-header class="header">
      <el-row type="flex">
        <el-col>
          <i class="title">VHR人事管理系统</i>
        </el-col>
        <el-col :push="10">
          <i style="color: rgba(87, 124, 138, 0.6);">{{ user.name }}</i>
          <el-dropdown class="drop-down" @command="handleCommand">
            <img
              :src="user.userface"
              style="width: 40px;height: 40px;border-radius: 15px;"
            />
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-plus" command="personal"
                >个人中心</el-dropdown-item
              >
              <el-dropdown-item icon="el-icon-circle-plus" command="setting"
                >设置</el-dropdown-item
              >
              <el-dropdown-item
                icon="el-icon-circle-plus-outline"
                command="logout"
                >注销</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="elaside">
        <el-scrollbar class="nav-scroll">
          <el-menu default-active="2" class="el-menu-vertical-demo" router>
            <el-submenu
              :index="index + ''"
              v-for="(item, index) in routes"
              :key="index"
            >
              <template slot="title">
                <i :class="item.iconCls" style="color: #81C7D4;"></i>
                <span>{{ item.name }}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item
                  :index="children.path"
                  v-for="(children, indexi) in item.children"
                  :key="indexi"
                >
                  {{ children.name }}</el-menu-item
                >
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-main>
        <el-breadcrumb
          separator-class="el-icon-arrow-right"
          v-if="this.$router.currentRoute.path != '/home'"
        >
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{
            $router.currentRoute.name
          }}</el-breadcrumb-item>
        </el-breadcrumb>
        <router-view class="routeViewClass" />
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    handleCommand(command) {
      if (command === "logout") {
        this.$confirm("确定要退出登录吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.postRequest("/logout").then(res => {
            if (res.code === 200) {
              window.sessionStorage.removeItem("tokenStr");
              this.$store.commit("initRoutes", []);
              this.$store.commit("initUser", {});
              this.$router.replace("/");
            }
          });
        });
      }
    }
  },
  computed: {
    routes() {
      return this.$store.state.routes;
    },
    user() {
      return this.$store.state.user;
    }
  }
};
</script>

<style>
.header {
  background: rgba(129, 199, 212, 0.2);
  border-radius: 10px;
  margin-bottom: 5px;
  padding: 15px;
}

.title {
  color: rgba(87, 124, 138, 0.6);
  font-size: 25px;
  font-weight: bold;
  font-style: oblique;
}

.elaside {
  width: 200px;
}

.nav-scroll {
  height: 100%;
}

.nav-scroll .el-scrollbar_wrap {
  overflow-x: hidden;
}

.drop-down {
  margin-bottom: 15px;
}

.routeViewClass {
  margin-top: 20px;
}
</style>
