/********** CONSTRUCTOR ******
 * Parameters: as per Ext.DatePicker
 ****/
DatetimePicker = function(config){
	/** Call superclass constructor **/
	DatetimePicker.superclass.constructor.call(this, config);
};

Ext.extend(DatetimePicker, Ext.DatePicker, {

	/**
	* Method Name: onRender
	* Description: as per Ext.DatePicker's onRender, except renders year in its own cell with arrow-changers in additional columns
	* Parameters: as per Ext.DatePicker's onRender
	* Returns: n/a
	* Throws: n/a
	*/
    selectToday : function(){
        this.setValue(new Date().clearTime());
		var val1 = this.value;
		val1.setHours(this.theHours);
		val1.setMinutes(this.theMinutes);
        this.fireEvent("select", this, val1);
    },
    handleDateClick : function(e, t){
        e.stopEvent();
        if(t.dateValue && !Ext.fly(t.parentNode).hasClass("x-date-disabled")){
            this.setValue(new Date(t.dateValue));
			var val1 = this.value;
			val1.setHours(this.theHours);
			val1.setMinutes(this.theMinutes);
            this.fireEvent("select", this, val1);
        }
    },
 	onRender : function(container, position){
        var m = [
             '<table cellspacing="0">',
                '<tr><td colspan="3"><table cellspacing="0" width="100%"><tr><td class="x-date-left"><a href="#" title="', this.prevText ,'">&#160;</a></td><td class="x-date-middle" align="center"></td><td class="x-date-right"><a href="#" title="', this.nextText ,'">&#160;</a></td></tr></table></td></tr>',
                '<tr><td colspan="3"><table class="x-date-inner" cellspacing="0"><thead><tr>'];
        var dn = this.dayNames;
        for(var i = 0; i < 7; i++){
            var d = this.startDay+i;
            if(d > 6){
                d = d-7;
            }
            m.push("<th><span>", dn[d].substr(0,1), "</span></th>");
        }
        m[m.length] = "</tr></thead><tbody><tr>";
        for(i = 0; i < 42; i++) {
            if(i % 7 === 0 && i !== 0){
                m[m.length] = "</tr><tr>";
            }
            m[m.length] = '<td><a href="#" hidefocus="on" class="x-date-date" tabIndex="1"><em><span></span></em></a></td>';
        }

		m[m.length] = '</tr></tbody></table></td></tr><tr><td class="minutecss"><table cellspacing="0" ><tr>';
		m[m.length] = '<td class="y-hour-left"><a href="#" title="down"> </a></td><td class="y-hour-middle" align="center"></td><td class="y-hour-right"><a href="#" title="up"> </a></td>';
		m[m.length] = '<td class="y-minute-left"><a href="#" title="down"> </a></td><td class="y-minute-middle" align="center"></td><td class="y-minute-right"><a href="#" title="up"> </a></td>';
		m[m.length] = '</tr></table></td><td  colspan="2" class="x-date-bottom" align="center"></td></tr></table><div class="x-date-mp"></div>';

        var el = document.createElement("div");
        el.className = "x-date-picker";
        el.innerHTML = m.join("");

        container.dom.insertBefore(el, position);

        this.el = Ext.get(el);
        this.eventEl = Ext.get(el.firstChild);

        new Ext.util.ClickRepeater(this.el.child("td.x-date-left a"), {
            handler: this.showPrevMonth,
            scope: this,
            preventDefault:true,
            stopDefault:true
        });

        new Ext.util.ClickRepeater(this.el.child("td.x-date-right a"), {
            handler: this.showNextMonth,
            scope: this,
            preventDefault:true,
            stopDefault:true
        });
		new Ext.util.ClickRepeater(this.el.child("td.y-hour-left a"), {
																			handler: function(){
																				if(this.theHours>0){
																					this.theHours--;
																					this.theHours = this.theHours %24;
																					var txt = '';
																					if(this.theHours<10){
																						txt='0'+this.theHours;
																					}
																					else{
																						txt= this.theHours;
																					}
																					this.hourLabel.update(txt+'时');
																					
																				}
																			}.createDelegate(this), 
																			scope: this
																		});
		new Ext.util.ClickRepeater(this.el.child("td.y-hour-right a"), {
																			handler: function(){
																				this.theHours++;
																				this.theHours = this.theHours % 24;
																				var txt = '';
																				if(this.theHours<10){
																					txt='0'+this.theHours;
																				}
																				else{
																					txt= this.theHours;
																				}
																				this.hourLabel.update(txt+'时');
																			}.createDelegate(this), 
																			scope: this
																		});
		new Ext.util.ClickRepeater(this.el.child("td.y-minute-left a"), {
																			handler: function(){
																				if(this.theMinutes>0){
																					this.theMinutes--;
																					this.theMinutes = this.theMinutes % 60;
																					var txt = '';
																					if(this.theMinutes<10){
																						txt='0'+this.theMinutes;
																					}
																					else{
																						txt= this.theMinutes;
																					}
																					this.minuteLabel.update(txt+'分');
																					
																				}
																			}.createDelegate(this), 
																			scope: this
																		});
		new Ext.util.ClickRepeater(this.el.child("td.y-minute-right a"), {
																			handler: function(){
																				this.theMinutes++;
																				this.theMinutes = this.theMinutes % 60;
																				var txt = '';
																				if(this.theMinutes<10){
																					txt='0'+this.theMinutes;
																				}
																				else{
																					txt= this.theMinutes;
																				}	
																				this.minuteLabel.update(txt+'分');
																			}.createDelegate(this), 
																			scope: this
																		});

        this.eventEl.on("mousewheel", this.handleMouseWheel,  this);

        this.monthPicker = this.el.down('div.x-date-mp');
        this.monthPicker.enableDisplayMode('block');
        
        var kn = new Ext.KeyNav(this.eventEl, {
            "left" : function(e){
                e.ctrlKey ?
                    this.showPrevMonth() :
                    this.update(this.activeDate.add("d", -1));
            },

            "right" : function(e){
                e.ctrlKey ?
                    this.showNextMonth() :
                    this.update(this.activeDate.add("d", 1));
            },

            "up" : function(e){
                e.ctrlKey ?
                    this.showNextYear() :
                    this.update(this.activeDate.add("d", -7));
            },

            "down" : function(e){
                e.ctrlKey ?
                    this.showPrevYear() :
                    this.update(this.activeDate.add("d", 7));
            },

            "pageUp" : function(e){
                this.showNextMonth();
            },

            "pageDown" : function(e){
                this.showPrevMonth();
            },

            "enter" : function(e){
                e.stopPropagation();
                return true;
            },

            scope : this
        });

        this.eventEl.on("click", this.handleDateClick,  this, {delegate: "a.x-date-date"});

        this.eventEl.addKeyListener(Ext.EventObject.SPACE, this.selectToday,  this);

        this.el.unselectable();
        
        this.cells = this.el.select("table.x-date-inner tbody td");
        this.textNodes = this.el.query("table.x-date-inner tbody span");

        this.mbtn = new Ext.Button({
            text: "&#160;",
            tooltip: this.monthYearText,
            renderTo: this.el.child("td.x-date-middle", true)
        });

        this.mbtn.on('click', this.showMonthPicker, this);
        this.mbtn.el.child(this.mbtn.menuClassTarget).addClass("x-btn-with-menu");

		var dt1 = new Date();
		var txt = '';
		this.hourLabel = this.el.child("td.y-hour-middle");
		this.theHours = dt1.getHours();
		if(this.theHours<10){
			txt='0'+this.theHours;
		}
		else{
			txt= this.theHours;
		}	
		this.hourLabel.update(txt+'时');

		this.minuteLabel = this.el.child("td.y-minute-middle");
		this.theMinutes = dt1.getMinutes();
		if(this.theMinutes<10){
			txt='0'+this.theMinutes;
		}
		else{
			txt= this.theMinutes;
		}	
		this.minuteLabel.update(txt+'分');

        var today = (new Date()).dateFormat(this.format);
        var todayBtn = new Ext.Button({
            renderTo: this.el.child("td.x-date-bottom", true),
            text: String.format(this.todayText, today),
            tooltip: String.format(this.todayTip, today),
            handler: this.selectToday,
            scope: this
        });
        
        if(Ext.isIE){
            this.el.repaint();
        }
        this.update(this.value);
	},

	/**
	* Method Name: update
	* Description: as per Ext.DatePicker's update, except updates year label in its own cell
	* Parameters: as per Ext.DatePicker's update
	* Returns: n/a
	* Throws: n/a
	*/
	update : function(date){
        var vd = this.activeDate;
        this.activeDate = date;
        if(vd && this.el){
            var t = date.getTime();
            if(vd.getMonth() == date.getMonth() && vd.getFullYear() == date.getFullYear()){
                this.cells.removeClass("x-date-selected");
                this.cells.each(function(c){
                   if(c.dom.firstChild.dateValue == t){
                       c.addClass("x-date-selected");
                       setTimeout(function(){
                            try{c.dom.firstChild.focus();}catch(e){}
                       }, 50);
                       return false;
                   }
                });
                return;
            }
        }
        var days = date.getDaysInMonth();
        var firstOfMonth = date.getFirstDateOfMonth();
        var startingPos = firstOfMonth.getDay()-this.startDay;

        if(startingPos <= this.startDay){
            startingPos += 7;
        }

        var pm = date.add("mo", -1);
        var prevStart = pm.getDaysInMonth()-startingPos;

        var cells = this.cells.elements;
        var textEls = this.textNodes;
        days += startingPos;

        // convert everything to numbers so it's fast
        var day = 86400000;
        var d = (new Date(pm.getFullYear(), pm.getMonth(), prevStart)).clearTime();
        var today = new Date().clearTime().getTime();
        var sel = date.clearTime().getTime();
        var min = this.minDate ? this.minDate.clearTime() : Number.NEGATIVE_INFINITY;
        var max = this.maxDate ? this.maxDate.clearTime() : Number.POSITIVE_INFINITY;
        var ddMatch = this.disabledDatesRE;
        var ddText = this.disabledDatesText;
        var ddays = this.disabledDays ? this.disabledDays.join("") : false;
        var ddaysText = this.disabledDaysText;
        var format = this.format;

        var setCellClass = function(cal, cell){
            cell.title = "";
            var t = d.getTime();
            cell.firstChild.dateValue = t;
            if(t == today){
                cell.className += " x-date-today";
                cell.title = cal.todayText;
            }
            if(t == sel){
                cell.className += " x-date-selected";
                setTimeout(function(){
                    try{cell.firstChild.focus();}catch(e){}
                }, 50);
            }
            // disabling
            if(t < min) {
                cell.className = " x-date-disabled";
                cell.title = cal.minText;
                return;
            }
            if(t > max) {
                cell.className = " x-date-disabled";
                cell.title = cal.maxText;
                return;
            }
            if(ddays){
                if(ddays.indexOf(d.getDay()) != -1){
                    cell.title = ddaysText;
                    cell.className = " x-date-disabled";
                }
            }
            if(ddMatch && format){
                var fvalue = d.dateFormat(format);
                if(ddMatch.test(fvalue)){
                    cell.title = ddText.replace("%0", fvalue);
                    cell.className = " x-date-disabled";
                }
            }
        };

        var i = 0;
        for(; i < startingPos; i++) {
            textEls[i].innerHTML = (++prevStart);
            d.setDate(d.getDate()+1);
            cells[i].className = "x-date-prevday";
            setCellClass(this, cells[i]);
        }
        for(; i < days; i++){
            intDay = i - startingPos + 1;
            textEls[i].innerHTML = (intDay);
            d.setDate(d.getDate()+1);
            cells[i].className = "x-date-active";
            setCellClass(this, cells[i]);
        }
        var extraDays = 0;
        for(; i < 42; i++) {
             textEls[i].innerHTML = (++extraDays);
             d.setDate(d.getDate()+1);
             cells[i].className = "x-date-nextday";
             setCellClass(this, cells[i]);
        }

        this.mbtn.setText(this.monthNames[date.getMonth()] + " " + date.getFullYear());

		if(this.theHours<10){
			txt='0'+this.theHours;
		}
		else{
			txt= this.theHours;
		}
		this.hourLabel.update(txt+'时');

		if(this.theMinutes<10){
			txt='0'+this.theMinutes;
		}
		else{
			txt= this.theMinutes;
		}	
		this.minuteLabel.update(txt+'分');

        if(!this.internalRender){
            var main = this.el.dom.firstChild;
            var w = main.offsetWidth;
            this.el.setWidth(w + this.el.getBorderWidth("lr"));
            Ext.fly(main).setWidth(w);
            this.internalRender = true;
            // opera does not respect the auto grow header center column
            // then, after it gets a width opera refuses to recalculate
            // without a second pass
            if(Ext.isOpera && !this.secondPass){
                main.rows[0].cells[1].style.width = (w - (main.rows[0].cells[0].offsetWidth+main.rows[0].cells[2].offsetWidth)) + "px";
                this.secondPass = true;
                this.update.defer(10, this, [date]);
            }
        }
	},
	
	/***** Public Instance Variables *****/
	
	/**
	* Variable Name: nextYearText, prevYearText
	* Description: Hover text for the previous year and next year arrow changers
	* Default: as shown
	* Type: string
	*/
	nextYearText: 'Next Year (Control+Up)',
	prevYearText: 'Previous Year (Control+Down)'
});


/** Class Name: DatetimeItem
 * Inherits From: Ext.menu.Adapter
 * Contains: DatetimePicker
 * Purpose: Effectively overrides Ext.menu.DateItem so that it contains DatetimePicker instead of Ext.DatePicker
 * Note: ORIGINAL and NEW comments are used to denote what differs from Ext.menu.DateItem
 */
DatetimeItem = function(config){
	// ORIGINAL:
	//Ext.menu.DateItem.superclass.constructor.call(this, new Ext.DatePicker(config), config);
	// NEW:
	DatetimeItem.superclass.constructor.call(this, new DatetimePicker(config), config);
	// END NEW
	this.picker = this.component;
	this.addEvents({select: true});

	this.picker.on("render", function(picker){
		picker.getEl().swallowEvent("click");
		picker.container.addClass("x-menu-date-item");
	});

	this.picker.on("select", this.onSelect, this);
};

Ext.extend(DatetimeItem, Ext.menu.Adapter, {
	onSelect : function(picker, date){
		this.fireEvent("select", this, date, picker);
		// ORIGINAL:
		//Ext.menu.DateItem.superclass.handleClick.call(this);
		// NEW:
		DatetimeItem.superclass.handleClick.call(this);
		// END NEW
	}
});


/** Class Name: DatetimeMenu
 * Inherits From: Ext.menu.Menu
 * Contains: DatetimeItem
 * Purpose: Effectively overrides Ext.menu.DateMenu so that it contains DatetimeItem instead of Ext.menu.DateItem
 * Note: ORIGINAL and NEW comments are used to denote what differs from Ext.menu.DateMenu
 */
DatetimeMenu = function(config){
	// ORIGINAL:
	//Ext.menu.DateMenu.superclass.constructor.call(this, config);
	//this.plain = true;
	//var di = new Ext.menu.DateItem(config);
	// NEW:
	DatetimeMenu.superclass.constructor.call(this, config);
	this.plain = true;
	var di = new DatetimeItem(config);
	// END NEW
	this.add(di);
	this.picker = di.picker;
	this.relayEvents(di, ["select"]);
};
Ext.extend(DatetimeMenu, Ext.menu.Menu);


//覆盖menu的render方法，修改的地方是在方法的最后增加
//		if(Ext.isGecko){      
//            this.picker.el.dom.childNodes[0].style.width = '178px';      
//            this.picker.el.dom.style.width = '178px';      
//        } 
//修正了firefox中Datetime控件被拉得很长的bug.
//liangg . 2009-3-9
Ext.override(Ext.menu.Menu,{      
   render : function(){
        if(this.el){
            return;
        }
        var el = this.el = this.createEl();

        if(!this.keyNav){
            this.keyNav = new Ext.menu.MenuNav(this);
        }
        if(this.plain){
            el.addClass("x-menu-plain");
        }
        if(this.cls){
            el.addClass(this.cls);
        }
        // generic focus element
        this.focusEl = el.createChild({
            tag: "a", cls: "x-menu-focus", href: "#", onclick: "return false;", tabIndex:"-1"
        });
        var ul = el.createChild({tag: "ul", cls: "x-menu-list"});
        ul.on("click", this.onClick, this);
        ul.on("mouseover", this.onMouseOver, this);
        ul.on("mouseout", this.onMouseOut, this);
        this.items.each(function(item){
            var li = document.createElement("li");
            li.className = "x-menu-list-item";
            ul.dom.appendChild(li);
            item.render(li, this);
        }, this);
        this.ul = ul;
        this.autoWidth();
		//**修正firefox中拉长Datetime的bug
		if(Ext.isGecko){      
            this.picker.el.dom.childNodes[0].style.width = '178px';      
            this.picker.el.dom.style.width = '178px';      
        }     
    }
});   