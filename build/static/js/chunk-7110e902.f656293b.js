(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7110e902"],{2386:function(e,t,a){},9631:function(e,t,a){"use strict";var r=a("2386"),s=a.n(r);s.a},d483:function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("my-layout",{attrs:{formCollapse:e.formCollapse},scopedSlots:e._u([{key:"tableLayout",fn:function(e){return[a("div",{ref:"echarts",staticClass:"charts",style:{height:e.height},attrs:{"data-h":e.height}}),a("div",{ref:"echarts2",staticClass:"charts"})]}}])},[e.isStu?a("el-form",{ref:"searchForm",staticClass:"search_form",attrs:{slot:"form",inline:!0,size:"mini",model:e.searchForm},slot:"form"},[a("el-form-item",{attrs:{label:"创建日期",prop:"date"}},[a("el-date-picker",{attrs:{clearable:"","value-format":"yyyy-MM-dd",type:"daterange","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期"},on:{change:e.dateChange},model:{value:e.date,callback:function(t){e.date=t},expression:"date"}})],1),a("el-form-item",{staticClass:"form_btn"},[a("el-button",{attrs:{type:"default"},on:{click:e.getChartData}},[e._v("查询")]),a("el-button",{attrs:{type:"default"},on:{click:function(t){return e.resetForm("searchForm")}}},[e._v("重置")]),a("el-button",{attrs:{type:"text"},on:{click:function(t){e.formCollapse=!e.formCollapse}}},[e._v(" "+e._s(e.formCollapse?"查看更多":"收起")+" "),a("i",{class:[e.formCollapse?"el-icon-caret-bottom":"el-icon-caret-top"]})])],1)],1):a("el-form",{ref:"searchForm",staticClass:"search_form",attrs:{slot:"form",inline:!0,size:"mini",model:e.searchForm},slot:"form"},[a("el-form-item",{attrs:{label:"学生名",prop:"studentName"}},[a("el-input",{attrs:{placeholder:"请输入学生名",clearable:""},nativeOn:{keydown:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.getChartData(t)}},model:{value:e.searchForm.studentName,callback:function(t){e.$set(e.searchForm,"studentName","string"===typeof t?t.trim():t)},expression:"searchForm.studentName"}})],1),a("el-form-item",{attrs:{label:"学号",prop:"studentId"}},[a("el-input",{attrs:{placeholder:"请输入学号",clearable:""},nativeOn:{keydown:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.getChartData(t)}},model:{value:e.searchForm.studentId,callback:function(t){e.$set(e.searchForm,"studentId","string"===typeof t?t.trim():t)},expression:"searchForm.studentId"}})],1),a("el-form-item",{staticClass:"search-item",attrs:{label:"课程名",prop:"courseName"}},[a("el-input",{attrs:{placeholder:"请输入课程名",clearable:""},nativeOn:{keydown:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.getChartData(t)}},model:{value:e.searchForm.courseName,callback:function(t){e.$set(e.searchForm,"courseName","string"===typeof t?t.trim():t)},expression:"searchForm.courseName"}})],1),a("el-form-item",{attrs:{label:"课程号",prop:"courseId"}},[a("el-input",{attrs:{placeholder:"请输入课程号",clearable:""},nativeOn:{keydown:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.getChartData(t)}},model:{value:e.searchForm.courseId,callback:function(t){e.$set(e.searchForm,"courseId","string"===typeof t?t.trim():t)},expression:"searchForm.courseId"}})],1),a("el-form-item",{attrs:{label:"教师名",prop:"teacherName"}},[a("el-input",{attrs:{placeholder:"请输入教师名",clearable:""},nativeOn:{keydown:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.getChartData(t)}},model:{value:e.searchForm.teacherName,callback:function(t){e.$set(e.searchForm,"teacherName","string"===typeof t?t.trim():t)},expression:"searchForm.teacherName"}})],1),a("el-form-item",{attrs:{label:"教师号",prop:"teacherId"}},[a("el-input",{attrs:{placeholder:"请输入教师号",clearable:""},nativeOn:{keydown:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.getChartData(t)}},model:{value:e.searchForm.teacherId,callback:function(t){e.$set(e.searchForm,"teacherId","string"===typeof t?t.trim():t)},expression:"searchForm.teacherId"}})],1),a("el-form-item",{attrs:{label:"创建日期",prop:"date"}},[a("el-date-picker",{attrs:{clearable:"","value-format":"yyyy-MM-dd",type:"daterange","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期"},on:{change:e.dateChange},model:{value:e.date,callback:function(t){e.date=t},expression:"date"}})],1),a("el-form-item",{staticClass:"form_btn"},[a("el-button",{attrs:{type:"default"},on:{click:e.getChartData}},[e._v("查询")]),a("el-button",{attrs:{type:"default"},on:{click:function(t){return e.resetForm("searchForm")}}},[e._v("重置")]),a("el-button",{attrs:{type:"text"},on:{click:function(t){e.formCollapse=!e.formCollapse}}},[e._v(" "+e._s(e.formCollapse?"查看更多":"收起")+" "),a("i",{class:[e.formCollapse?"el-icon-caret-bottom":"el-icon-caret-top"]})])],1)],1)],1)},s=[],o=(a("99af"),a("fb6a"),a("5530")),n=a("313e"),l={name:"index",data:function(){return{formCollapse:!1,searchForm:{studentName:"",studentId:"",courseName:"",courseId:"",teacherName:"",teacherId:"",createdAtStart:"",createdAtEnd:""},date:[],pieChart:null,barChart:null,chartData:{},isStu:!0,title:"我的成绩分布",url:"/students/getGradeDistributions",chartsNames:["≥90分","≤80<90分","≤70<80分","≤60<70分","≤0<60分","暂无成绩"]}},created:function(){"students"!==sessionStorage.getItem("level")&&(this.isStu=!1,this.title="学生成绩分布",this.url="/getAllGradeDistributions")},mounted:function(){var e=this;this.$nextTick((function(){var t=e.$refs,a=t["echarts"],r=parseInt(a.getAttribute("data-h").slice(0,-2))+60,s=a.clientWidth;a.style.height=r+"px";var o=n["a"](a,"dark");e.pieChart=o,o.setOption({title:{text:e.title,left:"center"},tooltip:{trigger:"item"},legend:{orient:"vertical",left:"left"},series:[{name:"访问来源",type:"pie",radius:"50%",data:[],emphasis:{itemStyle:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}}}]}),o.resize({height:r,width:s});var l=t["echarts2"];l.style.height=r+"px";var i=n["a"](l,"dark");e.barChart=i,i.setOption({color:{type:"linear",x:0,y:0,x2:0,y2:1,colorStops:[{offset:0,color:"red"},{offset:1,color:"blue"}],globalCoord:!1},title:{text:e.title,left:"center"},tooltip:{trigger:"axis",axisPointer:{type:"shadow"}},grid:{left:"3%",right:"4%",bottom:"3%",containLabel:!0},xAxis:[{type:"category",data:e.chartsNames,axisTick:{alignWithLabel:!0}}],yAxis:[{type:"value"}],series:[{name:"直接访问",type:"bar",barWidth:"60%",data:[]}]}),i.resize({height:r,width:s}),e.getChartData()}))},updated:function(){var e=this;this.$nextTick((function(){for(var t,a=document.body.children,r=0,s=a.length;r<s;r++)if(a[r].classList.contains("t-container")){t=a[r];break}var o=t.clientWidth,n=o<=1230?.9*(o-220):(o-220)/2-5,l=e.$refs["echarts"],i=e.$refs["echarts2"],c=parseInt(l.getAttribute("data-h").slice(0,-2))+60;l.style.height=c+"px",i.style.height=c+"px",e.pieChart.resize({height:c,width:n}),e.barChart.resize({height:c,width:n})}))},methods:{getChartData:function(){var e=this;this.axios.get(this.url,{params:Object(o["a"])({},this.searchForm)}).then((function(t){var a=t.data;0===a.status&&(e.chartData=t.data.data,e.refreshChart())}))},refreshChart:function(){this.pieChart.setOption({series:[{data:this.formatChartData("pie")}]}),this.barChart.setOption({series:[{data:this.formatChartData("bar")}]})},dateChange:function(e){e&&e.length?(this.searchForm.createdAtStart=e[0],this.searchForm.createdAtEnd=e[1]):(this.searchForm.createdAtStart="",this.searchForm.createdAtEnd="")},resetForm:function(e){this.$refs[e].resetFields(),this.date=[],this.dateChange()},formatChartData:function(e){for(var t=[],a=this.chartData,r=this.chartsNames,s=0,o=0,n=a.length;o<n;o++){var l=a[o]["level"+o];s+=l,"bar"===e?t=t.concat(l):"pie"===e&&(t=t.concat({value:l,name:r[o]}))}return 0===s&&"bar"===e&&(t=[],this.$message.warning("无数据")),t}}},i=l,c=(a("9631"),a("2877")),h=Object(c["a"])(i,r,s,!1,null,null,null);t["default"]=h.exports}}]);