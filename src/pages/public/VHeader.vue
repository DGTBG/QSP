<template>
<div>
    <div class="vheader">
        <el-page-header @back="back()" :title="title" :content="content"></el-page-header>
    </div>
</div>
</template>
<script>
export default {
    props:{
        title:"返回",
        content:"",
        backRouter:"",
    },
    methods:{
        back(){
            this.backRouter.go(-1);
        }
    }
}
</script>
<style scoped>
.vheader{
    padding:  5px 0 20px 0;
    border-bottom: 1px #DCDFE6 solid;
}
</style>