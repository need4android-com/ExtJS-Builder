Ext.BLANK_IMAGE_URL = "../widgets/ext-2.2/resources/images/default/s.gif"; 

/**
 * 提交form函数
 * Jason Wu....2008-9-2
 *  History:
 *   2008-09-25 kukuxia.hw 完善ajaxSubmitForm（）以及 submitForm（）
 */

function ajaxSubmitForm(formName)
{    
    var formPanel = Ext.getCmp(formName); 
	if(formPanel.form.isValid()){
              formPanel.form.doAction('submit', {
                   url : formPanel.dataProxy,
                   method : 'post',
		           params : {jsonFormData:'Y'},
			  success : function(form, action) {
		              Ext.Msg.alert('成功', action.result.msg);
//                    this.disabled = false;
		      },
		      failure : function(form, action) {
		              Ext.Msg.alert('错误', '操作错误，请重试！');
//		              this.disabled = false;
                        }
                    });
//                 this.disabled = false;
      }else{
    	Ext.Msg.alert('提示', '红色波浪线标识为必填信息，请完成');
	}
}

 //Form的非Ajax提交方式 2008-09-25 kukuxia.hw 
function submitForm(formName){
    var formPanel = Ext.getCmp(formName); 
	if(formPanel.form.isValid()){
        formPanel.form.submit = Ext.emptyFn;
        formPanel.form.submit = function(){this.getEl().dom.action = formPanel.url;  this.getEl().dom.submit();  }
        formPanel.form.submit();
	}else{
	    Ext.Msg.alert('提示', '红色波浪线标识为必填信息，请完成');
	}
}

 //重置form内容,Jason Wu....2008-10-08
function resetForm(formName){
    var formPanel = Ext.getCmp(formName); 
	formPanel.form.reset();
}


/**
 * 为执行ext menu组件中的handler所传递的函数，
 * Jason Wu....2008-9-2
 */
function menuHandlerEval(menuObj){
	if (menuObj.handlerExpress)
	{
		eval(menuObj.handlerExpress);
	}
}

/**
在桌面中新打开TAB
 * Jason Wu....2008-9-20
*/
function newTabForDeskPanel(url,title)
{    

    var center = Ext.getCmp('deskPanel');  
	if(Ext.getCmp(title))
	{
		center.setActiveTab(title);	
	}
	else{
		center.add({
               title: title,
	           id: title,
			   region:'center',
		       closable:true,
		       border:false,
			   layout:'fit',
	           items: [ new Ext.ux.IFrameComponent({ id: title, url: url }) ],
	           closable:true
            }).show;
		center.setActiveTab(title);
	}
}   
/**扩展打开tab时携带图片的功能 lin 2009-5-11**/
function newTabForDeskPanelWithIcon(url,title,icon_cls)
{    

    var center = Ext.getCmp('deskPanel');  
	var icon_cls =  icon_cls;
	if(Ext.getCmp(title))
	{
		center.setActiveTab(title);	
	}
	else{
		center.add({
               title: title,
	           id: title,
			   region:'center',
		       closable:true,
		       border:false,
			   layout:'fit',
			   iconCls:icon_cls,
	           items: [ new Ext.ux.IFrameComponent({ id: title, url: url }) ],
	           closable:true
            }).show;
		center.setActiveTab(title);
	}
}

/*
根据查询FORM刷新GIRD，
需要传入formName与gridName两个参数
 * Jason Wu....2008-9-27
*/
function searchForGrid(searchForm,gridName){
	var searchForm = Ext.getCmp(searchForm); 
	var grid = Ext.getCmp(gridName); 
	var paramObj=searchForm.getForm().getValues(false);

	var hasNotBeenRender = true;
	if(!Ext.isArray(paramObj)){              
		var field, id;
		var paramStr = '';
		for(id in paramObj){
//          var hasNotBeenRender = true;
			if(typeof paramObj[id] != 'function' && (field = searchForm.getForm().findField(id)) && paramObj[id] != 'undefined' && paramObj[id] != ''){
				if (hasNotBeenRender) {
					hasNotBeenRender = false;
				} else {
					paramStr = paramStr+ "&";
				}
				paramStr = paramStr + id + "="+paramObj[id];
			}
		}
	}

	//url = url + Ext.urlEncode(Ext.urlDecode(paramStr));
	grid.store.proxy.conn.url = grid.dataProxy;
	
	//* 处理导出所需要的url: urlForExprtFile liangg 2009.5.4 
	grid.urlForExprtFile = grid.dataProxy;
	
	var queryParam = Ext.urlDecode(paramStr);

	grid.store.queryParam = queryParam;
	
	queryParam["start"] = 0;
	
	if (grid.pageSize > 0) {
			queryParam["limit"] = grid.pageSize;
	}
	grid.store.reload( {
        params : queryParam
     });
}			
/**
从grid的工具栏中打开新窗口，关闭该新窗口时，将刷新grid中的数据
 * Jason Wu....2008-10-6
*/
var WinPosition=0;
function gridOpenNewWin(url,title,grid){
	var isFistRestore=0;

	var html = "<iframe id='frmForm' name='frmForm' src='"+url+"' width='100%' height='100%'></iframe>";
	var fatherStyle = Ext.getBody();
	var gridBody = Ext.getCmp(grid);
	var bodyWidth =  fatherStyle.getComputedWidth();
	
	var winId;
	var i;
	for(i=0;i<=WinPosition;)
	{
		winId = "win"+i;
		if(Ext.getCmp(winId))
		{
			i++;
		}
		else{
			if(title.length<1)
				title = '查看窗口'+i;
			var tabs = new Ext.Panel({
					region: 'center',
					margins:'3 3 3 0', 
					defaults:{autoScroll:true},
					html: html
				});
			win = new Ext.Window({
				title:title,
				closable:true,
				maximizable:true,
				border:false,
				plain:true,
				//modal:true,
				id:winId,
				constrain :true,
				layout: 'border',
				items: [tabs]
			});
			win.show(fatherStyle);
			win.maximize(); 
			win.on('restore', function(){
				if(isFistRestore==0)
				{
					win.setPosition(bodyWidth-i*30-30,0);
					isFistRestore=1;
				}
			});	
			win.on('close', function(){
				gridBody.getStore().reload();
			});	
			if(i==WinPosition)
				WinPosition++;
			break;
		}
	}
	
}	
/**
删除表格记录。
 * Jason Wu....2008-10-6
**/

function grid_doDel(url,grid) {
	var gridBody = Ext.getCmp(grid);
    var c = gridBody.getSelections();
    if (c.length > 0) {
       Ext.MessageBox.confirm('消息', '确认要删除所选记录?',function(btn) {grid_doDelProc(btn,url,gridBody)});
    } else { 
       Ext.MessageBox.alert('警告', '最少需要选择一条记录!');  
    }    
};
function grid_doDelProc(btn,url,gridBody) {

    if (btn == 'yes') {
        if (gridBody.getSelectionModel().hasSelection()) {
            var records = gridBody.getSelectionModel().getSelections();
			var idArrays=new Array(records.length); 
            for (var i = 0, len = records.length; i < len; i++) {
				if (records[i].data.id != 'undefined' && records[i].data.id != '')
				{
					idArrays[i] =  records[i].data.id;
				}
            }
            Ext.Ajax.request({            
               method : 'POST',      
               url: url,
               success: function(o) {grid_doDelProc_onSuccess(o,gridBody)},
               failure: function(form, action) {grid_doDelProc_onFailure(form, action,gridBody)},
               params: { ids:idArrays}
            });
        }
    }
} 
function grid_doDelProc_onFailure(form, action,gridBody) { 
    Ext.MessageBox.alert('消息', '删除失败!');
    gridBody.store.reload();
};
function grid_doDelProc_onSuccess(o,gridBody) {
    if ("success" == o.responseText){
        Ext.MessageBox.alert('消息', '删除记录成功!');
    } else {
        Ext.MessageBox.alert('消息', '删除记录失败!<br/><font color=red>'+o.responseText+'</font>');
    } 
    gridBody.store.reload();
};

/**
表格新增记录。
 * Jason Wu....2008-10-10
**/
function grid_doAdd(grid) {
	var gridBody = Ext.getCmp(grid);
	gridBody.doAddHandler();
}

/**
表格保存记录。
 * Jason Wu....2008-10-10
**/
function grid_doSave(grid) {
	var gridBody = Ext.getCmp(grid);
	gridBody.doAddHandler();
}

/**
表格保存记录。
 * Jason Wu....2008-10-14
**/
function grid_doSave(url,grid){
	var gridBody = Ext.getCmp(grid);
	Ext.MessageBox.show({
           title:'保存修改',
           msg: '如果保存所有修改记录，请选择‘保存所有’按钮',
           buttons: {yes:'保存所有', no:'保存选择',cancel:'取消'},
           fn: function(btn) {grid_doSaveProc(btn,url,gridBody)},
           icon: Ext.MessageBox.QUESTION
       });    
}

/**
表格保存记录回调函数。
 * Jason Wu....2008-10-14
**/
function grid_doSaveProc(btn,url,gridBody){
	if (btn == 'cancel') {return;}
	//获取gird修改的记录。
	var m = gridBody.store.modified.slice(0);
	var selectRecords = gridBody.getSelectionModel().getSelections();
	if(m.length <= 0) {
		Ext.MessageBox.alert('提示框', '对不起，您没有增加或修改的记录！');
		return;
	}     
	var idArrays=new Array(); 
	if (btn == 'no') {
		if (!gridBody.getSelectionModel().hasSelection()) {
			Ext.MessageBox.alert('提示框', '对不起，您没有选择新增或修改的记录！');
			return;
		}
		var hasSelectModifiedRecord = false;
		//循环修改的记录与选择的记录，如果有重复则把修改的记录ID放进idArrays数组中。
		for (var j = 0;j< m.length;j++ ) {
			var modifiedRecordData = m[j].data;
			for (var i = 0, len = selectRecords.length; i < len; i++) {
				if (selectRecords[i].id == m[j].id)
				{
					idArrays[idArrays.length] = j;
					hasSelectModifiedRecord = true;
				}
			}
			if (!hasSelectModifiedRecord)
			{
				Ext.MessageBox.alert('提示框', '对不起，您选择的记录没有做任何修改！');
				return;
			}
		}
	} else if (btn == 'yes') {
		for (var j = 0;j< m.length;j++ ) {
			idArrays[idArrays.length] = j;
		}
	}
	var paramStr = '';
	for (var j = 0;j< m.length;j++ ) {
		for (var i=0;i < idArrays.length ; i++) {
			if (j == idArrays[i]) {
				var modifiedRecordData = m[j].data;
				for(id in modifiedRecordData){
					if (paramStr.length > 0) {
						paramStr = paramStr + '&';
					}
					var parameterFieldName = id;
					if (id.indexOf("___") > -1) {
						parameterFieldName = id.replace("___",".");
					}
					if( typeof(modifiedRecordData[id])=='object' && null!=modifiedRecordData[id].getYear())
					{
						var year = modifiedRecordData[id].getFullYear();
						var month= modifiedRecordData[id].getMonth() + 1;
						var date = modifiedRecordData[id].getDate();
						var dateString = year + '-' + month + '-' + date;
						paramStr = paramStr + 'select_' + j + '_' + parameterFieldName + '=' + dateString ;
					}
					else
					{
						paramStr = paramStr + 'select_' + j + '_' + parameterFieldName + '=' + modifiedRecordData[id] ;
					}
				}
				paramStr = paramStr +  '&select_record_num_'+j+"=Y";
			}
		}
	}
	Ext.Ajax.request({            
	   method : 'POST',             
	   url: url,  
	   success:  function(o) {grid_onSaveSuccess(o,gridBody)} ,
	   failure:  function(form, action) {grid_onSaveFailure(form, action,gridBody)} ,
	   params: paramStr
	});		

}
/**
表格保存记录成功回调函数。
 * Jason Wu....2008-10-14
**/
function grid_onSaveSuccess(o,gridBody){
    if ("success" == o.responseText){
        Ext.MessageBox.alert('消息', '保存记录成功!');
		gridBody.store.modified = [];
		gridBody.store.reload();
    } else {
        Ext.MessageBox.alert('消息', '保存记录失败!<br/><font color=red>'+o.responseText+'</font>');
    }
}
/**
表格保存记录失败回调函数。
 * Jason Wu....2008-10-14
**/
function grid_onSaveFailure(form, action,gridBody){
	Ext.MessageBox.alert('消息', '保存失败!');
}

/**
many2many选择按钮所触发的事件，该事件将弹出一窗口。
 * Jason Wu....2008-10-21
**/
function openM2MSelectWin(o, winTitle,targetProxy,targetGridName,originGridName,entityName,fieldName,entityId,operator) {
	var params = targetProxy.split("?");
	if(params.length<2){
		url =  targetProxy+"?";
	} else {
		url =  targetProxy+"&";
	}
	//将弹出页面的地址加上需要传递的参数.
	url = url + "_M2MSelect_fieldName=" +  fieldName;
	url = url + "&_M2MSelect_targetGridName=" +  targetGridName;
    url = url + "&_M2MSelect_originGridName=" +  originGridName;
	url = url + "&_M2MSelect_entityName=" +  entityName;
	url = url + "&_M2M_ENTITY_ID=" +  entityId;
	var html = "<iframe id='M2MSelectFrame' name='M2MSelectFrame' src='"+url+"' width='100%' height='100%'></iframe>";
	var fatherStyle = Ext.getBody();	
	var bodyWidth =  fatherStyle.getComputedWidth() - 30;
	var bodyHeight =  fatherStyle.getComputedHeight() - 30;
	var gridBody = Ext.getCmp(originGridName);

	var tabs = new Ext.Panel({
			region: 'center',
			margins:'3 3 3 0', 
			defaults:{autoScroll:true},
			html: html
		});
	var fatherStyle = Ext.getBody();
	var bodyWidth =  fatherStyle.getComputedWidth();
	var m2mWin = new Ext.Window({id:'m2mWinID',width:bodyWidth,height:bodyHeight,title:winTitle,layout: 'border',modal: true,items: [tabs]});
	m2mWin.on('close', function(){
		gridBody.getStore().reload();
	});	
	m2mWin.show();
}

/**
 * 该函数用于选择批量增加多对多关系。
 * Jason Wu....2008-10-29
**/
function m2mSelect(menuObj,url,orgID,targetGridName,entityName,fieldName,entityId){
	var gridBody = Ext.getCmp(targetGridName); 
	var records = gridBody.getSelectionModel().getSelections();
	if (records.length <= 0)
	{
		Ext.MessageBox.alert('提示框', '对不起，您没有选择相关记录！');
		return;
	}
	var idArrays=new Array(records.length); 
	var m2mRenderProxy = bravoHome+'/ui/dataManageMent!m2mDataManageMent.action';
	for (var i = 0, len = records.length; i < len; i++) {
		if (records[i].data.id != 'undefined' && records[i].data.id != '') {
			idArrays[i] =  records[i].data.id;
		}
	}
	Ext.Ajax.request({            
	   method : 'POST',      
	   url: m2mRenderProxy,
	   success: function(o) {grid_onM2MSaveSuccess(o,gridBody)},
	   failure: function(form, action) {grid_onSaveFailure(form, action,gridBody)},
	   params: { _M2M_SELECT_IDS:idArrays,_M2M_ENTITY_ID:entityId,_M2MSelect_entityName:entityName,_M2MSelect_fieldName:fieldName}
	});
}

function grid_onM2MSaveSuccess(o,gridBody){
    if ("success" == o.responseText){
	    Ext.MessageBox.show({
           title:'保存成功',
           msg: '是否关闭该当前窗口',
           buttons: {yes:'是', no:'否'},
           fn: function(btn) {grid_doM2MCloseWin(btn,gridBody)},
           icon: Ext.MessageBox.QUESTION
       });  
		gridBody.store.modified = [];
		gridBody.store.reload();
    } else {
        Ext.MessageBox.alert('消息', '保存记录失败!<br/><font color=red>'+o.responseText+'</font>');
    }
}

function grid_doM2MCloseWin(btn,gridBody){
	if (btn == 'yes') {
	 var m2mWin = parent.Ext.getCmp('m2mWinID'); 
	 if(m2mWin!=undefined){
        m2mWin.close();
	 }
	}     
	else if(btn == 'no') {
      return;
	}
}
/**
 * 该函数用于选择批量删除多对多关系。
 * Jason Wu....2008-10-29
**/
function m2mRemove(menuObj,orgID,entityName,fieldName,entityId){
	var gridBody = Ext.getCmp(orgID); 
	var records = gridBody.getSelectionModel().getSelections();
	var idArrays=new Array(records.length); 
	var m2mRenderProxy = bravoHome+'/ui/dataManageMent!m2mDataManageMentRemove.action';
	for (var i = 0, len = records.length; i < len; i++) {
		if (records[i].data.id != 'undefined' && records[i].data.id != '') {
			idArrays[i] =  records[i].data.id;
		}
	}
	Ext.Ajax.request({            
	   method : 'POST',      
	   url: m2mRenderProxy,
	   success: function(o) {grid_doDelProc_onSuccess(o,gridBody)},
	   failure: function(form, action) {grid_doDelProc_onFailure(form, action,gridBody)},
	   params: { _M2M_SELECT_IDS:idArrays,_M2M_ENTITY_ID:entityId,_M2MSelect_entityName:entityName,_M2MSelect_fieldName:fieldName}
	});
}


/**
 * PopuSelect选择按钮所触发的事件，该事件将弹出一查询窗口。
 * kukuxia.kevin.hw  2008-11-10
**/
var parentPopuWin;//全局定义父页面打开的窗口

function openPopuSelectWin(o,name,winTitle,targetProxy,targetGridName,hiddenName,valueField,displayField) {
	var params = targetProxy.split("?");
	if(params.length<2){
		url =  targetProxy+"?";
	} else {
		url =  targetProxy+"&";
	}
	//将弹出页面的地址加上需要传递的参数.
	url = url + "_PopuSelect_name=" +  name;
	url = url + "&_PopuSelect_targetGridName=" +  targetGridName;
    url = url + "&_PopuSelect_hiddenName=" +  hiddenName;
    url = url + "&_PopuSelect_valueField=" +  valueField;
	url = url + "&_PopuSelect_displayField=" +  displayField;
	var html = "<iframe id='PopuSelectFrame' name='PopuSelectFrame' src='"+url+"' width='100%' height='100%'></iframe>";
	var fatherStyle = Ext.getBody();	
	var bodyWidth =  fatherStyle.getComputedWidth() - 30;
	var bodyHeight =  fatherStyle.getComputedHeight() - 10;

	var tabs = new Ext.Panel({
			region: 'center',
			margins:'3 3 3 0', 
			defaults:{autoScroll:true},
			html: html
		});
	var fatherStyle = Ext.getBody();
	var bodyWidth =  fatherStyle.getComputedWidth();
	parentPopuWin = new Ext.Window({id:'popuWinID',width:bodyWidth,height:bodyHeight,title:winTitle,layout: 'border',modal: true,items: [tabs]});
	parentPopuWin.show();
}

//在打开的页面上调用此函数，来关闭打开的parentPopuWin窗口
PopuSelectWinOpener = function() {   
	return {  
        closeWindow : function() {  
          parentPopuWin.close();
        }
    };  
}();

/**
 * PopuSelect选择按钮所触发的事件，该事件将弹出一查询窗口。
 * kukuxia.kevin.hw  2008-11-11
**/
function popuSelect(menuObj,name,targetGridName,valueField,displayField,hiddenName){
	var gridBody = Ext.getCmp(targetGridName); 
	var records = gridBody.getSelectionModel().getSelections();
	if(records.length!=1){
	   Ext.MessageBox.alert('提示框', '您只能选择一条记录');
	}else{
        //回填父页面上的封装的PopuSelect标签，显示的是displayField字段
		window.parent.document.getElementsByName(name)[0].value = records[0].data[displayField];
        //window.parent.document.getElementById(name).value = records[0].data[displayField];
		//回填父页面上的该字段的Hidden标签，填入的是valueField字段
		window.parent.document.getElementsByName(hiddenName)[0].value = records[0].data[valueField];
		//以下方法 works in IE，but not work in FF 
		//window.parent.document.getElementById(hiddenName).value = records[0].data[valueField];
           var oParent;  
           oParent = parent.PopuSelectWinOpener; //引用弹出窗口opener页面的js对象 
           oParent.closeWindow();  	
	}
}


/**
 * 从我的桌面里面的news的工具栏中打开新窗口
 * Cathy Lin....2008-11-12
 */

function newsOpenNewWin(newsID,url,title){
var html = "<iframe id='frmForm' name='frmForm' src='"+url+"' width='100%' height='100%'></iframe>";	
newsTitle=title;
			var tabs = new Ext.Panel({
					region: 'center',
					margins:'3 3 3 0', 
					defaults:{autoScroll:true},
					html: html
				});
           //如果在第一个窗口还存在的情况下，要打开第二个窗口，则先关闭第一个窗口
			if(Ext.getCmp('newsDetailWin')!=undefined){
				Ext.getCmp('newsDetailWin').close();
			}
			win = new Ext.Window({
				title:newsTitle,
				width:620,
				height:500,
				closable:true,
				maximizable:true,
				border:false,
				plain:true,
				//modal:true,
				id:'newsDetailWin',
				constrain :false,
			    collapsible:true,
				layout: 'border',
				items: [tabs]
			});
			win.show();	
}

/**
 * 更换页面的主题色彩
 * kukuxia.kevin.hw 2008-11-17
 */
function changeCss(name){
  var date = new Date();
  date.setTime(date.getTime() + 30*24*3600*1000);//设置cookie的时间为30天
  document.getElementsByTagName("link")[1].href = bravoHome+"/widgets/ext-2.2/resources/css/"+name;
  document.cookie="css="+name+"; path=/"+"; expires="+date.toGMTString();//设置cookie
  document.location.reload();
}

/**
 * 根据cookie设定界面主题色彩
 */
loadCss();
function loadCss()
{
	var cookies = (document.cookie).split("; ");
	var css;
	for(var i=0; null!=cookies && i<cookies.length; i++)
	{	
	   var cookie = cookies[i].split("=");
	   if(null!=cookie && cookie[0]=="css")
	   {
	      css = cookie[1];
	      break;
	   }
	}
	document.getElementsByTagName("link")[1].href = bravoHome+"/widgets/ext-2.2/resources/css/"+css;
	refreshUserCookie();
}

/**
 * 该函数用于弹出流程操作窗口
 * Jason Wu....2008-11-18
**/
function openWorkflowLogWin(entityName,entityId,workflowName,workflow_operation) {
	var url = bravoHome+'/workflow/task!addWorkflowLog.action';
	url = url + "?" +"workflow_operation="+workflow_operation;
	url = url + "&workflow_definitionName=" + workflow_definitionName;
	url = url + "&workflow_operation=" + workflow_operation;
	winTitle="流程操作日志"
	//将弹出页面的地址加上需要传递的参数.
	var html = "<iframe id='workflowLogWinFrame' name='workflowLogWinFrame' src='"+url+"' width='100%' height='100%'></iframe>";
	var tabs = new Ext.Panel({
			region: 'center',
			margins:'3 3 3 0', 
			defaults:{autoScroll:true},
			html: html
		});
	var workflowLogWin = new Ext.Window({id:'workflowLogWin',width:500,height:300,title:winTitle,layout: 'border',modal: true,items: [tabs]});
	workflowLogWin.on('close', function(){
		alert(workflowLogWin);
	});	
	workflowLogWin.show();
}

/**
 * 该函数用于退出系统
 * Jason Wu....2008-11-19
 * 添加退出提示对话框
 * Cathy Lin....2009-2-13**/



function loginOut(o,url) {
		Ext.MessageBox.show({
			title:'退出系统',
			msg:'确定要退出系统吗？',
			buttons:{yes:'是',no:'否'},
			minWidth:200,
			icon: Ext.MessageBox.QUESTION,
			fn:function(btn){closeWin(btn,url)}
				});
}
function closeWin(btn,url){
	if(btn=='yes'){
	var url = bravoHome+'/j_spring_security_logout';
	window.location = url;
	}
	
	else if(btn=='no'){
	    return;
	}
         }

/**
 * 该函数用于弹出用户个人设置
 * Jason Wu....2008-11-28
**/
function userProfile() {

	var url = bravoHome+'/workflow/task!addWorkflowLog.action';
	url = url + "?" +"workflow_operation="+workflow_operation;
	url = url + "&workflow_definitionName=" + workflow_definitionName;
	url = url + "&workflow_operation=" + workflow_operation;
	winTitle="流程操作日志"
	//将弹出页面的地址加上需要传递的参数.
	var html = "<iframe id='workflowLogWinFrame' name='workflowLogWinFrame' src='"+url+"' width='100%' height='100%'></iframe>";
	var tabs = new Ext.Panel({
			region: 'center',
			margins:'3 3 3 0', 
			defaults:{autoScroll:true},
			html: html
		});
	var workflowLogWin = new Ext.Window({id:'workflowLogWin',width:500,height:300,title:winTitle,layout: 'border',modal: true,items: [tabs]});
	workflowLogWin.on('close', function(){
		alert(workflowLogWin);
	});	
	workflowLogWin.show();

	var url = bravoHome+'/j_spring_security_logout';
	window.location = url;
}

/**
 * 该函数调用Ext.Ajax.request功能触发后台ACTION,执行保存当前cookie功能
 * Yeon   2008-12-2
 */
function saveUserProfileCookie(){
	Ext.Ajax.request
	({
		method: 'POST',
		url: './userCookie!saveUserCookie.action',
		params:
		{
		     cookieString : document.cookie
		},
		success: function(o) {Ext.MessageBox.alert('消息', '个人设置保存成功!');}
	});
}

/**
 * 该函数调用Ext.Ajax.request功能触发后台ACTION,读出所有当前登陆人的UserCookie,并且写入客户端cookie中
 * Yeon   2008-12-2
 */
function loadUserProfileCookie(){
	clearUserProfileCookie("JSESSIONID");
	Ext.Ajax.request
	({
		method: 'POST',
		url: './userCookie!loadUserCookie.action',
		success:function(o) {document.location.reload();}
	});
}

/**
 * 该函数返回指定cookie的值
 * Yeon 2009－1－6
 */
function getCookieValue(cookieName)
{
	var cookieValue="";
	var cookies = (document.cookie).split("; ");
	for(var i=0; null!=cookies && i<cookies.length; i++)
	{	
	   var cookie = cookies[i].split("=");
	   if(null!=cookie && cookie[0]==cookieName)
	   {
	      cookieValue = cookie[1];
	      break;
	   }
	}
	return cookieValue;
}

/**
 * 该函数去掉cookie值中两头的引号
 * Yeon    2008-12-7
 */
function refreshUserCookie(){
	var cookies = (document.cookie).split("; ");
	if(null != cookies){
		for(i=0; i<cookies.length; i++){				
				var cookie = cookies[i].split("=");				
				if(null!=cookie[1] && cookie[1].substring(0,1) == "\""){
					cookie[1] = cookie[1].substr(1,cookie[1].length - 2);
					document.cookie = cookie[0]+"="+cookie[1]+"; path=/; expires="+(new Date(new Date().getTime()+(1000*60*60*24*7))).toGMTString();								
				}
			}
	}
}

/**
 * 把当前页面中除名为excptCookieName外的cookie删除掉
 * Yeon   2008-12-4
 */
function clearUserProfileCookie(excptCookieName){
	var userProfileCookies = (document.cookie).split("; ");
	for(var i=0;i<userProfileCookies.length;i++)
	{	
		var Name = userProfileCookies[i].split("=")[0];
		if(excptCookieName != Name)
		{
			var date = new Date();
  			date.setTime(date.getTime() - 1000*60*60*24*366);
			var washCookie = userProfileCookies[i]+"; path=/; expires="+date.toGMTString();
			document.cookie = washCookie;
		}
	}
}

/**
 * 显示个人设置窗口
 * Yeon    2008-12-7
 */
function openUserProfileWin(){
	var url = '../common/profileMenu!query.action';
	var html = "<iframe id='profileMenuWinFrame' name='profileMenuWinFrame' src='"+url+"' width='100%' height='100%'></iframe>";
	var tabs = new Ext.Panel({
		region  : 'center',
		margins : '3 3 3 0', 
		defaults: {autoScroll:true},
		html    : html
	});
	var profileMenuWin = new Ext.Window({
		id    : 'profileMenuWin',
		width : 600,
		height: 300,
		title : '快捷菜单设置',
		layout: 'border',
		modal : true,
		items : [tabs]
	});
	profileMenuWin.show();	
}

function opentDeskTopModalWin(frameName,url,title,width,height){
	url    = (null!=url)? url:'';
	title  = (null!=title)?title:'';
	width  = (null!=width)? width:600;
	height = (null!=height)? height:300;
	
	var html = "<iframe id='profileMenuWinFrame' name='profileMenuWinFrame' src='"+url+"' width='100%' height='100%'></iframe>";

	var deskTopModalWin = new Ext.Window({ 
											title       : title,
											autoScroll  : true,
											expandOnShow: false,
											layout      : 'fit',
											plain       : true,
											width       : width,
									        height      : height,
									        resizable   : false,
									        modal       : true,
									        html        : html
									   	});
	deskTopModalWin.show();
}

/**
 * 检测当前session是否过期，如果过期则跳转到Bravo登陆界面
 * Yeon    2008-12-13
 */
function checkSession(){
	var isSessionExpired = true;
	var userProfileCookies = (document.cookie).split("; ");
	for(var i=0;i<userProfileCookies.length;i++)
	{	
		var Name = userProfileCookies[i].split("=")[0];
		if("JSESSIONID" == Name)
		{
			isSessionExpired = false;
		}
	}
	Ext.Ajax.request
	({
		url    : './desktop!syncSessionWithLog.action',
		method : 'POST',
		params : 
				 {
					isSessionExpired:isSessionExpired
				 },
		success: function(o){
				 	if("expired" == o.responseText){
						var url = bravoHome+'/j_spring_security_logout';
						window.location = url;
					}
				 }
	});
}

/**
 * 让当前页面的session过期，用于调试过期跳转效果
 * Yeon    2008-12-13
 */
function sessionExpired(){
	var userProfileCookies = (document.cookie).split("; ");
	for(var i=0;i<userProfileCookies.length;i++)
	{	
		var Name = userProfileCookies[i].split("=")[0];
		if("JSESSIONID" == Name)
		{
			var date = new Date();
  			date.setTime(date.getTime() - 1000*60*60*24*366);
			var washCookie = userProfileCookies[i]+"; expires="+date.toGMTString();
			document.cookie = washCookie;
		}
	}
}

/**
 * Finereport导出报表，url中处理中日韩文必须的Encode方法
 * kukuxia.kevin.hw 2008-12-22
 */
function cjkEncode(text) {   
    if (text == null) {   
        return "";   
    }   
 var newText = "";   
    for (var i = 0; i < text.length; i++) {   
        var code = text.charCodeAt (i);    
        if (code >= 128 || code == 91 || code == 93) {//91 is "[", 93 is "]".   
            newText += "[" + code.toString(16) + "]";   
        } else {   
            newText += text.charAt(i);   
        }   
    }   
 return newText;   
}


function gridDateFormat(value){
	if('string'!=typeof(value))
	{
    	return value ? value.dateFormat('Y-m-d') : '';
	}
    else
    {
    	return value ? value : '';
    }
    	
};

/**
 *日期时间选择的初始化
 *用my97datepicker来实现日期时间控件,加日期的限制选择.
 *liangg 2009.04.20
 */
	function  initCalderDateTimeField(dateObject){

	var start = Ext.getCmp(dateObject.startDateField);
	var linkField = Ext.getCmp(dateObject.linkAgeField);
 
	var end = Ext.getCmp(dateObject.endDateField);

	var dateDivId = dateObject.name + "_Date_Div" ;
	var dateDivElement =  document.getElementById(dateDivId);
		 
		if (null != dateDivElement ){
			 
			if (dateDivElement.parentNode ) {
				 
				dateDivElement.parentNode.removeChild(dateDivElement); 
			}
			 
		} 

			dateDivElement   =   document.createElement("div");  
			dateDivElement.style.position = "absolute";
			
			dateDivElement.style.left=dateObject.getPosition()[0];
			dateDivElement.style.top=dateObject.getPosition()[1];
			dateDivElement.id   =   dateDivId;   
			document.body.appendChild(dateDivElement);
			
	if (start) {
		
		if (null != start.value && "" != start.value){
			 
			 
			WdatePicker({
				el:$dp.$(dateDivId),
				onpicked:function(dp){
					setDateTimeValue(dp,dateObject,dateDivElement);
					if(null != linkField) linkField.onTriggerClick();
				},dateFmt:'yyyy-MM-dd HH:mm:ss',isShowClear:false, minDate: start.value, skin:'whyGreen'
			});
		} else {
			WdatePicker({
				el:$dp.$(dateDivId),
				onpicked:function(dp){
					setDateTimeValue(dp,dateObject,dateDivElement);
					if(null != linkField) linkField.onTriggerClick();
				},dateFmt:'yyyy-MM-dd HH:mm:ss',isShowClear:false, skin:'whyGreen'
			});
		}
	} 
	else if (end) {
		 
		if (null != end.value && "" != end.value){
			 
			WdatePicker({
				el:$dp.$(dateDivId),
				onpicked:function(dp){
					setDateTimeValue(dp,dateObject,dateDivElement);
					if(null != linkField) linkField.onTriggerClick();
				},dateFmt:'yyyy-MM-dd HH:mm:ss',isShowClear:false, maxDate:end.value, skin:'whyGreen'
			});
		} else {
			 WdatePicker({
				el:$dp.$(dateDivId),
				onpicked:function(dp){
					setDateTimeValue(dp,dateObject,dateDivElement);
					if(null != linkField) linkField.onTriggerClick();
				},dateFmt:'yyyy-MM-dd HH:mm:ss',isShowClear:false, skin:'whyGreen'
			});
		}
	}
	else{
	 
	 WdatePicker({
			el:$dp.$(dateDivId),
			onpicked:function(dp){
			setDateTimeValue(dp,dateObject,dateDivElement);
			if(null != linkField) linkField.onTriggerClick();
			},dateFmt:'yyyy-MM-dd HH:mm:ss',isShowClear:false, skin:'whyGreen'
		});
	}

	 
    
	}

function setDateTimeValue(dp,dateObj,divElement){

	 //内置函数获得年月日时分秒,再付给dateField控件
	 var date = $dp.cal.getP('y') + '-' + $dp.cal.getP('M') +'-'+ $dp.cal.getP('d') + ' ' + $dp.cal.getP('H') + ':' + $dp.cal.getP('m') + ':' + $dp.cal.getP('s') ;
	 
	dateObj.setValue(date);

	if (divElement.parentNode ) {
		divElement.parentNode.removeChild(divElement); 
	}

}


/**
 *日期选择的初始化(不带时间的日期控件)
 *用my97datepicker来实现日期时间控件,加日期的限制选择.
 *liangg 2009.04.20
 */
	function  initCalderDateField(dateObject){

	var start = Ext.getCmp(dateObject.startDateField);

	var linkField = Ext.getCmp(dateObject.linkAgeField);
	
	var end = Ext.getCmp(dateObject.endDateField);

	var dateDivId = dateObject.name + "_DateField_Div" ;
	var dateDivElement =  document.getElementById(dateDivId);
		 
		if (null != dateDivElement ){
			 
			if (dateDivElement.parentNode ) {
				 
				dateDivElement.parentNode.removeChild(dateDivElement); 
			}
			 
		} 

			dateDivElement   =   document.createElement("div");  
			dateDivElement.style.position = "absolute";
			
			dateDivElement.style.left=dateObject.getPosition()[0];
			dateDivElement.style.top=dateObject.getPosition()[1];
			dateDivElement.id   =   dateDivId;   
			document.body.appendChild(dateDivElement);
			
	if (start) {
		
		if (null != start.value && "" != start.value){
			 
			 
			WdatePicker({
				el:$dp.$(dateDivId),
				onpicked:function(dp){
				setDateFieldValue(dp,dateObject,dateDivElement);
				if(null != linkField) linkField.onTriggerClick();
				},dateFmt:'yyyy-MM-dd',isShowClear:false, minDate: start.value, skin:'whyGreen'
			});
		} else {
			WdatePicker({
				el:$dp.$(dateDivId),
				onpicked:function(dp){
				setDateFieldValue(dp,dateObject,dateDivElement);
				if(null != linkField) linkField.onTriggerClick();
				},dateFmt:'yyyy-MM-dd',isShowClear:false, skin:'whyGreen'
			});
		}
	} 
	else if (end) {
		 
		if (null != end.value && "" != end.value){
			 
			WdatePicker({
				el:$dp.$(dateDivId),
				onpicked:function(dp){
				setDateFieldValue(dp,dateObject,dateDivElement);
				if(null != linkField) linkField.onTriggerClick();
				},dateFmt:'yyyy-MM-dd',isShowClear:false, maxDate:end.value, skin:'whyGreen'
			});
		} else {
			 WdatePicker({
				el:$dp.$(dateDivId),
				onpicked:function(dp){
				setDateFieldValue(dp,dateObject,dateDivElement);
				if(null != linkField) linkField.onTriggerClick();
				},dateFmt:'yyyy-MM-dd',isShowClear:false, skin:'whyGreen'
			});
		}
	}
	else{
	 
	 WdatePicker({
			el:$dp.$(dateDivId),
			onpicked:function(dp){
			setDateFieldValue(dp,dateObject,dateDivElement);
			if(null != linkField) linkField.onTriggerClick();
			},dateFmt:'yyyy-MM-dd',isShowClear:false, skin:'whyGreen'
		});
	}
}

function setDateFieldValue(dp,dateObj,divElement){

	 //内置函数获得年月日时分秒,再付给dateField控件
	 var date = $dp.cal.getP('y') + '-' + $dp.cal.getP('M') +'-'+ $dp.cal.getP('d');
	 
	dateObj.setValue(date);

	if (divElement.parentNode ) {
		divElement.parentNode.removeChild(divElement); 
	}

}

	/**
	 * 把当前页面中除名为excptCookieName外的cookie删除掉
	 * Yeon   2008-12-4
	 */
	function clearUserProfileCookie(excptCookieName){
		var userProfileCookies = (document.cookie).split("; ");
		for(var i=0;i<userProfileCookies.length;i++)
		{	
			var Name = userProfileCookies[i].split("=")[0];
			if(excptCookieName != Name)
			{
				var date = new Date();
	  			date.setTime(date.getTime() - 1000*60*60*24*366);
				var washCookie = userProfileCookies[i]+"; path=/; expires="+date.toGMTString();
				document.cookie = washCookie;
			}
		}
	}
	
	/**
	 * 该函数去掉cookie值中两头的引号
	 * Yeon    2008-12-7
	 */
	function refreshUserCookie(){
		var cookies = (document.cookie).split("; ");
		if(null != cookies){
			for(i=0; i<cookies.length; i++){				
					var cookie = cookies[i].split("=");				
					if(null!=cookie[1] && cookie[1].substring(0,1) == "\""){
						cookie[1] = cookie[1].substr(1,cookie[1].length - 2);
						document.cookie = cookie[0]+"="+cookie[1]+"; path=/; expires="+(new Date(new Date().getTime()+(1000*60*60*24*7))).toGMTString();								
					}
				}
		}
	}