(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-abc60334"],{2471:function(e,r,t){"use strict";var s=t("93ca"),l=t.n(s);l.a},"93ca":function(e,r,t){},bcca:function(e,r,t){"use strict";t.r(r);var s=function(){var e=this,r=e.$createElement,t=e._self._c||r;return t("el-form",{ref:"ruleForm",staticClass:"r-container",attrs:{model:e.ruleForm,rules:e.rules,"label-width":"100px"}},[t("h1",{staticClass:"r-title"},[e._v("学生选课系统-注册")]),t("el-form-item",{attrs:{label:"姓名",prop:"name"}},[t("el-input",{model:{value:e.ruleForm.name,callback:function(r){e.$set(e.ruleForm,"name",r)},expression:"ruleForm.name"}})],1),t("el-form-item",{attrs:{label:"用户名",prop:"username"}},[t("el-input",{model:{value:e.ruleForm.username,callback:function(r){e.$set(e.ruleForm,"username",r)},expression:"ruleForm.username"}})],1),t("el-form-item",{attrs:{label:"密码",prop:"pass"}},[t("el-input",{attrs:{type:"password"},model:{value:e.ruleForm.pass,callback:function(r){e.$set(e.ruleForm,"pass",r)},expression:"ruleForm.pass"}})],1),t("el-form-item",{attrs:{label:"确认密码",prop:"checkPass"}},[t("el-input",{attrs:{type:"password"},model:{value:e.ruleForm.checkPass,callback:function(r){e.$set(e.ruleForm,"checkPass",r)},expression:"ruleForm.checkPass"}})],1),t("el-form-item",{attrs:{label:"密保手机",prop:"phone"}},[t("el-input",{model:{value:e.ruleForm.phone,callback:function(r){e.$set(e.ruleForm,"phone",e._n(r))},expression:"ruleForm.phone"}})],1),t("el-form-item",{attrs:{label:"邀请码",prop:"invitation"}},[t("el-input",{model:{value:e.ruleForm.invitation,callback:function(r){e.$set(e.ruleForm,"invitation",r)},expression:"ruleForm.invitation"}})],1),t("div",{staticClass:"r-radioBox"},[t("el-radio-group",{model:{value:e.level,callback:function(r){e.level=r},expression:"level"}},[t("el-radio",{attrs:{label:"students"}},[e._v("学生")]),t("el-radio",{attrs:{label:"teachers"}},[e._v("教师")]),t("el-radio",{attrs:{label:"admins"}},[e._v("管理员")])],1),t("div",[t("router-link",{staticClass:"r-login",attrs:{to:"/login"}},[e._v("登录 ")]),t("router-link",{staticClass:"f-register",attrs:{to:"/findPsw"}},[e._v(" 忘记密码？")])],1)],1),t("el-form-item",{staticClass:"r-register"},[t("el-button",{attrs:{type:"primary"},on:{click:function(r){return e.submitForm("ruleForm")}}},[e._v("注册")]),t("el-button",{on:{click:function(r){return e.resetForm("ruleForm")}}},[e._v("重置")])],1)],1)},l=[],o=(t("b0c0"),{name:"register",data:function(){var e=this,r=function(e,r,t){if(!r)return t(new Error("请输入用户名"));t()},t=function(e,r,t){""===r?t(new Error("请输入密码")):r.length<6?t(new Error("密码不能小于6位")):r.length>18?t(new Error("密码不能大于18位")):t()},s=function(r,t,s){""===t?s(new Error("请确认密码")):t!==e.ruleForm.pass?s(new Error("两次输入密码不一致!")):s()};return{level:"students",ruleForm:{name:"",username:"",pass:"",checkPass:"",dept:"",phone:"",invitation:""},rules:{name:[{required:!0,message:"请输入姓名",trigger:"blur"}],username:[{required:!0,validator:r,trigger:"blur"}],pass:[{required:!0,validator:t,trigger:"blur"}],checkPass:[{required:!0,validator:s,trigger:"blur"}],phone:[{required:!0,message:"请输入手机号",trigger:"blur"},{type:"number",message:"请输入正确的手机号",trigger:"blur"}]}}},methods:{submitForm:function(e){var r=this;this.$refs[e].validate((function(e){if(!e)return console.log("error submit!!"),!1;var t=r.ruleForm;r.axios.post("/register",{name:t.name,username:t.username,password:t.checkPass,phone:t.phone,invitation:t.invitation,level:r.level}).then((function(e){var t=e.data;if(0!==t.status)return r.$message.error(t.message);sessionStorage.setItem("token",t.token),sessionStorage.setItem("level",r.level),sessionStorage.setItem("id",t.id),r.$message.success("注册成功,3秒后跳转"),console.log(t),setTimeout((function(){r.$router.push("/"+r.level)}),3e3)}),(function(e){return r.$err(e)}))}))},resetForm:function(e){this.$refs[e].resetFields()}}}),a=o,n=(t("2471"),t("2877")),i=Object(n["a"])(a,s,l,!1,null,"09dd4d8e",null);r["default"]=i.exports}}]);
//# sourceMappingURL=chunk-abc60334.b2379857.js.map