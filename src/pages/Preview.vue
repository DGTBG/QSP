<template>
    <div>
        
        <vheader content="预览" :backRouter="this.$router"/>

        <div class="center-plane">
        </div>
        <abc :isPreview="true" :formData="formData"></abc>
    </div>
</template>


<script>

import QueTemple from './QueTemple'//  引用与Answer公用的公共组件

export default{
    data(){
        return {
            userId:this.$route.params.userId,
            // 从localStorage获取预览，因为预览和问卷编辑的Json结构有点不同，所以分开保存
            formData:{},
        }
    },
    created(){
        if(window.localStorage.getItem(this.userId+"Pre"))
        {
            this.formData = JSON.parse(window.localStorage.getItem(this.userId+"Pre"));
        }
    },
    components:{
        "abc":QueTemple,
    },
    methods:{
        back(){
            // this.$router.push({name:"Edit",params:{userId:this.userId}});
            // this.$router.push({name:"Home",params:{userId:this.userId}});
            this.$router.go(-1);
            // this.$router.replace();
        }
    }
}
</script>