<template>
<div>
    <vheader content="编辑" :backRouter="this.$router"/>
    <div class="center-plane">
    <!-- <h3>formData:</h3>
    <h4>{{formData}}</h4> -->
    <el-form ref="rulesForm1" :rules="rules" :model="formData">
        <div class="edit-head-menu">
        <el-row :gutter="10">
        <el-col :xs="24" :sm="24" :md="17" :lg="17" :xl="14">
        <el-form-item prop="papertitle">
            <el-input v-model="formData.papertitle" placeholder="请填写问卷标题"/>
        </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="3" :lg="3" :xl="5">
            <el-button 
            class="big-btn"
            type="primary" plain 
            @click="toPreview()">
                预览
            </el-button>
        </el-col>
        <el-col :xs="12" :sm="12" :md="4" :lg="4" :xl="5">
            <el-button 
            class="big-btn"
            type="primary"
            @click="onSubmit(formData)">
                保存问卷
            </el-button>
        </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-button @click="add_question(0)" :disabled="formData.questions.length>=30" class="big-btn">添加单选</el-button>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-button @click="add_question(1)" :disabled="formData.questions.length >=30" class="big-btn">添加多选</el-button>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-button @click="add_question(2)" :disabled="formData.questions.length>=30" class="big-btn">添加填空</el-button>
            </el-col>
        </el-row>
        </div>
        <el-row>
        <el-col>
        <div v-for='(question,i_q) in formData.questions' :key="i_q" style="padding: 10px 0;">
            <!-- 题目面板 -->
            <el-card shadow="hover">
                <p>
                    <span style="color:red;">{{question.ismust==true?"*":""}}</span> 
                    {{i_q+1}} . 
                    {{question.questiontitle}}
                    <span style="color:gray;">[{{question.topicid==0?"单选题":(question.topicid==1?"多选题":"填空题")}}]</span>
                </p>
                <div v-for='(option,i_o) in question.options' :key="i_o">
                    <el-radio :label="option.scontent"></el-radio>
                </div>

                <!-- 这只是个没有用的输入框，用来演示的 -->
                <div v-if="question.topicid==2">
                    <el-form-item>
                        <el-input  :disabled="true" placeholder="填空内容" />
                    </el-form-item>
                </div>
                <div>
                    <a @click="question_moveLast(i_q)"  class="edit-a">最后</a>
                    <a @click="question_moveFirst(i_q)"  class="edit-a">最前</a>
                    <a @click="question_moveDown(i_q)"   class="edit-a">下移</a>
                    <a @click="question_moveUp(i_q)" class="edit-a">上移</a>
                    <a @click="del_question(i_q)"  class="edit-a">删除</a>
                    <a @click="show_edit_panel(i_q)"  class="edit-a">{{question.show?"隐藏":"编辑"}}</a>
                </div>
            </el-card>

            <!-- 编辑面板 -->
            <div v-if="question.show">
                <el-card shadow="hover">
                    <el-row :gutter="30" >
                        <el-col :xs="6" :sm="3" :md="3" :lg="3" :xl="3">
                            <div class="small-title">标题</div>
                        </el-col>
                        <el-col  :xs="18" :sm="12" :md="12" :lg="12" :xl="12">
                            <el-form-item :prop='"questions."+i_q+".questiontitle"' :rules="rules.question_title">
                                <el-input v-model="question.questiontitle" placeholder="请填写题目" />
                            </el-form-item>
                        </el-col>
                        <el-col  :xs="24" :sm="9" :md="9" :lg="9" :xl="9">
                        <el-switch active-text="必答" v-model="question.ismust"></el-switch>
                        </el-col>
                    </el-row>
                        <div v-for='(option,i_o) in question.options' :key="i_o">
                            <el-row :gutter="30">
                                <el-col :xs="4" :sm="3" :md="3" :lg="3" :xl="3">
                                    <div class="small-title">选项</div>
                                </el-col>
                                <el-col :xs="20" :sm="12" :md="12" :lg="12" :xl="12">
                                <el-form-item :prop='"questions."+i_q+".options."+i_o+".scontent"'>
                                    <el-input v-model='option.scontent' placeholder="请填写选项内容"/>
                                </el-form-item>
                                </el-col>
                                <el-col :xs="{push:4,span:20}" :sm="9" :md="9" :lg="9" :xl="9">
                                    <el-button 
                                    @click="add_option(i_q,i_o)"
                                    :disabled="question.options.length>=15"
                                    type="primary"
                                    size="small"
                                    icon="el-icon-plus" 
                                    circle>
                                    </el-button>

                                    <el-button 
                                    @click="del_option(i_q,i_o)" 
                                    :disabled="((question.topicid==0&&question.options.length<2)
                                    ||(question.topicid==1&&question.options.length<=2))?true:false"
                                    type="primary"
                                    size="small"
                                    icon="el-icon-minus" 
                                    circle>
                                    </el-button>

                                    <el-button 
                                    @click="option_moveUp(i_q,i_o)"
                                    type="primary"
                                    size="small"
                                    icon="el-icon-arrow-up" 
                                    circle>
                                    </el-button>

                                    <el-button 
                                    @click="option_moveDown(i_q,i_o)"
                                    type="primary"
                                    size="small"
                                    icon="el-icon-arrow-down" 
                                    circle>
                                    </el-button>
                                </el-col>
                            </el-row>
                        </div>
                        
                    
                    <!-- 多选题显示编辑限制选项个数组件 -->
                        <div v-if="question.topicid==1">
                            <el-row>
                                <el-col :xs="7" :sm="4" :md="4" :lg="4" :xl="4">
                                    <div class="small-title">
                                        最少选项
                                    </div>
                                </el-col>
                                <el-col :xs="17" :sm="8" :md="8" :lg="8" :xl="8">
                                    <el-input-number 
                                        v-model="question.min" 
                                        :min="2" 
                                        :max="question.options.length">
                                    </el-input-number>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :xs="7" :sm="4" :md="4" :lg="4" :xl="4">
                                    <div class="small-title">
                                        最多选项
                                    </div>
                                </el-col>
                                <el-col :xs="17" :sm="8" :md="8" :lg="8" :xl="8"> 
                                    <el-input-number 
                                        v-model="question.max" 
                                        :value="question.min"
                                        :min="question.min" 
                                        :max="question.options.length">
                                    </el-input-number>
                                </el-col>
                            </el-row>
                        </div>
                        
                    <a @click="show_logic_dialog(i_q)">逻辑设置</a>
                    <!-- 逻辑设置弹窗 -->
                    <el-dialog
                    title="逻辑设置"
                    :visible.sync="dialogVisible"
                    center>
                    <div class="center-plane">
                        <el-row>
                            <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                                <div class="small-title">当前题目: </div>
                            </el-col>
                            <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
                                <div class="small-title">{{question.questiontitle}}</div>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                                <div class="small-title">关联题目:</div>
                            </el-col>
                            <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
                                <el-select v-model="question.rela.question_id" placeholder="请选择">
                                    <el-option
                                        v-for="(rq,ri) in getRelatedQuestions(i_q)"
                                        :key="ri"
                                        :value="rq.questionid"
                                        :label="rq.questiontitle">
                                    </el-option>
                                    <!-- v-for 排在本题前面的所有单选题列表 (rq,ri) in getRelatableQuestions(i_q) 根据当前问题的索引找到question -->
                                </el-select>
                            </el-col>
                        </el-row>
                        <p>关联选项:</p>
                        <el-row>
                            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" push="3">
                            <el-checkbox-group 
                                v-model="question.rela.option_index"
                                v-for="(ro,ri) in getOptions(question.rela.question_id)"
                                :key="ri">
                                <!-- v-for 所选题目的所有选项 (ro,ri) in getOptions(question.rela.question_id) -->
                                <el-checkbox :label="ri">{{ro.scontent}}</el-checkbox>
                            </el-checkbox-group>
                            </el-col>
                        </el-row>
                    </div>
                        <!-- 弹窗按钮 -->
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="delete_logic(question)">清 除</el-button>
                            <el-button type="primary" @click="save_logic(question)">确 定</el-button>
                        </span>
                    </el-dialog>
                </el-card>
            </div>
        </div>
        </el-col>
        </el-row>
    </el-form>
    </div>
</div>
</template>

<script>
import api from "../fetch/api"

var questionId=0;// 由前端页面分配每个问题的id

export default {
   name:'Edit',
    data(){
        return{
            onLine:true,// 是否联网
            dialogVisible:false,  // 编辑面板不显示
            formData:{
                paperid:0,// 问卷id，等到保存问卷时，才在后端进行设置
                ispublish:false,// 是否发布
                userid:this.$route.query.userid,// 用户id
                createtime:(new Date()).toLocaleDateString(),// 问卷创建时间
                questiontitle:"问卷标题",
                questions:[]
            },
            rules:{
                papertitle:[{required:true,message:'不能为空',trigger:'blur'},{max:51,message:'字数不能多于51',rigger:'blur'}],
                question_title:[{required:true,message:'不能为空',trigger:'blur'},{max:51,message:'字数不能多于51',trigger:'blur'}],
            }
        }
    },
    // 获取Home传来的用户id，暂时不填写问卷id，等保存之后才在后端申请问卷id
    created(){
        
        if(window.localStorage.getItem(this.userid+"Edit"))// 如果localStorage存有问卷表单数据
        {
            // 获取保存在localStorage的表单数据
            this.formData=JSON.parse(window.localStorage.getItem(this.userid+"Edit"));
        }
    },
    // // 网络状态判断
    // mounted(){
    //     window.addEventListener("offline",()=>{
    //         this.onLine=false;
    //         // 发送断网提示
    //         this.$message({
    //             message:"网络连接不可用",
    //             type:"warning"
    //         })
    //     })
    //     window.addEventListener("online",()=>{
    //         if(this.onLine==false)// 如果是从断网状态恢复
    //         {
    //             // 从localStroage中获取历史数据
    //             this.formData=this.storage.getItem("EditFormData");
    //         }
    //         this.onLine=true;
    //     })
    // },

    // 数据发生变化时保存数据到localstorage，防止刷新之后数据消失
    updated(){
        window.localStorage.setItem(this.userid+"Edit",JSON.stringify(this.formData));
    },
    methods:{
        // 提交数据前对数据进行处理，增加ip、to、ans属性，返回处理好的对象array，不改变原有的 this.formData
        handleData(formData)
        {
            var array = formData;// 返回的结果,to是跳转问题的index
            array.ip="";// 添加问卷记录Ip的属性
            for(var i=0;i<array.questions.length;i++)// 遍历formData
            {
                if(array.questions[i].rela.option_index.length>0)// 找到被关联题目下标i
                {
                    array.questions[i].show=false;// 隐藏被关联问题
                    for(var j=0;j<i;j++)// 在被关联题目前面寻找关联题目
                    {
                        if(array.questions[j].questionid==array.questions[i].rela.question_id)// 找到关联题目的下标j
                        {
                            for(var k=0;k<array.questions[i].rela.option_index.length;k++)// 被关联题目option_index的下标k
                            {
                                array.questions[j].options[array.questions[i].rela.option_index[k]].goquestion.push(i);
                                // var t= array.questions[j].options[array.questions[i].rela.option_index[k]].goquestion;
                                // array.questions[j].options[array.questions[i].rela.option_index[k]].goquestion = new Set(t);// 去除重复项
                            }
                            break;// 找到之后可以直接处理下一题
                        }
                    }
                }
                else{
                    array.questions[i].show=true;
                }
                if(array.questions[i].topicid<2)
                {
                    // 在formatData里添加ans，记录选择题的答案（所选选项的下标）
                    if(array.questions[i].topicid==0)// 如果是单选题
                    {
                        array.questions[i].topicid=i;
                    }
                    else if(array.questions[i].topicid==1)//如果是多选题
                    {
                        array.questions[i].ans=[];
                    }
                    // 添加选项id
                    for(var j=0;j<array.questions[i].options.length;j++)
                    {
                        array.questions[i].options[j].selectid=j;
                    }
                }
            }
            return array;
        },
        // 将问卷设置传到后端保存
        onSubmit(formData){
            // 规则验证
            this.$refs['rulesForm1'].validate(valid => {
                if (valid) {
                    // 提交处理好的数据 this.handleData(formData) 到后台,并跳转回个人主页
                    api
                      .PostNewQuestionnaire(this.handleData(formData))
                      .then(res => {
                          if(res.code == '01'){
                            this.$router.go(-1);
                            alert("保存成功！");
                          }else{
                              this.$alert(res.result,"保存失败",{
                                  confirmButtonText:"确定"
                              });
                          }
                      })
                      .catch(error =>{
                          console.log(error);
                      })
                } else {
                    return false;
                }

            });
        },
        // 跳转到预览页面
        toPreview()
        {
            this.$refs['rulesForm1'].validate(valid => {
                if (valid) {
                    // 将处理好的数据保存在PreviewFormmData，方便预览界面使用
                    window.localStorage.setItem(this.userid+"Pre",JSON.stringify(this.handleData(this.formData)))
                    this.$router.push({name:"Preview",params:{userid:this.userid}});// 跳转到预览界面
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        // 编辑面板的显示和隐藏
        show_edit_panel(i){
            this.formData.questions[i].show=!(this.formData.questions[i].show)
        },
        // 显示逻辑设置弹窗
        show_logic_dialog(i){
            if(i==0)
            {
                this.$message({
                    message:"第一题不能设置逻辑关联",
                    type:"warning"
                })
                return;
            };
            this.dialogVisible=true;
        }, 
        // 已知question的id获取question
        getQuestion(questionid){
            var array = this.formData.questions;
            for(var i=0;i<array.length;i++)
            {
                if(array[i].questionid==questionid)
                {
                    return array[i];
                }
            }
            return null;
        },
        // 根据问题id获取options
        getOptions(questionid)
        {
            var question = this.getQuestion(questionid);
            if(question)
            {
                return question.options;
            }
            return [];
        },
        // 获取目前题目前的所有单选题的id
        getRelatedQuestions(index)
        {
            var idList = [];
            var array = this.formData.questions;
            for(var i=0;i<index;i++)
            {
                if(array[i].topicid==0)// 如果是单选题
                {
                    idList.push(array[i]);
                    idList=Array.from(new Set(idList));
                }
            }
            return idList;
        },
        // 逻辑设置点击确定
        save_logic(question)
        {
            // 如果只设置题目没有设置选项，不保存设置
            if(question.rela.option_index.length==0)
            {
                question.rela.question_id=null;
            }
            this.dialogVisible=false;
        },
        // 清除题目关联
        delete_logic(question){
            question.rela.question_id=null;
            question.rela.option_index=[];
            this.dialogVisible=false;
        },
        // 增加题目
        add_question(topicid){
            var question={};
            question.show=false;
            question.questionid=++questionId;
            question.topicid=topicid;
            question.questiontitle='题目';
            question.err=false;
            question.ismust=false;
            question.rela={
                question_id:null,
                option_index:[]
            }
            if(topicid==0){// 单选题
                question.options=[
                    {
                        scontent:'选项',
                        goquestion:[],
                    }
                ];
            }
            else if(topicid==1){// 多选题
                question.min=2;
                question.max=null;
                question.options=[
                    {
                        scontent:'选项',
                    },
                    {
                        scontent:'选项',
                    }
                ];
            }else// 填空题
            {
                question.scontent=''
            }
            this.formData.questions.push(question);
        },
        // 删除题目
        del_question(i_q){
            var array = this.formData.questions;
            var questionid = array[i_q].questionid;
            //如果有关联，不能删除
            // 遍历后面的题目，看是否有被关联
            for(var i=i_q;i<array.length;i++)
            {
                if(array[i].rela.question_id==questionid)
                {
                    this.$message({
                        message:"题目关联"+i+"题，不能删除！",
                        type:"warning",
                    })
                    return;
                }
            }
            // 如果关联题目，要清除相关题目  
            this.formData.questions.splice(i_q,1);
        },
        // 上移题目
        question_moveUp(i_q){
            if(i_q>0)// 不是第一道题，可以上移
            {
                if(this.formData.questions[i_q].rela.question_id==this.formData.questions[i_q-1].questionid)
                {
                    this.$message({
                        message:"被上一题关联，不能移动！",
                        type:"warning",
                    })
                    return;
                }
                var t1 = this.formData.questions[i_q];
                var t2 = this.formData.questions[i_q-1];
                this.formData.questions.splice(i_q,1,t2);
                this.formData.questions.splice(i_q-1,1,t1);
            }
            
        },
        // 下移题目
        question_moveDown(i_q){
            if(i_q<this.formData.questions.length-1)// 不是最后一道题，可以下移
            {
                if(this.formData.questions[i_q+1].rela.question_id==this.formData.questions[i_q].questionid)
                {
                    this.$message({
                        message:"关联下一题，不能移动！",
                        type:"warning",
                    })
                    return;
                }
                var t1 = this.formData.questions[i_q];
                var t2 = this.formData.questions[i_q+1];
                this.formData.questions.splice(i_q,1,t2);
                this.formData.questions.splice(i_q+1,1,t1);
            }
        },
        // 题目移动到最前
        question_moveFirst(i_q){
            // 如果被关联，不能移动到最前
            if(this.formData.questions[i_q].rela.question_id!=null)
            {
                this.$message({
                    message:"被前面题目关联，不能移动到最前！",
                    type:"warning",
                })
                return;
            }
            var t = this.formData.questions[i_q];
            this.formData.questions.splice(i_q,1);
            this.formData.questions.unshift(t);
            
        },
        // 题目移动到最后
        question_moveLast(i_q){
            for(var i=i_q;i<this.formData.questions.length;i++)
            {
                if(this.formData.questions[i].rela.question_id==this.formData.questions[i_q].questionid)
                {
                    this.$message({
                        message:"关联后面的题目，不能移动到最后！",
                        type:"warning",
                    })
                    return;
                }
            }
            var t = this.formData.questions[i_q];
            this.formData.questions.splice(i_q,1);
            this.formData.questions.push(t);
        },
        // 增加选项
        add_option(i_q,i_o){
            var option={};
            option.scontent='选项';
            if(this.formData.questions[i_q].topicid==0)
            {
                option.goquestion=[];
            }
            this.formData.questions[i_q].options.splice(i_o+1,0,option);
        },
        // 删除选项
        del_option(i_q,i_o){
            this.formData.questions[i_q].options.splice(i_o,1);
        },
        // 上移选项
        option_moveUp(i_q,i_o){
            if(i_o>0)
            {
                var t1=this.formData.questions[i_q].options[i_o];
                var t2=this.formData.questions[i_q].options[i_o-1];
                this.formData.questions[i_q].options.splice(i_o,1,t2);
                this.formData.questions[i_q].options.splice(i_o-1,1,t1);
            }
        },
        // 下移选项
        option_moveDown(i_q,i_o){
            if(i_o<this.formData.questions[i_q].options.length-1)
            {
                var t1=this.formData.questions[i_q].options[i_o];
                var t2=this.formData.questions[i_q].options[i_o+1];
                this.formData.questions[i_q].options.splice(i_o,1,t2);
                this.formData.questions[i_q].options.splice(i_o+1,1,t1);
            }
        }
    }
}
</script>