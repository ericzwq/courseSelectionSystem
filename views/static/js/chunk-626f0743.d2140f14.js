(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-626f0743"],{"0680":function(e,t,a){"use strict";a.d(t,"a",(function(){return o}));var o=[{name:"请选择",value:""},{name:"特优(90以上)",value:0},{name:"优(80-89)",value:1},{name:"良(70-79)",value:2},{name:"及格(60-69)",value:3},{name:"不及格(60以下)",value:4},{name:"无成绩",value:5}]},"1c78":function(e,t,a){"use strict";a.r(t);var o=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("my-layout",{attrs:{formCollapse:e.formCollapse},scopedSlots:e._u([{key:"tableLayout",fn:function(t){return[a("my-table",{ref:"table",attrs:{tableData:e.tableData,height:t.height,totalCount:e.totalCount},on:{getData:e.getTable,"selection-change":e.selectChange}},[a("template",{slot:"tableHead"},[a("el-table-column",{attrs:{type:"selection"}}),a("el-table-column",{attrs:{type:"index",index:e.computeIndex,label:"序号",width:"60","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{prop:"studentName",label:"学生名","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{prop:"studentId",label:"学号","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{prop:"courseName",label:"课程名","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{prop:"courseId",label:"课程号","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{prop:"teacherName",label:"教师名","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{prop:"teacherId",label:"教师号","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{label:"分数","show-overflow-tooltip":""},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(-1===t.row.score?"暂无":t.row.score))])]}}],null,!0)}),a("el-table-column",{attrs:{prop:"classTime",label:"开课日期","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{prop:"updatedBy",label:"修改人","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{prop:"createdAt",label:"创建时间","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{prop:"updatedAt",label:"修改时间","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{fixed:"right",label:"操作"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{size:"mini",type:"primary",plain:""},on:{click:function(a){return e.updateScore(t.row)}}},[e._v("修改")])]}}],null,!0)},[e._v(' label="操作"> ')])],1)],2)]}}])},[a("el-form",{ref:"searchForm",staticClass:"search_form",attrs:{slot:"form",inline:!0,size:"mini",model:e.searchForm},slot:"form"},[a("el-form-item",{attrs:{label:"学生名",prop:"studentName"}},[a("el-input",{attrs:{placeholder:"请输入学生名",clearable:""},nativeOn:{keydown:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.search(t)}},model:{value:e.searchForm.studentName,callback:function(t){e.$set(e.searchForm,"studentName",t)},expression:"searchForm.studentName"}})],1),a("el-form-item",{attrs:{label:"学号",prop:"studentId"}},[a("el-input",{attrs:{placeholder:"请输入学号",clearable:""},nativeOn:{keydown:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.search(t)}},model:{value:e.searchForm.studentId,callback:function(t){e.$set(e.searchForm,"studentId",t)},expression:"searchForm.studentId"}})],1),a("el-form-item",{staticClass:"search-item",attrs:{label:"课程名",prop:"courseName"}},[a("el-input",{attrs:{placeholder:"请输入课程名",clearable:""},nativeOn:{keydown:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.search(t)}},model:{value:e.searchForm.courseName,callback:function(t){e.$set(e.searchForm,"courseName",t)},expression:"searchForm.courseName"}})],1),a("el-form-item",{attrs:{label:"教师名",prop:"teacherName"}},[a("el-input",{attrs:{placeholder:"请输入教师名",clearable:""},nativeOn:{keydown:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.search(t)}},model:{value:e.searchForm.teacherName,callback:function(t){e.$set(e.searchForm,"teacherName",t)},expression:"searchForm.teacherName"}})],1),a("el-form-item",{attrs:{label:"分数",prop:"scoreCode"}},[a("el-select",{attrs:{placeholder:"请选择"},model:{value:e.searchForm.scoreCode,callback:function(t){e.$set(e.searchForm,"scoreCode",t)},expression:"searchForm.scoreCode"}},e._l(e.scoreOptions,(function(e){return a("el-option",{key:e.value,attrs:{label:e.name,value:e.value}})})),1)],1),a("el-form-item",{attrs:{label:"创建日期",prop:"date"}},[a("el-date-picker",{attrs:{clearable:"","value-format":"yyyy-MM-dd",type:"daterange","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期"},on:{change:e.dateChange},model:{value:e.date,callback:function(t){e.date=t},expression:"date"}})],1),a("el-form-item",{attrs:{label:"开课日期",prop:"date"}},[a("el-date-picker",{attrs:{clearable:"","value-format":"yyyy-MM-dd",type:"daterange","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期"},on:{change:e.dateChange2},model:{value:e.date2,callback:function(t){e.date2=t},expression:"date2"}})],1),a("el-form-item",{staticClass:"form_btn"},[a("el-button",{attrs:{type:"default"},on:{click:e.search}},[e._v("查询")]),a("el-button",{attrs:{type:"default"},on:{click:function(t){return e.resetForm("searchForm")}}},[e._v("重置")]),a("el-button",{attrs:{type:"text"},on:{click:function(t){e.formCollapse=!e.formCollapse}}},[e._v(" "+e._s(e.formCollapse?"查看更多":"收起")+" "),a("i",{class:[e.formCollapse?"el-icon-caret-bottom":"el-icon-caret-top"]})])],1)],1),a("template",{slot:"tableBtn"},[a("el-button",{attrs:{type:"primary",plain:"",size:"mini",disabled:e.exportDisabled},on:{click:function(t){return e.exportScore(!1)}}},[e._v("导出")]),a("qr-button",{attrs:{searchData:e.searchForm}}),a("el-button",{attrs:{type:"primary",plain:"",size:"mini"},on:{click:function(t){return e.exportScore(!0)}}},[e._v("导出全部")])],1)],2)},r=[],l=(a("4160"),a("ac1f"),a("841c"),a("159b"),a("b893")),n=a("0680"),s=a("db5f"),c={name:"allCourses",data:function(){return{searchForm:{studentName:"",studentId:"",courseName:"",teacherName:"",scoreCode:"",createdAtStart:"",createdAtEnd:"",classTimeStart:"",classTimeEnd:""},date:[],date2:[],scoreOptions:n["a"],ruleFormIndex:"ruleForm"+Math.ceil(100*Math.random()),tableData:[],totalCount:0,selectedCourseId:"",page:1,count:10,tableObj:{},exportDisabled:!0,multipleSelection:[],formCollapse:!1}},mounted:function(){this.tableObj=this.$refs["table"]},methods:{exportScore:function(e){var t=this,a=[];this.multipleSelection.forEach((function(e){return a.push(e.scoreId)})),this.loading();var o=Object.assign({},this.searchForm,{scoreIds:a,all:e?1:0,page:this.page,count:this.count});this.axios.post("/exportStudentScores",o,{responseType:"blob"}).then((function(e){Object(l["a"])(e.data,"学生成绩"),t.$message.success("导出成功"),t.loaded.close()}))},selectChange:function(e){this.multipleSelection=e,e.length>0&&(this.exportDisabled=!1)},getTable:function(e,t){this.page=e,this.count=t,this.getTableData.call(this,"/admins/allScores",this.searchForm)},updateScore:function(e){var t=this;this.$prompt("请输入分数","提示",{inputValue:e.score>-1?e.score:"",confirmButtonText:"确定",cancelButtonText:"取消",inputValidator:function(e){if(!e)return"请输入分数";if("-1"!==e){if(!/^\d{1,3}(\.\d)?$/.test(e))return"格式不正确";if(e<0||e>100)return"分数超过限制"}}}).then((function(a){t.loading(),t.axios.post("/admins/updateScore",{score:a.value,studentId:e.studentId,courseId:e.courseId}).then((function(e){var a=e.data;t.loaded&&t.loaded.close(),0===a.status&&(t.$message.success(a.message),t.tableObj.refresh())}))}))},dateChange:function(e){e&&e.length?(this.searchForm.createdAtStart=e[0],this.searchForm.createdAtEnd=e[1]):(this.searchForm.createdAtStart="",this.searchForm.createdAtEnd="")},dateChange2:function(e){e&&e.length?(this.searchForm.classTimeStart=e[0],this.searchForm.classTimeEnd=e[1]):(this.searchForm.classTimeStart="",this.searchForm.classTimeEnd="")},computeIndex:function(e){return(this.page-1)*this.count+e+1},resetForm:function(e){this.$refs[e].resetFields(),this.date=[],this.date2=[],this.dateChange(),this.dateChange2()},search:function(){this.tableObj.search()}},components:{qrButton:s["a"]}},i=c,u=a("2877"),d=Object(u["a"])(i,o,r,!1,null,null,null);t["default"]=d.exports},3770:function(e,t,a){},b893:function(e,t,a){"use strict";a.d(t,"a",(function(){return o}));a("d3b7"),a("3ca3"),a("ddb0"),a("2b3d");var o=function(e,t){var a=URL.createObjectURL(e),o=document.createElement("a");o.style.display="none",o.href=a;var l=new Date,n=l.getFullYear()+"-"+r(l.getMonth()+1)+"-"+r(l.getDate())+"_"+r(l.getHours())+r(l.getMinutes())+r(l.getSeconds());o.download=t+"-"+n+".xlsx",document.body.appendChild(o),o.click(),document.body.removeChild(o)};function r(e){return(e+"").length<2?"0"+e:e}},db5f:function(e,t,a){"use strict";var o=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-button",{ref:"qr_export",staticClass:"qr_export",attrs:{type:"primary",plain:"",size:"mini"}},[e._t("default",[e._v("导出全部至手机")])],2)},r=[],l=(a("d3b7"),a("3ca3"),a("ddb0"),a("2b3d"),a("5530")),n={name:"qrButton",props:["searchData"],mounted:function(){var e=this,t=document.createElement("img");t.classList.add("qr_img");var a,o,r=this.$refs["qr_export"].$el,n=!1,s=0,c=!1,i=!0;r.append(t),r.addEventListener("mouseover",(function(){if(i=!1,n)return clearTimeout(a);a=setTimeout((function(){!(Date.now()>s+6e5)&&o||c||(c=!0,e.axios.get("/qrExportScore",{params:Object(l["a"])({},e.searchData),responseType:"blob"}).then((function(e){c=!1,s=Date.now(),o=URL.createObjectURL(new Blob([e.data])),t.src=o}))),i||(t.alt="二维码加载失败",t.style.display="block",n=!0)}),200)})),r.addEventListener("mouseout",(function(){t.style.display="none",n=!1,i=!0}))}},s=n,c=(a("ecbf"),a("2877")),i=Object(c["a"])(s,o,r,!1,null,null,null);t["a"]=i.exports},ecbf:function(e,t,a){"use strict";var o=a("3770"),r=a.n(o);r.a}}]);