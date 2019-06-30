/*
 *拓展功能，portal....
 *Ext.ux.Portal直接拷贝之ext-2.2\examples\portal\Portal.js文件
 *----------------------------------------------Start---------------------------------------------------
 */

Ext.ux.Portal = Ext.extend(Ext.Panel, {
    layout: 'column',
    autoScroll:true,
    cls:'x-portal',
    defaultType: 'portalcolumn',
    
    initComponent : function(){
        Ext.ux.Portal.superclass.initComponent.call(this);
        this.addEvents({
            validatedrop:true,
            beforedragover:true,
            dragover:true,
            beforedrop:true,
            drop:true
        });
    },

    initEvents : function(){
        Ext.ux.Portal.superclass.initEvents.call(this);
        this.dd = new Ext.ux.Portal.DropZone(this, this.dropConfig);
    },
    
    beforeDestroy: function() {
        if(this.dd){
            this.dd.unreg();
        }
        Ext.ux.Portal.superclass.beforeDestroy.call(this);
    }
});
Ext.reg('portal', Ext.ux.Portal);


Ext.ux.Portal.DropZone = function(portal, cfg){
    this.portal = portal;
    Ext.dd.ScrollManager.register(portal.body);
    Ext.ux.Portal.DropZone.superclass.constructor.call(this, portal.bwrap.dom, cfg);
    portal.body.ddScrollConfig = this.ddScrollConfig;
};

Ext.extend(Ext.ux.Portal.DropZone, Ext.dd.DropTarget, {
    ddScrollConfig : {
        vthresh: 50,
        hthresh: -1,
        animate: true,
        increment: 200
    },

    createEvent : function(dd, e, data, col, c, pos){
        return {
            portal: this.portal,
            panel: data.panel,
            columnIndex: col,
            column: c,
            position: pos,
            data: data,
            source: dd,
            rawEvent: e,
            status: this.dropAllowed
        };
    },

    notifyOver : function(dd, e, data){
        var xy = e.getXY(), portal = this.portal, px = dd.proxy;

        // case column widths
        if(!this.grid){
            this.grid = this.getGrid();
        }

        // handle case scroll where scrollbars appear during drag
        var cw = portal.body.dom.clientWidth;
        if(!this.lastCW){
            this.lastCW = cw;
        }else if(this.lastCW != cw){
            this.lastCW = cw;
            portal.doLayout();
            this.grid = this.getGrid();
        }

        // determine column
        var col = 0, xs = this.grid.columnX, cmatch = false;
        for(var len = xs.length; col < len; col++){
            if(xy[0] < (xs[col].x + xs[col].w)){
                cmatch = true;
                break;
            }
        }
        // no match, fix last index
        if(!cmatch){
            col--;
        }

        // find insert position
        var p, match = false, pos = 0,
            c = portal.items.itemAt(col),
            items = c.items.items;

        for(var len = items.length; pos < len; pos++){
            p = items[pos];
            var h = p.el.getHeight();
            if(h !== 0 && (p.el.getY()+(h/2)) > xy[1]){
                match = true;
                break;
            }
        }

        var overEvent = this.createEvent(dd, e, data, col, c,
                match && p ? pos : c.items.getCount());

        if(portal.fireEvent('validatedrop', overEvent) !== false &&
           portal.fireEvent('beforedragover', overEvent) !== false){

            // make sure proxy width is fluid
            px.getProxy().setWidth('auto');

            if(p){
                px.moveProxy(p.el.dom.parentNode, match ? p.el.dom : null);
            }else{
                px.moveProxy(c.el.dom, null);
            }

            this.lastPos = {c: c, col: col, p: match && p ? pos : false};
            this.scrollPos = portal.body.getScroll();

            portal.fireEvent('dragover', overEvent);

            return overEvent.status;;
        }else{
            return overEvent.status;
        }

    },

    notifyOut : function(){
        delete this.grid;
    },

    notifyDrop : function(dd, e, data){
        delete this.grid;
        if(!this.lastPos){
            return;
        }
        var c = this.lastPos.c, col = this.lastPos.col, pos = this.lastPos.p;

        var dropEvent = this.createEvent(dd, e, data, col, c,
                pos !== false ? pos : c.items.getCount());

        if(this.portal.fireEvent('validatedrop', dropEvent) !== false &&
           this.portal.fireEvent('beforedrop', dropEvent) !== false){

            dd.proxy.getProxy().remove();
            dd.panel.el.dom.parentNode.removeChild(dd.panel.el.dom);
            if(pos !== false){
                c.insert(pos, dd.panel);
            }else{
                c.add(dd.panel);
            }
            
            c.doLayout();

            this.portal.fireEvent('drop', dropEvent);

            // scroll position is lost on drop, fix it
            var st = this.scrollPos.top;
            if(st){
                var d = this.portal.body.dom;
                setTimeout(function(){
                    d.scrollTop = st;
                }, 10);
            }

        }
        delete this.lastPos;
    },

    // internal cache of body and column coords
    getGrid : function(){
        var box = this.portal.bwrap.getBox();
        box.columnX = [];
        this.portal.items.each(function(c){
             box.columnX.push({x: c.el.getX(), w: c.el.getWidth()});
        });
        return box;
    },

    // unregister the dropzone from ScrollManager
    unreg: function() {
        //Ext.dd.ScrollManager.unregister(this.portal.body);
        Ext.ux.Portal.DropZone.superclass.unreg.call(this);
    }
});

//-----------------------------------------Ext.ux.Portal End--------------------------------------------


/*
 *拓展功能，portalColumn....
 * Ext.ux.PortalColumn直接拷贝之ext-2.2\examples\portal\PortalColumn.js文件
 *----------------------------------------------Start---------------------------------------------------
 */
 Ext.ux.PortalColumn = Ext.extend(Ext.Container, {
    layout: 'anchor',
    autoEl: 'div',
    defaultType: 'portlet',
    cls:'x-portal-column'
});
Ext.reg('portalcolumn', Ext.ux.PortalColumn);

 //------------------------------- Ext.ux.PortalColumn End----------------------------------------------


 /*
 *拓展功能，portlet....
 * Ext.ux.Portlet直接拷贝之ext-2.2\examples\portal\Portlet.js文件
 *----------------------------------------------Start---------------------------------------------------
 */
Ext.ux.Portlet = Ext.extend(Ext.Panel, {
    anchor: '100%',
    frame:true,
    collapsible:true,
    draggable:true,
    cls:'x-portlet'
});
Ext.reg('portlet', Ext.ux.Portlet);

 //------------------------------- Ext.ux.Portlet End---------------------------------------------------


 /*
 *拓展功能，iframe....
 * 该组件用于iframe内嵌TABPANEL中。由该组件载入的iframe均能访问父PANEL的变量。
 *----------------------------------------------Start---------------------------------------------------
 */
Ext.ux.IFrameComponent = Ext.extend(Ext.BoxComponent, {
	onRender : function(ct, position) {
		this.el = ct.createChild({
			tag : 'iframe',
			name : this.id,
			id : 'iframe-' + this.id,
			frameBorder : 0,
			src : this.url
		});
	}
});

Ext.reg('iFrameComponent',Ext.ux.IFrameComponent);
 //------------------------------- Ext.ux.IFrameComponent End---------------------------------------------------



//扩展grid toolbar功能

 //------------------------------- Ext.ux.PageSizePlugin Start---------------------------------------------------
 
 

//导出时参数的处理
function renderParamForExport(export_grid_Name){
	var grid = Ext.getCmp(export_grid_Name); 
	var columnsLength = grid.colModel.getColumnCount();
	var tempFieldName = '';
	var tempTitle = '';
	var tempWidth = '';
	for(var i=0;i<columnsLength;i++){
         var columnObject = grid.colModel.getColumnById(i);
	 if(columnObject!=undefined){
	 	//dataIndex里有view字符串出现的都不要导出
	 	if(!columnObject.hidden&&columnObject.dataIndex.indexOf('view') < 0){
		 var dataIndex = columnObject.dataIndex;
		 var editor = columnObject.editor;
		 if(editor != undefined){
		      var editorField = editor.field;
			 if(editorField != undefined && editorField instanceof Ext.form.ComboBox){
//				alert(columnObject.editor.field.displayField);
		 		//当editor中存在combobox 下拉框时，判断column的名字里带的'.'或者'___'
				//目前都是'___'的，将其转化为___+displayField的形式。
				if(dataIndex.indexOf('.')> -1){
//					alert(' . ' + dataIndex.indexOf('.'));
					dataIndex = dataIndex.substr(0, dataIndex.indexOf('.')) + '.' + editorField.displayField;
				}else if(dataIndex.indexOf('___')> -1){
					
					dataIndex = dataIndex.substr(0, dataIndex.indexOf('___')) + '___' + editorField.displayField;
					
				}else{
				   dataIndex = displayField;
				}	
			 }
		 }
			tempFieldName =  tempFieldName + dataIndex + '_@_';
			tempTitle = tempTitle + columnObject.header + '_@_';
			tempWidth = tempWidth + columnObject.width + '_@_';
			 }
	   }
	   
	}
	contextDataFieldName = tempFieldName;
	columnWidth = tempWidth;
	contextDataTitle = tempTitle;
	 
	contextDataName = grid.contextDataName;
	
}
//导出excel
function exportExcel(export_grid_Name){
	 
	var grid = Ext.getCmp(export_grid_Name); 

	//***renderParamForExport liangg 2009.5.4 去除全局变量的改动
	var columnsLength = grid.colModel.getColumnCount();
	var contextDataFieldName = '';
	var contextDataTitle = '';
	var columnWidth = '';
	var contextDataName = grid.contextDataName;
	for(var i=0;i<columnsLength;i++){
         var columnObject = grid.colModel.getColumnById(i);
		 if(columnObject!=undefined){
	 	//dataIndex里有view字符串出现的都不要导出
	 		if(!columnObject.hidden&&columnObject.dataIndex.indexOf('view') < 0){
				var dataIndex = columnObject.dataIndex;
				var editor = columnObject.editor;
				if(editor != undefined){
					var editorField = editor.field;
					if(editorField != undefined && editorField instanceof Ext.form.ComboBox){
//					alert(columnObject.editor.field.displayField);
		 			//当editor中存在combobox 下拉框时，判断column的名字里带的'.'或者'___'
					//目前都是'___'的，将其转化为___+displayField的形式。
						if(dataIndex.indexOf('.')> -1){
//							alert(' . ' + dataIndex.indexOf('.'));
							dataIndex = dataIndex.substr(0, dataIndex.indexOf('.')) + '.' + editorField.displayField;
						}else if(dataIndex.indexOf('___')> -1){
					
							dataIndex = dataIndex.substr(0, dataIndex.indexOf('___')) + '___' + editorField.displayField;
					
						}else{
							dataIndex = displayField;
						}	
					}
				 }
			 contextDataFieldName =  contextDataFieldName + dataIndex + '_@_';
			 contextDataTitle = contextDataTitle + columnObject.header + '_@_';
			 columnWidth = columnWidth + columnObject.width + '_@_';
			}
		}
	   
	}
	//***
	var nowDate = new Date();
	var fileName = 'excelFile'+nowDate.getTime()+'.xls';
	var contentType = 'application/vnd.ms-excel';
	var pageSize = grid.pageSize;
	 
	Ext.Ajax.request
	 ({
		method: 'POST',
		url: grid.urlForExprtFile,
       params:{fileName:fileName,excelColumnWidth:columnWidth,exprt_excel:'Y',contextDataName:contextDataName,contextDataFieldName:contextDataFieldName,contextDataTitle:contextDataTitle, limit:pageSize},
		success: function(response,options) {
			downloadFile(fileName,contentType);
           }
	 });
     
  }
//导出word
  function exportWord(export_grid_Name){
	var grid = Ext.getCmp(export_grid_Name); 

	//***renderParamForExport liangg 2009.5.4 去除全局变量的改动
	var columnsLength = grid.colModel.getColumnCount();
	var contextDataFieldName = '';
	var contextDataTitle = '';
	var columnWidth = '';
	var contextDataName = grid.contextDataName;
	for(var i=0;i<columnsLength;i++){
         var columnObject = grid.colModel.getColumnById(i);
		 if(columnObject!=undefined){
	 	//dataIndex里有view字符串出现的都不要导出
	 		if(!columnObject.hidden&&columnObject.dataIndex.indexOf('view') < 0){
				var dataIndex = columnObject.dataIndex;
				var editor = columnObject.editor;
				if(editor != undefined){
					var editorField = editor.field;
					if(editorField != undefined && editorField instanceof Ext.form.ComboBox){
//					alert(columnObject.editor.field.displayField);
		 			//当editor中存在combobox 下拉框时，判断column的名字里带的'.'或者'___'
					//目前都是'___'的，将其转化为___+displayField的形式。
						if(dataIndex.indexOf('.')> -1){
//							alert(' . ' + dataIndex.indexOf('.'));
							dataIndex = dataIndex.substr(0, dataIndex.indexOf('.')) + '.' + editorField.displayField;
						}else if(dataIndex.indexOf('___')> -1){
					
							dataIndex = dataIndex.substr(0, dataIndex.indexOf('___')) + '___' + editorField.displayField;
					
						}else{
							dataIndex = displayField;
						}	
					}
				 }
			 contextDataFieldName =  contextDataFieldName + dataIndex + '_@_';
			 contextDataTitle = contextDataTitle + columnObject.header + '_@_';
			 columnWidth = columnWidth + columnObject.width + '_@_';
			}
		}
	   
	}
	//***
	var nowDate = new Date();
	var fileName = 'wordFile'+nowDate.getTime()+'.doc';
	var contentType = 'application/vnd.ms-word';
	var pageSize = grid.pageSize;
	Ext.Ajax.request
	 ({
		method: 'POST',
		url: grid.urlForExprtFile,
        params:{fileName:fileName,wordColumnWidth:columnWidth,exprt_word:'Y',contexktDataName:contextDataName,contextDataFieldName:contextDataFieldName,contextDataTitle:contextDataTitle, limit:pageSize},
		success: function(response,options) {
          downloadFile(fileName,contentType);
		   }
	 });
  }
//导出Pdf
  function exportPdf(export_grid_Name){
  	 
	var grid = Ext.getCmp(export_grid_Name); 

	//***renderParamForExport liangg 2009.5.4 去除全局变量的改动
	var columnsLength = grid.colModel.getColumnCount();
	var contextDataFieldName = '';
	var contextDataTitle = '';
	var columnWidth = '';
	var contextDataName = grid.contextDataName;
	for(var i=0;i<columnsLength;i++){
         var columnObject = grid.colModel.getColumnById(i);
		 if(columnObject!=undefined){
	 	//dataIndex里有view字符串出现的都不要导出
	 		if(!columnObject.hidden&&columnObject.dataIndex.indexOf('view') < 0){
				var dataIndex = columnObject.dataIndex;
				var editor = columnObject.editor;
				if(editor != undefined){
					var editorField = editor.field;
					if(editorField != undefined && editorField instanceof Ext.form.ComboBox){
//					alert(columnObject.editor.field.displayField);
		 			//当editor中存在combobox 下拉框时，判断column的名字里带的'.'或者'___'
					//目前都是'___'的，将其转化为___+displayField的形式。
						if(dataIndex.indexOf('.')> -1){
//							alert(' . ' + dataIndex.indexOf('.'));
							dataIndex = dataIndex.substr(0, dataIndex.indexOf('.')) + '.' + editorField.displayField;
						}else if(dataIndex.indexOf('___')> -1){
					
							dataIndex = dataIndex.substr(0, dataIndex.indexOf('___')) + '___' + editorField.displayField;
					
						}else{
							dataIndex = displayField;
						}	
					}
				 }
			 contextDataFieldName =  contextDataFieldName + dataIndex + '_@_';
			 contextDataTitle = contextDataTitle + columnObject.header + '_@_';
			 columnWidth = columnWidth + columnObject.width + '_@_';
			}
		}
	   
	}
	//***

	var nowDate = new Date();
	var fileName = 'pdfFile'+nowDate.getTime()+'.pdf';
	var contentType = 'application/vnd.ms-pdf';
	var pageSize = grid.pageSize;
	Ext.Ajax.request
	 ({
		method: 'POST',
		url: grid.urlForExprtFile,
        params:{fileName:fileName,pdfColumnWidth:columnWidth,exprt_pdf:'Y',contextDataName:contextDataName,contextDataFieldName:contextDataFieldName,contextDataTitle:contextDataTitle, limit:pageSize},
		success: function(response,options) {
          downloadFile(fileName,contentType);
		   }
	 });
  }

//kukuxia.kevin.hw 2009-04-20 解决bravo页面在没有form标签只有grid标签的情况下无法导出
 function downloadFile(fileName,contentType){
	 //当Grid所在页面没有form，新建form标签
	 if(document.forms[0]==undefined){
	   var submitForm = document.createElement("FORM");
       document.body.appendChild(submitForm);
	 }
    document.forms[0].action = "exportFile.action?fileName="+fileName+"&contentType="+contentType;
	document.forms[0].method = 'POST';
    document.forms[0].target = '_self';
	document.forms[0].submit();
 }

 function exportMenus(export_grid_Name){
	   var MenuExcel = new Ext.menu.Item({   

			id:'MenuExcel'+export_grid_Name
			,iconCls:'excel'
			,handler:menuHandlerEval
			,handlerExpress:'exportExcel(\''+export_grid_Name+'\')'
			,text:'导出excel'
      });
		
	   var MenuWord = new Ext.menu.Item({   

			id:'MenuWord'+export_grid_Name
			,iconCls:'word'
			,handler:menuHandlerEval
			,handlerExpress:'exportWord(\''+export_grid_Name+'\')'
			,text:'导出word'
	  });
		
	   var MenuPdf = new Ext.menu.Item({   

			id:'MenuPdf'+export_grid_Name
			,iconCls:'pdf'
			,handler:menuHandlerEval
			,handlerExpress:'exportPdf(\''+export_grid_Name+'\')'
			,text:'导出pdf'
	  });

	   var exportButton = new Ext.Toolbar.MenuButton({    
			id:'MenuExp'+export_grid_Name
			,iconCls:'output'
			,text:'导出'
			,menu:{items:[MenuExcel,MenuWord,MenuPdf]}
	   });
     
	 return exportButton;
 }

function menuHandlerEval(menuObj){
	if (menuObj.handlerExpress)
	{
		eval(menuObj.handlerExpress);
	}
}

Ext.ux.PageSizePlugin = function(export_grid_Name) {
    Ext.ux.PageSizePlugin.superclass.constructor.call(this, {
        store: new Ext.data.SimpleStore({
            fields: ['text', 'value'],
            data: [['10  ', 10], ['20  ', 20], ['30  ', 30], ['50  ', 50], ['100  ', 100], ['500  ', 500]]
        }),
        mode: 'local',
        displayField: 'text',
        valueField: 'value',
        editable: false,
        allowBlank: false,
        triggerAction: 'all',
        width: 40,
	    export_grid_Name:export_grid_Name
    });
};

Ext.extend(Ext.ux.PageSizePlugin, Ext.form.ComboBox, {
    init: function(paging) {
        paging.on('render', this.onInitView, this);
    },
    
    onInitView: function(paging) {
        paging.add('-',
            this,
            '&nbsp;条记录每页','&nbsp;&nbsp;&nbsp;&nbsp;',exportMenus(this.export_grid_Name)
        );
        this.setValue(paging.pageSize);
        this.on('select', this.onPageSizeChanged, paging);
    },
    
    onPageSizeChanged: function(combo) {
		var gridName = combo.export_grid_Name;
		var grid = Ext.getCmp(gridName);
 
        this.pageSize = parseInt(combo.getValue());
		//处理导出时使用到的gird.pageSize参数   liangg 2009.5.4 
		grid.pageSize = this.pageSize;
		 
        this.doLoad(0);
    }
});
 //------------------------------- Ext.ux.PageSizePlugin End---------------------------------------------------


//EditorGridPanel中存放ComboBox扩展功能
Ext.ux.comboBoxRenderer = function(combo) {
	return function(id) {
	var body = Ext.getCmp(combo);
    var idx = body.store.find(body.valueField, new RegExp( "^"+id+"$" ));
    var rec = body.store.getAt(idx);
    return (rec == null ? '' : rec.get(body.displayField));
  };
} 

//EditorGridPanel中存放ComboBoxTree扩展功能
Ext.ux.comboBoxTreeRenderer = function(comboTree) {
	return function(id) {
   if(id!=''&&id!=undefined){
	 var body = Ext.getCmp(comboTree);
     var displayValue = body.getRawValue();
	 var hiddenValue = body.getValue();
	     return displayValue;
   }
    return '';
  };
} 

// Very simple plugin for adding a close context menu to tabs
Ext.ux.TabCloseMenu = function(){
    var tabs, menu, ctxItem;
    this.init = function(tp){
        tabs = tp;
        tabs.on('contextmenu', onContextMenu);
    }

    function onContextMenu(ts, item, e){
        if(!menu){ // create context menu on first right click
            menu = new Ext.menu.Menu([{
                id: tabs.id + '-close',
                text: '关闭',
                handler : function(){
                    tabs.remove(ctxItem);
                }
            },{
                id: tabs.id + '-close-others',
                text: '关闭其他选项卡',
                handler : function(){
                    tabs.items.each(function(item){
                        if(item.closable && item != ctxItem){
                            tabs.remove(item);
                        }
                    });
                }
            }]);
        }
        ctxItem = item;
        var items = menu.items;
        items.get(tabs.id + '-close').setDisabled(!item.closable);
        var disableOthers = true;
        tabs.items.each(function(){
            if(this != item && this.closable){
                disableOthers = false;
                return false;
            }
        });
        items.get(tabs.id + '-close-others').setDisabled(disableOthers);
        menu.showAt(e.getPoint());
    }
};

//在Ext2.2的Ext.form.FormPanel中如果有RadioGroup或者CheckboxGroup，那么FormPanel.form.setValues方法对这2个东东内部的radio和checkbox无法动态赋值，需要对Ext.form.BasicForm的findField方法进行修正,参考: http://hi.baidu.com/gdancer/blog/item/575cdceace0f50d4d439c9d6.html
Ext.override(Ext.form.BasicForm,{   
     findField : function(id){  
		
        var field = this.items.get(id);  
		
        if(!field){   
            this.items.each(function(f){   
                if(f.isXType('radiogroup')||f.isXType('checkboxgroup')){   
 
                     f.items.each(function(c){  
						 
                        if(c.isFormField && (c.dataIndex == id || c.id == id || c.getName() == id)){   
                             field = c;   
                            return false;   
                         }   
                     });   
                 }   
                                   
                if(f.isFormField && (f.dataIndex == id || f.id == id || f.getName() == id)){   
                     field = f;   
                    return false;   
                 }   
             });   
         }   
		 
        return field || null;   
     }    
}); 

//修改Ext.MessageBox的minWidth为200,防止以后更新高版本的extjs的resource文件,将此ext-all.js文件覆盖，导致修改丢失
Ext.MessageBox = function(){
    var dlg, opt, mask, waitTimer;
    var bodyEl, msgEl, textboxEl, textareaEl, progressBar, pp, iconEl, spacerEl;
    var buttons, activeTextEl, bwidth, iconCls = '';

        var handleButton = function(button){
        if(dlg.isVisible()){
            dlg.hide();
            Ext.callback(opt.fn, opt.scope||window, [button, activeTextEl.dom.value], 1);
        }
    };

        var handleHide = function(){
        if(opt && opt.cls){
            dlg.el.removeClass(opt.cls);
        }
        progressBar.reset();
    };

        var handleEsc = function(d, k, e){
        if(opt && opt.closable !== false){
            dlg.hide();
        }
        if(e){
            e.stopEvent();
        }
    };

        var updateButtons = function(b){
        var width = 0;
        if(!b){
            buttons["ok"].hide();
            buttons["cancel"].hide();
            buttons["yes"].hide();
            buttons["no"].hide();
            return width;
        }
        dlg.footer.dom.style.display = '';
        for(var k in buttons){
            if(typeof buttons[k] != "function"){
                if(b[k]){
                    buttons[k].show();
                    buttons[k].setText(typeof b[k] == "string" ? b[k] : Ext.MessageBox.buttonText[k]);
                    width += buttons[k].el.getWidth()+15;
                }else{
                    buttons[k].hide();
                }
            }
        }
        return width;
    };

    return {
        
        getDialog : function(titleText){
           if(!dlg){
                dlg = new Ext.Window({
                    autoCreate : true,
                    title:titleText,
                    resizable:false,
                    constrain:true,
                    constrainHeader:true,
                    minimizable : false,
                    maximizable : false,
                    stateful: false,
                    modal: true,
                    shim:true,
                    buttonAlign:"center",
                    width:400,
                    height:100,
                    minHeight: 80,
                    plain:true,
                    footer:true,
                    closable:true,
                    close : function(){
                        if(opt && opt.buttons && opt.buttons.no && !opt.buttons.cancel){
                            handleButton("no");
                        }else{
                            handleButton("cancel");
                        }
                    }
                });
                buttons = {};
                var bt = this.buttonText;
                                buttons["ok"] = dlg.addButton(bt["ok"], handleButton.createCallback("ok"));
                buttons["yes"] = dlg.addButton(bt["yes"], handleButton.createCallback("yes"));
                buttons["no"] = dlg.addButton(bt["no"], handleButton.createCallback("no"));
                buttons["cancel"] = dlg.addButton(bt["cancel"], handleButton.createCallback("cancel"));
                buttons["ok"].hideMode = buttons["yes"].hideMode = buttons["no"].hideMode = buttons["cancel"].hideMode = 'offsets';
                dlg.render(document.body);
                dlg.getEl().addClass('x-window-dlg');
                mask = dlg.mask;
                bodyEl = dlg.body.createChild({
                    html:'<div class="ext-mb-icon"></div><div class="ext-mb-content"><span class="ext-mb-text"></span><br /><div class="ext-mb-fix-cursor"><input type="text" class="ext-mb-input" /><textarea class="ext-mb-textarea"></textarea></div></div>'
                });
                iconEl = Ext.get(bodyEl.dom.firstChild);
                var contentEl = bodyEl.dom.childNodes[1];
                msgEl = Ext.get(contentEl.firstChild);
                textboxEl = Ext.get(contentEl.childNodes[2].firstChild);
                textboxEl.enableDisplayMode();
                textboxEl.addKeyListener([10,13], function(){
                    if(dlg.isVisible() && opt && opt.buttons){
                        if(opt.buttons.ok){
                            handleButton("ok");
                        }else if(opt.buttons.yes){
                            handleButton("yes");
                        }
                    }
                });
                textareaEl = Ext.get(contentEl.childNodes[2].childNodes[1]);
                textareaEl.enableDisplayMode();
                progressBar = new Ext.ProgressBar({
                    renderTo:bodyEl
                });
               bodyEl.createChild({cls:'x-clear'});
            }
            return dlg;
        },

        
        updateText : function(text){
            if(!dlg.isVisible() && !opt.width){
                dlg.setSize(this.maxWidth, 100);             }
            msgEl.update(text || '&#160;');

            var iw = iconCls != '' ? (iconEl.getWidth() + iconEl.getMargins('lr')) : 0;
            var mw = msgEl.getWidth() + msgEl.getMargins('lr');
            var fw = dlg.getFrameWidth('lr');
            var bw = dlg.body.getFrameWidth('lr');
            if (Ext.isIE && iw > 0){
                                                iw += 3;
            }
            var w = Math.max(Math.min(opt.width || iw+mw+fw+bw, this.maxWidth),
                        Math.max(opt.minWidth || this.minWidth, bwidth || 0));

            if(opt.prompt === true){
                activeTextEl.setWidth(w-iw-fw-bw);
            }
            if(opt.progress === true || opt.wait === true){
                progressBar.setSize(w-iw-fw-bw);
            }
            dlg.setSize(w, 'auto').center();
            return this;
        },

        
        updateProgress : function(value, progressText, msg){
            progressBar.updateProgress(value, progressText);
            if(msg){
                this.updateText(msg);
            }
            return this;
        },

        
        isVisible : function(){
            return dlg && dlg.isVisible();
        },

        
        hide : function(){
            if(this.isVisible()){
                dlg.hide();
                handleHide();
            }
            return this;
        },

        
        show : function(options){
            if(this.isVisible()){
                this.hide();
            }
            opt = options;
            var d = this.getDialog(opt.title || "&#160;");

            d.setTitle(opt.title || "&#160;");
            var allowClose = (opt.closable !== false && opt.progress !== true && opt.wait !== true);
            d.tools.close.setDisplayed(allowClose);
            activeTextEl = textboxEl;
            opt.prompt = opt.prompt || (opt.multiline ? true : false);
            if(opt.prompt){
                if(opt.multiline){
                    textboxEl.hide();
                    textareaEl.show();
                    textareaEl.setHeight(typeof opt.multiline == "number" ?
                        opt.multiline : this.defaultTextHeight);
                    activeTextEl = textareaEl;
                }else{
                    textboxEl.show();
                    textareaEl.hide();
                }
            }else{
                textboxEl.hide();
                textareaEl.hide();
            }
            activeTextEl.dom.value = opt.value || "";
            if(opt.prompt){
                d.focusEl = activeTextEl;
            }else{
                var bs = opt.buttons;
                var db = null;
                if(bs && bs.ok){
                    db = buttons["ok"];
                }else if(bs && bs.yes){
                    db = buttons["yes"];
                }
                if (db){
                    d.focusEl = db;
                }
            }
            if(opt.iconCls){
              d.setIconClass(opt.iconCls);
            }
            this.setIcon(opt.icon);
            bwidth = updateButtons(opt.buttons);
            progressBar.setVisible(opt.progress === true || opt.wait === true);
            this.updateProgress(0, opt.progressText);
            this.updateText(opt.msg);
            if(opt.cls){
                d.el.addClass(opt.cls);
            }
            d.proxyDrag = opt.proxyDrag === true;
            d.modal = opt.modal !== false;
            d.mask = opt.modal !== false ? mask : false;
            if(!d.isVisible()){
                                document.body.appendChild(dlg.el.dom);
                d.setAnimateTarget(opt.animEl);
                d.show(opt.animEl);
            }

                        d.on('show', function(){
                if(allowClose === true){
                    d.keyMap.enable();
                }else{
                    d.keyMap.disable();
                }
            }, this, {single:true});

            if(opt.wait === true){
                progressBar.wait(opt.waitConfig);
            }
            return this;
        },

        
        setIcon : function(icon){
            if(icon && icon != ''){
                iconEl.removeClass('x-hidden');
                iconEl.replaceClass(iconCls, icon);
                iconCls = icon;
            }else{
                iconEl.replaceClass(iconCls, 'x-hidden');
                iconCls = '';
            }
            return this;
        },

        
        progress : function(title, msg, progressText){
            this.show({
                title : title,
                msg : msg,
                buttons: false,
                progress:true,
                closable:false,
                minWidth: this.minProgressWidth,
                progressText: progressText
            });
            return this;
        },

        
        wait : function(msg, title, config){
            this.show({
                title : title,
                msg : msg,
                buttons: false,
                closable:false,
                wait:true,
                modal:true,
                minWidth: this.minProgressWidth,
                waitConfig: config
            });
            return this;
        },

        
        alert : function(title, msg, fn, scope){
            this.show({
                title : title,
                msg : msg,
                buttons: this.OK,
                fn: fn,
                scope : scope
            });
            return this;
        },

        
        confirm : function(title, msg, fn, scope){
            this.show({
                title : title,
                msg : msg,
                buttons: this.YESNO,
                fn: fn,
                scope : scope,
                icon: this.QUESTION
            });
            return this;
        },

        
        prompt : function(title, msg, fn, scope, multiline, value){
            this.show({
                title : title,
                msg : msg,
                buttons: this.OKCANCEL,
                fn: fn,
                minWidth:250,
                scope : scope,
                prompt:true,
                multiline: multiline,
                value: value
            });
            return this;
        },

        
        OK : {ok:true},
        
        CANCEL : {cancel:true},
        
        OKCANCEL : {ok:true, cancel:true},
        
        YESNO : {yes:true, no:true},
        
        YESNOCANCEL : {yes:true, no:true, cancel:true},
        
        INFO : 'ext-mb-info',
        
        WARNING : 'ext-mb-warning',
        
        QUESTION : 'ext-mb-question',
        
        ERROR : 'ext-mb-error',

        
        defaultTextHeight : 75,
        
        maxWidth : 600,
        
        minWidth : 200,
        
        minProgressWidth : 250,
        
        buttonText : {
            ok : "OK",
            cancel : "Cancel",
            yes : "Yes",
            no : "No"
        }
    };
}();

/*扩展带clear按钮的ComboBox */
Ext.form.ClearableComboBox = Ext.extend(Ext.form.ComboBox, {
    initComponent: function(){
        Ext.form.ClearableComboBox.superclass.initComponent.call(this);
        this.addEvents('clear');
        
        this.triggerConfig = {
            tag:'span',
            cls:'x-form-twin-triggers',
            style:'padding-right:2px',
            cn:[
                {tag: "img", src: Ext.BLANK_IMAGE_URL, cls: "x-form-trigger"},
                {tag: "img", src: Ext.BLANK_IMAGE_URL, cls: "x-form-trigger x-form-clear-trigger"}
            ]
        };
    },

    getTrigger: function(index){
        return this.triggers[index];
    },

    initTrigger: function(){
        var ts = this.trigger.select('.x-form-trigger', true);
        this.wrap.setStyle('overflow', 'hidden');
        var triggerField = this;
        ts.each(function(t, all, index){
            t.hide = function(){
                var w = triggerField.wrap.getWidth();
                this.dom.style.display = 'none';
                triggerField.el.setWidth(w-triggerField.trigger.getWidth());
            };
            t.show = function(){
                var w = triggerField.wrap.getWidth();
                this.dom.style.display = '';
                triggerField.el.setWidth(w-triggerField.trigger.getWidth());
            };
            var triggerIndex = 'Trigger'+(index+1);

            if(this['hide'+triggerIndex]){
                t.dom.style.display = 'none';
            }
            t.on("click", this['on'+triggerIndex+'Click'], this, {preventDefault:true});
            t.addClassOnOver('x-form-trigger-over');
            t.addClassOnClick('x-form-trigger-click');
        }, this);
        this.triggers = ts.elements;
    },

    onTrigger1Click: function() {this.onTriggerClick()},
    onTrigger2Click: function() {this.clearValue(); this.fireEvent('clear', this)}
});

/*
 *拓展功能, 实现了MultiSelect控件(barvoHome为当前路径 见com.bravo.core.ui.dataRender.web.DynamicJsAction.java)
 *----------------------------------------------Start------------------------------------------------------
 */
  document.write('<script type="text/javascript" src='+ bravoHome + '/widgets/ext-2.2/ux/MultiSelect.js></script>'); 

//------------------------------- Ext.ux.Multiselect End---------------------------------------------------


/*
 *拓展功能, 实现了ItemSelector控件(barvoHome为当前路径 见com.bravo.core.ui.dataRender.web.DynamicJsAction.java)
 *----------------------------------------------Start------------------------------------------------------
 */
  document.write('<script type="text/javascript" src='+ bravoHome + '/widgets/ext-2.2/ux/DDView.js></script>'); 

//---------------------------------------------- End---------------------------------------------------



/*
 *拓展功能, 实现了ItemSelector控件(barvoHome为当前路径 见com.bravo.core.ui.dataRender.web.DynamicJsAction.java)
 *----------------------------------------------Start------------------------------------------------------
 */
  document.write('<script type="text/javascript" src='+ bravoHome + '/widgets/ext-2.2/ux/ItemSelector.js></script>'); 

//------------------------------- Ext.ux.ItemSelector End---------------------------------------------------

/*
 *拓展功能, 实现了UploadDialogButton控件(barvoHome为当前路径 见com.bravo.core.ui.dataRender.web.DynamicJsAction.java)
 *----------------------------------------------Start------------------------------------------------------
 */

  document.write('<script type="text/javascript" src='+ bravoHome + '/widgets/ext-2.2/ux/Ext.ux.UploadDialog.js></script>');

//------------------------------- Ext.ux.ItemSelector End---------------------------------------------------


/*
 *拓展功能, 实现了带checkBox的Tree控件(barvoHome为当前路径 见com.bravo.core.ui.dataRender.web.DynamicJsAction.java)
 *----------------------------------------------Start------------------------------------------------------
 */

  document.write('<script type="text/javascript" src='+ bravoHome + '/widgets/ext-2.2/ux/TreeCheckNodeUI.js></script>');

//------------------------------- TreeCheckNodeUI End---------------------------------------------------


/*
 *拓展功能, 实现了带comboBoxTree的Tree控件(barvoHome为当前路径 见com.bravo.core.ui.dataRender.web.DynamicJsAction.java)
 *----------------------------------------------Start------------------------------------------------------
 */

  document.write('<script type="text/javascript" src='+ bravoHome + '/widgets/ext-2.2/ux/ComboBoxTree.js></script>');

//--------------------------------------- ComboBoxTreeUI End---------------------------------------------------


/*
 *拓展功能, 实现了带DateField和TimeField的DateTime控件(barvoHome为当前路径 见com.bravo.core.ui.tags.form.DateTime.java)
 *----------------------------------------------Start---------------------------------------------------------
 */

  document.write('<script type="text/javascript" src='+ bravoHome + '/widgets/My97DatePicker/WdatePicker.js></script>');

//------------------------------------------ DateTimeUI End---------------------------------------------------

/*
 *dateTime.js用到的css文件  liangg  09.03.09
 *----------------------------------------------Start---------------------------------------------------------
 */

  document.write('<link rel="stylesheet" type="text/css" href='+ bravoHome + '/widgets/ext-2.2/ux/datetime.css></script>');

//------------------------------------------ datetime.css End---------------------------------------------------

/*
 *为grid提供专用的panding解决翻页时查询参数丢失问题  jason.wu  09.05.06
 *----------------------------------------------Start---------------------------------------------------------
 */

document.write('<script type="text/javascript" src='+ bravoHome + '/widgets/ext-2.2/ux/GridPagingToolbar.js></script>');

//------------------------------------------ datetime.css End---------------------------------------------------
