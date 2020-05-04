<!-- 预览和回答页面共用模板 -->
<template>
<div class="center-plane">
    <!-- {{formData}}  -->
    <el-form :rules="rules" v-model="formData">
    <div>
        <h1>{{formData.title}}</h1>

        <div v-for="(question,i_q) in formData.questions"
          :key="i_q">
            <div v-if="question.show">
                <p>
                    <span style="color:red;">{{question.must==true?"*":""}}</span> 
                    {{i_q+1}} . 
                    {{question.title}}
                    <span style="color:gray;">[{{question.type==0?"单选题":(question.type==1?"多选题":"填空题")}}]</span>
                </p>
                <!-- 单选 -->
                <div v-if="question.type==0">
                    <p style="color:red">{{singleWaring(question)}}</p>
                    <el-radio-group v-model="question.ans" @change="rela(i_q)">
                        <div v-for="(option,i_o) in question.options"
                          :key="i_o">
                            <el-radio :label="i_o" >
                                {{option.content}} 
                            </el-radio>
                        </div>
                    </el-radio-group>
                </div>
                <!-- 多选 -->
                <div v-if="question.type==1">
                    <p style="color:red" >{{multWaring(question)}}</p>
                    <el-checkbox-group v-model="question.ans">
                        <div v-for="(option,i_o) in question.options"
                        :key="i_o">
                            <el-checkbox :label="i_o">
                                {{option.content}}
                            </el-checkbox>
                        </div>
                    </el-checkbox-group>
                </div>
                <!-- 填空 -->
                <div v-if="question.type==2">
                    <p style="color:red" >{{blankWarning(question)}}</p>
                    <el-form-item prop="content">
                        <el-input 
                        type="textarea"
                        v-model="question.content" />
                    </el-form-item>
                </div>
            </div>
        </div>
        <el-button 
        type="primary" plain
        @click="onSubmit()">
            提交
        </el-button>
    </div>
    </el-form>
</div>
</template>



<!-- 用于获取用户IP -->
<script src="http://pv.sohu.com/cityjson?ie=utf-8"></script>
<script>
import api from "../fetch/api"


export default {
    data(){
        return{
            id:null,// 获取链接传来的问卷id，暂时用null代替
            rules:{
                content:[{max:51,message:'字数不能多于51',trigger:'blur'}],
            },
        }
    },
    props:{
        // 从编辑页面传过来的formData，项目中在created里面赋值
        formData:{},
        isPreview:true,// 是否处于预览状态,默认是预览状态
    },
   

    computed:{
        
        // 单选必答题提示
        singleWaring:function(questionq){
            return function(question){
                
                if(question.show&&question.must&&question.ans==null)
                {
                    question.err=true;
                    return "本题必答";
                }
                question.err=false;
            
                return ;
            }
        },
        // 多选题所选选项数目限制提示
        multWaring:function(question){
            return function(question){
                if(question.show&&question.must||question.ans.length>0)// 如果多选要求你必填，或已经选择了选项
                {
                    if(question.ans.length<question.min||question.max&&question.ans.length>question.max)
                    {
                        question.err=true;
                        if(question.min<question.max)
                        {
                            return "请选择"+question.min+"到"+question.max+"个选项";
                        }else{
                            return "请选择"+question.min+"个选项";
                        }
                    }
                }
                question.err=false;
            }
            return ;
            
        },
        // 填空题必填提示
        blankWarning:function(question){
            return function(question){
                if(question.show&&question.must&&question.content=="")
                {
                    question.err=true;
                    return "此题必答";
                }
                question.err=false;
                return;
            }
        }
    },
    methods:{
        // 显示被关联题目
        rela(i_q)
        {
            var val = this.formData.questions[i_q];
            // 如果题目有关联
            for(var i=0;i<val.options[val.ans].to.length;i++)
            {
                this.formData.questions[val.options[val.ans].to[i]].show=true;
            }
            if(val.options[val.ans].to.length==0)
            {
                // 隐藏其他选项关联的题目
                for(var j=0;j<val.options.length;j++)
                {
                    for(var i=0;i<val.options[j].to.length;i++)
                    {
                        this.formData.questions[val.options[j].to[i]].show=false;
                    }
                }
            }
        },
        // 提交问卷，对填写内容进行校验
        onSubmit()
        {
            for(var i=0;i<this.formData.questions.length;i++)// 遍历数据
            {
                if(this.formData.questions[i].show&&this.formData.questions[i].err)
                {
                    alert("请按要求填写问卷");
                    return;
                }
            }
            // 填写问卷（非预览状态）
            if(!this.isPreview)
            {
                // 为formData添加填写者ip的属性：ip
                this.formData.ip=returnCitySN["cip"]+','+returnCitySN["cname"];
                // 为formData添加填写时间的属性：ansTime
                this.formData.ansTime=(new Date()).toLocaleDateString();
                // 将答卷数据提交数据库，并跳转到填写成功页面 Done
                api
                  .PostAnswers(this.formData)// 数据提交给后端
                  .then(res =>{
                    if (res.code == "01") {
                        window.location = 'http://localhost:8080/done'// 页面跳转到 Done
                    } else {
                        this.$alert(res.result, "提交失败", {
                            confirmButtonText: "确定"
                        });
                    }
                })
                .catch(error => {
                    console.log(error);
                });

            }// 如果处于预览状态，只是模拟提交，不进行任何保存操作
            else{
                alert("提交成功");
                return;
            }
        }
    },
}
</script>