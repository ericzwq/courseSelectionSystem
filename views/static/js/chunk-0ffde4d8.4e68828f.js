(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0ffde4d8"],{"015d":function(e,t,a){"use strict";a.r(t);var o=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("my-layout",{attrs:{formCollapse:e.formCollapse},scopedSlots:e._u([{key:"tableLayout",fn:function(t){return[a("my-table",{ref:"table",attrs:{tableData:e.tableData,height:t.height,totalCount:e.totalCount},on:{getData:e.getTable}},[a("template",{slot:"tableHead"},[a("el-table-column",{attrs:{type:"index",index:e.computeIndex,label:"序号",width:"60","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{label:"文件名称",width:"100","show-overflow-tooltip":""},scopedSlots:e._u([{key:"default",fn:function(e){return[a("file-detail",{attrs:{file:e.row}})]}}],null,!0)}),a("el-table-column",{attrs:{prop:"size",label:"文件大小","show-overflow-tooltip":""}}),"students"!==e.level?a("el-table-column",{attrs:{prop:"studentName",label:"学生名","show-overflow-tooltip":""}}):e._e(),"students"!==e.level?a("el-table-column",{attrs:{prop:"studentId",label:"学号","show-overflow-tooltip":""}}):e._e(),a("el-table-column",{attrs:{prop:"courseName",label:"课程名","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{prop:"courseId",label:"课程号","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{prop:"teacherName",label:"教师名","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{prop:"teacherId",label:"教师号","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{label:"分数","show-overflow-tooltip":""},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(-1===t.row.score?"暂无":t.row.score))])]}}],null,!0)}),a("el-table-column",{attrs:{prop:"updatedBy",label:"修改人","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{prop:"createdAt",label:"创建时间","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{prop:"updatedAt",label:"修改时间","show-overflow-tooltip":""}}),"students"!==e.level?a("el-table-column",{attrs:{fixed:"right",label:"操作"},scopedSlots:e._u([{key:"default",fn:function(t){return["teachers"===e.level&&e.id===t.row.teacherId||"admins"===e.level?a("el-button",{staticClass:"updateScore",attrs:{size:"mini",type:"danger",plain:""},on:{click:function(a){return e.deleteScoreDetail(t.row)}}},[e._v("删除 ")]):a("el-button",{attrs:{size:"mini",disabled:"",plain:""}},[e._v("无")])]}}],null,!0)}):e._e()],1)],2)]}}])},[a("el-form",{ref:"searchForm",staticClass:"search_form",attrs:{slot:"form",inline:!0,size:"mini",model:e.searchForm},slot:"form"},[a("el-form-item",{attrs:{label:"文件名",prop:"fileName"}},[a("el-input",{attrs:{placeholder:"请输入文件名",clearable:""},nativeOn:{keydown:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.search(t)}},model:{value:e.searchForm.fileName,callback:function(t){e.$set(e.searchForm,"fileName",t)},expression:"searchForm.fileName"}})],1),"students"!==e.level?a("el-form-item",{attrs:{label:"学生名",prop:"studentName"}},[a("el-input",{attrs:{placeholder:"请输入学生名",clearable:""},nativeOn:{keydown:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.search(t)}},model:{value:e.searchForm.studentName,callback:function(t){e.$set(e.searchForm,"studentName",t)},expression:"searchForm.studentName"}})],1):e._e(),"students"!==e.level?a("el-form-item",{attrs:{label:"学号",prop:"studentId"}},[a("el-input",{attrs:{placeholder:"请输入学号",clearable:""},nativeOn:{keydown:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.search(t)}},model:{value:e.searchForm.studentId,callback:function(t){e.$set(e.searchForm,"studentId",t)},expression:"searchForm.studentId"}})],1):e._e(),a("el-form-item",{attrs:{label:"课程名",prop:"courseName"}},[a("el-input",{attrs:{placeholder:"请输入课程名",clearable:""},nativeOn:{keydown:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.search(t)}},model:{value:e.searchForm.courseName,callback:function(t){e.$set(e.searchForm,"courseName",t)},expression:"searchForm.courseName"}})],1),a("el-form-item",{attrs:{label:"课程号",prop:"courseId"}},[a("el-input",{attrs:{placeholder:"请输入课程号",clearable:""},nativeOn:{keydown:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.search(t)}},model:{value:e.searchForm.courseId,callback:function(t){e.$set(e.searchForm,"courseId",t)},expression:"searchForm.courseId"}})],1),a("el-form-item",{attrs:{label:"教师名",prop:"teacherName"}},[a("el-input",{attrs:{placeholder:"请输入教师名",clearable:""},nativeOn:{keydown:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.search(t)}},model:{value:e.searchForm.teacherName,callback:function(t){e.$set(e.searchForm,"teacherName",t)},expression:"searchForm.teacherName"}})],1),a("el-form-item",{attrs:{label:"分数",prop:"scoreCode"}},[a("el-select",{attrs:{placeholder:"请选择"},model:{value:e.searchForm.scoreCode,callback:function(t){e.$set(e.searchForm,"scoreCode",t)},expression:"searchForm.scoreCode"}},e._l(e.scoreOptions,(function(e){return a("el-option",{key:e.value,attrs:{label:e.name,value:e.value}})})),1)],1),"teachers"===e.level?a("el-form-item",{attrs:{label:"学生分类",prop:"studentCategory"}},[a("el-select",{attrs:{placeholder:"请选择"},model:{value:e.searchForm.studentCategory,callback:function(t){e.$set(e.searchForm,"studentCategory",t)},expression:"searchForm.studentCategory"}},e._l(e.studentCategoryOptions,(function(e){return a("el-option",{key:e.value,attrs:{label:e.name,value:e.value}})})),1)],1):e._e(),a("el-form-item",{staticClass:"form_btn"},[a("el-button",{attrs:{type:"default"},on:{click:e.search}},[e._v("查询")]),a("el-button",{attrs:{type:"default"},on:{click:function(t){return e.resetForm("searchForm")}}},[e._v("重置")]),a("el-button",{attrs:{type:"text"},on:{click:function(t){e.formCollapse=!e.formCollapse}}},[e._v(" "+e._s(e.formCollapse?"查看更多":"收起")+" "),a("i",{class:[e.formCollapse?"el-icon-caret-bottom":"el-icon-caret-top"]})])],1)],1)],1)},n=[],l=(a("4160"),a("caad"),a("c975"),a("ac1f"),a("2532"),a("841c"),a("159b"),function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{},[a("div",{staticClass:"file-name",on:{click:e.getFile}},[e._v(e._s(e.file.fileName))]),e.showPic?a("image-viewer",{attrs:{"z-index":2e3,"on-close":function(){return e.showPic=!1},"url-list":e.picUrl,start:0}}):e._e(),a("el-dialog",{attrs:{visible:e.showVideo},on:{"update:visible":function(t){e.showVideo=t}}},[a("video",{ref:"video",attrs:{controls:"",preload:"meta",width:"600",src:e.videoUrl}})])],1)}),s=[],i=a("71dd"),r=a("1ae0"),c={name:"fileDetail",components:{imageViewer:i["a"]},props:["file"],data:function(){return{fileURL:r["c"],showPic:!1,picUrl:[],showVideo:!1,videoUrl:""}},methods:{isVideo:function(e){return/mp4|MP4|avi|AVI/.test(e)},isPicture:function(e){return/jpg|JPG|png|PNG/.test(e)},isFile:function(e){return/docx|DOCX|xlsx|XLSX|pdf|PDF/.test(e)},getFile:function(){var e=this.file,t=e.fileName,a=e.url;if(this.isVideo(t)&&(this.videoUrl=[this.fileURL+a],this.showVideo=!0),this.isPicture(t)&&(this.showPic=!0,this.picUrl=[this.fileURL+a]),this.isFile(t)){var o=document.createElement("a");o.setAttribute("href",this.fileURL+a),document.body.appendChild(o),o.click(),document.body.removeChild(o)}}},watch:{showVideo:function(e){!1===e&&this.$refs.video.pause()}}},u=c,d=(a("eb12"),a("2877")),m=Object(d["a"])(u,l,s,!1,null,null,null),h=m.exports,f={name:"scoreDetails",data:function(){return{searchForm:{fileName:"",studentName:"",studentId:"",courseName:"",courseId:"",teacherName:"",scoreCode:"",studentCategory:2},scoreOptions:[{name:"请选择",value:""},{name:"特优(90以上)",value:1},{name:"优(80-89)",value:2},{name:"良(70-79)",value:3},{name:"及格(60-69)",value:4},{name:"不及格(60以下)",value:5}],studentCategoryOptions:[{name:"全部学生",value:1},{name:"我的学生",value:2}],tableData:[],totalCount:0,page:1,count:10,id:parseInt(sessionStorage.getItem("id")),tableObj:{},multipleSelection:[],importDialogVisible:!1,addDialogVisible:!1,level:"",formCollapse:!1}},created:function(){location.hash.includes("/students/")?(this.level="students",delete this.searchForm.studentName,delete this.searchForm.studentId,delete this.searchForm.studentCategory):location.hash.includes("/teachers/")?this.level="teachers":location.hash.includes("/admin")?(this.level="admins",delete this.searchForm.studentCategory):this.$router.push("/login")},mounted:function(){this.tableObj=this.$refs["table"]},methods:{getTable:function(e,t){this.page=e,this.count=t,this.getTableData.call(this,"/scoreDetails",this.searchForm,(function(e){e[0].forEach((function(e){var t=e.size/1024+"",a=t.indexOf(".");e.size=t.substring(0,a+3)+"kb"}))}))},deleteScoreDetail:function(e){var t=this;this.$confirm("此操作将永久删除, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){t.axios.post("/deleteScoreDetail",{materialId:e.materialId}).then((function(e){var a=e.data;t.loaded&&t.loaded.close(),0===a.status&&(t.$message.success(a.message),t.tableData.length<=1&&(t.tableObj.page=t.tableObj.page-1),t.tableObj.refresh())}))}))},computeIndex:function(e){return(this.page-1)*this.count+e+1},resetForm:function(e){this.$refs[e].resetFields()},search:function(){this.tableObj.search()}},components:{fileDetail:h}},p=f,b=Object(d["a"])(p,o,n,!1,null,null,null);t["default"]=b.exports},"5e02":function(e,t,a){},"71dd":function(e,t,a){"use strict";var o=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("transition",{attrs:{name:"viewer-fade"}},[a("div",{staticClass:"el-image-viewer__wrapper",style:{"z-index":e.zIndex}},[a("div",{staticClass:"el-image-viewer__mask"}),a("span",{staticClass:"el-image-viewer__btn el-image-viewer__close",on:{click:e.hide}},[a("i",{staticClass:"el-icon-circle-close",staticStyle:{color:"white"}})]),e.isSingle?e._e():[a("span",{staticClass:"el-image-viewer__btn el-image-viewer__prev",class:{"is-disabled":!e.infinite&&e.isFirst},on:{click:e.prev}},[a("i",{staticClass:"el-icon-arrow-left"})]),a("span",{staticClass:"el-image-viewer__btn el-image-viewer__next",class:{"is-disabled":!e.infinite&&e.isLast},on:{click:e.next}},[a("i",{staticClass:"el-icon-arrow-right"})])],a("div",{staticClass:"el-image-viewer__btn el-image-viewer__actions"},[a("div",{staticClass:"el-image-viewer__actions__inner"},[a("i",{staticClass:"el-icon-zoom-out",on:{click:function(t){return e.handleActions("zoomOut")}}}),a("i",{staticClass:"el-icon-zoom-in",on:{click:function(t){return e.handleActions("zoomIn")}}}),a("i",{staticClass:"el-image-viewer__actions__divider"}),a("i",{class:e.mode.icon,on:{click:e.toggleMode}}),a("i",{staticClass:"el-image-viewer__actions__divider"}),a("i",{staticClass:"el-icon-refresh-left",on:{click:function(t){return e.handleActions("anticlocelise")}}}),a("i",{staticClass:"el-icon-refresh-right",on:{click:function(t){return e.handleActions("clocelise")}}})])]),a("div",{staticClass:"el-image-viewer__canvas"},e._l(e.urlList,(function(t,o){return o===e.index?a("img",{key:t,ref:"img",refInFor:!0,staticClass:"el-image-viewer__img",style:e.imgStyle,attrs:{src:e.currentImg},on:{load:e.handleImgLoad,error:e.handleImgError,mousedown:e.handleMouseDown}}):e._e()})),0)],2)])},n=[],l=(a("99af"),a("c975"),a("a9e3"),a("b680"),a("b64b"),a("07ac"),a("5530")),s=a("526f"),i=a("6bd7"),r={CONTAIN:{name:"contain",icon:"el-icon-full-screen"},ORIGINAL:{name:"original",icon:"el-icon-c-scale-to-original"}},c=Object(i["a"])()?"DOMMouseScroll":"mousewheel",u={name:"elImageViewer",props:{urlList:{type:Array,default:function(){return[]}},zIndex:{type:Number,default:2e3},onSwitch:{type:Function,default:function(){}},onClose:{type:Function,default:function(){}},start:{type:Number,default:0}},data:function(){return{index:this.start,isShow:!1,infinite:!0,loading:!1,mode:r.CONTAIN,transform:{scale:1,deg:0,offsetX:0,offsetY:0,enableTransition:!1}}},computed:{isSingle:function(){return this.urlList.length<=1},isFirst:function(){return 0===this.index},isLast:function(){return this.index===this.urlList.length-1},currentImg:function(){return this.urlList[this.index]},imgStyle:function(){var e=this.transform,t=e.scale,a=e.deg,o=e.offsetX,n=e.offsetY,l=e.enableTransition,s={transform:"scale(".concat(t,") rotate(").concat(a,"deg)"),transition:l?"transform .3s":"","margin-left":"".concat(o,"px"),"margin-top":"".concat(n,"px")};return this.mode===r.CONTAIN&&(s.maxWidth=s.maxHeight="100%"),s}},watch:{index:{handler:function(e){this.reset(),this.onSwitch(e)}},currentImg:function(e){var t=this;this.$nextTick((function(e){var a=t.$refs.img[0];a.complete||(t.loading=!0)}))}},methods:{hide:function(){this.deviceSupportUninstall(),this.onClose()},deviceSupportInstall:function(){var e=this;this._keyDownHandler=Object(i["b"])((function(t){var a=t.keyCode;switch(a){case 27:e.hide();break;case 32:e.toggleMode();break;case 37:e.prev();break;case 38:e.handleActions("zoomIn");break;case 39:e.next();break;case 40:e.handleActions("zoomOut");break}})),this._mouseWheelHandler=Object(i["b"])((function(t){var a=t.wheelDelta?t.wheelDelta:-t.detail;a>0?e.handleActions("zoomIn",{zoomRate:.015,enableTransition:!1}):e.handleActions("zoomOut",{zoomRate:.015,enableTransition:!1})})),Object(s["b"])(document,"keydown",this._keyDownHandler),Object(s["b"])(document,c,this._mouseWheelHandler)},deviceSupportUninstall:function(){Object(s["a"])(document,"keydown",this._keyDownHandler),Object(s["a"])(document,c,this._mouseWheelHandler),this._keyDownHandler=null,this._mouseWheelHandler=null},handleImgLoad:function(e){this.loading=!1},handleImgError:function(e){this.loading=!1,e.target.alt="加载失败"},handleMouseDown:function(e){var t=this;if(!this.loading&&0===e.button){var a=this.transform,o=a.offsetX,n=a.offsetY,l=e.pageX,r=e.pageY;this._dragHandler=Object(i["b"])((function(e){t.transform.offsetX=o+e.pageX-l,t.transform.offsetY=n+e.pageY-r})),Object(s["b"])(document,"mousemove",this._dragHandler),Object(s["b"])(document,"mouseup",(function(e){Object(s["a"])(document,"mousemove",t._dragHandler)})),e.preventDefault()}},reset:function(){this.transform={scale:1,deg:0,offsetX:0,offsetY:0,enableTransition:!1}},toggleMode:function(){if(!this.loading){var e=Object.keys(r),t=Object.values(r),a=t.indexOf(this.mode),o=(a+1)%e.length;this.mode=r[e[o]],this.reset()}},prev:function(){if(!this.isFirst||this.infinite){var e=this.urlList.length;this.index=(this.index-1+e)%e}},next:function(){if(!this.isLast||this.infinite){var e=this.urlList.length;this.index=(this.index+1)%e}},handleActions:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(!this.loading){var a=Object(l["a"])({zoomRate:.2,rotateDeg:90,enableTransition:!0},t),o=a.zoomRate,n=a.rotateDeg,s=a.enableTransition,i=this.transform;switch(e){case"zoomOut":i.scale>.2&&(i.scale=parseFloat((i.scale-o).toFixed(3)));break;case"zoomIn":i.scale=parseFloat((i.scale+o).toFixed(3));break;case"clocelise":i.deg+=n;break;case"anticlocelise":i.deg-=n;break}i.enableTransition=s}}},mounted:function(){this.deviceSupportInstall()}},d=u,m=a("2877"),h=Object(m["a"])(d,o,n,!1,null,null,null);t["a"]=h.exports},eb12:function(e,t,a){"use strict";var o=a("5e02"),n=a.n(o);n.a}}]);