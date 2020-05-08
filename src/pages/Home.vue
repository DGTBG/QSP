<template>
  <div id="app">

        <vheader content="主页" :backRouter="this.$router"/>

    <div style="margin-top:calc(1vh)">
      <el-row type="flex" justify="center" align="center">
        <el-col :xs="20" :lg="10">
          <el-input
            @keyup.enter="exploreAction"
            v-model="querylist.questionnaireName"
            placeholder="搜索问卷"
          ></el-input>
        </el-col>
      </el-row>
    </div>
    <div style="margin-top:calc(1vh)">
      <el-row type="flex" justify="center" align="center">
        <el-col :xs="4" :lg="2" style="text-align:center">
          <el-dropdown @command="handleStatus">
            <span class="el-dropdown-link">
              状态
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="1">已发布</el-dropdown-item>
              <el-dropdown-item command="0">未发布</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
        <el-col :xs="4" :lg="2" style="text-align:center">
          <el-dropdown @command="handleOrder">
            <span class="el-dropdown-link">
              时间
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="1">正序</el-dropdown-item>
              <el-dropdown-item command="0">倒序</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
        <el-col :xs="4" :lg="2" style="text-align:center">
          <span @click="createQuestionnaire" class="span-button">创建</span>
        </el-col>
        <el-col :xs="4" :lg="2" style="text-align:center">
          <span @click="allQuestionnaire" class="span-button">全部</span>
        </el-col>
        <el-col :xs="4" :lg="2" style="text-align:center">
          <span @click="logOut" class="span-button">退出</span>
        </el-col>
      </el-row>
    </div>
    <div style="margin-top:calc(1vh)">
      <el-row type="flex" justify="center" align="center">
        <el-col :xs="20" :lg="10">
          <el-card
            v-for="(item,key) in list"
            :key="key"
            v-if="true"
            :body-style="{ padding: '10px' }"
          >
            <div>
              <span class="questionnaire-name">{{item.title}}</span>
              <ul class="header-ul-right">
                <li class="li-right">id:{{item.paperID}}</li>
                <li class="li-right">答卷:{{item.answersheetNumber}}</li>
                <li class="li-right">{{item.createTime}}</li>
                <li class="li-right">
                  <span v-if="item.isPublish">已发布</span>
                  <span v-if="!item.isPublish">未发布</span>
                </li>
              </ul>
            </div>
            <div style="padding:calc(2vw)"></div>
            <ul class="footer-ul-right">
              <li class="li-right">
                <span @click="changeStatus(item.isPublish)" v-if="!item.isPublish">发布</span>
                <span @click="changeStatus(item.isPublish)" v-if="item.isPublish">暂停</span>
              </li>
              <li class="li-right">
                <span @click="deleteAction(item.paperID)">删除</span>
              </li>
              <li class="li-right">
                <span @click="shareAction(item.paperID)" v-if="item.isPublish">分享</span>
              </li>
              <li class="li-right">
                <span @click="resultAction(item.paperID)">分析</span>
              </li>
            </ul>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template> 
<script type="text/ecmascript-6">
import api from "@/fetch/api";
export default {
  name: "Home",
  data() {
    return {
      querylist: {
        userId: "",
        status: "0",
        timeorder: true,
        explore: false,
        questionnaireName: ""
      }, //status中0代表请求全部的数据，1中代表请求已发布的数据，2代表请求未发布的数据,timeorder为true表示正序，timeorder为false为倒序，在后端先判断是否explore，然后判断status,再判断timeorder
      list: [
        //页面需要渲染的问卷列表
      ]
    };
  },
  created() {
    //先从本地存储提取userid;
    this.querylist.userId = this.$route.query.userid;
    //根据userid观察有没有意外退出未保存的问卷数据
    let unsavedQuestionnaire = localStorage.getItem(
      this.querylist.userId + "Edit"
    );
    if (unsavedQuestionnaire) {
      //有未保存的问卷
      this.$confirm("有意外退出没有保存的问卷, 是否保存?", "提示", {
        confirmButtonText: "保存",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          api
            .PostNewQuestionnaire(unsavedQuestionnaire)
            .then(res => {
              if (res.code === "01") {
                this.$message({ type: "info", message: "已保存问卷" });
                localStorage.removeItem(this.querylist.userId + "Edit");
              } else if (res.code === "03") {
                //没退出页面过了一天之后，刷新页面后继续，要求重新登录
                this.$router.push({ path: "/login", query: { no_token: 1 } });
              } else {
                this.$message({ type: "info", message: res.result });
              }
            })
            .catch(error => {
              this.$message({ type: "info", message: error });
            });
        })
        .catch(() => {
          localStorage.removeItem(this.userId + "Edit");
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }

    //请求个人所有的问卷数据
    api
      .GetQuestionnaires(this.querylist)
      .then(res => {
        if (res.code === "01") {
          //清空list
          if(this.list.length!==0)
          {
            this.list.splice(0, this.list.length);
          }
          console.log(res.result);
          for (let i = 0; i < res.result.length; i++) {
            this.list.push(res.result[i]);
          }
        } else if (res.code === "03") {
          this.$router.push({ path: "/login", query: { no_token: 1 } });
        } else {
          this.$message({ type: "info", message: res.result });
        }
      })
      .catch(error => {
        this.$message({ type: "info", message: error });
      });
  },
  methods: {
    exploreAction: function() {
      //传问卷名字给后台，后台返回问卷的整体信息，在按钮下面以卡片的形式存在
      this.querylist.explore = true;
      api
      .GetQuestionnaires(this.querylist)
      .then(res => {
        if (res.code === "01") {
          //清空list
          if(this.list.length!==0)
          {
            this.list.splice(0, this.list.length);
          }
          console.log(res.result);
          for (let i = 0; i < res.result.length; i++) {
            this.list.push(res.result[i]);
          }
        } else if (res.code === "03") {
          this.$router.push({ path: "/login", query: { no_token: 1 } });
        } else {
          this.$message({ type: "info", message: res.result });
        }
      })
      .catch(error => {
        this.$message({ type: "info", message: error });
      });
    },
    handleStatus(command) {
      //传用户id和command给后端，取相应的问卷数据按照时间正序的顺序返回,使用promise对象控制顺序
      //测试,1为已发布,0为未发布
      //this.$message("发布状态为" + command);
      if (command === "0") {
        this.querylist.status = "2";
      } else {
        this.querylist.status = "1";
      }
          api
      .GetQuestionnaires(this.querylist)
      .then(res => {
        if (res.code === "01") {
          //清空list
          if(this.list.length!==0)
          {
            this.list.splice(0, this.list.length);
          }
          console.log(res.result);
          for (let i = 0; i < res.result.length; i++) {
            this.list.push(res.result[i]);
          }
        } else if (res.code === "03") {
          this.$router.push({ path: "/login", query: { no_token: 1 } });
        } else {
          this.$message({ type: "info", message: res.result });
        }
      })
      .catch(error => {
        this.$message({ type: "info", message: error });
      });
    },
    handleOrder(command) {
      //传用户id和command给后端，取问卷数据按照相应的时间顺序排好返回，使用promise对象控制顺序
      //测试,1为正序，0为倒序
      //this.$message("时间顺序为" + command);
      if (command === "0") {
        this.querylist.timeorder = false;
      } else {
        this.querylist.timeorder = true;
      }
          api
      .GetQuestionnaires(this.querylist)
      .then(res => {
        if (res.code === "01") {
          //清空list
          if(this.list.length!==0)
          {
            this.list.splice(0, this.list.length);
          }
          console.log(res.result);
          for (let i = 0; i < res.result.length; i++) {
            this.list.push(res.result[i]);
          }
        } else if (res.code === "03") {
          this.$router.push({ path: "/login", query: { no_token: 1 } });
        } else {
          this.$message({ type: "info", message: res.result });
        }
      })
      .catch(error => {
        this.$message({ type: "info", message: error });
      });
    },
    createQuestionnaire: function() {
      localStorage.clear();
      this.$router.push({
        name: "Edit",
        query: { userId: this.querylist.userId }
      });
    },
    allQuestionnaire: function() {
      this.querylist.status = "0";
    api
      .GetQuestionnaires(this.querylist)
      .then(res => {
        if (res.code === "01") {
          //清空list
          if(this.list.length!==0)
          {
            this.list.splice(0, this.list.length);
          }
          console.log(res.result);
          for (let i = 0; i < res.result.length; i++) {
            this.list.push(res.result[i]);
          }
        } else if (res.code === "03") {
          this.$router.push({ path: "/login", query: { no_token: 1 } });
        } else {
          this.$message({ type: "info", message: res.result });
        }
      })
      .catch(error => {
        this.$message({ type: "info", message: error });
      });
    },
    logOut: function() {
      this.$router.push({ path: "/login" });
    },
    deleteAction: function(paperID) {
      api
        .DeleteQuestionnaire(paperID)
        .then(res => {
          if (res.code === "01") {
            this.$message({ type: "info", message: "删除成功" });
          } else if (res.code === "03") {
            this.$router.push({ path: "/login", query: { no_token: 1 } });
          } else {
            this.$message({ type: "info", message: res.result });
          }
        })
        .catch(error => {
          this.$message({ type: "info", message: error });
        });
    },

    shareAction: function(paperID) {
      this.$router.push({
        name: "Share",
        params: { userId: this.querylist.userId, paperID: paperID }
      });
    },

    resultAction: function(paperID) {
      this.$router.push({
        name: "Result",
        params: { userId: this.querylist.userId, paperID: paperID }
      });
    },
    changeStatus: function(paperID) {
      api
        .ChangeReleaseStatus(paperID)
        .then(res => {
          if (res.code === "01") {
            this.$message({ type: "info", message: "修改成功" });
          } else if (res.code === "03") {
            this.$router.push({ path: "/login", query: { no_token: 1 } });
          } else {
            this.$message({ type: "info", message: res.result });
          }
        })
        .catch(error => {
          this.$message({ type: "info", message: error });
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.el-input-group__append .el-button {
  background-color: #409eff;
  color: aliceblue;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
  font-size: 14px;
}
.el-icon-arrow-down {
  font-size: 14px;
  color: #409eff;
}
.span-button {
  color: #409eff;
  font-size: 14px;
  margin-left: auto;
  margin-right: auto;
}
.questionnaire-name {
  float: left;
  font-size: 14px;
  width: 50%;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  display: inline-block;

  white-space: nowrap;
}
.li-right {
  display: inline;
  padding-left: calc(0.5vw);
}
.header-ul-right {
  float: right;
  margin: 0;
  padding: 0;
  font-size: 14px;
  border: 0;
  @media screen and (max-width: 800px) {
    display: none;
  }
  display: inline-block;
}
.footer-ul-right {
  margin: calc(2vh) 0;
  float: right;
  padding: 0;
  font-size: 14px;
  border: 0;
}
</style>