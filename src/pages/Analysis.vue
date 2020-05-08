<template>
    <div id="main">
    </div>
</template>
<script>
var echarts = require("echarts/lib/chart/bar");



export default {
    data(){
        return{
            params:{
                X:[0,1],
                Y:2,
            },
            /**
             * <自> 1. 喜欢的颜色？ 0.红色 1.黑色 2.白色
             * <自> 2. 是否常运动？ 0.否 1.是
             * <因> 3. 性格如何？ 0.文静 1.搞怪 2.热情
             */
            option:{
                yAxis:{},


                /**
                 * 模拟后端数据
                 */
                xAxis:{
                    name:"喜欢的颜色？/是否常运动？",
                    data:[
                        "红色/否",
                        "红色/是",
                        "黑色/否",
                        "黑色/是",
                        "白色/否",
                        "白色/是",
                    ]
                },
                series:[
                    {
                        name:"文静",
                        data:[
                            2,
                            3,
                            1,
                            0,
                            3,
                            2,
                        ]
                    },
                    {
                        name:"搞怪",
                        data:[
                            2,
                            0,
                            1,
                            5,
                            1,
                            1,
                        ]
                    },
                    {
                        name:"热情",
                        data:[
                            4,
                            2,
                            1,
                            2,
                            3,
                            0,
                        ]
                    }
                ]
            }
        }
    },
    created(){
        // api
        // .CrossAnalysis(this.params)// 提交问卷id到后端
        // .then(res =>{
        //     if(res.code == "01"){
        //         this.option.xAxis=res.result.xAxis;
        //         this.option.series=res.result.series;
        //     }else{
        //         this.$alert(res.result,"获取问卷信息错误",{
        //             confirmButtonText:"确定"
        //         });
        //     }
        // })
        // .catch(error =>{
        //     console.log(error);
        // });
        for(var i=0;i<this.option.series.length;i++)
        {
            this.option.series[i].type='bar';
            this.option.series[i].stack='total';
        }
        var myChart = echarts.init(document.getElementById('main'));
        myChart.setOption(option);
    },
}
</script>