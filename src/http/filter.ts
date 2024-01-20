import axios from "axios";
const instance =axios.create({
    timeout:5000
})
instance.interceptors.response.use(
    response=>{
        //对请求结果做格式化
        // resulst { code:200,data:[],msg:"请求成功！" }
        return response.data
    },
    error=>{
        if(error.response)
        {
            switch (error.response.status) {
                case 401:
                    console.log("资源没有访问权限！")
                    break
                case 404:
                    console.log("接口不存在，请检查接口地址是否正确！")
                    break
                case 500:
                    console.log("内部服务器错误，请联系系统管理员！")
                    break  
            }
        }
        return error.message
    }
)
export default instance