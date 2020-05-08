import axios from 'axios'
import qs from 'qs'
// axios 配置
axios.defaults.timeout = 5000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.baseURL = '/api/v1';
// axios.defaults.headers.common['Authorization'] = 'Basic ';

/*
* 请求、响应拦截器
* */

//POST传参序列化
axios.interceptors.request.use((config) => {
    if(config.method  === 'post'){

        let token=localStorage.getItem('token');
        if(token){
          config.data=config.data||{};
          config.data.token=token;
        }
        config.data = qs.stringify(config.data);
    }
    return config;
},(error) =>{
    return Promise.reject(error);
});

//返回状态判断
axios.interceptors.response.use((res) =>{
    if(res.status!==200){
        return Promise.reject(res);
    }
    if(res.data.code=='03'){  //无token
      window.location='http://localhost:8080/login?no_token=1';
      return;
    }
    return res;
}, (error) => {
    return Promise.reject(error);
});

export function fetch(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, params)
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err);
            })
            .catch((error) => {
               reject(error)
            })
    })
}

export default {
      /**
     * 用户登陆
     */
    Login(params) {
      return fetch('/login', params)
    },
    /**
     * 用户注册 
     */
    Register(params) {
      return fetch('/register', params)
    },
    /**
     * 获取个人创建过的所有问卷信息
     */
    GetQuestionnaires(params)
    {
      return fetch('/get-questionnaires',params)
    },
    /**
     * 获取个人创建过的所有问卷信息,时间倒序
     */
    GetQuestionnairesReversed(params)
    {
      return fetch('/get-questionnaires-reversed',params)
    },
    /* *
    *提交新创建的问卷
    */
    PostNewQuestionnaire(params)
    {
      return fetch('/post-new-questionnaire',params)
    },
    /* *
    *获取问卷信息生成问卷作答
    */
    GetQuestionnaireToanswer(params)
    {
      return fetch('/get-questionnaire-to-answer',params)
    },
    /* *
    *提交作答结果
    */    
    PostAnswers(params)
    {
      return fetch('/post-answers',params)
    },
    /* *
    *获取问卷作答结果，以作详细分析
    */ 
    GetResultToAnalysis(params)
    {
      return fetch('/get-analysis',params)
    },
    /* *
    *获取问卷总体作答信息，以作统计
    */
    GetStatics(params)
    {
      return fetch('/get-statics',params)
    },
    /* *
     *改变问卷的发布状态
     */
    ChangeReleaseStatus(params)
    {
      return fetch('/change-release-status',params);
    },
    /* *
     *删除问卷
     */
    DeleteQuestionnaire(params)
    {
      return fetch('/delete-questionnaire',params);
    },
    /**
     * 交叉分析
     */
    CrossAnalysis(params)
    {
      return fetch('/cross-analysis',params);
    }
}
