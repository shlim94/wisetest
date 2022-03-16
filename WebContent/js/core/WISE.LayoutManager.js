WISE.libs.Dashboard.LayoutManager = function() {
	var self = this;
	var layout;
	var items;
	var itemGenerateManager;
	var groups;
	
	this.dashboardid;
	this.containerId;
	this.reportId;
	
	this.itemidBasten = [];
	this.linkItemidBasten = [];
	this.originLayoutCSS = [];
	
	//2020.04.02 ajkim 창 설정 임시추가 dogfoot
	this.menuConfigJson = {}
	
	this.init = function() {
		this.menuConfigJson = userJsonObject.menuconfig.Menu;
		var page = window.location.pathname.split('/');
		if (page[page.length - 1] === 'config.do' || page[page.length - 1] === 'account.do' || page[page.length - 1] === 'excelView.do' || page[page.length - 1] === 'spreadEdit.do'  || page[page.length - 1] === 'spreadsheet.do') {
			layout = '';

		}else if(gDashboard.reportType == 'AdHoc' && page[page.length - 1] === 'viewer.do'){
			layout =  '';
			items = gDashboard.itemGenerateManager;

		}
		else if(!gDashboard.isNewReport){
			if(gDashboard.reportType == 'AdHoc'){
				/* DOGFOOT hsshim 1211 */
				if(window[this.dashboardid].structure.Layout === 'CG') window[this.dashboardid].structure.Layout = 'CTGB';
				layout = window[this.dashboardid].structure.Layout;
				// layout = '';
				items = window[this.dashboardid].structure.Items;
				groups = window[self.dashboardid].structure.Groups;
				itemGenerateManager = window[this.dashboardid].itemGenerateManager;

			}else{
				/* DOGFOOT hsshim 1211 */
				layout = window[this.dashboardid].structure.LayoutTreeHtml;
				// layout = '';
				items = window[this.dashboardid].structure.Items;
				groups = window[self.dashboardid].structure.Groups;
				itemGenerateManager = window[this.dashboardid].itemGenerateManager;

			}
		}
		else{
//			layout = gDashboard.structure.ReportMasterInfo.layout || '';
			layout =  '';
			items = gDashboard.itemGenerateManager;

		}
//		layout = gDashboard.structure.ReportMasterInfo.layout || '';
//		items = gDashboard.itemGenerateManager;
////		groups = gDashboard.structure.ReportMasterInfo.Groups;
////		itemGenerateManager = window[this.dashboardid].itemGenerateManager;

	};
	
	this.render = function() {
		/*
		 * render edit layout if current page is not viewer
		 */ 
		var page = window.location.pathname.split('/');
		if (page[page.length - 1] === 'viewer.do' || page[page.length - 1] === 'excelView.do') {
			//
//			$(document).off();
			self.basicViewLayoutSet();
			self.viewactivateBasicFunction();
		} else if (page[page.length - 1] === 'config.do') {
			self.basicConfigLayoutSet();
			self.activateBasicFunction();
		} else if (page[page.length - 1] === 'account.do') {
			self.basicAccountLayoutSet();
			self.activateBasicFunction();
		} else if (page[page.length - 1] === 'spreadsheet.do') {
			self.basicSpreadLayoutSet();
			self.activateBasicFunction();
		}else {
			self.basicLayoutSet();
			self.activateBasicFunction();
		}
		
		if (self.isNewReport) {
			WISE.alert('set layout data first!');
			return;
		}
		var runnable = function() {
			$('#' + self.containerId+'_'+self.reportId).html(layout);
			var page = window.location.pathname.split('/');
			/* width 재계산(cs에서 입력이 있어야함)*/
			if (page[page.length - 1] === 'config.do' || page[page.length - 1] === 'account.do' || page[page.length - 1] === 'spreadsheet.do') {
				return;
			}else if(page[page.length - 1] === 'viewer.do' || page[page.length - 1] === 'excelView.do'){
				$('.filter-more').css('display','none');
				/* DOGFOOT hsshim 1211
				 * 옛날 뷰어 적용
				 */
				$.each(items,function(_i,_items){
					$.each(WISE.util.Object.toArray(_items),function(_j,_eachitems){
						_eachitems.ComponentName = _eachitems.ComponentName+"_"+self.reportId;
						if($(window).width() <= 640){
							// $('#'+_eachitems.ComponentName).css({'width':'100%','float':'none'});
							$('#'+_eachitems.ComponentName).css({'width':'100%','height':'100%'});
						}
					
					});
				});
				// 끝 
				if($(window).width() <= 720){
					$("[itemtype=Groups]").css({"width":"100%","float":'none','height':'100%'});
					/*특정 기기(갤럭시 S5)에서는 레포트의 하단이 짤리는 현상이 일어남*/
					$('#contentContainer_'+self.reportId).css('height','83%');
				}
			} else if(!gDashboard.isNewReport){
				var dashMainElement = ((typeof window[self.dashboardid].structure.MapOption.DASHBOARD_XML == 'undefined') || (window[self.dashboardid].structure.MapOption.DASHBOARD_XML == "")) ? '' : window[self.dashboardid].structure.MapOption.DASHBOARD_XML.MAIN_ELEMENT;
				if(dashMainElement != ''){
					if(!dashMainElement.CANVAS_AUTO){
						var canvasWidth = dashMainElement.CANVAS_WIDTH <=0 ? '94%' : dashMainElement.CANVAS_WIDTH+'px';
						var canvasHeight = dashMainElement.CANVAS_HEIGHT <= 0 ? '94%' : dashMainElement.CANVAS_HEIGHT+'px';
						$('#contentContainer').css('width',canvasWidth);
						$('#contentContainer').css('height',canvasHeight);
						$('#contentContainer').css('overflow','auto');
					}
				}
			}
			else{
				$('#contentContainer').css('width','94%');
				$('#contentContainer').css('height','94%');
				$('#contentContainer').css('overflow','auto');
			}
			
			/* adding vertical class into div that is not horizontal class or undefined */
			$.each($('.no-bpm div'), function(_k, _o) {
				if($(_o).attr('reportId') != self.reportId){
					return true;
				}
				if(!$(_o).attr('class') || $(_o).attr('class') != 'horizontal') {
					$(_o).addClass('vertical');
				}
				if(typeof groups != 'undefined'){
					if(typeof groups.Group[0] != 'undefined'){
						$.each(groups.Group,function(_i,_e){
							if(_e.ComponentName == _o.id && !_e.hasOwnProperty('ShowCaption')){
								$(_o).css("overflow","auto");
								var html = '<div class="cont_box">';
								html += '<div class="cont_box_top">';
								html += '<div id="' + _e.ComponentName + '_title' + '" class="cont_box_top_tit">' + _e.Name + '</div>';
								html += '</div>';
								html += '</div>';
								$(_o).prepend(html);
							}
						});
					}else{
						$.each(groups,function(_i,_e){
							if(_e.ComponentName == _o.id && !_e.hasOwnProperty('ShowCaption')){
								$(_o).css("overflow","auto");
								var html = '<div class="cont_box">';
								html += '<div class="cont_box_top">';
								html += '<div id="' + _e.ComponentName + '_title' + '" class="cont_box_top_tit">' + _e.Name + '</div>';
								html += '</div>';
								html += '</div>';
								$(_o).prepend(html);
							}
						});
					}
				}
			});
			if (items) {
				var generateDxItemContainer = function(_obj) {
					var parentid = _obj['ComponentName'];
					var itemTile = _obj['Name'];
					var itemid = parentid + '_item';
					var matchingCSS = true;
					var style = '';//_obj['ShowCaption'] === false ? ' style="margin-top:35px;"' : '';
					var html = '<div class="cont_box" ' + style + '>';
//					if (_obj['ShowCaption'] !== false) {
					if(typeof groups != 'undefined'){
						$.each(groups.Group,function(_i,_e){
							if(_e.ComponentName == _obj.Group){
								matchingCSS = _e.hasOwnProperty('ShowCaption');
							}
						});
					}
					if(matchingCSS)
						html += '<div class="cont_box_top">';
					else if( parentid.indexOf('pivot')!=-1 || parentid.indexOf('grid')!=-1 )
						html += '<div class="cont_box_top" style="background: #ffffff;">';
					else
//						html += '<div>';
						html += '<div class="cont_box_top">';
					
					if(!gDashboard.isNewReport){
						if(self.dashboardid)
						    var subLinkReportMeta = window[self.dashboardid].structure.subLinkReport;
						else
						     var subLinkReportMeta =gDashboard.structure.subLinkReport;
						$.each(subLinkReportMeta,function(_i,_e){
							if(_e.target_item+'_item' == itemid && _e.link_type == 'LP'){
								itemTile = "<div id='"+itemid+"_link'>"+itemTile+"</div>";
								self.linkItemidBasten.push(itemid+"_link");
							}
						});
					}						
					
						html += '<div id="' + itemid + '_title' + '" class="cont_box_top_tit">' + itemTile + '</div>';
						// 2019.12.16 수정자 : mksong 뷰어 비정형 옵션 추가를 위한 수정 DOGFOOT box-nav-wrap 제거
						html += '<ul id="' + itemid + '_topicon' + '" class="cont_box_top_icon">';
//						html += '<li><a href="#"><img src="' + WISE.Constants.context + '/images/cont_box_icon_playzoom.png" onMouseOver="this.src=\'' + WISE.Constants.context + '/images/cont_box_icon_playzoom_.png\'" onMouseOut="this.src=\'' + WISE.Constants.context + '/images/cont_box_icon_playzoom.png\'" alt="Initial Extend" title="Initial Extend"></a></li>';
//						html += '<li><a href="#"><img src="' + WISE.Constants.context + '/images/cont_box_icon_export.png" onMouseOver="this.src=\'' + WISE.Constants.context + '/images/cont_box_icon_export_.png\'" onMouseOut="this.src=\'' + WISE.Constants.context + '/images/cont_box_icon_export.png\'" alt="Export" title="Export"></a></li>';
//						html += '<li><a href="#"><img src="' + WISE.Constants.context + '/images/cont_box_icon_filter_disable.png" alt="Filter" title="Filter"></a></li>';
//						html += '<li><a href="#"><img src="' + WISE.Constants.context + '/images/cont_box_icon_multi_select.png" alt="Multiselect" title="Multiselect"></a></li>';
						html += '</ul>';
						html += '</div>'; // end of cont_box_top
//					}
					/* DOGFOOT hsshim 1211
					 * 옛날 뷰어랑 현제 디자이너 레이아웃을 지원하게 
					 */
					if (WISE.Constants.editmode === 'viewer') {
						html += '<div id="' + itemid + '" class="cont_box_cont" style="height: calc(100% - 36px); padding:20px"></div>';
					} else {
						html += '<div id="' + itemid + '" class="cont_box_cont" style="height: calc(100% - 20px); padding:20px"></div>';
					}
					// 끝 
					html += '</div>'; // end of cont_box
					
					$('#' + parentid).html(html);
					
					// store iteme area id
					self.itemidBasten.push(itemid);
				};
				
				$.each(items, function(_k, _i) {
					$.each(WISE.util.Object.toArray(_i), function(_ind, _o) {
						generateDxItemContainer(_o);
					});
				});
				

				
				_.each(self.linkItemidBasten,function(_linkitemid){
					$('#'+_linkitemid).click(function(_e){
						self.openLink(_linkitemid);
					});
				})
			}
				
			self.resize();
				
			/* generate dx items */
			if (itemGenerateManager) {
				itemGenerateManager.generate(items);
			}
		};
		
		var __CONFIG = WISE.widget.getCustom('common', 'Config');
		if (__CONFIG && __CONFIG.debug) {
			runnable();
		}
		else {
			try {
				runnable();
			}
			catch (e) {
				var msg = 'error occurred while rendering report layout - ' + e.toString();
				throw {status: 500, msg: msg};
			}
		}
		
	};
	
	this.createItemLayer = function(_itemid) {
		var itemid = _itemid;
		var parentid = itemid.replace('_item', '');
		$("#" + itemid).remove();
		
		var contbox = $('#' + parentid).children('.cont_box');
		var area = $('<div id="' + itemid + '" class="cont_box_cont"></div>');
		contbox.append(area);
		
		this.resize(itemid);
	};
	
	this.resize = function(_itemid) {
		
		var resizeItemLayer = function(_o) {
			var ith = 41; // item title height
			var C = $('#' + _o), P = C.parent().parent();
			if (_o.indexOf('grid') === 0 || _o.indexOf('pivot') === 0) {
				C.addClass('dx-grid-no-margin');
			}
			
			// remove item title bar
//			if (C.prev().tagName === undefined) {
//				ith = 0;
//			}
			
			var size = {};
			size.mt = parseFloat((C.css('apddin-top') || '0').replace(/px/,''));
			size.mb = parseFloat((C.css('margin-bottom') || '0').replace(/px/,''));
			size.mr = parseFloat((C.css('margin-right') || '0').replace(/px/,''));
			size.ml = parseFloat((C.css('margin-left') || '0').replace(/px/,''));
			size.pt = parseFloat((C.css('padding-top') || '0').replace(/px/,''));
			size.pb = parseFloat((C.css('padding-bottom') || '0').replace(/px/,''));
			size.pr = parseFloat((C.css('padding-right') || '0').replace(/px/,''));
			size.pl = parseFloat((C.css('padding-left') || '0').replace(/px/,''));
			size.bt = parseFloat((C.css('border-top') || '0').replace(/px/,''));
			size.bb = parseFloat((C.css('border-bottom') || '0').replace(/px/,''));
			size.br = parseFloat((C.css('border-right') || '0').replace(/px/,''));
			size.bl = parseFloat((C.css('border-left') || '0').replace(/px/,''));
			
			// calculate child size
			size.width = P.width() - (size.mr + size.ml + size.pr + size.pl + size.br + size.bl) - 8;
			size.height = P.height() - (size.mt + size.mb + size.pt + size.pb + size.bt + size.bb + ith);
			C.css('width', size.width + 'px');
			C.css('height', size.height + 'px');
		};
		
		if (_itemid) {
//			resizeItemLayer(_itemid);
//			2019.12.16 mksong 대시보드 리사이즈 오류 수정 dogfoot
			$.each(gDashboard.itemGenerateManager.dxItemBasten, function(_i, _itemO) {
				if (_itemO.itemid === _itemid) {
					_itemO.preResize();
//					_itemO.resize();
				}
			});
		}
		else {
//			$.each(this.itemidBasten, function(_i, _o) {
//				resizeItemLayer(_o);
//			});
//			$.each(itemGenerateManager.dxItemBasten, function(_i, _itemO) {
//				_itemO.preResize();
////				_itemO.resize();
//			});
		}
	};
	
	//20200709 AJKIM 서브 연결 보고서 식별을 위해 매개변수 추가 dogfoot
	/*dogfoot 피벗 서브연결 보고서 추가 shlim 20210124*/
	this.openLink = function(_linkitemid, _linkitemnm,_onData){
		var paramListValue = WISE.libs.Dashboard.item.DatasetUtility.getCurrentParamValues();
		
		if(self.dashboardid)
		    var subLinkReportMeta = window[self.dashboardid].structure.subLinkReport;
		else
		     var subLinkReportMeta =gDashboard.structure.subLinkReport;
		var linkJsonMatch = {};
		var target_id,target_Type=WISE.Constants.context;
		
		
		$.each(subLinkReportMeta,function(_i,_linkMeta){
			if(_linkMeta.target_item+'_item_link' == _linkitemid && _linkMeta.link_type == 'LP' && (!_linkitemnm || _linkitemnm === _linkMeta.target_nm))
			{
				target_id = _linkMeta.target_id;
				target_Type = _linkMeta.target_type == 'DashAny' ? 'ds' : 'ah';
//				target_Type = _linkMeta.target_type == 'N' ? 'ds' : 'ah';
				$.each(_linkMeta.linkJson.LINK_XML_PARAM.ARG_DATA,function(_j,_linkJson){
					if(paramListValue[_linkJson])
						linkJsonMatch[_linkJson] = paramListValue[_linkJson].value =='_EMPTY_VALUE_' ? '[All]' : paramListValue[_linkJson].value;
				});
			} else if(_linkMeta.target_item+'_item_link' == _linkitemid && _linkMeta.link_type == 'LD'){
				target_id = _linkMeta.target_id;
				target_Type = _linkMeta.target_type == 'DashAny' ? 'ds' : 'ah';
			}else if(_linkitemnm){
				return true;
			}
			
			// 2020.02.13 mksong 서브연결보고서 파라미터 전달 부분 추가 DOGFOOT
			if(typeof _linkMeta.linkJson != 'undefined' && _linkMeta.linkJson != "" && _linkMeta.linkJson.LINK_XML_PARAM != undefined) {
				//20200708 ajkim 서브 연결 보고서 파라미터 전달 부분 수정 dogfoot
				$.each(WISE.util.Object.toArray(_linkMeta.linkJson.LINK_XML_PARAM.ARG_DATA),function(_j,_linkJson){
//					if(!Array.isArray(_linkMeta.linkJson.LINK_XML_PARAM.ARG_DATA)) {
//						linkJsonMatch[_linkMeta.linkJson.LINK_XML_PARAM.ARG_DATA.PK_COL_NM] = paramListValue[_linkMeta.linkJson.LINK_XML_PARAM.ARG_DATA.FK_COL_NM].value =='_EMPTY_VALUE_' ? '[All]' : paramListValue[_linkMeta.linkJson.LINK_XML_PARAM.ARG_DATA.FK_COL_NM].value;
//					} else if(_linkJson.PK_COL_NM) {
//						linkJsonMatch[_linkJson.PK_COL_NM] = paramListValue[_linkJson.FK_COL_NM].value =='_EMPTY_VALUE_' ? '[All]' : paramListValue[_linkJson.FK_COL_NM].value;
//					}
					var isBetween = false;
					if(!paramListValue[_linkJson.FK_COL_NM] && paramListValue[_linkJson.FK_COL_NM+'_fr']) isBetween = true;
					if(!isBetween)
						linkJsonMatch[_linkJson.PK_COL_NM] = paramListValue[_linkJson.FK_COL_NM].value =='_EMPTY_VALUE_' ? '[All]' : paramListValue[_linkJson.FK_COL_NM].value;
					else
						linkJsonMatch[_linkJson.PK_COL_NM] = [paramListValue[_linkJson.FK_COL_NM+'_fr'].value =='_EMPTY_VALUE_' ? '[All]' : paramListValue[_linkJson.FK_COL_NM+'_fr'].value,
								paramListValue[_linkJson.FK_COL_NM+'_to'].value =='_EMPTY_VALUE_' ? '[All]' : paramListValue[_linkJson.FK_COL_NM+'_to'].value];
				});
			}
			/*dogfoot 서브연결 보고서 임시 shlim 20210124 */
			if(typeof _linkMeta.linkJson2 != 'undefined' && _linkMeta.linkJson2 != "" && _linkMeta.linkJson2.LINK_XML_DATA != undefined) {
				//20200708 ajkim 서브 연결 보고서 파라미터 전달 부분 수정 dogfoot
				$.each(WISE.util.Object.toArray(_linkMeta.linkJson2.LINK_XML_DATA.ARG_DATA),function(_j,_linkJson){
					$.each(_onData,function(_index,_data){
						if(_index === 'rowPathData'){
							if(_data != undefined && _data.length > 0){
							    $.each(_data[0].rowFields,function(_k,_l){
									if(_l.dataField === _linkJson.FK_COL_NM ){
										linkJsonMatch[_linkJson.PK_COL_NM] = _data[0].rowPath ? _data[0].rowPath[_k] : '[All]'
									}
								})	
							}
						}
					})
				});
			}
		});
		
		var locationStr = "";
		$.each(linkJsonMatch,function(_key,_val){
			// 2020.02.13 mksong 연결보고서 VALUE값 암호화 DOGFOOT
			locationStr += encodeURI(encodeURIComponent(_key))+'='+btoa(encodeURIComponent(_val))+'&';
		});
		locationStr = (locationStr.substring(0,locationStr.length-1));
		// 2020.02.13 mksong 서브연결보고서 & 누락오류 수정 DOGFOOT
		if(locationStr.length > 1) {
			locationStr = "&" + locationStr;
		}
		var urlString = window.location.protocol+'//'+window.location.host+WISE.Constants.context +'/report/'+target_id+'/viewer.do?USER='+userJsonObject.userId+'&assign_name=bWVpcw==' + locationStr;
		window.open(urlString);
	};
	
	this.basicLayoutSet = function(){
		var target_id,target_Type=WISE.Constants.context;
		
		//2020.02.04 mksong KERIS CUBEID 레포트 편집 모드 열기 UI 수정dogfoot
		if(!userJsonObject.selectCubeId){
			self.leftSideLayout();
		}else{
			$('.container-inner').css('paddingLeft','0px');
		}
		
		if($('.report-tab ul').find('li').length == 0){
			self.headerLayout();	
		}
		
		self.navLayout();
		if(gDashboard.reportType == 'AdHoc'){
			$('.activeChangeLayout').css('display','block');
			/* DOGFOOT MKSONG KERIS 뷰어 비정형일 때 디자이너로 레포트 아이디 이동 위해 수정 20200217 */
			$('.design').css('display','block');
		}else{
			/* DOGFOOT MKSONG KERIS 뷰어 비정형일 때 디자이너로 레포트 아이디 이동 위해 수정 20200217 */
			$('.activeChangeLayout').css('display','none');
			$('.design').css('display','none');
		}
		
		self.sectionLayout();
		
		//2020.02.04 mksong KERIS CUBEID 레포트 편집 모드 열기 UI 수정dogfoot
		if(userJsonObject.selectCubeId){
			$('.panel.tree.active').width('270px');
		}
		
		if(reportType != 'Excel' && reportType != 'Spread') {

			self.modalLayout();
			self.dataItemOptionLayout();
			self.fieldFormatOptionLayout();
		} else if(reportType == 'Spread' || reportType == 'Excel') {
			self.modalLayout();
		}
		
		gDashboard.reportUtility.activeButton();
		
		var url = window.location.href;
		/* DOGFOOT ktkang 비정형 메인화면 새창 열기 및 중복 코드 제거  20200120 */
		url = url.substring(0, url.lastIndexOf('/') + 1);
		
		// 2020.04.02 ajkim 지정한 설정에 따라 팝업설정 dogfoot
		$('#insertInformal').off('click').on('click',function(e){
			e.preventDefault();
			var frm = document.mainAdhocName;
			frm.action = url + 'edit.do';
			/*dogfoot shlim 비정형보고서 현재창에서 열기 20200309*/
			
			if(Object.keys(gDashboard.dataSourceManager.datasetInformation).length == 0){
				if(self.menuConfigJson.PROG_MENU_TYPE.AdHoc.popup)
					frm.target = "_blank";
				else
					frm.target = "_self";
				frm.submit();
			}
			else{
				var message = '비정형 보고서 생성 화면으로<br> 이동하시겠습니까?';


				var options = {
						buttons: {
							confirm: {
								id: 'confirm',
								className: 'blue',
								text: '확인',
								action: function() { 
									if(self.menuConfigJson.PROG_MENU_TYPE.AdHoc.popup)
										frm.target = "_blank";
									else
										frm.target = "_self";
									frm.submit();
								}
							},
							cancel: {
								id: 'cancel',
								className: 'negative',
								text: '취소',
								action: function() { 
									$AlertPopup.hide();
								}
							}
						}
					};

				WISE.confirm(message, options);
			}
			
			
		});
		
		$('.dashboard').off('click').on('click',function(e){
			e.preventDefault();
			
			if(Object.keys(gDashboard.dataSourceManager.datasetInformation).length == 0){
                if(self.menuConfigJson.PROG_MENU_TYPE.DashAny.popup)
					window.open(url + 'edit.do');
				else
					location.href = url + 'edit.do';
			}else{
				var message = '대시보드 생성 화면으로<br> 이동하시겠습니까?';
			
				var options = {
						buttons: {
							confirm: {
								id: 'confirm',
								className: 'blue',
								text: '확인',
								action: function() { 
									if(self.menuConfigJson.PROG_MENU_TYPE.DashAny.popup)
										window.open(url + 'edit.do');
									else
										location.href = url + 'edit.do';
								}
							},
							cancel: {
								id: 'cancel',
								className: 'negative',
								text: '취소',
								action: function() { 
									$AlertPopup.hide();
								}
							}
						}
					};

				WISE.confirm(message, options);    
			}
		});
		/* DOGFOOT ktkang 통계 분석 부분 추가  20201102 */
		$('#static_analysis').off('click').on('click',function(e){
			e.preventDefault();
			var frm = document.staticAnalysis;
			frm.action = url + 'edit.do';
			/*dogfoot shlim 비정형보고서 현재창에서 열기 20200309*/
			
			if(Object.keys(gDashboard.dataSourceManager.datasetInformation).length == 0){
				if(self.menuConfigJson.PROG_MENU_TYPE.Analysis.popup)
					frm.target = "_blank";
				else
					frm.target = "_self";
				frm.submit();
			}
			else{
				var message = '통계분석 화면으로<br> 이동하시겠습니까?';


				var options = {
						buttons: {
							confirm: {
								id: 'confirm',
								className: 'blue',
								text: '확인',
								action: function() { 
									if(self.menuConfigJson.PROG_MENU_TYPE.Analysis.popup)
										frm.target = "_blank";
									else
										frm.target = "_self";
									frm.submit();
								}
							},
							cancel: {
								id: 'cancel',
								className: 'negative',
								text: '취소',
								action: function() { 
									$AlertPopup.hide();
								}
							}
						}
					};

				WISE.confirm(message, options);
			}
		});
		
		/* DOGFOOT ktkang 통계 분석 부분 추가  20201102 */
		$('#r_analysis').off('click').on('click',function(e){
			e.preventDefault();
			var frm = document.rAnalysis;
			frm.action = url + 'edit.do';
			/*dogfoot shlim 비정형보고서 현재창에서 열기 20200309*/
			
			if(Object.keys(gDashboard.dataSourceManager.datasetInformation).length == 0){
//				if(self.menuConfigJson.PROG_MENU_TYPE.Analysis.popup)
//					frm.target = "_blank";
//				else
					frm.target = "_self";
				frm.submit();
			}
			else{
				var message = 'R 분석 화면으로<br> 이동하시겠습니까?';


				var options = {
						buttons: {
							confirm: {
								id: 'confirm',
								className: 'blue',
								text: '확인',
								action: function() { 
									if(self.menuConfigJson.PROG_MENU_TYPE.Analysis.popup)
										frm.target = "_blank";
									else
										frm.target = "_self";
									frm.submit();
								}
							},
							cancel: {
								id: 'cancel',
								className: 'negative',
								text: '취소',
								action: function() { 
									$AlertPopup.hide();
								}
							}
						}
					};

				WISE.confirm(message, options);
			}
		});
		
		/* DOGFOOT ajkim 데이터집합 뷰어 추가  20210128 */
		$('#dataset_viewer').off('click').on('click',function(e){
			e.preventDefault();
			var frm = document.dataSetViewer;
			frm.action = url + 'edit.do';
			/*dogfoot shlim 비정형보고서 현재창에서 열기 20200309*/
			
			if(Object.keys(gDashboard.dataSourceManager.datasetInformation).length == 0){
//				if(self.menuConfigJson.PROG_MENU_TYPE.Analysis.popup)
//					frm.target = "_blank";
//				else
					frm.target = "_self";
				frm.submit();
			}
			else{
				var message = '데이터집합 뷰어 화면으로<br> 이동하시겠습니까?';


				var options = {
						buttons: {
							confirm: {
								id: 'confirm',
								className: 'blue',
								text: '확인',
								action: function() { 
									if(self.menuConfigJson.PROG_MENU_TYPE.DSViewer.popup)
										frm.target = "_blank";
									else
										frm.target = "_self";
									frm.submit();
								}
							},
							cancel: {
								id: 'cancel',
								className: 'negative',
								text: '취소',
								action: function() { 
									$AlertPopup.hide();
								}
							}
						}
					};

				WISE.confirm(message, options);
			}
		});
		
		$('.excelTable').on('click',function(e){
			e.preventDefault();
			gDashboard.dataSetCreate.openDataUpload();
		});
		
		$('.excel').off('click').on('click',function(e){
			e.preventDefault();
			window.open(url + 'excelView.do');
		});
		
		$('.viewer').off('click').on('click',function(e){
			e.preventDefault();
			window.open(url + 'viewer.do?adhocView=hGQyV5sGlbOcGE8wplmCXg%3D%3D');
		});
		
		// 2020.02.04 mksong 뷰어 아이콘 변환 dogfoot
		$('.viewer-2').off('click').on('click',function(e){
			e.preventDefault();
			window.open(url + 'viewer.do?adhocView=hGQyV5sGlbOcGE8wplmCXg%3D%3D');
		});
		
		$('.sheet').off('click').on('click',function(e){
			e.preventDefault();
		
			if(self.menuConfigJson.PROG_MENU_TYPE.Excel.popup)
				window.open(url + 'spreadsheet.do');
			else
				location.href = url + 'spreadsheet.do';
		});

		$('.configuration').off('click').on('click', function() {
			if(self.menuConfigJson.PROG_MENU_TYPE.Config.popup)
				window.open(url + 'config.do');
			else
				location.href = url + 'config.do'
		});
		
		$('.execToss').off('click').on('click', function() {
			window.open(url + 'execToss.do');
		});
		// 중복 코드 제거 끝
	};
	
	this.basicViewLayoutSet = function(){
		if($('.report-tab ul').find('li').length == 0){
			self.viewheaderLayout();	
		}
		/* goyong ktkang 디자인 수정  20210603 */
//		self.viewsectionLayout();
		if (userJsonObject.userAuth === 'viewer') {
			$('.design').remove();
		} else {
			$('.design').off('click').on('click',function(){
				/* DOGFOOT MKSONG KERIS 뷰어 비정형일 때 디자이너로 레포트 아이디 이동 위해 수정 20200217 */
//				window.open(window.location.href.substring(0,window.location.href.indexOf("/report")+8)+"/edit.do");
				$('#reportId').val(gDashboard.structure.ReportMasterInfo.id);
				//DOGFOOT MKSONG KERIS CUBEID 함께 전송 20200219
				$('#cubeId').val(gDashboard.dataSourceManager.datasetInformation[gDashboard.itemGenerateManager.dxItemBasten[0].dataSourceId].DATASRC_ID);
				
				$('#editForm').submit();
			});
		}
		// 2019.12.16 수정자 : mksong 뷰어 비정형 컬럼선택기 추가를 위한 수정 DOGFOOT
		self.modalLayout();
		self.dataItemOptionLayout();
		self.fieldFormatOptionLayout();
	};

	this.basicConfigLayoutSet = function(){
		self.leftSideConfigLayout();
		self.configHeaderLayout();	
		self.configNavLayoutSave();
		self.configSectionLayout();

		var url = window.location.href;
		$('.viewer-2').off('click').on('click',function(e){
			e.preventDefault();
			url = url.substring(0, url.lastIndexOf('/') + 1);
			window.open(url + 'viewer.do?adhocView=hGQyV5sGlbOcGE8wplmCXg%3D%3D');
		});
		$('.report').off('click').on('click',function(e){
			e.preventDefault();
			url = url.substring(0, url.lastIndexOf('/') + 1);
			window.open(url + 'edit.do');
		});
	};

	this.basicAccountLayoutSet = function(){
		self.accountHeaderLayout();	
		// self.accountNavLayout();
	};
	
	this.basicSpreadLayoutSet = function() {
		self.leftSideSpreadLayout();
		if($('.report-tab ul').find('li').length == 0){
			self.headerLayout();	
		}
		self.spreadSectionLayout();
		gDashboard.reportUtility.activeButton();
		
		var url = window.location.href;
			url = url.substring(0, url.lastIndexOf('/') + 1);
		
		$('#insertInformal').off('click').on('click',function(e){
			e.preventDefault();
			var frm = document.mainAdhocName;
			frm.action = url + 'edit.do';
			/*dogfoot shlim 비정형보고서 현재창에서 열기 20200309*/
			frm.target = "_self";
			frm.submit();
		});

			
		$('.dashboard').off('click').on('click',function(e){
			e.preventDefault();
			window.open(url + 'edit.do');
		});

		
		$('.configuration').off('click').on('click', function() {
			window.open(url + 'config.do');
		});
		
		$('.viewer-2').off('click').on('click',function(e){
			e.preventDefault();
			window.open(url + 'viewer.do?adhocView=hGQyV5sGlbOcGE8wplmCXg%3D%3D');
		});
		
		/*dogfoot 스프레드 시트 테이블 바인드 테스트 용 shlim 20200721*/
		$('.sheet').off('click').on('click',function(e){
			e.preventDefault();
//			$('.sheet_table').removeClass('offn');
//			$('.sheet').removeClass('offn');
//			gDashboard.queryHandler.spreadtable = false;
		});
		/*dogfoot 스프레드 시트 테이블 바인드 테스트 용 shlim 20200721*/
//		$('.sheet_table').off('click').on('click',function(e){
//			e.preventDefault();
//			$('.sheet').addClass('offn');
//			$('.sheet_table').addClass('offn');
//			gDashboard.queryHandler.spreadtable = true;
//		});

	};

//	gnb-conatiner UI 생성
	this.leftSideLayout = function(){
		var html = '<ul>';
		/* DOGFOOT ktkang KERIS 요청사항 한글로 변경  20200221 */
//		KERIS
//		html += '<li id="insertInformal" class="atypical"><a href="#" title="비정형 보고서"><span>비정형 보고서</span></a></li>';
//		html += '<li class="db" onclick="aa();"><a href="#dbOpenCmm" class="modalLoad" title="데이터 집합"><span>Dataset</span></a></li>';
//		html += '<li class="excelTable" title="데이터 업로드 분석"><a href=""><span>Data Upload<br>Analysis</span></a></li>';
//		html += '<li class="dashboard" title="대시보드"><a href=""><span>Dash<br>board</span></a></li>';
//		html += '<li class="excel" title="엑셀보고서"><a href="#"><span>Excel</span></a></li>';
//		html += '<li class="configuration preferences" title="환경설정"><a href="#"><span>Settings</span></a></li>';
//		KERIS 주석 끝
		
		/*dogfoot shlim 메인 비정형 아이콘 css고정 20200309*/
		// 20200402 ajkim 메뉴 설정에 따라 visible 변경 dogfoot
		if(self.menuConfigJson.PROG_MENU_TYPE.AdHoc.visible){
			if(gDashboard.reportType==='AdHoc'){
	            html += '<li id="insertInformal" class="atypical"><a id="adhoc_box" title="비정형 보고서"><span>비정형 보고서</span></a></li>';
			}else{
				html += '<li id="insertInformal" class="atypical"><a title="비정형 보고서"><span>비정형 보고서</span></a></li>';
			}
		}
		if(self.menuConfigJson.PROG_MENU_TYPE.DashAny.visible){
			if(gDashboard.reportType==='DashAny'){
	            html += '<li class="dashboard" title="대시보드"><a id="dashboard_box"><span>대시보드</span></a></li>';
			}else{
				html += '<li class="dashboard" title="대시보드"><a><span>대시보드</span></a></li>';
			}
		}
		if(self.menuConfigJson.PROG_MENU_TYPE.Excel.visible){
			html += '<li class="sheet" title="스프레드시트보고서"><a><span>Spread<br>Sheet</span></a></li>';
		}
		/* DOGFOOT ktkang 통계 분석 부분 추가  20201102 */
		if(typeof self.menuConfigJson.PROG_MENU_TYPE.Analysis !== 'undefined'){
			if(self.menuConfigJson.PROG_MENU_TYPE.Analysis.visible) {
				if(gDashboard.reportType==='StaticAnalysis'){
		            html += '<li id="static_analysis" class="atypical"><a id="static_analysis_box" title="통계분석" color="#577df6"><span>통계분석</span></a></li>';
				}else{
					html += '<li id="static_analysis" class="atypical"><a title="통계분석"><span>통계분석</span></a></li>';
				}
			}
		}
		
		//20201209 AJKIM R 분석 기능 추가 dogfoot
		/* DOGFOOT syjin R 분석 버튼 주석 처리  20201102 */
//		if(typeof self.menuConfigJson.PROG_MENU_TYPE.Analysis !== 'undefined'){
//			if(self.menuConfigJson.PROG_MENU_TYPE.Analysis.visible) {
//				if(gDashboard.reportType==='RAnalysis'){
//		            html += '<li id="r_analysis" class="atypical"><a id="adhoc_box" href="#" title="R 분석" color="#577df6"><span>R 분석</span></a></li>';
//				}else{
//					html += '<li id="r_analysis" class="atypical"><a href="#" title="R 분석"><span>R 분석</span></a></li>';
//				}
//			}
//		}
		
		
		
		if(self.menuConfigJson.PROG_MENU_TYPE.DataSet.visible){
			html += '<li class="db" onclick="aa();"><a href="#dbOpenCmm" class="modalLoad" title="데이터 집합"><span>데이터 집합</span></a></li>';
		}
		if(self.menuConfigJson.PROG_MENU_TYPE.Config.visible){
			html += '<li class="configuration preferences" title="환경설정"><a><span>환경설정</span></a></li>';
		}
		
		/* DOGFOOT ajkim 데이터집합 뷰어 추가  20210128 */
		if(typeof self.menuConfigJson.PROG_MENU_TYPE.DSViewer !== 'undefined'){
			if(self.menuConfigJson.PROG_MENU_TYPE.DSViewer.visible) {
				if(gDashboard.reportType==='DSViewer'){
		            html += '<li id="dataset_viewer" class="dataset_viewer"><a id="adhoc_box" title="데이터 집합 뷰어" color="#577df6"><span>데이터 집합<br>뷰어</span></a></li>';
				}else{
					html += '<li id="dataset_viewer" class="dataset_viewer"><a title="데이터 집합 뷰어"><span>데이터 집합<br>뷰어</span></a></li>';
				}
			}
		}
		
//		html += '<li class="excelTable" title="데이터 업로드 분석"><a href=""><span>사용자 데이터<br>업로드</span></a></li>';
		html += '</ul>';
		$('.gnb-container').html(html);
	};

	this.leftSideConfigLayout = function(){
		var html = 	'<ul>' +
						'<li class="configuration preferences" title="환경설정"><a><span>환경 설정</span></a></li>' +
						'<li class="configuration user-group" title="사용자/그룹 관리"><a><span>사용자/그룹<br>관리</span></a></li>' +
						'<li class="configuration report-folder" title="보고서/폴더 관리"><a><span>보고서/폴더<br>관리</span></a></li>' +
						'<li class="configuration authentication" title="권한"><a><span>권한</span></a></li>' +
						'<li class="configuration data-source" title="원본 추가"><a><span>원본 추가</span></a></li>' +
						'<li class="configuration log" title="로그"><a><span>로그</span></a></li>' +
//						'<li class="configuration session" title="세션 관리"><a href="#"><span>세션 관리</span></a></li>' +
//						'<li class="configuration monitoring" title="모니터링"><a href="#"><span>모니터링</span></a></li>' +
						//KERIS
//						'<li class="configuration DataSet" title="데이터 집합 관리"><a href="#"><span>데이터 집합<br>관리</span></a></li>' +
						//KERIS 주석끝
					'</ul>';
		$('.gnb-container').html(html);
	};
	
	this.leftSideSpreadLayout = function(){
		var html = '<ul>';
		if(self.menuConfigJson.PROG_MENU_TYPE.AdHoc.visible){
			if(gDashboard.reportType==='AdHoc'){
	            html += '<li id="insertInformal" class="atypical"><a id="adhoc_box" title="비정형 보고서"><span>비정형 보고서</span></a></li>';
			}else{
				html += '<li id="insertInformal" class="atypical"><a title="비정형 보고서"><span>비정형 보고서</span></a></li>';
			}
		}
		if(self.menuConfigJson.PROG_MENU_TYPE.DashAny.visible){
			if(gDashboard.reportType==='DashAny'){
	            html += '<li class="dashboard" title="대시보드"><a id="dashboard_box"><span>대시보드</span></a></li>';
			}else{
				html += '<li class="dashboard" title="대시보드"><a><span>대시보드</span></a></li>';
			}
		}
		if(self.menuConfigJson.PROG_MENU_TYPE.Excel.visible){
			    html += '<li class="sheet" title="스프레드시트보고서"><a id="sheet_box"><span>Spread<br>Sheet</span></a></li>';
				/*dogfoot 스프레드 시트 테이블 바인드 테스트 용 shlim 20200721*/
//				html += '<li class="sheet_table offn" title="스프레드시트테이블"><a href="#" id="sheet_box"><span>Spread<br>Table</span></a></li>';	
		}
		if(self.menuConfigJson.PROG_MENU_TYPE.DataSet.visible){
			html += '<li class="db" onclick="aa();"><a href="#dbOpenCmm" class="modalLoad" title="데이터 집합"><span>데이터 집합</span></a></li>';
		}
		if(self.menuConfigJson.PROG_MENU_TYPE.Config.visible){
			html += '<li class="configuration preferences" title="환경설정"><a><span>환경설정</span></a></li>';
		}
		html += '</ul>';
		$('.gnb-container').html(html);
	};

	this.getProfilePicture = function() {
		if (userJsonObject.userImage) {
			return WISE.Constants.context + '/images/users/' + userJsonObject.userNo + '/' + userJsonObject.userImage;
		} else {
			return WISE.Constants.context + '/resources/main/images/ico_namEdit.png';
		}
	}

//	header-container 생성
	this.headerLayout = function(){
		if(typeof userJsonObject == 'undefined' || userJsonObject == null) {
			userJsonObject.userNm = 'User Name';
		}
		var html = '<div class="header-inner">';
		/* DOGFOOT ktkang KERIS WI로고 제거  20200221 */
		html += '<h1>';
		
		//2020.02.04 mksong KERIS CUBEID 레포트 편집 모드 열기 UI 수정dogfoot
		if(!userJsonObject.selectCubeId){
			html += '<a id="mainLogo" class="logo" style="background: url(' + WISE.Constants.context + '/resources/main/images/custom/' + userJsonObject.logo + ') no-repeat; -webkit-background-size: contain;background-size: contain;"></a>';	
		}
		
//		html += '<a>Wise Intelligence Logo</a>';
		html += '</h1>';
		html += '</div>';
		html += '<div class="util-container">';
		html += '<div class="util-cont left">';
		//2020.02.04 mksong KERIS CUBEID 레포트 편집 모드 열기 UI 수정dogfoot
		if(!userJsonObject.selectCubeId){
			// 2020.02.04 mksong 뷰어 아이콘 변환 dogfoot
			html += '<a class="util-gui viewer-2" title="보고서 뷰어">Viewer</a>';
//			html += '<a class="util-gui viewer" title="보고서 뷰어">Viewer</a>';
			html += '<a class="util-gui report" title="새창 띄우기">report</a>';	
		}
		html += '<div class="report-tab"><ul></ul></div>';
		html += '<a class="next">next</a>';
		html += '</div>';
		html += '<div class="util-cont right">';
//		html += '<div class="execToss">토스실행</div>';
		
//		KERIS
//		html += '<div class="relative-item"><input type="text" class="search reportSearch"><a id="report_search_btn" class="reportSearch">search</a></div>';
//		KERIS 주석 끝
		/* DOGFOOT ktkang 쿼리보기 기능 구현  20200804 */
		/* DOGFOOT mksong 2020-08-10 TOP_MENU_TYPE undefined 오류 수정 */
		/* DOGFOOT ktkang 보고서 형상관리 기능 구현  20200903 */
		if((typeof userJsonObject.userReportSeq == 'undefined' || userJsonObject.userReportSeq == '1001' || userJsonObject.userReportSeq == '') && gDashboard.reportType !== 'DSViewer') {
			if(self.menuConfigJson.TOP_MENU_TYPE.QueryView != undefined){
				if(self.menuConfigJson.TOP_MENU_TYPE.QueryView.visible){
					html += '<div style="padding-right: 20px; position: relative;"><a id="queryView" class="lnb-link" style="width:40px;">';
					html += '<img src="' + WISE.Constants.context + '/resources/main/images/ico_new_sqlInput.png" style="margin: 12px" alt="">';
					html += '<span style="margin: -12px">쿼리보기</span></a>';
					html += '</div>';
				}	
			}

			/* DOGFOOT ktkang 보고서 형상관리 구현  20200827 */
//			html += '<div style="padding-right: 20px; position: relative;" title="보고서 형상관리"><a id="reportHistory" class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_reportProperty.png" style="margin: 12px" alt=""><span style="margin: -12px">보고서 형상관리</span></a></div>';				

			/* DOGFOOT syjin 보고서 레이아웃 설정 버튼 추가  20200814 */
			html += '<div style="padding-right: 20px; position: relative;" title="보고서 설정"><a id="reportSetting" class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_reportProperty.png" style="margin: 12px" alt=""><span style="margin: -12px">보고서 설정</span></a></div>';				
			//2020.02.19 MKSONG 타이틀 추가 DOGFOOT
			html += '<div style="padding-right: 20px; position: relative;" title="보고서 속성"><a id="reportProperty" class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_reportProperty.png" style="margin: 12px" alt=""><span style="margin: -12px">보고서 속성</span></a></div>';
		}
				
		/* DOGFOOT MKSONG KERIS 모든 디자이너에서 이름 보기 위해 주석  20200218 */
//		if(!userJsonObject.selectCubeId){
			/* DOGFOOT MKSONG KERIS 유저 이름 보기 수정  20200218 */
			//2020.02.19 MKSONG 타이틀 추가 DOGFOOT
			html += '<div class="user-name click-btn" title="사용자 정보"><a><div class="user-img"><img src="' + self.getProfilePicture() + '" alt=""></div><span>' + userJsonObject.userNm + '</span></a></div>';
			
			html += '<div class="user-util click-pop">';
			html += '<div class="user-img"><img src="' + self.getProfilePicture() + '" alt=""></div>';
			html += '<div class="user-menu"><span>' + userJsonObject.userNm + '</span><a id="logout" class="btn crud positive">로그아웃</a>';
			html += '<ul class="language-select">';
//			html += '<li class="language-select-status"><a href="#">한국어</a></li>';
//			html += '<li class="lang-item"><a href="#">한국어</a></li>';
//			html += '<li class="lang-item"><a href="#">English</a></li>';
			html += '</ul>';
			/* DOGFOOT ktkang 글자 크기 조절 버트 숨김  20200629 */
//			html += '<div class="util-item text-zoom">';
//			html += '<button class="text-zoom-plus" type="button" name="button">확대</button>';
//			html += '<button class="text-zoom-minus" type="button" name="button">축소</button>';
//			html += '</div>';
			html += '<div class="util-item preferences">';
			html += '<button class="settings-button" type="button" name="button">환경 설정</button>';
			html += '</div>';
			html += '</div>';
			html += '</div>';
			html += '</div>';
		/* DOGFOOT MKSONG KERIS 모든 디자이너에서 이름 보기 위해 주석  20200218 */
//		}
		
		
		html += '</div>';//util-container
		html += '</div>';//header-inner
		$('.header-container').html(html);
		
		$('.search').dxTextBox();

		$('.report').on("click", function(e){
			e.preventDefault();
			window.open(window.document.location.href);
		});

		$('#logout').on('click', function(){
			$.ajax({
				url: WISE.Constants.context + '/logout.do',
				/* DOGFOOT ktkang 유저 로그아웃 로그 및 세션 관리 추가  20200923 */
				data: {
					id : userJsonObject.userId
				},
				success: function() {
					window.location.href = WISE.Constants.context;
				}
			});
		});  
	};
	
	this.viewheaderLayout = function(){
		if(typeof userJsonObject == 'undefined' || userJsonObject == null) {
			userJsonObject.userNm = 'User Name';
		}
		var html = '<div class="header-inner">';
		/* DOGFOOT ktkang KERIS WI로고 제거  20200221 */
		html += '<h1>';
		html += '<a id="mainLogo" class="logo" style="background: url(' + WISE.Constants.context + '/resources/main/images/custom/' + userJsonObject.logo + ') no-repeat; -webkit-background-size: contain;background-size: contain;"></a>';
//		html += '<a>Wise Intelligence Logo</a>';
		html += '</h1>';
		html += '</div>';
		//end header-inner;
		html += '<div class="util-container">';
		html += '	<div class="util-cont left">';
		/* DOGFOOT MKSONG KERIS 뷰어 비정형일 때 디자이너로 레포트 아이디 이동 위해 수정 20200217 */
		if(typeof userJsonObject.adhocView != 'undefined' && userJsonObject.adhocView == 'wise') {
			html += ' 		<a class="util-gui design" title="디자이너로 이동" style="display:none;">design</a>';
    	}
		
		// 2020.01.07 mksong 불필요한 아이콘 제거 dogfoot
		html += '		<span class="other-menu">';
		// 2020.01.07 mksong 타이틀 추가 dogfoot
//		html += '		 <div id="dl_popover" style="display: none;"></div>';
		html += '        <a id="dl_viewer_report" class="other-menu-ico util-gui download" title="다운로드">export</a>';
// 		html += '		 <ul class="more-link left-type" style="top: 40px; left: 357px;">';
// 		html += '           <div class="add-item noitem">';
// 		html += '				<span class="add-item-head on">MS Office</span>';
// 		html += '				<ul class="add-item-body">';
// 		// 2019.12.16 수정자 : mksong XLSX XLS 구분을 위한 수정 DOGFOOT
// 		html += '					<li><a id="downloadReportXLSX" class="downloadReport xlsx" href="#" title="MS Office Excel(xlsx)"><img src="' + WISE.Constants.context + '/resources/main/images/ico_xlsx.png" alt=""><span>MS Office Excel(xlsx)</span></a></li>';
// 		html += '					<li><a id="downloadReportXLS" class="downloadReport xls" href="#" title="MS Office Excel(xls)"><img src="' + WISE.Constants.context + '/resources/main/images/ico_xls.png" alt=""><span>MS Office Excel(xls)</span></a></li>';
// 		// 2019.12.16 수정자 : mksong XLSX XLS 구분을 위한 수정 끝 DOGFOOT
// 		// html += '					<li><a id="downloadReportDOC" class="downloadReport doc" href="#" title="MS Office Word"><img src="' + WISE.Constants.context + '/resources/main/images/ico_ept_msword.png" alt=""><span>MS Office Word</span></a></li>';
// 		// html += '					<li><a id="downloadReportPPT" class="downloadReport ppt" href="#" title="MS Office Powerpoint"><img src="' + WISE.Constants.context + '/resources/main/images/ico_ept_msppt.png" alt=""><span>MS Office Powerpoint</span></a></li>';
// 		html += '				</ul>';
// 		html += '			</div>';
// 		// html += '			<div class="add-item noitem">';
// 		// html += '				<span class="add-item-head on">한컴 오피스</span>';
// 		// html += '				<ul class="add-item-body">';
// 		// html += '					<li><a id="downloadReportHanHWP" class="downloadReport hwp" href="#" title="한글"><img src="' + WISE.Constants.context + '/resources/main/images/ico_ept_hcword.png" alt=""><span>한컴</span></a></li>';
// 		// html += '					<li><a id="downloadReportHanCell" class="downloadReport cell" href="#" title="한셀"><img src="' + WISE.Constants.context + '/resources/main/images/ico_ept_hcexcell.png" alt=""><span>한셀</span></a></li>';
// 		// html += '					<li><a id="downloadReportHanShow" class="downloadReport show" href="#" title="한쇼"><img src="' + WISE.Constants.context + '/resources/main/images/ico_ept_hcshow.png" alt=""><span>한쇼</span></a></li>';
// 		// html += '				</ul>';
// 		// html += '			</div>';

// //		KERIS				
// 		html += '			<div class="add-item noitem">';
// 		html += '				<span class="add-item-head on">기타 항목</span>';
// 		html += '				<ul class="add-item-body">';
// 		html += '					<li><a id="downloadReportIMG" class="downloadReport img" href="#" title="이미지"><img src="' + WISE.Constants.context + '/resources/main/images/ico_exportImages.png" alt=""><span>이미지</span></a></li>';
// 		// html += '					<li><a id="downloadReportPDF" class="downloadReport pdf" href="#" title="PDF"><img src="' + WISE.Constants.context + '/resources/main/images/ico_exportPDF.png" alt=""><span>PDF</span></a></li>';
// 		html += '					<li><a id="downloadReportHTML" class="downloadReport html" href="#" title="HTML"><img src="' + WISE.Constants.context + '/resources/main/images/ico_exportHTML.png" alt=""><span>HTML</span></a></li>';
// 		html += '				</ul>';
// 		html += '			</div>';
// //		KERIS 주석 끝
		
// 		html += '		</ul>';
		
		//2020.01.22 MKSONG 아이콘 위치 변경 DOGFOOT
		html += '			<a class="arrow activeChangeLayout other-menu-ico util-gui atypical-layout" title="비정형 레이아웃" style="display:none;">more</a>';
		html += '			<ul class="more-link right-type" style="top: 40px; left: 357px;z-index:101;">';
		html += '			<li><a id="changeLayoutC" class="changeLayout" >차트만 보기</a></li>';
		html += '			<li><a id="changeLayoutG" class="changeLayout" >그리드만 보기</a></li>';
		//2020.01.21 mksong 비정형 레이아웃 수정 dogfoot
		html += '			<li><a id="changeLayoutCG" class="changeLayout" >차트와 그리드 동시에 보기</a></li>';
//		html += '			<li><a id="changeLayoutCLGR" class="changeLayout" href="#">차트 왼쪽 / 그리드 오른쪽</a></li>';
//		html += '			<li><a id="changeLayoutCRGL" class="changeLayout" href="#">차트 오른쪽 / 그리드 왼쪽</a></li>';
//		html += '			<li><a id="changeLayoutCTGB" class="changeLayout" href="#">차트 위 / 그리드 아래</a></li>';
//		html += '			<li><a id="changeLayoutCBGT" class="changeLayout" href="#">차트 아래 / 그리드 위</a></li>';
		html += '			</ul>';
		
		//2020.01.22 MKSONG 아이콘 위치 변경 DOGFOOT
		/*dogfoot 뷰어 연결보고서 목록 표시 오류 수정 shlim 20200731*/
		html += '       	<a class="other-menu-ico util-gui connectR" title="연결보고서" style="display:none; opacity:.7 !important;">linkReportView</a>';
		html += '			<ul class="more-link right-type" id="linkReportList">';
		html += '			</ul>';
		
		html += '	   </span>';
		
		html += '		<div class="report-tab"><ul></ul></div>';
		html += '	</div>';
		//end left;
		html += '	<div class="util-cont right">';
//		KERIS
//		html += '		<div class="relative-item">';
//		html += '			<input type="text" class="search reportSearch">';
//		html += '			<a id="report_search_btn" class="reportSearch" href="#">search</a>';
//		html += '		</div>';
//		KERIS 주석 끝		
		//2020.02.19 MKSONG 타이틀 추가 DOGFOOT
//		html += '		<div style="padding-right: 20px; position: relative;" title="저장">';
		/* 뷰어 저장 버튼 삭제 산림청 20211217 bjsong */
		/* DOGFOOT ktkang 고용정보원09  사용자 정보 변경 오류  수정  */
//		html += '			<a id="saveReport" class="lnb-link">';
//		html += '				<img src="' + WISE.Constants.context + '/resources/main/images/ico_save.png" style="margin: 12px;" alt="">';
//		html += '				<span style="margin: -12px">저장</span>';
//		html += '			</a>';
//		html += '		</div>';
//		html += '		<div style="padding-right: 20px; position: relative;" title="다른 이름으로 저장">'; // ymbin : 레포트 속성
//		html += '			<a id="saveReportAs" class="lnb-link">';
//		html += '				<img src="' + WISE.Constants.context + '/resources/main/images/ico_save.png" style="margin: 12px" alt="">';
//		html += '				<span style="margin: -12px">다른 이름으로 저장</span>';
//		html += '			</a>';
//		html += '		</div>';
		if(typeof userJsonObject.adhocView != 'undefined' && userJsonObject.adhocView == 'wise') {
			html += '		<div style="padding-right: 20px; position: relative;" title="보고서 속성">'; // ymbin : 레포트 속성
			html += '			<a id="reportProperty" class="lnb-link">';
			html += '				<img src="' + WISE.Constants.context + '/resources/main/images/ico_reportProperty.png" style="margin: 12px" alt="">';
			html += '				<span style="margin: -12px">보고서 속성</span>';
			html += '			</a>';
			html += '		</div>';
		}
		/* DOGFOOT MKSONG KERIS 유저 이름 보기 수정  20200217 */
		//2020.02.19 MKSONG 타이틀 추가 DOGFOOT
		html += '		<div class="user-name click-btn" title="사용자 정보">';
		html += '			<a>';
		html += '				<div class="user-img">';
		html +=	'					<img src="' + self.getProfilePicture() + '" alt="">';
		html += '				</div>';
		html += '				<span>' + userJsonObject.userNm + '</span>';
		html += '			</a>';
		html += '		</div>';
		html += '		<div class="user-util click-pop">';
		html += '			<div class="user-img">';
		html += '				<img src="' + self.getProfilePicture() + '" alt="">';
		html += '			</div>';
		html += '			<div class="user-menu">'
		html += '				<span>' + userJsonObject.userNm + '</span>';
		html += '				<a href="' + WISE.Constants.context + '" id="logout" class="btn crud positive">로그아웃</a>';
		html += '				<ul class="language-select">';
//		html += '					<li class="language-select-status"><a href="#">한국어</a></li>';
//		html += '					<li class="lang-item"><a href="#">한국어</a></li>';
//		html += '					<li class="lang-item"><a href="#">English</a></li>';
		html += '				</ul>';
		/* DOGFOOT ktkang 글자 크기 조절 버트 숨김  20200629 */
//		html += '				<div class="util-item text-zoom">';
//		html += '					<button class="text-zoom-plus" type="button" name="button">확대</button>';
//		html += '					<button class="text-zoom-minus" type="button" name="button">축소</button>';
//		html += '				</div>';
		html += '				<div class="util-item preferences">';
		html += '					<button class="settings-button" type="button" name="button">환경 설정</button>';
		html += '				</div>';
        html += '			</div>';
        html += '		</div>';
        //end user-util;
        html += '	</div>';
        //end util-cont right
        html += '</div>';
        //end util-container
		$('.header-container').html(html);
		
		$('.search').dxTextBox();
		
		/* DOGFOOT ktkang 유저 로그아웃 로그 및 세션 관리 추가  20200923 */
		$('#logout').on('click', function(){
			$.ajax({
				url: WISE.Constants.context + '/logout.do',
				data: {
					id : userJsonObject.userId
				},
				success: function() {
					window.location.href = WISE.Constants.context;
				}
			});
		});  
		
		/* DOGFOOT ktkang 고용정보원09  사용자 정보 변경 오류  수정  */
		$('#saveReport').click(function(){
			if(gDashboard.fldType == 'MY' && WISE.Constants.editmode == 'viewer') {
				gDashboard.reportUtility.saveReport(true);
			} else {
				WISE.alert('공용보고서 저장 권한이 없습니다.<br> 다른이름으로 저장하여 개인보고서로 관리하세요.');
			}
		});
		
		// 20210226 AJKIM 뷰어 다른 이름으로 저장 기능 추가 dogfoot
		$('#saveReportAs').click(function(){
			gDashboard.reportUtility.saveReport("false");
		});
		
		$('#dl_popover').dxPopover({
			target: $('#dl_viewer_report'),
			deferRendering: false,
			contentTemplate: function() {
				$('.dx-popup-content').css('padding',0);
				return $(
					'<div style="width:200px;">' +
						'<div class="add-item noitem office">'+
							'<span class="add-item-head on">MS Office</span>'+
							'<ul class="add-item-body">'+
								'<li><a id="downloadReportXLSX" class="downloadReport xlsx" title="MS Office Excel(xlsx)"><img src="' + WISE.Constants.context + '/resources/main/images/ico_xlsx.png" alt=""><span>MS Office Excel(xlsx)</span></a></li>'+
								'<li><a id="downloadReportXLS" class="downloadReport xls" title="MS Office Excel(xls)"><img src="' + WISE.Constants.context + '/resources/main/images/ico_xls.png" alt=""><span>MS Office Excel(xls)</span></a></li>'+
								// '<li><a id="downloadReportDOC" class="downloadReport doc" href="#" title="MS Office Word"><img src="' + WISE.Constants.context + '/resources/main/images/ico_ept_msword.png" alt=""><span>MS Office Word</span></a></li>'+
								// '<li><a id="downloadReportPPT" class="downloadReport ppt" href="#" title="MS Office Powerpoint"><img src="' + WISE.Constants.context + '/resources/main/images/ico_ept_msppt.png" alt=""><span>MS Office Powerpoint</span></a></li>'+
							'</ul>'+
						'</div>'+
						// '<div class="add-item noitem hanoffice">'+
						// 	'<span class="add-item-head on">한컴 오피스</span>'+
						// 	'<ul class="add-item-body">'+
						// 		'<li><a id="downloadReportHanHWP" class="downloadReport hwp" href="#" title="한글"><img src="' + WISE.Constants.context + '/resources/main/images/ico_ept_hcword.png" alt=""><span>한컴</span></a></li>'+
						// 		'<li><a id="downloadReportHanCell" class="downloadReport cell" href="#" title="한셀"><img src="' + WISE.Constants.context + '/resources/main/images/ico_ept_hcexcell.png" alt=""><span>한셀</span></a></li>'+
						// 		'<li><a id="downloadReportHanShow" class="downloadReport show" href="#" title="한쇼"><img src="' + WISE.Constants.context + '/resources/main/images/ico_ept_hcshow.png" alt=""><span>한쇼</span></a></li>'+
						// 	'</ul>'+
						// '</div>'+		
						//'<div class="add-item noitem etc">'+
						//	'<span class="add-item-head on">기타 항목</span>'+
						//	'<ul class="add-item-body">'+
						//		'<li><a id="downloadReportIMG" class="downloadReport img" href="#" title="이미지"><img src="' + WISE.Constants.context + '/resources/main/images/ico_exportImages.png" alt=""><span>이미지</span></a></li>'+
								//'<li><a id="downloadReportPDF" class="downloadReport pdf" href="#" title="PDF"><img src="' + WISE.Constants.context + '/resources/main/images/ico_exportPDF.png" alt=""><span>PDF</span></a></li>'+
								//'<li><a id="downloadReportHTML" class="downloadReport html" href="#" title="HTML"><img src="' + WISE.Constants.context + '/resources/main/images/ico_exportHTML.png" alt=""><span>HTML</span></a></li>'+
						//		'<li><a id="downloadReportCSV" class="downloadReport csv" href="#" title="CSV"><img src="' + WISE.Constants.context + '/resources/main/images/ico_ept_hcexcell.png" alt=""><span>CSV</span></a></li>'+
						//	'</ul>'+
						//'</div>' +
					'</div>'
				);
			},
			onShowing: function() {
				if (gDashboard.reportType === 'Spread' || gDashboard.reportType === 'Excel') {
					$('.add-item.office #downloadReportXLS').parent().hide();
					$('.add-item.etc #downloadReportIMG').parent().hide();
					$('.add-item.etc #downloadReportHTML').parent().hide();
					/*dogfoot 뷰어 엑셀보고서 PDF 다운로드 버튼 제거 shlim 20200724*/
					$('.add-item.etc #downloadReportPDF').parent().hide();
					$('.add-item.etc #downloadReportCSV').parent().show();
				} else {
					$('.add-item.office #downloadReportXLS').parent().show();
					$('.add-item.etc #downloadReportIMG').parent().show();
					$('.add-item.etc #downloadReportHTML').parent().show();
					$('.add-item.etc #downloadReportCSV').parent().hide();
				}
			}
		});
	};

	this.configHeaderLayout = function(){
		if(typeof userJsonObject == 'undefined' || userJsonObject == null) {
			userJsonObject.userNm = 'User Name';
		}
		var html = '<div class="header-inner">';
		/* DOGFOOT ktkang KERIS WI로고 제거  20200221 */
		html += '<h1>';
		html += '<a id="mainLogo" class="logo" style="background: url(' + WISE.Constants.context + '/resources/main/images/custom/' + userJsonObject.logo + ') no-repeat; -webkit-background-size: contain;background-size: contain;"></a>';
//		html += '<a>Wise Intelligence Logo</a>';
		html += '</h1>';
		html += '</div>';
		html += '<div class="util-container">';
		html += '<div class="util-cont left">';
		/* DOGFOOT ktkang 환경설정 뷰어 이미지 변경  20200705 */
		html += '<a class="util-gui viewer-2">Viewer</a>';
		html += '<a class="util-gui report">report</a>';
		html += '<a class="next">next</a>';
		html += '</div>';
		html += '<div class="util-cont right">';
//		html += '<div class="relative-item"><input type="text" class="search reportSearch"><a id="report_search_btn" class="reportSearch" href="#">search</a></div>';
		html += '<div class="user-name click-btn"><a><div class="user-img"><img src="' + self.getProfilePicture() + '" alt=""></div><span>' + userJsonObject.userNm + '</span></a></div>';
		html += '<div class="user-util click-pop">';
		html += '<div class="user-img"><img src="' + self.getProfilePicture() + '" alt=""></div>';
		html += '<div class="user-menu"><span>' + userJsonObject.userNm + '</span><a id="logout" class="btn crud positive">로그아웃</a>';
		html += '<ul class="language-select">';
//		html += '<li class="language-select-status"><a href="#">한국어</a></li>';
//		html += '<li class="lang-item"><a href="#">한국어</a></li>';
//		html += '<li class="lang-item"><a href="#">English</a></li>';
		html += '</ul>';
		/* DOGFOOT ktkang 글자 크기 조절 버트 숨김  20200629 */
//		html += '<div class="util-item text-zoom">';
//		html += '<button class="text-zoom-plus" type="button" name="button">확대</button>';
//		html += '<button class="text-zoom-minus" type="button" name="button">축소</button>';
//		html += '</div>';
		html += '<div class="util-item preferences">';
		html += '<button class="settings-button" type="button" name="button">환경 설정</button>';
		html += '</div>';
		html += '</div>';
		html += '</div>';
		html += '</div>';
		
		html += '</div>';//util-container
		html += '</div>';//header-inner
		$('.header-container').html(html);
		
		$('.search').dxTextBox();

		$('#logout').on('click', function(){
			$.ajax({
				url: WISE.Constants.context + '/logout.do',
				/* DOGFOOT ktkang 유저 로그아웃 로그 및 세션 관리 추가  20200923 */
				data: {
					id : userJsonObject.userId
				},
				success: function() {
					window.location.href = WISE.Constants.context;
				}
			});
		});  
	};

	this.accountHeaderLayout = function(){
		if(typeof userJsonObject == 'undefined' || userJsonObject == null) {
			userJsonObject.userNm = 'User Name';
		}
		var html = '<div class="header-inner">';
		/* DOGFOOT ktkang KERIS WI로고 제거  20200221 */
		html += '<h1>';
		html += '<a id="mainLogo" class="logo" style="background: url(' + WISE.Constants.context + '/resources/main/images/custom/' + userJsonObject.logo + ') no-repeat; -webkit-background-size: contain;background-size: contain;"></a>';
		html += '</h1>';
		html += '</div>';
		html += '<div class="util-container">';
		html += '<div class="util-cont left">';
		html += '</div>';
		html += '<div class="util-cont right">';
//		html += '<div class="relative-item"><input type="text" class="search reportSearch"><a id="report_search_btn" class="reportSearch" href="#">search</a></div>';
		html += '<div class="user-name click-btn"><a><div class="user-img"><img src="' + self.getProfilePicture() + '" alt=""></div><span>' + userJsonObject.userNm + '</span></a></div>';
		html += '<div class="user-util click-pop">';
		html += '<div class="user-img"><img src="' + self.getProfilePicture() + '" alt=""></div>';
		html += '<div class="user-menu"><span>' + userJsonObject.userNm + '</span>';
		html += '<ul class="language-select">';
//		html += '<li class="language-select-status"><a href="#">한국어</a></li>';
//		html += '<li class="lang-item"><a href="#">한국어</a></li>';
//		html += '<li class="lang-item"><a href="#">English</a></li>';
		html += '</ul>';
		/* DOGFOOT ktkang 글자 크기 조절 버트 숨김  20200629 */
//		html += '<div class="util-item text-zoom">';
//		html += '<button class="text-zoom-plus" type="button" name="button">확대</button>';
//		html += '<button class="text-zoom-minus" type="button" name="button">축소</button>';
//		html += '</div>';
		html += '</div>';
		html += '</div>';
		html += '</div>';
		html += '</div>';//util-container
		html += '</div>';//header-inner
		$('.header-container').html(html);
		
		$('.search').dxTextBox();

		$('#logout').on('click', function(){
			$.ajax({
				url: WISE.Constants.context + '/logout.do',
				/* DOGFOOT ktkang 유저 로그아웃 로그 및 세션 관리 추가  20200923 */
				data: {
					id : userJsonObject.userId
				},
				success: function() {
					window.location.href = WISE.Constants.context;
				}
			});
		});  
	};

//	lnb-container 생성
	this.navLayout = function(){
		var html = '';
		/* DOGFOOT hsshim 2020-02-06 navLayout 필요없는 부분 제거 */
		html += '<div class="lnb-container">';
		
		//실행여부
//		html += '<ul class="lnb-lst-tab ctl">';
//		html += '<li><a href="#" class="lnb-link revert"><span>revert</span></a></li>';
//		html += '<li><a href="#" class="lnb-link redo"><span>redo</span></a></li>';
//		html += '</ul>';
		
		//보고서 작성 메뉴
		// 2020.02.04 mksong 디자인 수정 dogfoot
		html += '<div class="scroll-comp menu-comp fix-menu">';
		
		html += '<div class="slide-ui">';
		html += '<ul class="lnb-lst-tab crud">';

		/* DOGFOOT ktkang 보고서 형상관리 기능 구현  20200903 */
		if(typeof userJsonObject.userReportSeq == 'undefined' || userJsonObject.userReportSeq == '1001' || userJsonObject.userReportSeq == '') {
			html += '<li id="newReport" title="새로 만들기"><a class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_new.png" alt=""><span>새로 만들기</span></a></li>';
			//2020.02.04 mksong KERIS CUBEID 레포트 편집 모드 열기 UI 수정dogfoot
			if(!userJsonObject.selectCubeId){
				if(gDashboard.reportType !== 'DSViewer'){
					//2020.02.19 MKSONG 타이틀 추가 DOGFOOT
					html += '<li id="openReport" title="불러오기"><a class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_load.png" alt=""><span>불러오기</span></a></li>';	
				}
				else {
					//2020.02.19 MKSONG 타이틀 추가 DOGFOOT
					html += '<li id="load_dataset_viewer" title="데이터집합 불러오기"><a class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_load.png" alt=""><span>데이터집합<br>불러오기</span></a></li>';	
				}
			}
		}
		
		if((typeof userJsonObject.userReportSeq == 'undefined' || userJsonObject.userReportSeq == '1001' || userJsonObject.userReportSeq == '') && gDashboard.reportType !== 'DSViewer') {
			html += '<li class="more">';

			//2020.02.19 MKSONG 타이틀 추가 DOGFOOT
			html += '<a class="lnb-link saveReport" title="저장"><img src="' + WISE.Constants.context + '/resources/main/images/ico_save.png" alt=""><span>저장</span></a>';
			html += '<a class="arrow" title="more">more</a>';
			html += '<ul class="more-link">';
			html += '<li><a id="saveReport" class="saveReport">저장</a></li>';
			html += '<li><a id="saveReportAs">다른 이름으로 저장</a></li>';
			html += '</ul>';
			html += '</li>';
		} else if( gDashboard.reportType !== 'DSViewer'){
			html += '<li class="more">';

			//2020.02.19 MKSONG 타이틀 추가 DOGFOOT
			html += '<a class="lnb-link restoreReport" title="복원"><img src="' + WISE.Constants.context + '/resources/main/images/ico_save.png" alt=""><span>복원</span></a>';
			html += '<a class="arrow" title="more">more</a>';
			html += '<ul class="more-link">';
			html += '<li><a id="restoreReport" class="restoreReport">복원</a></li>';
			html += '<li><a id="restoreReportAs">다른 이름으로 복원</a></li>';
			html += '</ul>';
			html += '</li>';
		}
		
		if(gDashboard.reportType !== 'DSViewer'){
		/* DOGFOOT ktkang 보고서 삭제기능 추가  20200214 */
		//2020.02.19 MKSONG 타이틀 추가 DOGFOOT
		html += '<li id="deleteReport" title="삭제"><a class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_crudRemove.png" alt=""><span>삭제</span></a></li>';	
		/* DOGFOOT ktkang 리포트 다운로드 권한 구현  20201109 */
		html += '<li id="downloadId" class="more">';
		//2020.02.19 MKSONG 타이틀 추가 DOGFOOT
		//2020.02.20 MKSONG 다운로드 아이콘 통일 DOGFOOT
		html += '<a class="lnb-link" title="다운로드"><img src="' + WISE.Constants.context + '/resources/main/images/ico-download_new.png" alt=""><span>다운로드</span></a>';
		html += '<a class="arrow" title="more">more</a>';
//		html += '<ul class="more-link">';
		html += '<ul class="more-link right-type">';
		
		/* DOGFOOT hsshim 2020-02-06 navLayout 필요없는 부분 제거 */
		if(self.menuConfigJson.DOWNLOAD_MENU_TYPE.Office.visible){
			html += '<li class="more"><a>MS OFFICE</a>';
			html += '<ul class="more-link">';
			html += '<li><a id="downloadReportXLSX" class="downloadReport xlsx">EXCEL(.xlsx)</a></li>';
			html += '<li><a id="downloadReportXLS" class="downloadReport xls">EXCEL(.xls)</a></li>';
			//if(self.menuConfigJson.DOWNLOAD_MENU_TYPE.Office.doc)
				//html += '<li><a id="downloadReportDOC" class="downloadReport doc" href="#">WORD(.doc)</a></li>';
			//if(self.menuConfigJson.DOWNLOAD_MENU_TYPE.Office.ppt)	
				//html += '<li><a id="downloadReportPPT" class="downloadReport ppt" href="#">POWER POINT(.ppt)</a></li>';
			html += '</ul>';
			html += '</li>';
		}

		if(self.menuConfigJson.DOWNLOAD_MENU_TYPE.Hancom.visible){
			html += '<li class="more"><a>한컴오피스</a>';
			html += '<ul class="more-link">';
			if(self.menuConfigJson.DOWNLOAD_MENU_TYPE.Hancom.cell)	
				html += '<li><a id="downloadReportHanCell" class="downloadReport cell">한셀</a></li>';
			if(self.menuConfigJson.DOWNLOAD_MENU_TYPE.Hancom.hwp)	
				html += '<li><a id="downloadReportHanHWP" class="downloadReport hwp">한글</a></li>';
			if(self.menuConfigJson.DOWNLOAD_MENU_TYPE.Hancom.show)	
				html += '<li><a id="downloadReportHanShow" class="downloadReport show">한쇼</a></li>';
			html += '</ul>';
			html += '</li>';
		}
		
		if(self.menuConfigJson.DOWNLOAD_MENU_TYPE.Etc.visible){
			html += '<li class="more"><a href="#">기타</a>';
			html += '<ul class="more-link">';
			if(self.menuConfigJson.DOWNLOAD_MENU_TYPE.Etc.img)
				html += '<li><a id="downloadReportIMG" class="downloadReport img">이미지</a></li>';
			if(self.menuConfigJson.DOWNLOAD_MENU_TYPE.Etc.html)
				html += '<li><a id="downloadReportHTML" class="downloadReport html">HTML</a></li>';
			//if(self.menuConfigJson.DOWNLOAD_MENU_TYPE.Etc.pdf)
				//html += '<li><a id="downloadReportPDF" class="downloadReport pdf" href="#">PDF</a></li>';
			html += '</ul>';
			html += '</li>';
		}
		
		html += '</ul>';
		html += '</li>';
		
//		html += '<li id="insertDashboard" class="changeReport slide-ui-item more"><a href="#" class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_atypical02.png" alt=""><span>대시보드로 전환</span></a></li>';
		
		html += '</ul>'; //lnb-lst-tab
        html += '</div>'; //slide-ui
		}
        if((typeof userJsonObject.userReportSeq == 'undefined' || userJsonObject.userReportSeq == '1001' || userJsonObject.userReportSeq == '')&& gDashboard.reportType !== 'DSViewer') {
        html += '<div class="slide-ui">';
        html += '<ul class="lnb-lst-tab">';

        //2020.02.04 mksong KERIS 레포트 편집 모드 열기 UI 수정dogfoot
//        html += '<li><a href="#" class="lnb-link" onclick="bb();"><img src="' + WISE.Constants.context + '/resources/main/images/ico_dataset.png" alt=""><span>데이터 집합</span></a></li>';
		
		// 2020.01.07 mksong 고급 옵션으로 통합 작업 진행 dogfoot
//        html += '<li class="more"><a href="#" class="lnb-link arrow"><img src="' + WISE.Constants.context + '/resources/main/images/ico_highrank-option.png" alt=""><span>고급 옵션</span></a></a>';
//		html += '<ul class="more-link">';
//		html += '<li>';
//		
//		html += '<div style="height: 420px;">';
//		html += '<div class="add-item noitem">';
//		html += '<span class="add-item-head on">보고서 옵션</span>';
//		html += '<ul class="add-item-body">';
//		/**
//		 * KERIS 수정
//		 */
// 		// 2019.12.24 수정자 : ktkang 탭컨테이너 비정형에서는 안보이도록 DOGFOOT
//		if(gDashboard.reportType == 'DashAny') {
//			html += '<li><a id="insertContainer" href="#" class="insertItem advance-item"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_insert_container.png" alt=""><div class="advanced-item">컨테이너 추가</div></a></li>';
//		}
//		html += '<li><a id="createCustomField" href="#" class="advance-item"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_calculationField.png" alt=""><div class="advanced-item">사용자 정의<br>데이터</div></a></li>';
//		html += '</ul>';
//		html += '</div>';
//		
//		html += '</div>';
//		html += '</li>';
//		html += '</ul>';//more-link
//		html += '</li>';//more
		
		//2020.02.19 MKSONG 타이틀 추가 DOGFOOT
//        html += '<li id="createCustomField" title="사용자 정의 데이터"><a href="#" class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_calculationField.png" alt=""><span>사용자 정의<br>데이터</span></a></li>';
        html += '<li class="more">';
        //2020.02.19 MKSONG 타이틀 추가 DOGFOOT
		html += '<a id="addLinkedReport" class="lnb-link addLinkedReport" title="연결보고서"><img src="' + WISE.Constants.context + '/resources/main/images/ico_connectReportAdd.png" alt=""><span>연결보고서</span></a>';
		html += '<a class="arrow" title="more">more</a>';
		html += '<ul class="more-link" id="linkReportList">';
		html += '</ul>';
		html += '</li>';
		
		//2020.02.19 MKSONG 타이틀 추가 DOGFOOT
		if(self.menuConfigJson.TOP_MENU_TYPE.Scheduler.visible){
	        html += '<li id="openScheduler" title="스케줄링"><a class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_listBox.png" alt=""><span>스케줄링</span></a></li>';
		}
        // html += '<li><a id="deleteCustomField"></a></li>';
        html += '</ul>'; //lnb-lst-tab
        html += '</div>'; //slide-ui
		
		html += '<div class="slide-ui insertItemList" style="border-right: none;">';
		html += '<ul class="lnb-lst-tab" style="padding-right: 0px;">';
		
		// 2020.01.07 mksong 디자이너 비정형아이템 아이콘 이동으로 주석처리 dogfoot
		// mksong 2019.12.20 삭제된 소스 복원 dogfoot
//		html += '<li class="slide-ui-item more"><a id="insertInformal" href="#" class="changeReport lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_atypical01.png" alt=""><span>비정형 아이템</span></a>';
//		html += '<a href="#" class="arrow activeChangeLayout" title="more">more</a>';
//		html += '<ul class="more-link right-type">';
//		html += '<li><a id="changeLayoutC" class="changeLayout" href="#">차트만 보기</a></li>';
//		html += '<li><a id="changeLayoutG" class="changeLayout" href="#">그리드만 보기</a></li>';
//		html += '<li><a id="changeLayoutCG" class="changeLayout" href="#">차트와 그리드 동시에 보기</a></li>';
//		html += '</ul>';
//		html += '</li>';
		
		/**
		 * KERIS 수정
		 */
 		//2020.01.21 mksong 비정형 레이아웃 수정 dogfoot
 		/* DOGFOOT ktkang 비정형과 대시보드 레이아웃 나눔  20200130 */
		if(gDashboard.reportType == 'DashAny') {
			//2020.02.19 MKSONG 타이틀 추가 DOGFOOT
			if(self.menuConfigJson.TOP_MENU_TYPE.Container.visible){
				html += '<li id="insertContainer" class="insertItem" title="컨테이너 추가"><a href="#" class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_insert_container.png" alt=""><span>컨테이너 추가</span></a></li>';
			}
			html += '<li class="more"><a class="lnb-link addChart arrow" title="일반 차트">일반 차트</a>';
			html += '<ul class="more-link">';
			html += '<li>';
			
//			html += '<div class="scrollbar">';
			html += '<div style="height: 420px;">';
			
			html += '<div class="add-item noitem">';
			html += '<span class="add-item-head on">막대</span>';
			html += '<ul class="add-item-body">';
			html += '<li><a id="insertChart" class="changeReport insertItem" seriestype="Bar"><img src="' + WISE.Constants.context + '/resources/main/images/ico_bar2.png" alt=""><span>막대</span></a></li>';
			html += '<li><a id="insertChart" class="changeReport insertItem" seriestype="StackedBar"><img src="' + WISE.Constants.context + '/resources/main/images/ico_bar3.png" alt=""><span>스택 막대</span></a></li>';
			html += '<li><a id="insertChart" class="changeReport insertItem" seriestype="FullStackedBar"><img src="' + WISE.Constants.context + '/resources/main/images/ico_bar4.png" alt=""><span>풀스택 막대</span></a></li>';
			html += '<li><a id="insertRangeBarChart" class="changeReport insertItem" seriestype="rangeBar"><img src="' + WISE.Constants.context + '/resources/main/images/ico_rangebarchart.png" alt=""><span>바 분포</span></a></li>';
//			html += '<li><a href="#"><img src="' + WISE.Constants.context + '/resources/main/images/ico_bar4.png" alt=""><span>bar4</span></a></li>';
			html += '</ul>';
			html += '</div>';
			
			html += '<div class="add-item noitem">';
			html += '<span class="add-item-head on">선</span>';
			html += '<ul class="add-item-body">';
			html += '<li><a id="insertChart" class="changeReport insertItem" seriestype="Point"><img src="' + WISE.Constants.context + '/resources/main/images/ico_pointLine1.png" alt=""><span>점</span></a></li>';
			html += '<li><a id="insertChart" class="changeReport insertItem" seriestype="Line"><img src="' + WISE.Constants.context + '/resources/main/images/ico_pointLine2.png" alt=""><span>선</span></a></li>';
			html += '<li><a id="insertChart" class="changeReport insertItem" seriestype="StackedLine"><img src="' + WISE.Constants.context + '/resources/main/images/ico_pointLine3.png" alt=""><span>스택 선</span></a></li>';
			html += '<li><a id="insertChart" class="changeReport insertItem" seriestype="FullStackedLine"><img src="' + WISE.Constants.context + '/resources/main/images/ico_pointLine4.png" alt=""><span>풀스택 선</span></a></li>';
			html += '<li><a id="insertChart" class="changeReport insertItem" seriestype="StepLine"><img src="' + WISE.Constants.context + '/resources/main/images/ico_pointLine5.png" alt=""><span>계단</span></a></li>';
			html += '<li><a id="insertChart" class="changeReport insertItem" seriestype="Spline"><img src="' + WISE.Constants.context + '/resources/main/images/ico_pointLine6.png" alt=""><span>곡선</span></a></li>';
			html += '</ul>';
			html += '</div>';
			
			html += '<div class="add-item noitem">';
			html += '<span class="add-item-head on">영역</span>';
			html += '<ul class="add-item-body">';
			html += '<li><a id="insertChart" class="changeReport insertItem" seriestype="Area"><img src="' + WISE.Constants.context + '/resources/main/images/ico_area1.png" alt=""><span>영역</span></a></li>';
			html += '<li><a id="insertChart" class="changeReport insertItem" seriestype="StackedArea"><img src="' + WISE.Constants.context + '/resources/main/images/ico_area2.png" alt=""><span>스택 영역</span></a></li>';
			html += '<li><a id="insertChart" class="changeReport insertItem" seriestype="FullStackedArea"><img src="' + WISE.Constants.context + '/resources/main/images/ico_area3.png" alt=""><span>풀스택 영역</span></a></li>';
			html += '<li><a id="insertChart" class="changeReport insertItem" seriestype="StepArea"><img src="' + WISE.Constants.context + '/resources/main/images/ico_area4.png" alt=""><span>계단 영역</span></a></li>';
			html += '<li><a id="insertChart" class="changeReport insertItem" seriestype="SplineArea"><img src="' + WISE.Constants.context + '/resources/main/images/ico_area5.png" alt=""><span>곡선 영역</span></a></li>';
			html += '<li><a id="insertChart" class="changeReport insertItem" seriestype="StackedSplineArea"><img src="' + WISE.Constants.context + '/resources/main/images/ico_area6.png" alt=""><span>스택곡선 영역</span></a></li>';
			html += '<li><a id="insertChart" class="changeReport insertItem" seriestype="FullStackedSplineArea"><img src="' + WISE.Constants.context + '/resources/main/images/ico_area7.png" alt=""><span>풀스택곡선 영역</span></a></li>';
			html += '</ul>';
			html += '</div>';
			
//			html += '<div class="add-item noitem">';
//			html += '<span class="add-item-head on">Range</span>';
//			html += '<ul class="add-item-body">';
//			html += '<li><a href="#"><img src="' + WISE.Constants.context + '/resources/main/images/ico_range1.png" alt=""><span>Range1</span></a></li>';
//			html += '<li><a href="#"><img src="' + WISE.Constants.context + '/resources/main/images/ico_range2.png" alt=""><span>Range2</span></a></li>';
//			html += '</ul>';
//			html += '</div>';
//			
			html += '<div class="add-item noitem">';
			html += '<span class="add-item-head on">기타</span>';
			html += '<ul class="add-item-body">';
			/*2021-07-05 jhseo 버블차트 삭제 (나중에 기능 개발하던지 하기로함)*/
			//html += '<li><a id="insertChart" href="#" class="changeReport insertItem" seriestype="Bubble"><img src="' + WISE.Constants.context + '/resources/main/images/ico_bubble1.png" alt=""><span>버블</span></a></li>';
			//html += '<li><a id="insertBubbleChart" href="#" class="changeReport insertItem" seriestype="Bubble2"><img src="' + WISE.Constants.context + '/resources/main/images/ico_bubble1.png" alt=""><span>버블2</span></a></li>';
			html += '<li><a id="insertPieChart" class="changeReport insertItem" seriestype="PieChart"><img src="' + WISE.Constants.context + '/resources/main/images/ico_pie.png" alt=""><span>파이</span></a></li>';
			html += '<li><a id="insertTimeLineChart" class="changeReport insertItem" seriestype="timeLine"><img src="' + WISE.Constants.context + '/resources/main/images/ico_timeline.png" alt=""><span>타임라인</span></a></li>';
			html += '<li><a id="insertRangeAreaChart" class="changeReport insertItem" seriestype="rangeArea"><img src="' + WISE.Constants.context + '/resources/main/images/ico_range2.png" alt=""><span>영역 분포</span></a></li>';
			html += '<li><a id="insertFunnelChart" class="changeReport insertItem" seriestype="funnelChart"><img src="' + WISE.Constants.context + '/resources/main/images/ico_funnel.png" alt=""><span>퍼널 차트</span></a></li>';
			html += '<li><a id="insertPyramidChart" class="changeReport insertItem" seriestype="pyramidChart"><img src="' + WISE.Constants.context + '/resources/main/images/ico_pyramid.png" alt=""><span>피라미드 차트</span></a></li>';
//			html += '<li><a id="insertRangeBarChart" href="#" class="changeReport insertItem" seriestype="rangeBar"><img src="' + WISE.Constants.context + '/resources/main/images/ico_pie.png" alt=""><span>레인지 바</span></a></li>';
			
			html += '</ul>';
			html += '</div>';
//			
//			html += '<div class="add-item noitem">';
//			html += '<span class="add-item-head on">Finance</span>';
//			html += '<ul class="add-item-body">';
//			html += '<li><a href="#"><img src="' + WISE.Constants.context + '/resources/main/images/ico_finance1.png" alt=""><span>Finance1</span></a></li>';
//			html += '<li><a href="#"><img src="' + WISE.Constants.context + '/resources/main/images/ico_finance2.png" alt=""><span>Finance2</span></a></li>';
//			html += '<li><a href="#"><img src="' + WISE.Constants.context + '/resources/main/images/ico_finance3.png" alt=""><span>Finance3</span></a></li>';
//			html += '</ul>';
//			html += '</div>';
			
			html += '</div>';//scroll-bar
			html += '</li>';
			html += '</ul>';//more-link
			html += '</li>';//more
			
			//2020.02.19 MKSONG 타이틀 추가 DOGFOOT
//			html += '<li class="slide-ui-item" title="막대"><a id="insertChart" href="#" class="changeReport insertItem lnb-link bar1" seriestype="Bar"><img src="' + WISE.Constants.context + '/resources/main/images/ico_bar1.png" alt=""><span>막대</span></a></li>';
//			html += '<li class="slide-ui-item"><a id="insertChart" href="#" class="changeReport insertItem lnb-link line2" seriestype="Line"><img src="' + WISE.Constants.context + '/resources/main/images/ico_pointLine2.png" alt=""><span>선</span></a></li>';
//			html += '<li class="slide-ui-item"><a id="insertChart" href="#" class="changeReport insertItem lnb-link area3" seriestype="FullStackedArea"><img src="' + WISE.Constants.context + '/resources/main/images/ico_area3.png" alt=""><span>풀스택영역</span></a></li>';
//			html += '<li class="slide-ui-item"><a id="insertChart" href="#" class="changeReport insertItem lnb-link bubble1" seriestype="Bubble"><img src="' + WISE.Constants.context + '/resources/main/images/ico_bubble1.png" alt=""><span>버블</span></a></li>';

			html += '</ul>'; //lnb-lst-tab
			html += '</div>'; //slide-ui
			
			html += '</div>'; //menu-comp
			
			html += '<div class="menu-comp custom-menu">';

			// 2020.01.16 mksong 영역 크기 조정 dogfoot
			html += '<div class="slide-ui responsive insertItemList" style="width:40%;"><a class="slide-ui-prev">prev</a><a class="slide-ui-next">next</a>';
			html += '<ul class="slide-ui-list lnb-lst-tab">';
//			html += '<li id="insertPivotGrid" class="changeReport insertItem slide-ui-item more" seriestype="PivotGrid"><a href="#" class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_pivotGrid.png" alt=""><span>피벗그리드</span></a></li>'+
//			'		 <li id="insertDataGrid" class="changeReport insertItem slide-ui-item more" seriestype="DataGrid"><a href="#" class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_basicGrid.png" alt=""><span>일반그리드</span></a></li>' + 
//			'			                    <li class="slide-ui-item"><a href="#" class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_dispersionChart.png" alt=""><span>분산형차트</span></a></li>' + 
//			'		 <li id="insertPieChart" class="changeReport insertItem slide-ui-item" seriestype="PieChart"><a href="#" class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_pie.png" alt=""><span>파이차트</span></a></li>';
//			'			                    <li class="slide-ui-item"><a href="#" class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_fullClrcular.png" alt=""><span>게이지</span></a></li>' + 
//			'			                    <li class="slide-ui-item"><a href="#" class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_card.png" alt=""><span>카드</span></a></li>' + 
//			'			                    <li class="slide-ui-item"><a href="#" class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_treeView.png" alt=""><span>트리맵</span></a></li>' + 
//			'		 <li id="insertChoroplethMap" class="changeReport insertItem slide-ui-item" seriestype="ChoroplethMap"><a href="#" class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_corroflesMap.png" alt=""><span>코로플레스 지도</span></a></li>' + 
//			'		 <li id="insertParallelCoordinate" class="changeReport insertItem slide-ui-item" seriestype="ParallelCoordinate"><a href="#" class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_parallelCoordinateSystem.png" alt=""><span>평행좌표계</span></a></li>' +
//			'		 <li id="insertTreemap" class="changeReport insertItem slide-ui-item" seriestype="TreeMap"><a href="#" class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_squariFied.png" alt=""><span>트리맵</span></a></li>'+
//			'		 <li id="insertStarchart" class="changeReport insertItem slide-ui-item" seriestype="StarChart"><a href="#" class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_starChart.png" alt=""><span>스타차트</span></a></li>' + 
//			'		 <li id="insertHeatMap" class="changeReport insertItem slide-ui-item" seriestype="HeatMap"><a href="#" class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_heatMap.png" alt=""><span>히트맵</span></a></li>'+
//			'		 <li id="insertImage" class="changeReport insertItem slide-ui-item" seriestype="Image"><a href="#" class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_images.png" alt=""><span>이미지</span></a></li>' +
//			'		 <li class="slide-ui-item more"><a href="#" class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_basicFilter.png" alt=""><span>필터항목</span></a><a href="#" class="arrow">more</a>'+
//			'		 	<ul class="more-link">'+
//			'		    	<li id="insertComboBox" class="changeReport insertItem"><a href="#"><img src="' + WISE.Constants.context + '/resources/main/images/ico_comboBox.png" alt=""><span>콤보박스</span></a></li>'+
//			'			    <li id="insertListBox" class="changeReport insertItem"><a href="#"><img src="' + WISE.Constants.context + '/resources/main/images/ico_listBox.png" alt=""><span>목록상자</span></a></li>'+
//			'			    <li id="insertTreeView" class="changeReport insertItem"><a href="#"><img src="' + WISE.Constants.context + '/resources/main/images/ico_treeView.png" alt=""><span>트리보기</span></a></li>'+
//			'			 </ul>'+
//			'		 </li>';
			
			if(self.menuConfigJson.TOP_MENU_TYPE.InsertAdHoc.visible){
				html += '<li id="insertAdHocItem" href="#" class="insertItem" title="비정형 아이템"><a href="#" class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_atypical01.png" alt=""><span>비정형 아이템</span></a></li>';
			}
			//2020.02.19 MKSONG 타이틀 추가 DOGFOOT
			html += '<li id="insertPivotGrid" class="changeReport insertItem slide-ui-item more" seriestype="PivotGrid" title="피벗그리드"><a href="#" class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_pivotGrid.png" alt=""><span>피벗그리드</span></a></li>';
			html += '<li id="insertDataGrid" class="changeReport insertItem slide-ui-item more" seriestype="DataGrid" title="일반그리드"><a href="#" class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_basicGrid.png" alt=""><span>일반그리드</span></a></li>'; 
//			html += '<li id="insertPieChart" class="changeReport insertItem slide-ui-item more" seriestype="PieChart" title="파이차트"><a href="#" class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_pie.png" alt=""><span>파이차트</span></a></li>';
//			KERIS
			// Image
//			html += '<li id="insertImage" class="changeReport insertItem slide-ui-item more" seriestype="Image"><a href="#" class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_images.png" alt=""><span>이미지</span></a></li>';
			// Textbox
//			html += '<li id="insertTextBox" class="changeReport insertItem slide-ui-item more" seriestype="Textbox"><a href="#" class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_textbox.png" alt=""><span>텍스트 상자</span></a></li>';
//			KERIS 주석끝

			
			// 고급 차트 추가
			//2020.02.19 MKSONG 타이틀 추가 DOGFOOT
			html += '<li class="more"><a href="#" class="lnb-link addChart arrow" title="고급 시각화">고급 시각화</a>';
			html += '<ul class="more-link">';
			html += '<li>';
			
//			KERIS 760 -> 380
//			html += '<div style="height: 600px;">'; --최초 600
			/*dogfoot 고급 시각화 레이아웃 수정 shlim 20201202*/
			html += '<div class="scrollbar hauto">';
//			html += '<div style="height: 760px;" >';
//			html += '<div style="height: 380px;">';
//			KERIS 주석 끝
			// 카드 및 게이지
			//2020.02.07 mksong 아이템 추가 dogfoot
//			html += '<div class="add-item noitem">';
////			html += '<span class="add-item-head on">카드 및 게이지</span>';
//			html += '<span class="add-item-head on">카드</span>';
//			html += '<ul class="add-item-body">';
//			//2020.02.19 MKSONG 타이틀 추가 DOGFOOT
//			html += '<li title="카드"><a id="insertCard" href="#" class="changeReport insertItem advance-item" seriestype="Card"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_card.png" alt=""><div class="advanced-item">카드</div></a></li>';
////			html += '<li><a id="insertGauge" href="#" class="changeReport insertItem advance-item" seriestype="Gauge"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_halfClrcular.png" alt=""><div class="advanced-item">게이지</div></a></li>';
//			html += '</ul>';
//			html += '</div>';
//			// 지도 = 공간시각화
//			html += '<div class="add-item noitem">';
//			html += '<span class="add-item-head on">지도</span>';
//			html += '<ul class="add-item-body">';
//			//2020.02.19 MKSONG 타이틀 추가 DOGFOOT
//			html += '<li title="코로플레스"><a id="insertChoroplethMap" href="#" class="changeReport insertItem advance-item" seriestype="ChoroplethMap"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_corroflesMap.png" alt=""><div class="advanced-item">코로플레스</div></a></li>';
//			html += '</ul>';
//			html += '</div>';
			
			// 분포 시각화 = 파이차트, 도우넛차트, 트리맵, 누적연속그래프
//			html += '<div class="add-item noitem">';
//			html += '<span class="add-item-head on">분포 시각화</span>';
//			html += '<ul class="add-item-body">';
//			//2020.02.19 MKSONG 타이틀 추가 DOGFOOT
//			html += '</ul>';
//			html += '</div>';
			
			// 관계 시각화 = 스캐터플롯, 버블차트, 히스토그램
			html += '<div class="add-item noitem">';
			html += '<span class="add-item-head on">관계 시각화</span>';
			html += '<ul class="add-item-body advanced-item">';
			//2020.02.19 MKSONG 타이틀 추가 DOGFOOT
			html += '<li title="히스토그램"><a id="insertHistogramChart" href="#" class="changeReport insertItem advance-item" seriestype="TreeMap"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_histogram.png" alt=""><div class="advanced-item">히스토그램</div></a></li>';
			// 2019.12.16 수정자 : mksong 워드클라우드 아이콘 수정  DOGFOOT
			//2020.02.19 MKSONG 타이틀 추가 DOGFOOT
			html += '<li title="워드클라우드"><a id="insertWordCloud" href="#" class="changeReport insertItem advance-item" seriestype="TreeMap"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_wordcloud.png" alt=""><div class="advanced-item">워드클라우드</div></a></li>';
			html += '<li title="네모영역"><a id="insertRectangularAreaChart" href="#" class="changeReport insertItem advance-item" seriestype="TreeMap"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_RectangularAreaChart.png" alt=""><div class="advanced-item">네모영역</div></a></li>';
			html += '<li title="버블차트"><a id="insertBubbleD3" href="#" class="changeReport insertItem advance-item" seriestype="TreeMap"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_bubbled3.png" alt=""><div class="advanced-item">버블차트</div></a></li>';
			html += '<li title="폭포수차트"><a id="insertWaterfallchart" href="#" class="changeReport insertItem advance-item" seriestype="TreeMap"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_waterfall.png" alt=""><div class="advanced-item">폭포수차트</div></a></li>';
			html += '<li title="산점도"><a id="insertScatterPlot" href="#" class="changeReport insertItem advance-item" seriestype="TreeMap"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_scatter.png" alt=""><div class="advanced-item">산점도</div></a></li>';
			/*dogfoot 고급 시각화 레이아웃 수정 shlim 20201202*/
//			html += '<br>'
			html += '<li title="버블차트2"><a id="insertScatterPlot2" href="#" class="changeReport insertItem advance-item" seriestype="TreeMap"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_scatter.png" alt=""><div class="advanced-item">버블차트2</div></a></li>';
			html += '<li title="산점도 행렬"><a id="insertScatterPlotMatrix" href="#" class="changeReport insertItem advance-item" seriestype="TreeMap"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_scatterMatrix.png" alt=""><div class="advanced-item">산점도 행렬</div></a></li>';
			html += '</ul>';
			html += '</div>';
			
			// 연관 시각화 = 이분법차트, 샌키차트, 계층차트, 네트워크
			html += '<div class="add-item noitem">';
			html += '<span class="add-item-head on">연관 시각화</span>';
			html += '<ul class="add-item-body advanced-item">';
			html += '<li title="이분법차트"><a id="insertBipartitechart" href="#" class="changeReport insertItem advance-item" seriestype="TreeMap"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_bipartite.png" alt=""><div class="advanced-item">이분법차트</div></a></li>';
			html += '<li title="샌키차트"><a id="insertSankeychart" href="#" class="changeReport insertItem advance-item" seriestype="TreeMap"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_sankey.png" alt=""><div class="advanced-item">샌키차트</div></a></li>';
			html += '<li title="계층차트"><a id="insertHierarchicalEdge" href="#" class="changeReport insertItem advance-item" seriestype="HierarchicalEdge"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_hierarchy.jpg" alt=""><div class="advanced-item" >계층차트</div></a></li>';
			html += '<li title="네트워크_축소"><a id="insertForceDirect" href="#" class="changeReport insertItem advance-item" seriestype="ForceDirect"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_network_small.jpg" alt=""><div class="advanced-item">네트워크-축소</div></a></li>';
			html += '<li title="네트워크_확대"><a id="insertForceDirectExpand" href="#" class="changeReport insertItem advance-item" seriestype="ForceDirectExpand"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_network_big.jpg" alt=""><div class="advanced-item">네트워크-확대</div></a></li>';
			html += '<li title="의존성휠"><a id="insertDependencyWheel" href="#" class="changeReport insertItem advance-item" seriestype="DependencyWheel"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_dependencyWheel.png" alt=""><div class="advanced-item" >의존성휠</div></a></li>';
			/*dogfoot 고급 시각화 레이아웃 수정 shlim 20201202*/
//			html += '<br>';
			html += '<li title="캘린더뷰"><a id="insertCalendarViewChart" href="#" class="changeReport insertItem advance-item" seriestype="CalendarViewChart"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_calendarviewchart.png" alt=""><div class="advanced-item" >캘린더 뷰</div></a></li>';
			html += '<li title="캘린더2뷰"><a id="insertCalendarView2Chart" href="#" class="changeReport insertItem advance-item" seriestype="CalendarView2Chart"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_calendarviewchart2.png" alt=""><div class="advanced-item" >캘린더2 뷰</div></a></li>';
			html += '<li title="캘린더3뷰"><a id="insertCalendarView3Chart" href="#" class="changeReport insertItem advance-item" seriestype="CalendarView3Chart"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_calendarviewchart3.png" alt=""><div class="advanced-item" >캘린더3 뷰</div></a></li>';
			html += '<li title="아크다이어그램"><a id="insertArcDiagram" href="#" class="changeReport insertItem advance-item" seriestype="CalendarView3Chart"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_arcDiagram.png" alt=""><div class="advanced-item" >아크다이어그램</div></a></li>';
			html += '</ul>';
			html += '</div>';
			
			// 비교 시각화 = 히트맵, 스타차트, 평행 좌표계, 다차원 척도법
			html += '<div class="add-item noitem">';
			html += '<span class="add-item-head on">비교/분포 시각화</span>';
			html += '<ul class="add-item-body">';
			//2020.02.19 MKSONG 타이틀 추가 DOGFOOT
			html += '<li title="평행좌표계"><a id="insertParallelCoordinate" href="#" class="changeReport insertItem advance-item" seriestype="ParallelCoordinate"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_parallelCoordinateSystem.png" alt=""><div class="advanced-item" >평행좌표계</div></a></li>';
			html += '<li title="스타차트"><a id="insertStarchart" href="#" class="changeReport insertItem advance-item" seriestype="StarChart"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_starChart.png" alt=""><div class="advanced-item" >스타차트</div></a></li>';
//			html += '<li title="히트맵"><a id="insertHeatMap" href="#" class="changeReport insertItem advance-item" seriestype="HeatMap"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_heatMap.png" alt=""><div class="advanced-item" >히트맵</div></a></li>';
			html += '<li title="트리맵"><a id="insertTreemap" href="#" class="changeReport insertItem advance-item" seriestype="TreeMap"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_squariFied.png" alt=""><div class="advanced-item">트리맵</div></a></li>';
			html += '<li title="버블팩차트"><a id="insertBubblePackChart" href="#" class="changeReport insertItem advance-item" seriestype="BubblePackChart"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_bubblepackchart.png" alt=""><div class="advanced-item" >버블팩</div></a></li>';
//			html += '<li title="퍼널차트"><a id="insertFunnelChart" href="#" class="changeReport insertItem advance-item" seriestype="FunnelChart"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_funnel.png" alt=""><div class="advanced-item">퍼널차트</div></a></li>';
//			html += '<li title="피라미드차트"><a id="insertPyramidChart" href="#" class="changeReport insertItem advance-item" seriestype="PyramidChart"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_pyramid.png" alt=""><div class="advanced-item">피라미드차트</div></a></li>';
//			html += '<li title="레인지바차트"><a id="insertRangeBarChart" href="#" class="changeReport insertItem advance-item" seriestype="RangeBar"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_rangebarchart.png" alt=""><div class="advanced-item">바 분포</div></a></li>';
//			html += '<li title="레인지영역차트"><a id="insertRangeAreaChart" href="#" class="changeReport insertItem advance-item" seriestype="RangeArea"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_range2.png" alt=""><div class="advanced-item">영역 분포</div></a></li>';
//			html += '<li title="타임라인차트"><a id="insertTimeLineChart" href="#" class="changeReport insertItem advance-item" seriestype="TimeLine"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_timeline.png" alt=""><div class="advanced-item">타임라인</div></a></li>';
			html += '<li title="긍정/부정비교"><a id="insertDivergingChart" href="#" class="changeReport insertItem advance-item" seriestype="TreeMap"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_diverging.png" alt=""><div class="advanced-item">긍정/부정비교</div></a></li>';
			html += '<li title="박스플롯"><a id="insertBoxPlot" href="#" class="changeReport insertItem advance-item" seriestype="TreeMap"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_boxplot.png" alt=""><div class="advanced-item">박스플롯</div></a></li>';
			/*dogfoot 고급 시각화 레이아웃 수정 shlim 20201202*/
//			html += '<br>';
			html += '<li title="신경망바차트"><a id="insertDendrogramBarChart" href="#" class="changeReport insertItem advance-item" seriestype="DendrogramBarChart"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_dendrogrambarchart.png" alt=""><div class="advanced-item" >신경망 바</div></a></li>';
			html += '<li title="액체게이지"><a id="insertLiquidFillGauge" href="#" class="changeReport insertItem advance-item" seriestype="TreeMap"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_liquidFillGauge.png" alt=""><div class="advanced-item">액체게이지</div></a></li>';
			html += '<li title="히트맵"><a id="insertHeatMap2" href="#" class="changeReport insertItem advance-item" seriestype="HeatMap"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_heatMap.png" alt=""><div class="advanced-item" >히트맵</div></a></li>';
			html += '<li title="선버스트"><a id="insertSequencesSunburst" href="#" class="changeReport insertItem advance-item" seriestype="HeatMap"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_sequencesSunburst.PNG" alt=""><div class="advanced-item" >선버스트</div></a></li>';
			html += '<li title="신경망트리"><a id="insertCollapsibleTreeChart" href="#" class="changeReport insertItem advance-item" seriestype="CollapsibleTreeChart"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_collapsibletreechart.png" alt=""><div class="advanced-item" >신경망 트리</div></a></li>';
			html += '<br>';
			html += '<li title="방사형신경망"><a id="insertRadialTidyTree" href="#" class="changeReport insertItem advance-item" seriestype="CollapsibleTreeChart"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_radialTidyTree.png" alt=""><div class="advanced-item" >방사형신경망</div></a></li>';
//			html += '</ul>';
			html += '<li title="타임라인"><a id="insertHistoryTimeline" href="#" class="changeReport insertItem advance-item" seriestype="CollapsibleTreeChart"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_timeline.png" alt=""><div class="advanced-item" >타임라인</div></a></li>';
			html += '<li title="평면좌표라인"><a id="insertCoordinateLine" href="#" class="changeReport insertItem advance-item" seriestype="CollapsibleTreeChart"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_coordinate.png" alt=""><div class="advanced-item" >평면좌표라인</div></a></li>';
			html += '<li title="평면좌표점"><a id="insertCoordinateDot" href="#" class="changeReport insertItem advance-item" seriestype="CollapsibleTreeChart"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_coordinate_dot.png" alt=""><div class="advanced-item" >평면좌표점</div></a></li>';
			html += '<li title="동기화라인차트"><a id="insertSynchronizedChart" href="#" class="changeReport insertItem advance-item" seriestype="HeatMap"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_pointLine3.png" alt=""><div class="advanced-item" >동기화라인차트</div></a></li>';
			html += '</ul>';
			html += '</div>';
			
			
			//html += '<div class="add-item noitem">';
			//html += '<span class="add-item-head on">고급 시각화</span>';
			//html += '<ul class="add-item-body">';
			//html += '<li title="캘린더2뷰"><a id="insertCalendarView2Chart" href="#" class="changeReport insertItem advance-item" seriestype="CalendarView2Chart"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_calendarviewchart.png" alt=""><div class="advanced-item" >캘린더2 뷰</div></a></li>';
			//html += '<li title="캘린더3뷰"><a id="insertCalendarView3Chart" href="#" class="changeReport insertItem advance-item" seriestype="CalendarView3Chart"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_calendarviewchart.png" alt=""><div class="advanced-item" >캘린더3 뷰</div></a></li>';
			//html += '<li title="신경망트리"><a id="insertCollapsibleTreeChart" href="#" class="changeReport insertItem advance-item" seriestype="CollapsibleTreeChart"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_calendarviewchart.png" alt=""><div class="advanced-item" >신경망 트리</div></a></li>';
			//html += '</ul>';
			//html += '</div>';
			
			// 필터 영역
			html += '<div class="add-item noitem">';
			html += '<span class="add-item-head on">필터</span>';
			html += '<ul class="add-item-body">';
			//2020.02.19 MKSONG 타이틀 추가 DOGFOOT
			html += '<li title="콤보상자"><a id="insertComboBox" href="#" class="changeReport insertItem advance-item"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_comboBox.png" alt=""><div class="advanced-item">콤보상자</div></a></li>';
			html += '<li title="목록상자"><a id="insertListBox" href="#" class="changeReport insertItem advance-item"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_listBox.png" alt=""><div class="advanced-item">목록상자</div></a></li>';
			html += '<li title="트리보기"><a id="insertTreeView" href="#" class="changeReport insertItem advance-item"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_treeView.png" alt=""><div class="advanced-item">트리보기</div></a></li>';
			html += '</ul>';
			html += '</div>';
			
//			KERIS
			html += '<div class="add-item noitem">';
			html += '<span class="add-item-head on">기타 항목</span>';
			html += '<ul class="add-item-body">';
			//2020.02.19 MKSONG 타이틀 추가 DOGFOOT
			html += '<li title="이미지"><a id="insertImage"  href="#" class="changeReport insertItem advance-item"><img src="' + WISE.Constants.context + '/resources/main/images/ico_images.png" alt=""><div class="advanced-item">이미지</div></a></li>';
//			2019.12.20 mksong text overflow 오류 수정 dogfoot
			//2020.02.19 MKSONG 타이틀 추가 DOGFOOT
			html += '<li title="텍스트 상자"><a id="insertTextBox" href="#" class="changeReport insertItem advance-item"><img src="' + WISE.Constants.context + '/resources/main/images/ico_textbox.png" alt=""><div class="advanced-item">텍스트 상자</div></a></li>';
			html += '<li title="코로플레스"><a id="insertChoroplethMap" href="#" class="changeReport insertItem advance-item" seriestype="ChoroplethMap"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_corroflesMap.png" alt=""><div class="advanced-item">코로플레스</div></a></li>';
			var __bmtFlag = (Number(DevExpress.VERSION.split('.')[0])>=20);			
			if(__bmtFlag) {
				//html += '<li title="카카오 지도"><a id="insertKakaoMap2" href="#" class="changeReport insertItem advance-item" seriestype="KakaoMap2"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_corroflesMap.png" alt=""><div class="advanced-item">카카오 지도</div></a></li>';
			} else {
				html += '<li title="카카오 지도"><a id="insertKakaoMap" href="#" class="changeReport insertItem advance-item" seriestype="KakaoMap"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_corroflesMap.png" alt=""><div class="advanced-item">카카오 지도</div></a></li>';
			}
			html += '<li title="카드"><a id="insertCard" href="#" class="changeReport insertItem advance-item" seriestype="Card"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_card.png" alt=""><div class="advanced-item">카드</div></a></li>';
			html += '</ul>';
			html += '</div>';
			html += '</div>';//scroll-bar
			html += '</li>';
			html += '</ul>';//more-link
			html += '</li>';//more
			
			if (Array.isArray(userJsonObject.wpMenuConfig) && userJsonObject.wpMenuConfig.length > 0) {
				
				var treeWpMenuConfig = {};
				
				userJsonObject.wpMenuConfig.forEach(function(item){
				    if(typeof treeWpMenuConfig[item.PROJ_ID] == "undefined"){
				    	treeWpMenuConfig[item.PROJ_ID] = {PROJ_NM: item.PROJ_NM, MODEL: []};
				    }
				    treeWpMenuConfig[item.PROJ_ID].MODEL.push({MODEL_ID:item.MODEL_ID, MODEL_NM: item.MODEL_NM});
				});
				
				
				html += '<li class="more"><a href="#" class="lnb-link addChart arrow" title="WP 연동">WP 연동</a>';
				html += '<ul class="more-link">';
				html += '<li>';

				html += '<div class="scrollbar hauto">';
				
				$.each(treeWpMenuConfig, function(proj_id, info){
					html += '<div class="add-item noitem" proj_id="'+proj_id+'">';
					html += '<span class="add-item-head on">'+info.PROJ_NM+'</span>';
					html += '<ul class="add-item-body advanced-item">';
					
					for(var i = 0; i < info.MODEL.length; i++){
						html += '<li model_id="'+info.MODEL[i].MODEL_ID+'" title="'+info.MODEL[i].MODEL_NM+'"><a id="'+info.MODEL[i].MODEL_ID+'" href="#" class="changeReport insertItem advance-item" seriestype="TreeMap"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_histogram.png" alt=""><div class="advanced-item" style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">'+info.MODEL[i].MODEL_NM+'</div></a></li>';
					}
					
					html += '</ul>';
					html += '</div>';
				})
				
				html += '</div>';//scroll-bar
				html += '</li>';
				html += '</ul>';//more-link
				html += '</li>';
			}
			
			html += '</ul>';
			html += '</div>';
			
			html += '</div>';
			

		}else if(gDashboard.reportType == 'AdHoc'){
			html += '<li class="more">';
			html += '<a class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_atypical02.png" alt=""><span>레이아웃</span></a>';
			html += '<a class="arrow" title="more">more</a>';
			html += '<ul class="more-link">';
			html += '<li><a id="changeLayoutC" class="changeLayout">차트만 보기</a></li>';
			html += '<li><a id="changeLayoutG" class="changeLayout">그리드만 보기</a></li>';
			html += '<li><a id="changeLayoutCG" class="changeLayout">차트와 그리드 동시에 보기</a></li>';
			html += '<li><a id="recoveryLayout" class="changeLayout">초기화</a></li>';
//			html += '<li><a id="changeLayoutCLGR" class="changeLayout" href="#">차트 왼쪽 / 그리드 오른쪽</a></li>';
//			html += '<li><a id="changeLayoutCRGL" class="changeLayout" href="#">차트 오른쪽 / 그리드 왼쪽</a></li>';
//			html += '<li><a id="changeLayoutCTGB" class="changeLayout" href="#">차트 위 / 그리드 아래</a></li>';
//			html += '<li><a id="changeLayoutCBGT" class="changeLayout" href="#">차트 아래 / 그리드 위</a></li>';
			html += '</ul>';
			html += '</li>';
			html += '</ul>';
			html += '</div>';
			html += '</div>';
			html += '<div class="menu-comp custom-menu">';
			html += '</div>';
		/* DOGFOOT ktkang 통계 분석 부분 추가  20201102 */
		}else if(gDashboard.reportType == 'StaticAnalysis') {
			// 고급 차트 추가
			html += '<li class="more"><a class="lnb-link addChart arrow" title="통계분석">통계분석</a>';
			html += '<ul class="more-link">';
			html += '<li>';
			
			html += '<div class="scrollbar h600" style="height: auto !important">';
			
			// 통계분석
			html += '<div class="add-item noitem">';
			html += '<span class="add-item-head on">분산분석</span>';
			html += '<ul class="add-item-body advanced-item">';
			/* DOGFOOT ktkang 통계 UI 수정  20201126 */
			html += '<li title="일원배치"><a id="insertOnewayAnova" class="changeReport insertItem advance-item" seriestype="TreeMap"' + (gDashboard.analysisType == '' || gDashboard.analysisType == 'insertOnewayAnova' ? 'style="border: 1px solid #c5ccdd;background: #f5f6fa;"' : '') + '><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_boxplot.png" alt=""><div class="advanced-item">일원배치</div></a></li>';
			html += '<li title="반복있는 이원배치"><a id="insertTwowayAnova" class="changeReport insertItem advance-item" seriestype="TreeMap"' + (gDashboard.analysisType == 'insertTwowayAnova' ? 'style="border: 1px solid #c5ccdd;background: #f5f6fa;"' : '') + '><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_boxplot.png" alt=""><div class="advanced-item">반복있는<br>이원배치</div></a></li>';
			html += '<li title="반복없는 이원배치"><a id="insertOnewayAnova2" class="changeReport insertItem advance-item" seriestype="TreeMap"' + (gDashboard.analysisType == 'insertOnewayAnova2' ? 'style="border: 1px solid #c5ccdd;background: #f5f6fa;"' : '') + '><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_boxplot.png" alt=""><div class="advanced-item">반복없는<br>이원배치</div></a></li>';
			html += '</ul>';
			html += '</div>';
			
			html += '<div class="add-item noitem">';
			html += '<span class="add-item-head on">상관분석</span>';
			html += '<ul class="add-item-body advanced-item">';
			html += '<li title="피어슨"><a id="insertPearsonsCorrelation" class="changeReport insertItem advance-item" seriestype="TreeMap"' + (gDashboard.analysisType == 'insertPearsonsCorrelation' ? 'style="border: 1px solid #c5ccdd;background: #f5f6fa;"' : '') + '><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_heatMap.png" alt=""><div class="advanced-item">피어슨</div></a></li>';
			html += '<li title="스피어만"><a id="insertSpearmansCorrelation" class="changeReport insertItem advance-item" seriestype="TreeMap"' + (gDashboard.analysisType == 'insertSpearmansCorrelation' ? 'style="border: 1px solid #c5ccdd;background: #f5f6fa;"' : '') + '><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_heatMap.png" alt=""><div class="advanced-item">스피어만</div></a></li>';
			html += '</ul>';
			html += '</div>';
			
			html += '<div class="add-item noitem">';
			html += '<span class="add-item-head on">회귀분석</span>';
			html += '<ul class="add-item-body advanced-item">';
			html += '<li title="단순선형"><a id="insertSimpleRegression" class="changeReport insertItem advance-item" seriestype="TreeMap"' + (gDashboard.analysisType == 'insertSimpleRegression' ? 'style="border: 1px solid #c5ccdd;background: #f5f6fa;"' : '') + '><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_pointLine2.png" alt=""><div class="advanced-item">단순선형</div></a></li>';
			html += '<li title="다중선형"><a id="insertMultipleRegression" class="changeReport insertItem advance-item" seriestype="TreeMap"' + (gDashboard.analysisType == 'insertMultipleRegression' ? 'style="border: 1px solid #c5ccdd;background: #f5f6fa;"' : '') + '><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_pointLine2.png" alt=""><div class="advanced-item">다중선형</div></a></li>';
			html += '<li title="로지스틱"><a id="insertLogisticRegression" class="changeReport insertItem advance-item" seriestype="TreeMap"' + (gDashboard.analysisType == 'insertLogisticRegression' ? 'style="border: 1px solid #c5ccdd;background: #f5f6fa;"' : '') + '><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_pointLine6.png" alt=""><div class="advanced-item">로지스틱</div></a></li>';
			html += '<li title="로지스틱 다중"><a id="insertMultipleLogisticRegression" class="changeReport insertItem advance-item" seriestype="TreeMap"' + (gDashboard.analysisType == 'insertMultipleLogisticRegression' ? 'style="border: 1px solid #c5ccdd;background: #f5f6fa;"' : '') + '><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_pointLine6.png" alt=""><div class="advanced-item">로지스틱다중</div></a></li>';
			html += '</ul>';
			html += '</div>';
			
			/* DOGFOOT ktkang 가설검정 T-test 추가  20210204 */
			html += '<div class="add-item noitem">';
			html += '<span class="add-item-head on">가설검정</span>';
			html += '<ul class="add-item-body advanced-item">';
			html += '<li title="T검정"><a id="insertTtest" class="changeReport insertItem advance-item" seriestype="TreeMap"' + (gDashboard.analysisType == 'insertTtest' ? 'style="border: 1px solid #c5ccdd;background: #f5f6fa;"' : '') + '><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_pointLine2.png" alt=""><div class="advanced-item">T검정</div></a></li>';
			html += '<li title="Z검정"><a id="insertZtest" class="changeReport insertItem advance-item" seriestype="TreeMap"' + (gDashboard.analysisType == 'insertZtest' ? 'style="border: 1px solid #c5ccdd;background: #f5f6fa;"' : '') + '><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_pointLine2.png" alt=""><div class="advanced-item">Z검정</div></a></li>';
			html += '<li title="카이제곱검정"><a id="insertChitest" class="changeReport insertItem advance-item" seriestype="TreeMap"' + (gDashboard.analysisType == 'insertChitest' ? 'style="border: 1px solid #c5ccdd;background: #f5f6fa;"' : '') + '><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_pointLine6.png" alt=""><div class="advanced-item">카이제곱검정</div></a></li>';
			html += '<li title="F검정"><a id="insertFtest" class="changeReport insertItem advance-item" seriestype="TreeMap"' + (gDashboard.analysisType == 'insertFtest' ? 'style="border: 1px solid #c5ccdd;background: #f5f6fa;"' : '') + '><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_pointLine6.png" alt=""><div class="advanced-item">F검정</div></a></li>';
			html += '</ul>';
			html += '</div>';
			
			/* DOGFOOT ktkang 다변량분석 추가  20210215 */
			html += '<div class="add-item noitem">';
			html += '<span class="add-item-head on">다변량 분석</span>';
			html += '<ul class="add-item-body advanced-item">';
			html += '<li title="다변량분석"><a id="insertMultivariate" class="changeReport insertItem advance-item" seriestype="TreeMap"' + (gDashboard.analysisType == 'insertMultivariate' ? 'style="border: 1px solid #c5ccdd;background: #f5f6fa;"' : '') + '><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_pointLine2.png" alt=""><div class="advanced-item">다변량분석</div></a></li>';
			html += '</ul>';
			html += '</div>';
			
//			html += '<div class="add-item noitem">';
//			html += '<span class="add-item-head on">외부 프로그램</span>';
//			html += '<ul class="add-item-body advanced-item">';
//			html += '<li title="R 연동"><a id="insertMultipleLogisticRegression" href="#" class="changeReport insertItem advance-item" seriestype="TreeMap"><img class="advanced-item" src="' + WISE.Constants.context + '/resources/main/images/ico_r.png" alt=""><div class="advanced-item">R 연동</div></a></li>';
//			html += '</ul>';
//			html += '</div>';
			
			html += '</div>';//scroll-bar
			html += '</li>';
			html += '</ul>';//more-link
			html += '</li>';//more
			html += '</ul>';
			html += '</div>';
			
			html += '</div>';
			
			html += '<div class="menu-comp custom-menu">';
		}
		/* DOGFOOT ajkim R분석 부분 추가 20201130 */
		else if(gDashboard.reportType == 'RAnalysis') {
			// 고급 차트 추가
			html += '</ul>';
			html += '</div>';
			
			html += '</div>';
//			html += '<div class="menu-comp custom-menu">';
		}
        }
        if(gDashboard.reportType == 'DSViewer'){
			html += '</ul>';
			html += '</div>';
			
			html += '</div>';
		}
//        }
		/* DOGFOOT ktkang 비정형과 대시보드 레이아웃 나눔 끝  20200130 */
		//2020.01.21 mksong 비정형 레이아웃 수정 끝 dogfoot
		
//		KERIS 주석끝
		
		
		
		
		/* DOGFOOT ktkang 보고서 형상관리 기능 구현  20200903 */
        if(typeof userJsonObject.userReportSeq == 'undefined' || userJsonObject.userReportSeq == '1001' || userJsonObject.userReportSeq == '') {
        	if(userJsonObject.siteNm == 'KAMKO'){       		
        		html += '<a id="btn_query" style="border-radius:0px; background-color:#1b8466; color:white; left:0.1%; top:25%; cursor:pointer;" href="#" class="btn crud" title="'+ gMessage.get('WISE.message.page.widget.button.common.search') + '">조회</a>';     		
        	}else{
        		html += '<a id="btn_query" href="#" class="global-lookup search" title="'+ gMessage.get('WISE.message.page.widget.button.common.search') + '">lookup</a>';
        	}
        } else {
        	html += '</div>';
        	html += '<div class="slide-ui" style="float: right;" >';
        	html += '<ul class="lnb-lst-tab">';
        	html += '<a id="btn_query" class="global-lookup search" style="float: right;" title="조회">lookup</a>';
        	html += '</ul>';
        	html += '</div>';
        }
//		//차트 추가
//		html += '<ul class="lnb-lst-tab">';
//		html += '<span class="drag-line"></span>';
//		html += '<li class="more">';
//		html += '<a href="#" class="all-more lnb-link txt chart" title="Add Chart"><span>Add Chart</span></a>';
//		html += '<ul class="more-link">';
//		html += '<li>';
//		
//		//스크롤 감싸기
//		html += '<div class="scrollbar">';
//		
//		html += '<div class="add-item">';
//		html += '<a href="#" class="add-item-head on">Bar</a>';
//		html += '<div class="add-item-body">';
//		html += '<a id="insertChart" href="#" class="insertItem lnb-link bar1" seriestype="Bar"><span>bar1</span></a>';
//		html += '<a id="insertChart" href="#" class="insertItem lnb-link bar2" seriestype="StackedBar"><span>bar2</span></a>';
//		html += '<a id="insertChart" href="#" class="insertItem lnb-link bar3" seriestype="FullStackedBar"><span>bar3</span></a>';
//		html += '</div>';
//		html += '</div>';
//		
//		html += '<div class="add-item">';
//		html += '<a id="insertChart" href="#" class="insertItem add-item-head on">Point/Line</a>';
//		html += '<div class="add-item-body">';
//		html += '<a id="insertChart" href="#" class="insertItem lnb-link line1" seriestype="Point"><span>line1</span></a>';
//		html += '<a id="insertChart" href="#" class="insertItem lnb-link line2" seriestype="Line"><span>line2</span></a>';
//		html += '<a id="insertChart" href="#" class="insertItem lnb-link line3" seriestype="StackedLine"><span>line3</span></a>';
//		html += '<a id="insertChart" href="#" class="insertItem lnb-link line4" seriestype="FullStackedLine"><span>line4</span></a>';
//		html += '<a id="insertChart" href="#" class="insertItem lnb-link line5" seriestype="StepLine"><span>line5</span></a>';
//		html += '<a id="insertChart" href="#" class="insertItem lnb-link line6" seriestype="Spline"><span>line6</span></a>';
//		html += '</div>';
//		html += '</div>';
//		html += '<div class="add-item">';
//		html += '<a href="#" class="add-item-head on">Area</a>';
//		html += '<div class="add-item-body">';
//		html += '<a id="insertChart" href="#" class="insertItem lnb-link area1" seriestype="Area"><span>area1</span></a>';
//		html += '<a id="insertChart" href="#" class="insertItem lnb-link area2" seriestype="StackedArea"><span>area2</span></a>';
//		html += '<a id="insertChart" href="#" class="insertItem lnb-link area3" seriestype="FullStackedArea"><span>area3</span></a>';
//		html += '<a id="insertChart" href="#" class="insertItem lnb-link area4" seriestype="StepArea"><span>area4</span></a>';
//		html += '<a id="insertChart" href="#" class="insertItem lnb-link area5" seriestype="SplineArea"><span>area5</span></a>';
//		html += '<a id="insertChart" href="#" class="insertItem lnb-link area6" seriestype="StackedSplineArea"><span>area6</span></a>';
//		html += '<a id="insertChart" href="#" class="insertItem lnb-link area7" seriestype="FullStackedSplineArea"><span>area7</span></a>';
//		html += '</div>';
//		html += '</div>';
//		
//		html += '</div>';
////		html += '<div class="add-item">';
////		html += '<a href="#" class="add-item-head on">Range</a>';
////		html += '<div class="add-item-body">';
////		html += '<a href="#" class="lnb-link range1"><span>range1</span></a>';
////		html += '<a href="#" class="lnb-link range2"><span>range2</span></a>';
////		html += '</div>';
////		html += '</div>';
////		html += '<div class="add-item">';
////		html += '<a href="#" class="add-item-head on">Bubble</a>';
////		html += '<div class="add-item-body">';
////		html += '<a href="#" class="lnb-link bubble1"><span>bubble1</span></a>';
////		html += '</div>';
////		html += '</div>';
////		html += '<div class="add-item">';
////		html += '<a href="#" class="add-item-head on">Finance</a>';
////		html += '<div class="add-item-body">';
////		html += '<a href="#" class="lnb-link finance1"><span>finance1</span></a>';
////		html += '<a href="#" class="lnb-link finance2"><span>finance2</span></a>';
////		html += '<a href="#" class="lnb-link finance3"><span>finance3</span></a>';
////		html += '</div>';
////		html += '</div>';
//		html += '</li>';
//		html += '</ul>';
//		html += '</li>';
//
//		//즐겨찾기 차트
//		html += '<li><a id="insertChart" href="#" class="insertItem lnb-link bar1" seriestype="Bar"></a></li>';
//		html += '<li><a id="insertChart" href="#" class="insertItem lnb-link line2" seriestype="Line"></a></li>';
//		html += '<li><a id="insertChart" href="#" class="insertItem lnb-link area3" seriestype="FullStackedArea"></a></li>';
//		html += '</ul>';
//		
//		//임시 아이템 추가 - InsertItem
//		html += '<ul class="lnb-lst-tab">';
//		html += '<span class="drag-line"></span>';
//		html += '<li class="insertItem" style="margin-top:10px"><a id="insertPivotGrid" href="#" class="btn neutral">피벗그리드</a></li>';
//		html += '<li class="insertItem" style="width:100px;margin-top:10px"><a id="insertDataGrid" href="#" class="btn neutral" style="width:100%">데이터그리드</a></li>';
//		html += '<li class="insertItem" style="margin-top:10px"><a id="insertPieChart" href="#" class="btn neutral">파이차트</a></li>';
//		html += '<li class="insertItem" style="margin-top:10px"><a id="insertChoroplethMap" href="#" class="btn neutral">코로플레스맵</a></li>';
//		html += '</ul>';
		
//		html += '<ul class="lnb-lst-tab crud">';
//		html += '<span class="drag-line"></span>';
//		html += '<li class="more">';
//		html += '<a href="#" class="all-more lnb-link filter"><span>Filter</span></a>';
//		html += '<ul class="more-link">';
//		html += '<li><a href="#">Filter1</a></li>';
//		html += '<li><a href="#">Filter2</a></li>';
//		html += '</ul>';
//		html += '</li>';
//		html += '</ul>';
		html += '</div>'; //lnb-container
//		}
		
		$('#lnb').html(html);
		
		$("#tempRicon").on("click", function(){
			var p = $('#editPopup').dxPopup('instance');
			p.option({
				title: 'R 서버 접근 정보',
				onContentReady: function() {
					gDashboard.fontManager.setFontConfigForOption('editPopup');
				},
				contentTemplate: function(contentElement) {
					var example = 1234567890.123;
					var initialized = false;

					// initialize template
					var html = 	'<div id="rServerAccess"></div>' +
								'<div style="padding-bottom:20px;"></div>' +
								'<div class="modal-footer" style="padding-bottom:0px;">' +
									'<div class="row center">' +
										'<a id="ok-hide" href="#" class="btn positive ok-hide">로그인</a>' +
										'<a id="close" href="#" class="btn neutral close">취소</a>' +
									'</div>' +
								'</div>';
					contentElement.append(html);

					// edit Y axis measures
					var optionsForm = $('#rServerAccess').dxForm({
						items: [
							{
								dataField: 'ID',
								editorType: 'dxTextBox'
							},{
								dataField: 'PW',
								editorType: 'dxTextBox'
							},
						],
						onContentReady: function(form) {
						
						}
					}).dxForm('instance');

					// confirm and cancel
					$('#ok-hide').off('click').on('click', function() {
                        p.hide();
					});
					$('#close').off('click').on('click', function() {
						p.hide();
					});
				}
			});
			p.show();
		})
				
	    $('.custom-menu').css({width : 'calc(100% - 1246px)'});
//		if(gDashboard.reportType == 'AdHoc'){
//			$('#insertInformal').css('display','none');
//			$('.insertItemList').css('display','none');
//		}else{
//			$('#insertDashboard').css('display','none');
////			$('.insertItemList').css('display','none');
//		}
	};

	this.configNavLayoutEmpty = function() {
		var html = 	'<div class="lnb-container">' +
						'<div class="menu-comp fix-menu">' +
							'<div class="slide-ui"></div>' +
						'</div>' +
						'<div id="filterContainer"></div>' +
						'<a id="refreshButton" class="global-lookup"></a>' +
					'</div>';
		
		$('#lnb').html(html);
	}

	this.configNavLayoutSave = function(){
		var html = 	'<div class="lnb-container">' +
						'<div class="menu-comp fix-menu">' +
							'<div class="slide-ui">' +
								'<ul class="lnb-lst-tab crud">' +
									'<li id="saveConfig"><a class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_save.png" alt=""><span>저장</span></a></li>' +
								'</ul>' +
							'</div>' +
						'</div>' +
						'<div id="filterContainer"></div>' +
						'<a id="refreshButton" class="global-lookup"></a>' +
					'</div>';
		
		$('#lnb').html(html);
	};

	this.configNavLayoutSaveDelete = function() {
		var html = 	'<div class="lnb-container">' +
						'<div class="menu-comp fix-menu">' +
							'<div class="slide-ui">' +
								'<ul class="lnb-lst-tab crud">' +
									'<li id="saveConfig"><a class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_save.png" alt=""><span>저장</span></a></li>' +
									'<li id="deleteConfig"><a class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_elementRemove.png" alt=""><span>삭제</span></a></li>' +
								'</ul>' +
							'</div>' +
						'</div>' +
						'<div id="filterContainer"></div>' +
						'<a id="refreshButton" class="global-lookup"></a>' +
					'</div>';
		
		$('#lnb').html(html);
	}

	this.configNavLayoutNewSaveDelete = function() {
		var html = 	'<div class="lnb-container">' +
						'<div class="menu-comp fix-menu">' +
							'<div class="slide-ui">' +
								'<ul class="lnb-lst-tab crud">' +
								'<li id="newConfig"><a style="cursor:pointer" class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_new.png" alt=""><span>새로 만들기</span></a></li>' +
								'<li id="saveConfig"><a style="cursor:pointer" class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_save.png" alt=""><span>저장</span></a></li>' +
								'<li id="deleteConfig"><a style="cursor:pointer" class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_elementRemove.png" alt=""><span>삭제</span></a></li>' +
								'</ul>' +
							'</div>' +
						'</div>' +
						'<div id="filterContainer"></div>' +
						'<a id="refreshButton" class="global-lookup"></a>' +
					'</div>';
		
		$('#lnb').html(html);
	}

	this.configNavLayoutNewEditDelete = function() {
		var html = 	'<div class="lnb-container">' +
						'<div class="menu-comp fix-menu">' +
							'<div class="slide-ui">' +
								'<ul class="lnb-lst-tab crud">' +
									'<li id="newConfig"><a class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_new.png" alt=""><span>새로 만들기</span></a></li>' +
									'<li id="editConfig"><a class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_ept_txt.png" alt=""><span>편집</span></a></li>' +
									'<li id="deleteConfig"><a class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_elementRemove.png" alt=""><span>삭제</span></a></li>' +
								'</ul>' +
							'</div>' +
						'</div>' +
						'<div id="filterContainer"></div>' +
						'<a id="refreshButton" class="global-lookup"></a>' +
					'</div>';
		
		$('#lnb').html(html);
	}

	this.configNavLayoutNewSaveDeletePw = function() {
		var html = 	'<div class="lnb-container">' +
						'<div class="menu-comp fix-menu">' +
							'<div class="slide-ui">' +
								'<ul class="lnb-lst-tab crud">' +
									'<li id="newConfig"><a class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_new.png" alt=""><span>새로 만들기</span></a></li>' +
									'<li id="saveConfig"><a class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_save.png" alt=""><span>저장</span></a></li>' +
									'<li id="deleteConfig"><a class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_elementRemove.png" alt=""><span>삭제</span></a></li>' +
									'<li id="passwordConfig"><a class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_password.png" alt=""><span>비밀번호 변경</span></a></li>' +
								'</ul>' +
							'</div>' +
						'</div>' +
						'<div id="filterContainer"></div>' +
						'<a id="refreshButton" class="global-lookup"></a>' +
					'</div>';
		
		$('#lnb').html(html);
	}

	this.configNavLayoutDownloadLogout = function() {
		var html = 	'<div class="lnb-container">' +
						'<div class="menu-comp fix-menu">' +
							'<div class="slide-ui">' +
								'<ul class="lnb-lst-tab crud">' +
									// '<li id="downloadConfig"><a href="" class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_save.png" alt=""><span>내려받기</span></a></li>' +
									'<li id="logoutConfig"><a class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_elementRemove.png" alt=""><span>로그아웃</span></a></li>' +
								'</ul>' +
							'</div>' +
						'</div>' +
						'<div id="filterContainer"></div>' +
						'<a id="refreshButton" class="global-lookup"></a>' +
					'</div>';
		
		$('#lnb').html(html);
	}

	this.configNavLayoutUnlock = function() {
		var html = 	'<div class="lnb-container">' +
						'<div class="menu-comp fix-menu">' +
							'<div class="slide-ui">' +
								'<ul class="lnb-lst-tab crud">' +
									'<li id="unlockConfig"><a class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_password.png" alt=""><span>풀기</span></a></li>' +
								'</ul>' +
							'</div>' +
						'</div>' +
						'<div id="filterContainer"></div>' +
						'<a id="refreshButton" class="global-lookup"></a>' +
					'</div>';
		
		$('#lnb').html(html);
	};
	
	this.configDataSetNewSaveSaveasDel = function() {
		var html = 	'<div class="lnb-container">' +
						'<div class="menu-comp fix-menu" style="width: 267px;">' +
							'<div class="slide-ui" style="width: 266px;">' +
								'<ul class="lnb-lst-tab crud">' +
									'<li id="newConfig"><a class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_new.png" alt=""><span>새로 만들기</span></a></li>' +
									'<li id="saveConfig"><a class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_save.png" alt=""><span>저장</span></a></li>' +
									'<li id="saveAsConfig"><a class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_save.png" alt=""><span>다른 이름으로 저장</span></a></li>' +
									'<li id="deleteConfig"><a class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_elementRemove.png" alt=""><span>삭제</span></a></li>' +
								'</ul>' +
							'</div>' +
						'</div>' +
						'<div id="filterContainer"></div>' +
						'<a id="refreshButton" class="global-lookup"></a>' +
					'</div>';
		
		$('#lnb').html(html);
	}

	this.accountNavLayout = function(){
		var html = 	'<div class="lnb-container">' +
						'<div class="menu-comp fix-menu">' +
							'<div class="slide-ui">' +
								'<ul class="lnb-lst-tab crud">' +
									'<li id="saveUserConfig"><a class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_save.png" alt=""><span>저장</span></a></li>' +
								'</ul>' +
							'</div>' +
						'</div>' +
						'<a id="refreshButton" class="global-lookup"></a>' +
					'</div>';
		
		$('#lnb').html(html);
	};
	
	/* DOGFOOT ktkang 모니터링 부분 기능 추가  20201014 */
	this.configNavLayoutDelete = function() {
		var html = 	'<div class="lnb-container">' +
						'<div class="menu-comp fix-menu">' +
							'<div class="slide-ui">' +
								'<ul class="lnb-lst-tab crud">' +
								'<li id="deleteConfig"><a class="lnb-link"><img src="' + WISE.Constants.context + '/resources/main/images/ico_elementRemove.png" alt=""><span>삭제</span></a></li>' +
								'</ul>' +
							'</div>' +
						'</div>' +
						'<div id="filterContainer"></div>' +
						'<a id="refreshButton" class="global-lookup"></a>' +
					'</div>';
		
		$('#lnb').html(html);
	};
	
	this.modalLayout = function(){
//		var html = '<div class="modal" id="dbOpenCmm" style="top:28%;left:40%;width:70%;height:78%;margin-left:-25%;margin-top:-13% ">';
		var html = '<div class="modal" style="top:28%;left:40%;width:70%;height:78%;margin-left:-25%;margin-top:-13% ">';
			html += '<div class="modal-inner">'; 
			html += '<div class="modal-header">데이터원본선택</div>';
			html += '<div class="modal-body">';
			html += '<div class="row">';
			
			html += '<div class="column">';
			html += '<div class="modal-tit">데이터원본 목록</div>';
//			html += '<button class="btn-drag" type="button">Drag</button>';
			html += '<div id="data_list"></div>';
			html += '</div>';
			
			html += '<div class="column">';
			html += '<div class="modal-tit">데이터원본 정보</div>';
			html += '<div id="data_info"></div>';
			html += '</div>';
			html += '</div>';
			
			html += '</div>';
			
			
			html += '<div class="modal-footer">';
			html += '<div class="row right" style="width:56%;">';
			html += '<a class="btn positive ok-hide">확인</a>';
			html += '<a class="btn neutral close">취소</a>';
			html += '</div>';
			html += '</div>';
			
			html += '<div class="modal-controller">';
			html += '<a class="gui min">최소화</a>';
			html += '<a class="gui max">최대화</a>';
			html += '<a class="gui close">닫기</a>';
			html += '</div>';
			html += '</div>';
			html += '</div>';
		
		$('#container').append($(html));
	};
	
	//section 생성
	this.sectionLayout = function(){
		var html = '<div class="panel-tab">';
		if(reportType == 'Spread' || reportType == 'Excel') {
			html = '';
			html += '<div class="panel tree active">';
//			html += '<button class="btn-drag" type="button">Drag</button>';
			html += '<div class="panel-head"><h3 class="tit-level2" style="width: 60%;float: left;margin-right: 10px;padding-top: 5px;">데이터 원본</h3>';
			html += '<div style="padding-top: 3px;">';
			html += '<a id="createCustomField" style="padding-right:10px"><img src="' + WISE.Constants.context + '/resources/main/images/ico_createCustomField.png" alt="사용자 정의 데이터" title="사용자 정의 데이터" style="height:20px; padding: 3px;"></a>';
			html += '<a id="editDataSource" style="padding-right:10px"><img src="' + WISE.Constants.context + '/resources/main/images/ico_crudModify.png" alt="데이터 집합 수정" title="데이터 집합 수정" style="height:20px"></a>';
			
			/* DOGFOOT MKSONG Element ID cubeRelation으로 변경  20200217 */			
			if(gDashboard.reportType != "AdHoc"){
				html += '<a id="removeDataSource"><img src="' + WISE.Constants.context + '/resources/main/images/ico_crudRemove.png" alt="데이터 집합 삭제" title="데이터 집합 삭제" style="height:20px"></a>';	
			}else{
				html += '<a id="cubeRelation" alt="주제영역 연계 데이터 보기" title="주제영역 연계 데이터 보기" style="height:20px"><input type="checkbox"></a>';	
			}
			html += '</div>';
			html += '</div>';
			//2020.02.20 MKSONG 스크롤 오류 수정 DOGFOOT
			//2020.06.25 AJKIM line-area 제거 DGOFOOT
			html += '<div id="allList" class="wise-area-content-pane-all drop-panel panel-body" style="padding: 5px;height:85%;">';
			html += '<div class="drop-down tree-menu">';
			/* DOGFOOT ktkang KERIS IE에서 UI 오류 수정  20200310 */
			html += '<div id="dataSetLookUp" style="margin-bottom:7px; width:calc(100% - 15px);"/>';
			html += '<ul>';

			html += '</ul>';
			html += '</div>';
			html += '</div>';
			html += '</div>';

			
			$('#spreadsheet').before(html);
			$('<div id="fieldRename" />').append('html');
			/*2020-01-14 LSH topN */
			$('<div id="topNset" />').append('html');
			self.activeDataSourceFunction();
		}else if(gDashboard.reportType === 'RAnalysis'){
			//20201214 AJKIM R 스크립트 필드 추가 DOGFOOT
			//2020.02.18 mksong panel resize 기능 위해 수정 dogfoot
			html += '<div class="panel tree active">';
			/* DOGFOOT MKSONG 리사이즈 기능 추가 위해 주석 해제  20200217 */
			html += '<button id="splitter" class="btn-drag" type="button">Drag</button>';
			//2020.01.23 mksong KERIS UI 수정 60% -> 70% dogfoot
//			html += '<div class="panel-head"><h3 class="tit-level2" style="width: 60%;float: left;margin-right: 10px;padding-top: 5px;">데이터 원본</h3>';
			//2020.02.07 mksong 반응형 오류 수정 dogfoot
			html += '<div class="panel-head"><h3 class="tit-level2" style="float: left;margin-right: calc(0.5vh - 4px);padding-top: 5px;">데이터 원본</h3>';
			//2020.02.18 mksong ui 수정 dogfoot
			html += '<div style="padding-top: 3px;float:right;">';
			html += '<a id="createCustomField" style="padding-right:10px"><img src="' + WISE.Constants.context + '/resources/main/images/ico_createCustomField.png" alt="사용자 정의 데이터" title="사용자 정의 데이터" style="height:20px; padding: 3px"></a>';
			html += '<a id="editDataSource" style="padding-right:10px"><img src="' + WISE.Constants.context + '/resources/main/images/ico_crudModify.png" alt="데이터 집합 수정" title="데이터 집합 수정" style="height:20px"></a>';
			
			html += '<a id="removeDataSource"><img src="' + WISE.Constants.context + '/resources/main/images/ico_crudRemove.png" alt="데이터 집합 삭제" title="데이터 집합 삭제" style="height:20px"></a>';	
			
			html += '</div>';
			html += '</div>';
			
			html += '	<div id="allList" class="wise-area-content-pane-all drop-panel panel-body" style="padding: 5px;height:85%;">';
			html += '		<div id="dataSetLookUp" style="margin-bottom:7px; width:calc(100% - 15px);"/>';
			html += '		<div class="panel-inner scrollbar" style="overflow-y:visible !important;height:100%;">';
			html += '			<div class="drop-down tree-menu">';
			/* DOGFOOT ktkang KERIS IE에서 UI 오류 수정  20200310 */
			html += '			<ul>';
			html += '			</ul>';
			html += '			</div>';
			html += '		</div>';
			html += '	</div>';//allList
			html += '</div>';//panel tree active
			//2020.02.20 MKSONG 스크롤 오류 수정 끝 DOGFOOT
			
			//데이터 항목
			html += '<div class="panel data active">';
			//2020.02.19 MKSONG 데이터 항목 영역 리사이즈 기능 추가 DOGFOOT
			html += '<button id="splitter2" class="btn-drag" type="button">Drag</button>';
			html += '<div class="tab-title rowColumn">';
			html += '<ul id="menulist">';
			html += '<li rel="panelDataA-1"><a>필드</a></li>';
			html += '</ul>';
			html += '</div>';
			
			//scrollbar
			html += '<div class="panel-inner scrollbar" style="height: 100%; overflow-y:visible !important">';
			
			//panel-body
			html += '<div id="panelDataA" class="tab-component">';
			html += '<div class="panelDataA-1 tab-content">';
			html += '<div class="column-drop-body">';
			html += '</div>';
			html += '</div>';
			html += '</div>';
			html += '</div>';
			
			html += '</div>';//스크롤
			
			//rScript
			html += '<div class="panel r active resize_panel">';
			html += '<button id="splitter6" class="btn-drag" type="button">Drag</button>';
			html += '<div class="tab-title rowColumn">';
			html += '<ul id="r-menulist">';
			html += '<li rel="panelDataB-1"><a>RScript</a></li>';
			html += '</ul>';
			html += '</div>';
			
			//scrollbar
			html += '<div class="panel-inner scrollbar" style="height: 100%; overflow-y:visible !important">';
			
			//panel-body
			html += '<div id="panelDataB" class="tab-component">';
			html += '<div class="panelDataB-1 tab-content">';
			html += '<div class="">';
			html += ("<h4 class=\"tit-level3\">R 스크립트 입력</h4>" + 
			"<div class=\"panel-body\">" + 
			"	<div class=\"design-menu rowColumn\">" + 
				"<textarea id=\"rscript\" class=\"wise-text-input\" style=\"width: 100%; height: "+$('.panel-inner').height() * .7+'px'+"\"/>"+
			"	</div>" + 
			"</div>");
			html += '</div>';
			html += '</div>';
			html += '</div>';
			html += '</div>';
			
			html += '</div>';//스크롤
			
			//캔버스
			html += '<div class="panel cont">';
			
			//필터 Bar
			html += '<div id="filter-bar" class="filter-bar'+(userJsonObject.siteNm === 'KAMKO'? ' kamko': '')+'">';
			html += '<div class="filter-row">';
			html += '<div class="filter-gui">';
			html += '<div class="filter-col ui">';
			html += '<a class="filter filter-more" title="필터 표시"><span>Filter</span></a>';
			html += '</div>';
			html += '</div>';
			
			//2020.03.02 MKSONG 본사 소스 누락 부분 추가 DOGFOOT
			html += '<div id="report-filter-item" class="filter-item">';
			html += '</div>';
			
			html += '</div>';
			/* dogfoot WHATIF 분석 매개변수 필터 버튼  shlim 20201022 */
			html += '<div id="calcParamButton" style="display: none;top: 0px;position: absolute;right: 20px;"></div>';
			html += '</div>';
			
			//아이템 샘플
			
			//아이템 HEAD - cont-box-head
			html += '<div class="panel-inner">';
			html += '<div class="cont-box" style="height:100%;">';
			/**
			 * KERIS 수정
			 */
			//아이템 Body - cont-box-body
			html += '<div class="cont-box-body">';
			html += '<div id="canvas-container" class="goldenLayout-custom-div" style="height:99%; width: 100%;">';
			html += '</div>';
			html += '</div>';
			
			html += '</div>';
			html += '</div>';
						
			html += '</div>';
			html += '</div>'; //SECTION 끝
			
			$('.content').html(html);
			$('<div id="fieldRename" />').append('html');
			/*2020-01-14 LSH topN */
			$('<div id="topNset" />').append('html');
			self.activeDataSourceFunction();
		} else if(gDashboard.reportType === 'DSViewer'){
			html += '<div class="panel tree active">';
			html += '<button id="splitter" class="btn-drag" type="button">Drag</button>';
			html += '<div class="panel-head"><h3 class="tit-level2" style="float: left;margin-right: calc(0.5vh - 4px);padding-top: 5px;">데이터 원본</h3>';
			html += '</div>';
			
			html += '	<div id="allList" class="wise-area-content-pane-all drop-panel panel-body" style="padding: 5px;height:85%;">';
			html += '		<div id="dataSetLookUp" style="margin-bottom:7px; width:calc(100% - 15px);"/>';
			html += '		<div class="panel-inner scrollbar" style="overflow-y:visible !important;height:100%;">';
			html += '			<div class="drop-down tree-menu">';
			/* DOGFOOT ktkang KERIS IE에서 UI 오류 수정  20200310 */
			html += '			<ul>';
			html += '			</ul>';
			html += '			</div>';
			html += '		</div>';
			html += '	</div>';//allList
			html += '</div>';//panel tree active
			//2020.02.20 MKSONG 스크롤 오류 수정 끝 DOGFOOT
			
			//데이터 항목
			html += '<div class="panel data active">';
			//2020.02.19 MKSONG 데이터 항목 영역 리사이즈 기능 추가 DOGFOOT
			html += '<button id="splitter2" class="btn-drag" type="button">Drag</button>';
			html += '<div class="tab-title rowColumn">';
			html += '<ul id="menulist">';
			html += '<li rel="panelDataA-1"><a>필드</a></li>';
//			html += '<li rel="panelDataA-2"><a href="#">데이터</a></li>';
			html += '</ul>';
//			html += '<h3 class="tit-level2">데이터항목</h3>';
			html += '</div>';
			
			//scrollbar
			html += '<div class="panel-inner scrollbar" style="height: 100%; overflow-y:visible !important">';
			
			//panel-body
			html += '<div id="panelDataA" class="tab-component">';
			html += '<div class="panelDataA-1 tab-content">';
			html += '<div class="column-drop-body">';
			html += '</div>';
			html += '</div>';
			html += '<div class="panelDataA-2 tab-content data-menu"></div>';
			html += '</div>';
			html += '</div>';
			
			html += '</div>';//스크롤
			
			//캔버스
			html += '<div class="panel cont">';
			
			//필터 Bar
			html += '<div id="filter-bar" class="filter-bar'+(userJsonObject.siteNm === 'KAMKO'? ' kamko': '')+'">';
			html += '<div class="filter-row">';
			html += '<div class="filter-gui">';
			html += '<div class="filter-col ui">';
			html += '<a class="filter filter-more" title="필터 표시"><span>Filter</span></a>';
			html += '</div>';
			html += '</div>';
			
			//2020.03.02 MKSONG 본사 소스 누락 부분 추가 DOGFOOT
			html += '<div id="report-filter-item" class="filter-item">';
			html += '</div>';
			
			html += '</div>';
			/* dogfoot WHATIF 분석 매개변수 필터 버튼  shlim 20201022 */
			html += '<div id="calcParamButton" style="display: none;top: 0px;position: absolute;right: 20px;"></div>';
			html += '</div>';
			
			//아이템 샘플
			
			//아이템 HEAD - cont-box-head
			html += '<div class="panel-inner">';
			html += '<div class="cont-box" style="height:100%;">';
			/**
			 * KERIS 수정
			 */
			//아이템 Body - cont-box-body
			html += '<div class="cont-box-body">';
			html += '<div id="canvas-container" class="goldenLayout-custom-div" style="height:99%; width: 100%;">';
			html += '</div>';
			html += '</div>';
			
			html += '</div>';
			html += '</div>';
						
			html += '</div>';
			html += '</div>'; //SECTION 끝
			
			$('.content').html(html);
			$('<div id="fieldRename" />').append('html');
			/*2020-01-14 LSH topN */
			$('<div id="topNset" />').append('html');
			self.activeDataSourceFunction();
		}else {
			//2020.02.18 mksong panel resize 기능 위해 수정 dogfoot
			html += '<div class="panel tree active">';
			/* DOGFOOT MKSONG 리사이즈 기능 추가 위해 주석 해제  20200217 */
			html += '<button id="splitter" class="btn-drag" type="button">Drag</button>';
			//2020.01.23 mksong KERIS UI 수정 60% -> 70% dogfoot
//			html += '<div class="panel-head"><h3 class="tit-level2" style="width: 60%;float: left;margin-right: 10px;padding-top: 5px;">데이터 원본</h3>';
			//2020.02.07 mksong 반응형 오류 수정 dogfoot
			html += '<div class="panel-head"><h3 class="tit-level2" style="float: left;margin-right: calc(0.5vh - 4px);padding-top: 5px;">데이터 원본</h3>';
			//2020.02.18 mksong ui 수정 dogfoot
			html += '<div style="padding-top: 3px;float:right;">';
			html += '<a id="createCustomField" style="padding-right:10px"><img src="' + WISE.Constants.context + '/resources/main/images/ico_createCustomField.png" alt="사용자 정의 데이터" title="사용자 정의 데이터" style="height:20px; padding: 3px"></a>';
			html += '<a id="editDataSource" style="padding-right:10px"><img src="' + WISE.Constants.context + '/resources/main/images/ico_crudModify.png" alt="데이터 집합 수정" title="데이터 집합 수정" style="height:20px"></a>';
			
			html += '<a id="removeDataSource"><img src="' + WISE.Constants.context + '/resources/main/images/ico_crudRemove.png" alt="데이터 집합 삭제" title="데이터 집합 삭제" style="height:20px"></a>';	
			
			html += '</div>';
			html += '</div>';
			
			//2020.02.20 MKSONG 스크롤 오류 수정 DOGFOOT
			//2020.06.25 AJKIM line-area 제거 DGOFOOT
			/*dogfoot 스크롤바 위치 변경 shlim 20200715*/
//			html += '<div class="panel-inner scrollbar" style="overflow-y:visible !important">';
//			html += '<div id="allList" class="wise-area-content-pane-all drop-panel panel-body" style="padding: 5px;height:100%;">';
//			html += '<div class="drop-down tree-menu">';
//			/* DOGFOOT ktkang KERIS IE에서 UI 오류 수정  20200310 */
//			html += '<div id="dataSetLookUp" style="margin-bottom:7px; width:calc(100% - 15px);"/>';
//			html += '<ul>';
//			html += '</ul>';
//			html += '</div>';
//			html += '</div>';
//			html += '</div>';//panel-head
			
			html += '	<div id="allList" class="wise-area-content-pane-all drop-panel panel-body" style="padding: 5px;height:85%;">';
			html += '		<div id="dataSetLookUp" style="margin-bottom:7px; width:calc(100% - 15px);"/>';
			html += '		<div class="panel-inner scrollbar" style="overflow-y:visible !important;height:100%;">';
			html += '			<div class="drop-down tree-menu">';
			/* DOGFOOT ktkang KERIS IE에서 UI 오류 수정  20200310 */
			html += '			<ul>';
			html += '			</ul>';
			html += '			</div>';
			html += '		</div>';
			html += '	</div>';//allList
			html += '</div>';//panel tree active
			//2020.02.20 MKSONG 스크롤 오류 수정 끝 DOGFOOT
			
			//데이터 항목
			html += '<div class="panel data active">';
			//2020.02.19 MKSONG 데이터 항목 영역 리사이즈 기능 추가 DOGFOOT
			html += '<button id="splitter2" class="btn-drag" type="button">Drag</button>';
			html += '<div class="tab-title rowColumn">';
			html += '<ul id="menulist">';
			html += '<li rel="panelDataA-1"><a>필드</a></li>';
//			html += '<li rel="panelDataA-2"><a href="#">데이터</a></li>';
			html += '</ul>';
//			html += '<h3 class="tit-level2">데이터항목</h3>';
			html += '</div>';
			
			//scrollbar
			/*dogfoot 데이터 항목 스크롤 오류 수정 shlim 20210329 */
			/*dogfoot shlim 20210415*/
			html += '<div class="panel-inner scrollbar" style="height: 95% !important">';
			
			//panel-body
			html += '<div id="panelDataA" class="tab-component">';
			html += '<div class="panelDataA-1 tab-content">';
			html += '<div class="column-drop-body">';
			html += '</div>';
			html += '</div>';
			html += '<div class="panelDataA-2 tab-content data-menu"></div>';
			html += '</div>';
			html += '</div>';
			
			html += '</div>';//스크롤
			
			//캔버스
			html += '<div class="panel cont">';
			
			//필터 Bar
			html += '<div id="filter-bar" class="filter-bar'+(userJsonObject.siteNm === 'KAMKO'? ' kamko': '')+'">';
			html += '<div class="filter-row">';
			html += '<div class="filter-gui">';
			html += '<div class="filter-col ui">';
			html += '<a class="filter filter-more" title="필터 표시"><span>Filter</span></a>';
			html += '</div>';
			html += '</div>';
			
			//2020.03.02 MKSONG 본사 소스 누락 부분 추가 DOGFOOT
			html += '<div id="report-filter-item" class="filter-item">';
			html += '</div>';
			
			html += '</div>';
			/* dogfoot WHATIF 분석 매개변수 필터 버튼  shlim 20201022 */
			html += '<div id="calcParamButton" style="display: none;top: 0px;position: absolute;right: 20px;"></div>';
			html += '</div>';
			
			//아이템 샘플
			
			//아이템 HEAD - cont-box-head
			html += '<div class="panel-inner">';
			html += '<div class="cont-box" style="height:100%;">';
			/**
			 * KERIS 수정
			 */
			//아이템 Body - cont-box-body
			html += '<div class="cont-box-body">';
			html += '<div id="canvas-container" class="goldenLayout-custom-div" style="height:99%; width: 100%;">';
			html += '</div>';
			html += '</div>';
			
			html += '</div>';
			html += '</div>';
						
			html += '</div>';
			html += '</div>'; //SECTION 끝
			
			$('.content').html(html);
			$('<div id="fieldRename" />').append('html');
			/*2020-01-14 LSH topN */
			$('<div id="topNset" />').append('html');
			self.activeDataSourceFunction();
		}
	};

	// 2019.12.16 수정자 : mksong 뷰어 비정형 컬럼선택기 추가 위한 수정 DOGFOOT
	this.viewsectionLayout = function(reportId){
		var html = '';
		// 2019.12.10 수정자 : mksong 뷰어 비정형 컬럼선택기 추가 위한 수정 DOGFOOT
//		if(gDashboard.reportType == 'AdHoc'){
			// 2019.12.11 수정자 : mksong 뷰어 비정형 컬럼선택기 추가 위한 수정 DOGFOOT dataAttrArea div 제거
			html += '<div id="dataArea_' + reportId + '" class="reportChangePanel" report_id="' + reportId + '">'
			html += '	<div class="panel tree active viewer2">';
			html += '		<button id="splitter4" class="btn-drag" type="button">Drag</button>';
			html += '		<div class="panel-head">';
			html += '			<h3 class="tit-level2">분석 항목</h3>';
			html += '		</div>';
			html += '		<div class="panel-inner">';
			// 2019.12.11 수정자 : mksong 뷰어 비정형 컬럼선택기 추가 위한 수정 DOGFOOT
			//2020.01.23 mksong KERIS UI 수정 padding 5 -> 10px dogfoot
//			html += '			<div id="allList" class="wise-area-content-pane-all line-area drop-panel panel-body scrollbar" style="height:100%; padding:5px;">';
			//2020.06.25 AJKIM line-area 제거 DGOFOOT
			html += '			<div id="allList" class="wise-area-content-pane-all drop-panel panel-body scrollbar" style="height:85%; padding:10px;">';
			html += '				<div class="drop-down tree-menu">';
			/* DOGFOOT ktkang KERIS IE에서 UI 오류 수정  20200310 */
			html += '					<div id="dataSetLookUp" style="margin-bottom:7px; display:none; width:calc(100% - 15px);">';
			html += '					</div>';
			html += '					<ul>';
			html += '					</ul>';
			html += '				</div>';
			html += '			</div>';
			// 2019.12.11 수정자 : mksong 수정 끝 DOGFOOT
			html += '		</div>';
			html += '	</div>';
			html += '	<div class="panel data active viewer">';
			html += '		<button id="splitter5" class="btn-drag" type="button">Drag</button>';
			html += '		<div class="tab-title rowColumn">';
			html += '			<ul>';
			html += '				<li rel="panelDataA-1" class="on">';
			html += '					<a>데이터</a>';
			html += '				</li>';
			html += '				<li rel="panelDataA-2">';
			html += '					<a>속성</a>';
			html += '				</li>';
			html += '			</ul>';
			html += '		</div>';
			html += '		<div class="panel-inner scrollbar">';
			html += '			<div id="panelDataA" class="tab-component">';
			html += '				<div class="panelDataA-1 tab-content">';
			// 2019.12.11 수정자 : mksong 뷰어 비정형 컬럼선택기 추가 위한 수정 DOGFOOT
			html += '					<div class="column-drop-body">';
			html += '					</div>';
			html += '				</div>';
			html += '			</div>';
			html += '		</div>';
			html += '	</div>';
			html += '</div>';
			// 2019.12.11 수정자 : mksong 뷰어 비정형 컬럼선택기 추가 위한 수정 DOGFOOT dataAttrArea div 끝부분 제거
			$('.dataAttrArea').append(html);
			
			$(".panel.tree.active.viewer2").resize_panel({
			   handleSelector: "#splitter4",
			   resizeHeight: false,
			   target: ".panel.data.active"
			 });

			 $(".panel.data.active.viewer").resize_panel({
			   handleSelector: "#splitter5",
			   resizeHeight: false,
			   target: ".panel.cont"
			 });
		
//		}
		// 2019.12.16 수정자 : mksong 뷰어 비정형 컬럼선택기 추가 위한 수정 끝 DOGFOOT
	};

	this.configSectionLayout = function() {
		var html = 	'<div class="panel-tab pref">' +
						'<div class="panel tree preferences-lnb preferences">' +
							'<ul class="pre-ul">' +
								'<li class="mo-slt"><a></a></li>' +
								'<li class="panel-head default">' +
									'<a class="tit-level2 select-category" data-category="config-general">일반 설정</a>' +
								'</li>' +
								'<li class="panel-head">' +
									'<a class="tit-level2 select-category" data-category="config-advanced">고급 설정</a>' +
								'</li>' +
								'<li class="panel-head">' +
									'<a class="tit-level2 select-category" data-category="config-report">보고서 설정</a>' +
								'</li>' +
								'<li class="panel-head">' +
									'<a class="tit-level2 select-category" data-category="config-menu">메뉴 설정</a>' +
								'</li>' +
							'</ul>' +
						'</div>' +
						'<div class="panel tree preferences-lnb user-group">' +
							'<ul class="pre-ul">' +
								'<li class="mo-slt"><a></a></li>' +
								'<li class="panel-head default">' +
									'<a class="tit-level2 select-category" data-category="usrgrp-user">사용자 관리</a>' +
								'</li>' +
								'<li class="panel-head">' +
									'<a class="tit-level2 select-category" data-category="usrgrp-group">그룹 관리</a>' +
								'</li>' +
							'</ul>' +
						'</div>' +
						'<div class="panel tree preferences-lnb report-folder">' +
							'<ul class="pre-ul">' +
								'<li class="mo-slt"><a></a></li>' +
								'<li class="panel-head default">' +
									'<a class="tit-level2 select-category" data-category="repfol-report">보고서 관리</a>' +
								'</li>' +
								'<li class="panel-head">' +
									'<a class="tit-level2 select-category" data-category="repfol-folder">폴더 관리</a>' +
								'</li>' +
							'</ul>' +
						'</div>' +
						'<div class="panel tree preferences-lnb log">' +
							'<ul class="pre-ul">' +
								'<li class="mo-slt"><a></a></li>' +
								'<li class="panel-head default">' +
									'<a class="tit-level2 select-category" data-category="log-user">로그인 정보</a>' +
								'</li>' +
								'<li class="panel-head">' +
									'<a class="tit-level2 select-category" data-category="log-report">보고서 정보</a>' +
								'</li>' +
								'<li class="panel-head">' +
									'<a class="tit-level2 select-category" data-category="log-export">내려받기 정보</a>' +
								'</li>' +
								'<li class="panel-head">' +
									'<a class="tit-level2 select-category" data-category="log-query">수행쿼리 정보</a>' +
								'</li>' +
//									'<li class="panel-head"><a class="select-category" data-category="log-analysis" href="#">분석 항목 정보</a></li>' +
							'</ul>' +
						'</div>' +
						'<div class="panel tree preferences-lnb session">' +
							'<ul class="pre-ul">' +
								'<li class="mo-slt"><a></a></li>' +
								'<li class="panel-head default">' +
									'<a class="tit-level2 select-category" data-category="session-job">작업 관리</a>' +
								'</li>' +
								'<li class="panel-head">' +
									'<a class="tit-level2 select-category" data-category="session-users">사용자 세션</a>' +
								'</li>' +
								'<li class="panel-head">' +
									'<a class="tit-level2 select-category" data-category="session-inactive-users">장기 미사용자</a>' +
								'</li>' +
								'<li class="panel-head">' +
									'<a class="tit-level2 select-category" data-category="session-locked-users">잠긴 사용자</a>' +
								'</li>' +
							'</ul>' +
						'</div>' +
						'<div class="panel tree preferences-lnb monitoring">' +
							'<ul class="pre-ul">' +
								'<li class="mo-slt"><a></a></li>' +
								/* DOGFOOT ktkang 모니터링에서 시스템 부분 주석처리  20200924*/
//								'<li class="panel-head default">' +
//									'<a class="tit-level2 select-category" data-category="monitoring-system" href="#">시스템</a>' +
//								'</li>' +
								/* DOGFOOT ktkang 모니터링 프로세스 부분 오류 수정  20201015 */
								'<li class="panel-head default">' +
									'<a class="tit-level2 select-category" data-category="monitoring-processes">프로세스</a>' +
								'</li>' +
								'<li class="panel-head">' +
									'<a class="tit-level2 select-category" data-category="monitoring-users">사용자</a>' +
								'</li>' +
							'</ul>' +
						'</div>' +
						'<div class="panel tree preferences-lnb authentication">' +
							'<ul class="pre-ul">' +
								'<li class="mo-slt"><a href="#"></a></li>' +
								'<li class="panel-head default">' +
									'<a class="tit-level2 select-category" data-category="authentication-groupdata" href="#">그룹 데이터</a>' +
								'</li>' +
								'<li class="panel-head">' +
									'<a class="tit-level2 select-category" data-category="authentication-groupreport" href="#">그룹 보고서</a>' +
								'</li>' +
								'<li class="panel-head">' +
									'<a class="tit-level2 select-category" data-category="authentication-groupdataset" href="#">그룹 데이터 집합</a>' +
								'</li>' +
								'<li class="panel-head">' +
									'<a class="tit-level2 select-category" data-category="authentication-groupds" href="#">그룹 데이터 원본</a>' +
							    '</li>' +
							    (userJsonObject.menuconfig.Menu.USE_MENU_AUTH? 
							    '<li class="panel-head">' +
									'<a class="tit-level2 select-category" data-category="authentication-groupwb" href="#">그룹 메뉴</a>' +
							    '</li>' : "") +
								'<li class="panel-head">' +
									'<a class="tit-level2 select-category" data-category="authentication-userdata" href="#">사용자 데이터</a>' +
								'</li>' +
								'<li class="panel-head">' +
									'<a class="tit-level2 select-category" data-category="authentication-userreport" href="#">사용자 보고서</a>' +
								'</li>' +
								'<li class="panel-head">' +
									'<a class="tit-level2 select-category" data-category="authentication-userdataset" href="#">사용자 데이터 집합</a>' +
								'</li>' +
								'<li class="panel-head">' +
								    '<a class="tit-level2 select-category" data-category="authentication-userds" href="#">사용자 데이터 원본</a>' +
								'</li>' +
								(userJsonObject.menuconfig.Menu.USE_MENU_AUTH? 
								'<li class="panel-head">' +
									'<a class="tit-level2 select-category" data-category="authentication-userwb" href="#">사용자 메뉴</a>' +
							    '</li>': "") +
							'</ul>' +
						'</div>' +
//						'<div class="panel tree preferences-lnb DataSet">' +
//							'<ul class="pre-ul">' +
//								'<li class="mo-slt"><a href="#"></a></li>' +
//								'<li class="panel-head default">' +
//									'<a class="tit-level2 select-category" data-category="dataSet-list" href="#">데이터 집합</a>' +
//								'</li>' +
//							'</ul>' +
//							'</div>' +
						'<div class="panel cont preferences-cont"></div>' +
					'</div>';
		$('.content').html(html);
	}
	
	this.spreadSectionLayout = function() {
		$('.panel-tab .panel.tree').empty().append(
			'<div class="panel-head">' +
				'<h3 class="tit-level2" style="width: 50%;float: left;margin-right: 30px;padding-top: 5px;">데이터 원본</h3>' +
				'<div style="padding-top: 3px;">' +
					'<a href="#" id="editDataSource" style="padding-right:10px"><img src="' + WISE.Constants.context + '/resources/main/images/ico_crudModify.png" alt="데이터 집합 수정" title="데이터 집합 수정" style="height:20px"></a>' +
					'<a href="#" id="removeDataSource"><img src="' + WISE.Constants.context + '/resources/main/images/ico_crudRemove.png" alt="데이터 집합 삭제" title="데이터 집합 삭제" style="height:20px"></a>' +
				'</div>' +
			'</div>' +
			'<div id="allList" class="wise-area-content-pane-all line-area drop-panel panel-body scrollbar">' +
				'<div class="drop-down tree-menu">' +
				/* DOGFOOT ktkang KERIS IE에서 UI 오류 수정  20200310 */
					'<div id="dataSetLookUp" style="margin-bottom:7px; width:calc(100% - 15px);"/>' +
					'<ul></ul>' +
				'</div>' +
			'</div>'
		);
		$('.panel-tab .filter-bar').empty().append(
			'<div class="filter-row">' +
				'<div class="filter-gui">' +
					'<div class="filter-col ui">' +
						'<a class="filter filter-more" title="필터 표시"><span>Filter</span></a>' +
					'</div>' +
				'</div>' +
				'<div class="filter-item"></div>' +
				'<a id="btn_query" class="global-lookup search" title="조회"></a>' +
			'</div>'
		);
		self.activeDataSourceFunction();
	}
	
	this.dataItemOptionLayout = function(){
		$('body').append('<div id="seriesOptions"></div>');
	}
	
	this.fieldFormatOptionLayout = function(){
		$('body').append('<div id="formatOptions"></div>');
		$('body').append('<div id="fieldRename"></div>');
		/*2020-01-14 LSH topN */
		$('body').append('<div id="topNset"></div>');
	};
	
	this.activateBasicFunction = function(){
		userAgentCheck();
	    languageCheck();
//	    $('.scrollbar').scrollbar();
	
	    
//	    .dxScrollView("instance");
	    // top bar util menu UI
	    utilUi();
	    menuItemUi();
	    menuItemSlideUi();
	
	    // common layout UI
	    tabUi();
	    boxColumn();
	    tabColumnClass();
	
	    // panel UI
	    panelUi();
	    // setTimeout(function() { // 1203 setTimeout내부로 호출
		panelLayout();
		panelDataUi();
		displayBtnMoreUi();
	    // }, 400);
	    // setInterval(function(){ // 1203 추가
	    //     panelDataUi();
	    //     displayBtnMoreUi();
	    // }, 400);
//	    panelLayout();
//					
//	    panelDataUi();
	    containerBoxUi();
						   
	    compMoreMenuUi();
	    designMenuUi();
	
	    // modal UI
	    miniPop();
	    modalUi();
	    clickPopupUi(); //0530 추가
	    
	    // input UI
	    btnswitch();
	    treeMenuUi();
	    treeTableUi(); // 0723 추가
	    customSelect();
	    fileUploadUi();
	  
	    // media UI
	    resizeUi();
	    mediaTab();
	    
	    // 0528 소스추가
//	    $('.scrollbar').on('scroll',function(){
//	        if($('.other-menu-ico').length){
//	            $('.other-menu-ico').removeClass('on');
//	        }
//	    });
	    
	    // 0729 모바일반응형 탭 ui 추가
	    preferencesTabMo();
	    
	    reportSearch();
	    gDashboard.scrollbar();
	};
	this.viewactivateBasicFunction = function(){
		userAgentCheck();
	    languageCheck();
	
	    // top bar util menu UI
	    utilUi();
	    menuItemUi();
	    menuItemSlideUi();
	
	    // common layout UI
	    tabUi();
	    boxColumn();
	    tabColumnClass();
	
	    // panel UI
	    panelUi();
	    
	    /* DOGFOOT 20201021 ajkim setTimeout 제거*/
        panelLayout();
        panelDataUi();
        displayBtnMoreUi();
	    // setInterval(function(){ // 1203 추가
	    //     panelDataUi();
	    //     displayBtnMoreUi();
	    // }, 400);
//	    panelLayout();
//					
//	    panelDataUi();
	    containerBoxUi();
						   
	    compMoreMenuUi();
	    designMenuUi();
	
	    // modal UI
	    miniPop();
	    modalUi();
	    clickPopupUi(); //0530 추가
	    
	    // input UI
	    btnswitch();
	    treeMenuUi();
	    customSelect();
	    fileUploadUi();
	  
	    // media UI
	    resizeUi();
	    mediaTab();
	    
	    // 0528 소스추가
//	    $('.scrollbar').on('scroll',function(){
//	        if($('.other-menu-ico').length){
//	            $('.other-menu-ico').removeClass('on');
//	        }
//	    });

	    
	    reportSearch();
	    gDashboard.scrollbar();
//	    $('.scrollbar').scrollbar();
	}

	this.activeDataSourceFunction = function(){
		$('#removeDataSource').off('click').on('click',function(_i,_e){
			var dataset = gDashboard.datasetMaster.getSelectedDataset();
			if (dataset) {
				WISE.confirm(
					'"' + dataset.DATASET_NM + '" 집합을 삭제하시겠습니까?' +(gDashboard.reportType==='DashAny'? '삭제시 연결되어 있는 아이템이 있으면 사라집니다'
							:gDashboard.reportType==='AdHoc'?"삭제시 연결되어 있는 데이터 항목이 있으면 사라집니다":''), 
					{
						buttons: {
							confirm: {
								id: 'confirm',
								className: 'green',
								text: '확인',
								action: function() {
									if(gDashboard.reportType === "Spread" || gDashboard.reportType === "Excel"){
										if(typeof gDashboard.dataSourceManager.datasetInformation[gDashboard.datasetMaster.getSelectedDataset().mapid].SHEET_ID !== "undefined"){
											$AlertPopup.hide();
											WISE.confirm(
													'"' + dataset.DATASET_NM + '" 집합은 현재 시트와 연동되어 있습니다.<br/> 정말 삭제하시겠습니까?', 
													{
														buttons: {
															confirm: {
																id: 'confirm',
																className: 'green',
																text: '확인',
																action: function() {
																		delete gDashboard.dataSourceManager.datasetInformation[gDashboard.datasetMaster.getSelectedDataset().mapid];
																		gDashboard.datasetMaster.deleteSelectedDataset();
																		$AlertPopup.hide();
																}
															},
															cancel: {
																id: 'cancel',
																className: 'negative',
																text: '취소',
																action: function() { $AlertPopup.hide(); }
															}
														}
													}
												);
										}else{
											delete gDashboard.dataSourceManager.datasetInformation[gDashboard.datasetMaster.getSelectedDataset().mapid];
											gDashboard.datasetMaster.deleteSelectedDataset();
											$AlertPopup.hide();
										}
									}else{
										gDashboard.datasetMaster.deleteSelectedDataset();
										$AlertPopup.hide();
									}
								}
							},
							cancel: {
								id: 'cancel',
								className: 'negative',
								text: '취소',
								action: function() { $AlertPopup.hide(); }
							}
						}
					}
				);
			} else {
				var targetId, targetCaption;
				if(gDashboard.reportType == "Spread" || gDashboard.reportType == "Excel"){
					targetCaption = $("#dataSetLookUp").dxList('instance')._selection.options.selectedItems[0];	
					if(targetCaption == undefined)return;
					
					$.each(gDashboard.dataSourceManager.datasetInformation,function(_i,_d){
						if(_d.DATASET_NM == targetCaption){
							targetId = _d.mapid;	
						}
					});
					
				}else{
					targetId = $('#allList').children().children('ul').children('li').attr('id');
					targetCaption = $('#'+targetId).children('a').text();
				}
				// 2020.01.16 mksong confirm 기능 추가 dogfoot
				var options = {
						buttons: {
							confirm: {
								id: 'confirm',
								className: 'green',
								text: '확인',
								action: function() {
									$AlertPopup.hide();
									if(targetId != undefined){
										for(var i=0;i<gDashboard.structure.DataSources.DataSource.length;i++){
											if(gDashboard.structure.DataSources.DataSource[i].ComponentName == targetId){
												gDashboard.structure.DataSources.DataSource.splice(i,1);
												break;
											}
										}
										delete gDashboard.dataSourceManager.datasetInformation[targetId];
										delete gDashboard.dataSetCreate.infoTreeList[targetCaption];
										$.each(gDashboard.dataSetCreate.lookUpItems,function(_i,_items){
											if(_items.DATASET_NM === targetCaption){
												gDashboard.dataSetCreate.lookUpItems.splice(_i,1);
												return false;
											}
										});
										/* DOGFOOT ktkang 데이터 집합이 여러개일 때 하나를 삭제하면 다른 집합의 매개변수들까지 삭제되는 오류 수정 20191213 */
										$.each(gDashboard.dataSetCreate.paramTreeList[targetId],function(_i,_e){
											var delParam = false;
											if(Object.keys(gDashboard.dataSetCreate.paramTreeList).length == 1) {
												delParam = true;
												return false;
											} else {
												for(key in gDashboard.dataSetCreate.paramTreeList) {
													if(targetId != key) {
														$.each(gDashboard.dataSetCreate.paramTreeList[key] ,function(_iii,_eee){
															if(_eee == _e) {
																delParam = false;
																return false;
															} else {
																delParam = true;
															}
														});
													}
												}
											}
											
											if(delParam) {
												delete gDashboard.parameterFilterBar.parameterInformation[_e];
												if(gDashboard.structure.ReportMasterInfo.paramJson.length == undefined){
													delete gDashboard.structure.ReportMasterInfo.paramJson[_e];
												}else{
													for(var i=0;i<gDashboard.structure.ReportMasterInfo.paramJson.length;i++){
														if(gDashboard.structure.ReportMasterInfo.paramJson[i].PARAM_NM == _e){
															gDashboard.structure.ReportMasterInfo.paramJson.splice(i,1);
															break;
														}
													}
												}
											}
										});
										/* DOGFOOT ktkang 데이터 집합이 여러개일 때 하나를 삭제하면 다른 집합의 매개변수들까지 삭제되는 오류 수정 끝 20191213 */
										delete gDashboard.dataSetCreate.paramTreeList[targetId];
										$('.filter-item').empty();
//										gDashboard.parameterHandler.init();
										//gDashboard.parameterHandler.render();
//										gDashboard.parameterHandler.resize();
										
										// tbchoi 집합 2개이상일때 삭제 후 리스트 갱신이 안되는 에러 수정 20200325
										var newLookUpItems=[];
										$.each(gDashboard.dataSetCreate.lookUpItems, function(_id, _ds) {
											if (typeof _ds === 'string') {
												newLookUpItems.push(_ds);
											} else {
												newLookUpItems.push(_ds.DATASET_NM);
											}
										});
										
//										if(gDashboard.reportType == "Spread" || gDashboard.reportType == "Excel"){
//											$('#dataSetLookUp').dxList('instance').option('dataSource',newLookUpItems);
//											if(gDashboard.dataSetCreate.lookUpItems.length == 0){
//												$('#dataSetLookUp').dxList('instance').option('dataSource','');
//											}
//										}else{
										var $dataSetLookUp = $('#dataSetLookUp');
										if(WISE.Constants.editmode == "viewer" && $("#dataArea_"+WISE.Constants.pid+" #dataSetLookUp").length > 0){
											$dataSetLookUp = $("#dataArea_"+WISE.Constants.pid+" #dataSetLookUp");
										}
											$dataSetLookUp.dxLookup('instance').option('items',newLookUpItems);
											if(gDashboard.dataSetCreate.lookUpItems.length == 0){
												$dataSetLookUp.dxLookup('instance').option('value','');
											}else{
												$dataSetLookUp.dxLookup('instance').option('value',newLookUpItems[newLookUpItems.length-1]);
											}
//										}
										
										
										
	
										$.each($('.panelDataA-1').children(),function(_i,_element){
											// var itemId = $(_element).attr('id').replace('fieldManager','');
											// var itemIndex = itemId.substring(itemId.length-1);
											self.removeAnalysisColumn(_i,_element,targetId);
										});
									}
									return false;
								}
							},
							cancel: {
								id: 'cancel',
								className: 'negative',
								text: '취소',
								action: function() { $AlertPopup.hide(); }
							}
						}
				};
				if(targetId != undefined){
					WISE.confirm(targetCaption+' 집합을 삭제하시겠습니까?', options);
				}
				// 2020.01.16 mksong confirm 기능 추가 위한 수정 끝 dogfoot			
			}
		});
		
		//2020.05.19 tbchoi 주제영역 툴팁 변경
		$('#editDataSource').off('mouseover').on('mouseover',function(_i,_e){
			$('#editDataSource').children('img').attr('title','데이터 집합 수정');
			if(!gDashboard.dataSourceManager.datasetInformation.length) return;
			if(gDashboard.reportType !== "Spread" || gDashboard.reportType !== "Excel"){
				targetId = $('#allList').children().children('ul').children('li').attr('id');					
				var dataset_Type = gDashboard.dataSourceManager.datasetInformation[targetId].DATASET_TYPE;
				/* DOGFOOT ktkang 주제영역 필터 오류 수정  20200205 */
				if(!dataset_Type) {
					dataset_Type = gDashboard.dataSourceManager.datasetInformation[targetId].DATASRC_TYPE;
				}
				if(dataset_Type == 'CUBE') {
					$('#editDataSource').children('img').attr('title','매개변수 편집');
				}				
			}
		});
		
		
		$('#editDataSource').off('click').on('click',function(_i,_e){
			var dataset = gDashboard.datasetMaster.getSelectedDataset();
			var dataset_Type;
			var targetId, targetCaption;
			
			/* DOGFOOT ktkang 사용자 데이터 업로드 오류 수정  20201111 */
			if(typeof dataset.userUpload != 'undefined' && dataset.userUpload == 'Y') {
				WISE.alert('사용자데이터 업로드는 데이터 집합 수정 기능이 없습니다.');
				return false;
			}
			
			if(dataset) {
				dataset_Type = dataset.DATASET_TYPE;
				targetId = dataset.mapid;
				targetCaption = dataset.DATASET_NM;
				/* DOGFOOT ktkang 주제영역 필터 오류 수정  20210127 */
				if(!dataset_Type || dataset_Type == "") {
					dataset_Type = dataset.DATASRC_TYPE;
				}
			} else {
//				if(gDashboard.reportType == "Spread" || gDashboard.reportType == "Excel"){
//					targetCaption = $("#dataSetLookUp").dxList('instance')._selection.options.selectedItems[0];	
//					if(targetCaption == undefined)return;				
//					$.each(gDashboard.dataSourceManager.datasetInformation,function(_i,_d){
//						if(_d.DATASET_NM == targetCaption){
//							targetId = _d.mapid;	
//						}
//					});	
//				}else{
					/*dogfoot 비정형 매개변수 편집 오류 수정 shlim 20200715*/
//					targetId = $('#allList').children().children('ul').children('li').attr('id');
					targetId = $('#allList').children().find('ul').children('li').attr('id');
					targetCaption = $('#'+targetId).children('a').text();
//				}

				if(targetId) {
					dataset_Type = gDashboard.dataSourceManager.datasetInformation[targetId].DATASET_TYPE;
					/* DOGFOOT ktkang 주제영역 필터 오류 수정  20210127 */
					if(!dataset_Type || dataset_Type == "") {
						dataset_Type = gDashboard.dataSourceManager.datasetInformation[targetId].DATASRC_TYPE;
					}
				}
			}

			$('body').append('<div id="edit_ds_popup" class="ds_popup"></div>');
			
			/*DOGFOOT cshan 20200113 - 신규 데이터 집합 생성 - 주제영역*/
			if(dataset_Type == "DataSetSQL" || dataset_Type == "DataSetDs" || dataset_Type == 'DataSetCube'){
				if( gDashboard.reportType == 'AdHoc' && WISE.Constants.editmode != 'viewer'){
					gDashboard.adhocEditDatasource = true;
                }
				gDashboard.datasetDesigner.render({
                    datasource: gDashboard.datasetMaster.getState('DATASOURCES')[dataset.mapid],
					dataset: dataset,
					params: WISE.libs.Dashboard.item.DatasetUtility.getParamByMapId(dataset.mapid)
				});
			}else if(dataset_Type == 'DataSetSingleDs' || dataset_Type == 'DataSetSingleDsView' ){
				if( gDashboard.reportType == 'AdHoc' && WISE.Constants.editmode != 'viewer'){
					gDashboard.adhocEditDatasource = true;
                }
				gDashboard.editDataSourceByTarget(targetId,targetCaption,dataset_Type);
			/* DOGFOOT ktkang 주제영역에서 필터 수정 및 삭제 기능  20200704 */
			}else if(dataset_Type == 'CUBE') {
				
				if(gDashboard.isNewReport) {
					gDashboard.FieldFilter.editFilter(true, null);
				} else {
					gDashboard.FieldFilter.editFilter(true, gDashboard.datasetMaster.state.datasources.dataSource1.DS_ID, gDashboard.datasetMaster.state.params, gDashboard.datasetDesigner.onParamEditConfirm);
				}
			}else{
				console.log("Error DataSetType=",dataset_Type);
				return false;
			}
		});
		$('#createCustomField').off('click').on('click', function(){
			gDashboard.customFieldManager.createCustomField();
		});
	};
	
	//20200701 AJKIM 트리뷰 폴더 검색 기능 추가 DOGFOOT
	//collapseAll, expandAll 심한 딜레이 있음
	this.addCustomSearch = function(id){
		if($("#" + id + '_search').length === 0){
        	$("#" + id).before('<div id="' + id + '_search"></div>');
        }
        $("#" + id + '_search').dxTextBox({
        	placeholder: "검색",
        	valueChangeEvent: "keyup",
        	onValueChanged: function(data){
        		if(data.value === ""){
        			$("#" + id).dxTreeView("collapseAll")
        			$("#" + id + ' .dx-treeview-node').css('display', 'block');
        		}else{
        			if($("#" + id).dxTreeView("getDataSource").items().length !== $('#data_list .dx-treeview-node').length){
        				$("#" + id).dxTreeView("expandAll");
        				$("#" + id + ' .dx-treeview-node').css('display', 'none');
                		$("#" + id + ' .dx-treeview-node:contains("' + data.value + '")').css('display', 'block');
                		$("#" + id + ' .dx-treeview-node:not(.dx-treeview-node-is-leaf):contains("' + data.value + '")[aria-label*="' + data.value + '"] .dx-treeview-node').css('display', 'block');
        			}else{
        				$("#" + id + ' .dx-treeview-node').css('display', 'none');
                		$("#" + id + ' .dx-treeview-node:contains("' + data.value + '")').css('display', 'block');
                		$("#" + id + ' .dx-treeview-node:not(.dx-treeview-node-is-leaf):contains("' + data.value + '")[aria-label*="' + data.value + '"] .dx-treeview-node').css('display', 'block');
                		$("#" + id).dxTreeView("expandAll");
//                		$("#" + id).dxTreeView("expandAll");
        			}
        		}
        	},
        	showClearButton: true,
        	mode: "search"
        });
	}
	
	this.removeAnalysisColumn = function(_idx, _element, targetId){
		if($(_element).attr('id') != undefined){
			var itemId = $(_element).attr('id').replace('fieldManager','');
			var itemIndex = itemId.substring(itemId.length-1);
			var deletecheck = false;
			switch($(_element).attr('type')){
				case 'PIVOT_GRID':
					var pivotValueList = $(_element).find('#dataList'+itemIndex).children().children('li');
					var pivotColumnList = $(_element).find('#colList'+itemIndex).children().children('li');
					var pivotRowList = $(_element).find('#rowList'+itemIndex).children().children('li');
					var pivotHiddenList = $(_element).find('#pivot_hide_measure_list'+itemIndex).children().children('li');
					$.each(pivotValueList,function(_i,_ch){
						if(targetId === $(_ch).attr('data-source-id')){
							$(_ch).parent().remove();
						}
					});
					
					$.each(pivotColumnList,function(_i,_ch){
						if(targetId === $(_ch).attr('data-source-id')){
							$(_ch).parent().remove();
						}
					});

					$.each(pivotRowList,function(_i,_ch){
						if(targetId === $(_ch).attr('data-source-id')){
							$(_ch).parent().remove();
						}
					});

					$.each(pivotHiddenList,function(_i,_ch){
						if(targetId === $(_ch).attr('data-source-id')){
							$(_ch).parent().remove();
						}
					});

					if($(_element).find('#dataList'+itemIndex).children().children('li').length == 0){
						$(_element).find('#dataList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
					}

					if($(_element).find('#colList'+itemIndex).children().children('li').length ==0){
						$(_element).find('#colList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newcolumnfiled') + '</a></li></ul>');
					}

					if($(_element).find('#rowList'+itemIndex).children().children('li').length ==0){
						$(_element).find('#rowList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newrowfiled') + '</a></li></ul>');
					}

					if($(_element).find('#pivot_hide_measure_list'+itemIndex).children().children('li').length ==0){
						$(_element).find('#pivot_hide_measure_list'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
					}

					// $(_element).children().removeAttr('data-source-id');
					break;

				case 'DATA_GRID':
					var gridColumnList = $(_element).find('#columnList'+itemIndex).children().children('li');
					var gridSparklineList = $(_element).find('#sparkline'+itemIndex).children().children('li');
					var gridHiddenList = $(_element).find('#grid_hide_measure_list'+itemIndex).children().children('li');
					$.each(gridColumnList,function(_i,_ch){
						if(targetId === $(_ch).attr('data-source-id')){
							$(_ch).parent().remove();
						}
					});
					
					$.each(gridSparklineList,function(_i,_ch){
						if(targetId === $(_ch).attr('data-source-id')){
							$(_ch).parent().remove();
						}
					});

					$.each(gridHiddenList,function(_i,_ch){
						if(targetId === $(_ch).attr('data-source-id')){
							$(_ch).parent().remove();
						}
					});

					if($(_element).find('#columnList'+itemIndex).children().children('li').length ==0){
						$(_element).find('#columnList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newfiled') + '</a></li></ul>');
					}

					if($(_element).find('#sparkline'+itemIndex).children().children('li').length ==0){
						$(_element).find('#sparkline'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newsparkline') + '</a></li></ul>');
					}

					if($(_element).find('#grid_hide_measure_list'+itemIndex).children().children('li').length ==0){
						$(_element).find('#grid_hide_measure_list'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
					}

					// $(_element).children().removeAttr('data-source-id');
					break;

				case 'SIMPLE_CHART':
					var chartValueList = $(_element).find('#chartValueList'+itemIndex).children().children('li');
					var chartParamaterList = $(_element).find('#chartParameterList'+itemIndex).children().children('li');
					var chartSeriesList = $(_element).find('#chartSeriesList'+itemIndex).children().children('li');
					var chartHiddenList = $(_element).find('#chart_hide_measure_list'+itemIndex).children().children('li');
					$.each(chartValueList,function(_i,_ch){
						if(targetId === $(_ch).attr('data-source-id')){
							$(_ch).parent().remove();
						}
					});
					
					$.each(chartParamaterList,function(_i,_ch){
						if(targetId === $(_ch).attr('data-source-id')){
							$(_ch).parent().remove();
						}
					});

					$.each(chartSeriesList,function(_i,_ch){
						if(targetId === $(_ch).attr('data-source-id')){
							$(_ch).parent().remove();
						}
					});

					$.each(chartHiddenList,function(_i,_ch){
						if(targetId === $(_ch).attr('data-source-id')){
							$(_ch).parent().remove();
						}
					});

					if($(_element).find('#chartValueList'+itemIndex).children().children('li').length ==0){
						$(_element).find('#chartValueList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
					}

					if($(_element).find('#chartParameterList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#chartParameterList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}

				if($(_element).find('#chartSeriesList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#chartSeriesList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newseries') +  '</a></li></ul>');
				}

				if($(_element).find('#chart_hide_measure_list'+itemIndex).children().children('li').length ==0){
					$(_element).find('#chart_hide_measure_list'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}

				// $(_element).children().removeAttr('data-source-id');
				break;
			case 'PIE_CHART':
				var pieValueList = $(_element).find('#pieValueList'+itemIndex).children().children('li');
				var pieParamaterList = $(_element).find('#pieParameterList'+itemIndex).children().children('li');
				var pieSeriesList = $(_element).find('#pieSeriesList'+itemIndex).children().children('li');
				var pieHiddenList = $(_element).find('#pie_hide_measure_list'+itemIndex).children().children('li');
				$.each(pieValueList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				
				$.each(pieParamaterList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});

				$.each(pieSeriesList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});

				$.each(pieHiddenList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});

				if($(_element).find('#pieValueList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#pieValueList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}

				if($(_element).find('#pieParameterList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#pieParameterList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}

				if($(_element).find('#pieSeriesList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#pieSeriesList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newseries') +  '</a></li></ul>');
				}

				if($(_element).find('#pie_hide_measure_list'+itemIndex).children().children('li').length ==0){
					$(_element).find('#pie_hide_measure_list'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}

				// $(_element).children().removeAttr('data-source-id');
				break;

			case 'PARALLEL_COORDINATE':
				var parallelValueList = $(_element).find('#parallelValueList'+itemIndex).children().children('li');
				var parallelParamaterList = $(_element).find('#parallelParameterList'+itemIndex).children().children('li');
				$.each(parallelValueList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				
				$.each(parallelParamaterList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});

				if($(_element).find('#parallelValueList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#parallelValueList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}

				if($(_element).find('#parallelParameterList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#parallelParameterList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}

				// $(_element).children().removeAttr('data-source-id');
				break;
			case 'BUBBLE_PACK_CHART':
				var bubblepackchartValueList = $(_element).find('#bubblepackchartValueList'+itemIndex).children().children('li');
				var bubblepackchartParamaterList = $(_element).find('#bubblepackchartParameterList'+itemIndex).children().children('li');
				$.each(bubblepackchartValueList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				
				$.each(bubblepackchartParamaterList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				
				if($(_element).find('#bubblepackchartValueList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#bubblepackchartValueList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}
				
				if($(_element).find('#bubblepackchartParameterList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#bubblepackchartParameterList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}
				
				// $(_element).children().removeAttr('data-source-id');
				break;
			case 'WORD_CLOUD_V2':
				var wordcloudv2ValueList = $(_element).find('#wordcloudv2ValueList'+itemIndex).children().children('li');
				var wordcloudv2ParamaterList = $(_element).find('#wordcloudv2ParameterList'+itemIndex).children().children('li');
				$.each(wordcloudv2ValueList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				
				$.each(wordcloudv2ParamaterList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				
				if($(_element).find('#wordcloudv2ValueList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#wordcloudv2ValueList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}
				
				if($(_element).find('#wordcloudv2ParameterList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#wordcloudv2ParameterList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}
				
				// $(_element).children().removeAttr('data-source-id');
				break;
			case 'DENDROGRAM_BAR_CHART':
				var dendrogrambarchartValueList = $(_element).find('#dendrogrambarchartValueList'+itemIndex).children().children('li');
				var dendrogrambarchartParamaterList = $(_element).find('#dendrogrambarchartParameterList'+itemIndex).children().children('li');
				$.each(dendrogrambarchartValueList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				
				$.each(dendrogrambarchartParamaterList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				
				if($(_element).find('#dendrogrambarchartValueList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#dendrogrambarchartValueList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}
				
				if($(_element).find('#dendrogrambarchartParameterList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#dendrogrambarchartParameterList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}
				
				// $(_element).children().removeAttr('data-source-id');
				break;
			case 'CALENDAR_VIEW_CHART':
				var calendarviewchartValueList = $(_element).find('#calendarviewchartValueList'+itemIndex).children().children('li');
				var calendarviewchartParamaterList = $(_element).find('#calendarviewchartParameterList'+itemIndex).children().children('li');
				$.each(calendarviewchartValueList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				
				$.each(calendarviewchartParamaterList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				
				if($(_element).find('#calendarviewchartValueList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#calendarviewchartValueList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}
				
				if($(_element).find('#calendarviewchartParameterList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#calendarviewchartParameterList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}
				
				// $(_element).children().removeAttr('data-source-id');
				break;
			case 'CALENDAR_VIEW2_CHART':
				var calendarview2chartValueList = $(_element).find('#calendarview2chartValueList'+itemIndex).children().children('li');
				var calendarview2chartParamaterList = $(_element).find('#calendarview2chartParameterList'+itemIndex).children().children('li');
				$.each(calendarview2chartValueList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				
				$.each(calendarview2chartParamaterList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				
				if($(_element).find('#calendarview2chartValueList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#calendarview2chartValueList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}
				
				if($(_element).find('#calendarview2chartParameterList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#calendarview2chartParameterList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}
				
				// $(_element).children().removeAttr('data-source-id');
				break;
			case 'CALENDAR_VIEW3_CHART':
				var calendarview3chartValueList = $(_element).find('#calendarview3chartValueList'+itemIndex).children().children('li');
				var calendarview3chartParamaterList = $(_element).find('#calendarview3chartParameterList'+itemIndex).children().children('li');
				$.each(calendarview3chartValueList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				
				$.each(calendarview3chartParamaterList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				
				if($(_element).find('#calendarview3chartValueList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#calendarview3chartValueList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}
				
				if($(_element).find('#calendarview3chartParameterList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#calendarview3chartParameterList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}
				
				// $(_element).children().removeAttr('data-source-id');
				break;
			case 'COLLAPSIBLE_TREE_CHART':
				var collapsibletreechartValueList = $(_element).find('#collapsibletreechartValueList'+itemIndex).children().children('li');
				var collapsibletreechartParamaterList = $(_element).find('#collapsibletreechartParameterList'+itemIndex).children().children('li');
				$.each(collapsibletreechartValueList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				
				$.each(collapsibletreechartParamaterList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				
				if($(_element).find('#collapsibletreechartValueList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#collapsibletreechartValueList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}
				
				if($(_element).find('#collapsibletreechartParameterList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#collapsibletreechartParameterList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}
				
				// $(_element).children().removeAttr('data-source-id');
				break;
			case 'WordCloud':
				var WordCloudValueList = $(_element).find('#wordcloudValueList'+itemIndex).children().children('li');
				var WordCloudParamaterList = $(_element).find('#wordcloudParameterList'+itemIndex).children().children('li');
				$.each(WordCloudValueList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				
				$.each(WordCloudParamaterList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});

				if($(_element).find('#wordcloudValueList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#wordcloudValueList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}

				if($(_element).find('#wordcloudParameterList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#wordcloudParameterList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}

				// $(_element).children().removeAttr('data-source-id');
				break;
			case 'HEATMAP':
				var heatmapValueList = $(_element).find('#heatmapValueList'+itemIndex).children().children('li');
				var heatmapParamaterList = $(_element).find('#heatmapParameterList'+itemIndex).children().children('li');
				var heatmapHiddenList = $(_element).find('#heatmap_hide_measure_list'+itemIndex).children().children('li');

				$.each(heatmapValueList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				$.each(heatmapParamaterList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				$.each(heatmapHiddenList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});

				if($(_element).find('#heatmapValueList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#heatmapValueList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}
				if($(_element).find('#heatmapParameterList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#heatmapParameterList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}
				if($(_element).find('#heatmap_hide_measure_list'+itemIndex).children().children('li').length ==0){
					$(_element).find('#heatmap_hide_measure_list'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}

				// $(_element).children().removeAttr('data-source-id');
				break;
			case 'HEATMAP2':
				var heatmapValueList = $(_element).find('#heatmap2ValueList'+itemIndex).children().children('li');
				var heatmapParamaterList = $(_element).find('#heatmap2ParameterList'+itemIndex).children().children('li');
				var heatmapHiddenList = $(_element).find('#heatmap_hide_measure_list'+itemIndex).children().children('li');
				
				$.each(heatmapValueList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				$.each(heatmapParamaterList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				
				$.each(heatmapHiddenList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});

				if($(_element).find('#heatmap2ValueList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#heatmap2ValueList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}
				if($(_element).find('#heatmap2ParameterList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#heatmap2ParameterList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}
				
				if($(_element).find('#heatmap2_hide_measure_list'+itemIndex).children().children('li').length ==0){
					$(_element).find('#heatmap2_hide_measure_list'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}

				// $(_element).children().removeAttr('data-source-id');
				break;
			case 'SYNCHRONIZED_CHARTS':
				var syncchartValueList = $(_element).find('#syncchartValueList'+itemIndex).children().children('li');
				var syncchartParamaterList = $(_element).find('#syncchartParameterList'+itemIndex).children().children('li');
				var syncchartHiddenList = $(_element).find('#syncchart_hide_measure_list'+itemIndex).children().children('li');
				
				$.each(syncchartValueList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				$.each(syncchartParamaterList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				
				$.each(syncchartHiddenList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});

				if($(_element).find('#syncchartValueList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#syncchartValueList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}
				if($(_element).find('#syncchartParameterList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#syncchartParameterList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}
				
				if($(_element).find('#syncchart_hide_measure_list'+itemIndex).children().children('li').length ==0){
					$(_element).find('#syncchart_hide_measure_list'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}

				// $(_element).children().removeAttr('data-source-id');
				break;
			case 'HISTOGRAM_CHART':
				var histogramchartValueList = $(_element).find('#histogramchartValueList'+itemIndex).children().children('li');
//				var histogramchartParamaterList = $(_element).find('#histogramchartParameterList'+itemIndex).children().children('li');

				$.each(histogramchartValueList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
//				$.each(histogramchartParamaterList,function(_i,_ch){
//					if(targetId === $(_ch).attr('data-source-id')){
//						$(_ch).parent().remove();
//					}
//				});

				if($(_element).find('#histogramchartValueList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#histogramchartValueList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}
//				if($(_element).find('#histogramchartParameterList'+itemIndex).children().children('li').length ==0){
//					$(_element).find('#histogramchartParameterList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
//				}

				// $(_element).children().removeAttr('data-source-id');
				break;

			case 'CHOROPLETH_MAP':
				var mapValueList = $(_element).find('#mapValueList'+itemIndex).children().children('li');
				var mapParamaterList = $(_element).find('#mapParameterList'+itemIndex).children().children('li');

				$.each(mapValueList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				$.each(mapParamaterList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});

				if($(_element).find('#mapValueList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#mapValueList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}
				if($(_element).find('#mapParameterList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#mapParameterList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}

				// $(_element).children().removeAttr('data-source-id');
				break;

			case 'TREEMAP':
				var treemapValueList = $(_element).find('#treemapValueList'+itemIndex).children().children('li');
				var treemapParamaterList = $(_element).find('#treemapParameterList'+itemIndex).children().children('li');

				$.each(treemapValueList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				$.each(treemapParamaterList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});

				if($(_element).find('#treemapValueList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#treemapValueList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}
				if($(_element).find('#treemapParameterList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#treemapParameterList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}

				// $(_element).children().removeAttr('data-source-id');
				break;

			case 'STAR_CHART':
				var starchartValueList = $(_element).find('#starchartValueList'+itemIndex).children().children('li');
				var starchartParamaterList = $(_element).find('#starchartParameterList'+itemIndex).children().children('li');
				var starchartSeriesList = $(_element).find('#starchartSeriesList'+itemIndex).children().children('li');
				$.each(starchartValueList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				
				$.each(starchartParamaterList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});

				$.each(starchartSeriesList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});

				$.each(pieHiddenList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});

				if($(_element).find('#starchartValueList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#starchartValueList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}

				if($(_element).find('#starchartParameterList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#starchartParameterList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}

				if($(_element).find('#starchartSeriesList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#starchartSeriesList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newseries') +  '</a></li></ul>');
				}

				// $(_element).children().removeAttr('data-source-id');
				break;
			case 'HIERARCHICAL_EDGE':
				var hierarchicalParamaterList = $(_element).find('#hierarchicalParameterList'+itemIndex).children().children('li');
				$.each(hierarchicalParamaterList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});

				if($(_element).find('#hierarchicalParameterList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#hierarchicalParameterList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}

				// $(_element).children().removeAttr('data-source-id');
				break;
			/*dogfoot 신규 레인지 차트 추가 shlim 20200811*/
			case 'RANGE_BAR_CHART':
				var rangebarchartValueList = $(_element).find('#rangebarchartValueList'+itemIndex).children().children('li');
				var rangebarchartParamaterList = $(_element).find('#rangebarchartParameterList'+itemIndex).children().children('li');
//				var rangebarchartSeriesList = $(_element).find('#rangebarchartSeriesList'+itemIndex).children().children('li');
//				var rangebarchartHiddenList = $(_element).find('#rangebarchart_hide_measure_list'+itemIndex).children().children('li');
				$.each(rangebarchartValueList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
					
				$.each(rangebarchartParamaterList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});

//				$.each(rangebarchartSeriesList,function(_i,_ch){
//					if(targetId === $(_ch).attr('data-source-id')){
//						$(_ch).parent().remove();
//					}
//				});
//
//				$.each(rangebarchartHiddenList,function(_i,_ch){
//					if(targetId === $(_ch).attr('data-source-id')){
//						$(_ch).parent().remove();
//					}
//				});
	
				if($(_element).find('#rangebarchartValueList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#rangebarchartValueList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}

				if($(_element).find('#rangebarchartParameterList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#rangebarchartParameterList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}

//				if($(_element).find('#rangebarchartSeriesList'+itemIndex).children().children('li').length ==0){
//					$(_element).find('#rangebarchartSeriesList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newseries') +  '</a></li></ul>');
//				}
//
//				if($(_element).find('#rangebarchart_hide_measure_list'+itemIndex).children().children('li').length ==0){
//					$(_element).find('#rangebarchart_hide_measure_list'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
//				}

				// $(_element).children().removeAttr('data-source-id');
				break;
			case 'RANGE_AREA_CHART':
				var rangeareachartValueList = $(_element).find('#rangeareachartValueList'+itemIndex).children().children('li');
				var rangeareachartParamaterList = $(_element).find('#rangeareachartParameterList'+itemIndex).children().children('li');
//				var rangeareachartSeriesList = $(_element).find('#rangeareachartSeriesList'+itemIndex).children().children('li');
//				var rangeareachartHiddenList = $(_element).find('#rangeareachart_hide_measure_list'+itemIndex).children().children('li');
				$.each(rangeareachartValueList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
					
				$.each(rangeareachartParamaterList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});

//				$.each(rangeareachartSeriesList,function(_i,_ch){
//					if(targetId === $(_ch).attr('data-source-id')){
//						$(_ch).parent().remove();
//					}
//				});
//
//				$.each(rangeareachartHiddenList,function(_i,_ch){
//					if(targetId === $(_ch).attr('data-source-id')){
//						$(_ch).parent().remove();
//					}
//				});
	
				if($(_element).find('#rangeareachartValueList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#rangeareachartValueList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}

				if($(_element).find('#rangeareachartParameterList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#rangeareachartParameterList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}

//				if($(_element).find('#rangeareachartSeriesList'+itemIndex).children().children('li').length ==0){
//					$(_element).find('#rangeareachartSeriesList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newseries') +  '</a></li></ul>');
//				}
//
//				if($(_element).find('#rangeareachart_hide_measure_list'+itemIndex).children().children('li').length ==0){
//					$(_element).find('#rangeareachart_hide_measure_list'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
//				}

				// $(_element).children().removeAttr('data-source-id');
				break;
			case 'FUNNEL_CHART':
				var funnelchartValueList = $(_element).find('#funnelchartValueList'+itemIndex).children().children('li');
				var funnelchartParameterList = $(_element).find('#funnelchartParameterList'+itemIndex).children().children('li');

				$.each(funnelchartValueList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				$.each(funnelchartParameterList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});

				if($(_element).find('#funnelchartValueList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#funnelchartValueList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}
				if($(_element).find('#funnelchartParameterList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#funnelchartParameterList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}

				break;
			case 'PYRAMID_CHART':
				var pyramidchartValueList = $(_element).find('#pyramidchartValueList'+itemIndex).children().children('li');
				var pyramidchartParameterList = $(_element).find('#pyramidchartParameterList'+itemIndex).children().children('li');

				$.each(pyramidchartValueList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				$.each(pyramidchartParameterList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});

				if($(_element).find('#pyramidchartValueList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#pyramidchartValueList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}
				if($(_element).find('#pyramidchartParameterList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#pyramidchartParameterList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}

				break;
				/* DOGFOOT syjin 카카오 지도 추가  20200820 */
			case 'KAKAO_MAP':
				var kakaoMapLatitudeList = $(_element).find('#kakaoMapLatitudeList'+itemIndex).children().children('li');
				var kakaoMapLongitudeList = $(_element).find('#kakaoMapLongitudeList'+itemIndex).children().children('li');
				var kakaoMapAddressList = $(_element).find('#kakaoMapAddressList'+itemIndex).children().children('li');
				var kakaoMapValueList = $(_element).find('#kakaoMapValueList'+itemIndex).children().children('li');
				var kakaoMapFieldList = $(_element).find('#kakaoMapFieldList'+itemIndex).children().children('li');

				$.each(kakaoMapLatitudeList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				$.each(kakaoMapLongitudeList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				$.each(kakaoMapAddressList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				$.each(kakaoMapValueList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				$.each(kakaoMapFieldList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});

				if($(_element).find('#kakaoMapValueList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#kakaoMapValueList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}
				if($(_element).find('#kakaoMapParameterList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#kakaoMapParameterList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}

				break;
			case 'KAKAO_MAP2':
				var kakaoMap2ValueList = $(_element).find('#kakaoMap2ValueList'+itemIndex).children().children('li');
				var kakaoMap2ParameterList = $(_element).find('#kakaoMap2ParameterList'+itemIndex).children().children('li');

				$.each(kakaoMap2ValueList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				$.each(kakaoMap2ParameterList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});

				if($(_element).find('#kakaoMa2pValueList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#kakaoMap2ValueList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}
				if($(_element).find('#kakaoMap2ParameterList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#kakaoMap2ParameterList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}

				break;
			case 'SCATTER_PLOT':
//				var scatterplotValueList = $(_element).find('#scatterplotValueList'+itemIndex).children().children('li');
				var scatterplotXList = $(_element).find('#scatterplotXList'+itemIndex).children().children('li');
				var scatterplotYList = $(_element).find('#scatterplotYList'+itemIndex).children().children('li');
//				var scatterplotZList = $(_element).find('#scatterplotZList'+itemIndex).children().children('li');
				var scatterplotParamaterList = $(_element).find('#scatterplotParameterList'+itemIndex).children().children('li');
//				var scatterplot_hide_measure_list = $(_element).find('#scatterplot_hide_measure_list'+itemIndex).children().children('li');
				
				$.each(scatterplotXList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				$.each(scatterplotYList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				
				$.each(scatterplotParamaterList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});

//				if($(_element).find('#scatterplotValueList'+itemIndex).children().children('li').length ==0){
//					$(_element).find('#scatterplotValueList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
//				}
				if($(_element).find('#scatterplotXList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#scatterplotXList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}
				if($(_element).find('#scatterplotYList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#scatterplotYList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}
//				if($(_element).find('#scatterplotZList'+itemIndex).children().children('li').length ==0){
//					$(_element).find('#scatterplotZList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
//				}

				if($(_element).find('#scatterplotParameterList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#scatterplotParameterList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}
				
//				if($(_element).find('#scatterplot_hide_measure_list'+itemIndex).children().children('li').length ==0){
//					$(_element).find('#scatterplot_hide_measure_list'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' +  + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + +  '</a></li></ul>');
//				}

				break;
			case 'SCATTER_PLOT2':
//				var scatterplotValueList = $(_element).find('#scatterplotValueList'+itemIndex).children().children('li');
				var scatterplotXList = $(_element).find('#scatterplot2XList'+itemIndex).children().children('li');
				var scatterplotYList = $(_element).find('#scatterplot2YList'+itemIndex).children().children('li');
				var scatterplotZList = $(_element).find('#scatterplot2ZList'+itemIndex).children().children('li');
				var scatterplotParamaterList = $(_element).find('#scatterplot2ParameterList'+itemIndex).children().children('li');
//				var scatterplot_hide_measure_list = $(_element).find('#scatterplot2_hide_measure_list'+itemIndex).children().children('li');
				
				$.each(scatterplotXList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				$.each(scatterplotYList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				
				$.each(scatterplotZList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				
				$.each(scatterplotParamaterList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});

//				if($(_element).find('#scatterplotValueList'+itemIndex).children().children('li').length ==0){
//					$(_element).find('#scatterplotValueList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
//				}
				if($(_element).find('#scatterplot2XList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#scatterplot2XList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}
				if($(_element).find('#scatterplot2YList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#scatterplot2YList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}
				if($(_element).find('#scatterplot2ZList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#scatterplot2ZList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}

				if($(_element).find('#scatterplot2ParameterList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#scatterplot2ParameterList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}
				
//				if($(_element).find('#scatterplot2_hide_measure_list'+itemIndex).children().children('li').length ==0){
//					$(_element).find('#scatterplot2_hide_measure_list'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' +  + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + +  '</a></li></ul>');
//				}

				break;
			case 'RADIAL_TIDY_TREE':
				var radialTidyTreeParameterList = $(_element).find('#radialTidyTreeParameterList'+itemIndex).children().children('li');
				
				$.each(radialTidyTreeParameterList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});

				if($(_element).find('#radialTidyTreeParameterList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#radialTidyTreeParameterList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}
				break;
			case 'ARC_DIAGRAM':
				var arcdiagramParameterList = $(_element).find('#arcdiagramParameterList'+itemIndex).children().children('li');
				
				$.each(arcdiagramParameterList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});

				if($(_element).find('#arcdiagramParameterList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#arcdiagramParameterList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}
				break;
			case 'SCATTER_PLOT_MATRIX':
//				var scatterplotValueList = $(_element).find('#scatterplotValueList'+itemIndex).children().children('li');
				var scatterPlotMatrixX1List = $(_element).find('#scatterPlotMatrixX1List'+itemIndex).children().children('li');
				var scatterPlotMatrixY1List = $(_element).find('#scatterPlotMatrixY1List'+itemIndex).children().children('li');
				var scatterPlotMatrixX2List = $(_element).find('#scatterPlotMatrixX2List'+itemIndex).children().children('li');
				var scatterPlotMatrixY2List = $(_element).find('#scatterPlotMatrixY2List'+itemIndex).children().children('li');
//				var scatterplotZList = $(_element).find('#scatterplotZList'+itemIndex).children().children('li');
				var scatterPlotMatrixParameterList = $(_element).find('#scatterPlotMatrixParameterList'+itemIndex).children().children('li');
				
				$.each(scatterPlotMatrixX1List,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				$.each(scatterPlotMatrixY1List,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				$.each(scatterPlotMatrixX2List,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				$.each(scatterPlotMatrixY2List,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				
				$.each(scatterPlotMatrixParameterList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});

				if($(_element).find('#scatterPlotMatrixX1List'+itemIndex).children().children('li').length ==0){
					$(_element).find('#scatterPlotMatrixX1List'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}
				if($(_element).find('#scatterPlotMatrixY1List'+itemIndex).children().children('li').length ==0){
					$(_element).find('#scatterPlotMatrixY1List'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}
				if($(_element).find('#scatterPlotMatrixX2List'+itemIndex).children().children('li').length ==0){
					$(_element).find('#scatterPlotMatrixX1List'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}
				if($(_element).find('#scatterPlotMatrixY2List'+itemIndex).children().children('li').length ==0){
					$(_element).find('#scatterPlotMatrixY1List'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}

				if($(_element).find('#scatterPlotMatrixParameterList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#scatterPlotMatrixParameterList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}

				break;
			case 'HISTORY_TIMELINE':
				var historyTimelineParameterList = $(_element).find('#historyTimelineParameterList'+itemIndex).children().children('li');
				var historyTimelineStartList = $(_element).find('#historyTimelineStartList'+itemIndex).children().children('li');
				var historyTimelineEndList = $(_element).find('#historyTimelineEndList'+itemIndex).children().children('li');
				
				$.each(historyTimelineStartList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				
				$.each(historyTimelineEndList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				
				$.each(historyTimelineParameterList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});

//				if($(_element).find('#scatterplotValueList'+itemIndex).children().children('li').length ==0){
//					$(_element).find('#scatterplotValueList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
//				}
//				if($(_element).find('#scatterplotXList'+itemIndex).children().children('li').length ==0){
//					$(_element).find('#scatterplotXList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
//				}
//				if($(_element).find('#scatterplotYList'+itemIndex).children().children('li').length ==0){
//					$(_element).find('#scatterplotYList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
//				}
//				if($(_element).find('#scatterplotZList'+itemIndex).children().children('li').length ==0){
//					$(_element).find('#scatterplotZList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
//				}

				if($(_element).find('#historyTimelineStartList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#historyTimelineStartList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}
				
				if($(_element).find('#historyTimelineEndList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#historyTimelineEndList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}
				
				if($(_element).find('#historyTimelineParameterList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#historyTimelineParameterList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}


				break;
			case 'BOX_PLOT':
				var boxplotValueList = $(_element).find('#boxplotValueList'+itemIndex).children().children('li');
				var boxplotParamaterList = $(_element).find('#boxplotParameterList'+itemIndex).children().children('li');
				$.each(boxplotValueList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				
				$.each(boxplotParamaterList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});

				if($(_element).find('#boxplotValueList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#boxplotValueList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}

				if($(_element).find('#boxplotParameterList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#boxplotParameterList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}

				break;
			case 'COORDINATE_LINE':
				var coordinatelineXList = $(_element).find('#coordinatelineXList'+itemIndex).children().children('li');
				var coordinatelineYList = $(_element).find('#coordinatelineYList'+itemIndex).children().children('li');
				var coordinatelineParameterList = $(_element).find('#coordinatelineParameterList'+itemIndex).children().children('li');
				
				$.each(coordinatelineXList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				
				$.each(coordinatelineYList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				
				$.each(coordinatelineParameterList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});

				if($(_element).find('#coordinatelineXList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#coordinatelineXList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}
				if($(_element).find('#coordinatelineYList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#coordinatelineYList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}
				if($(_element).find('#coordinatelineParameterList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#coordinatelineParameterList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}

				break;
			case 'COORDINATE_DOT':
				var coordinatedotXList = $(_element).find('#coordinatedotXList'+itemIndex).children().children('li');
				var coordinatedotYList = $(_element).find('#coordinatedotYList'+itemIndex).children().children('li');
				var coordinatedotParameterList = $(_element).find('#coordinatedotParameterList'+itemIndex).children().children('li');
				
				$.each(coordinatedotXList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				
				$.each(coordinatedotYList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				
				$.each(coordinatedotParameterList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});

				if($(_element).find('#coordinatedotXList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#coordinatedotXList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}
				if($(_element).find('#coordinatedotYList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#coordinatedotYList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}
				if($(_element).find('#coordinatedotParameterList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#coordinatedotParameterList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}

				break;
			case 'DEPENDENCY_WHEEL':
//				var dependencywheelValueList = $(_element).find('#dependencywheelValueList'+itemIndex).children().children('li');
				var dependencywheelParamaterList = $(_element).find('#dependencywheelParameterList'+itemIndex).children().children('li');
//				$.each(dependencywheelValueList,function(_i,_ch){
//					if(targetId === $(_ch).attr('data-source-id')){
//						$(_ch).parent().remove();
//					}
//				});
				
				$.each(dependencywheelParamaterList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});

//				if($(_element).find('#dependencywheelValueList'+itemIndex).children().children('li').length ==0){
//					$(_element).find('#dependencywheelValueList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
//				}

				if($(_element).find('#dependencywheelParameterList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#dependencywheelParameterList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}

				break;
			case 'SEQUENCES_SUNBURST':
				var sequencessunburstValueList = $(_element).find('#sequencessunburstValueList'+itemIndex).children().children('li');
				var sequencessunburstParamaterList = $(_element).find('#sequencessunburstParameterList'+itemIndex).children().children('li');
				$.each(sequencessunburstValueList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				
				$.each(sequencessunburstParamaterList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});

				if($(_element).find('#sequencessunburstValueList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#sequencessunburstValueList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}

				if($(_element).find('#sequencessunburstParameterList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#sequencessunburstParameterList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}

				break;
			case 'LIQUID_FILL_GAUGE':
				var liquidfillgaugeValueList = $(_element).find('#liquidfillgaugeValueList'+itemIndex).children().children('li');
				var liquidfillgaugeParamaterList = $(_element).find('#liquidfillgaugeParameterList'+itemIndex).children().children('li');
				$.each(liquidfillgaugeValueList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				
				$.each(liquidfillgaugeParamaterList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});

				if($(_element).find('#liquidfillgaugeValueList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#liquidfillgaugeValueList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}

				if($(_element).find('#liquidfillgaugeParameterList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#liquidfillgaugeParameterList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}

				break;
			case 'TEXTBOX':
				if(gDashboard.reportType === "RAnalysis"){
					var rFieldList = $(_element).find('#rFieldList'+itemIndex).children().children('li');
					
					$.each(rFieldList,function(_i,_ch){
						if(targetId === $(_ch).attr('data-source-id')){
							$(_ch).parent().remove();
						}
					});
					
					if($(_element).find('#rFieldList'+itemIndex).children().children('li').length ==0){
						$(_element).find('#rFieldList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
					}
				}
				break;
			case 'DIVERGING_CHART':
				var divergingchartValueList = $(_element).find('#divergingchartValueList'+itemIndex).children().children('li');
				var divergingchartParamaterList = $(_element).find('#divergingchartParameterList'+itemIndex).children().children('li');
				var divergingchartSeriesList = $(_element).find('#divergingchartSeriesList'+itemIndex).children().children('li');
				var divergingchart_hide_measure_list = $(_element).find('#divergingchart_hide_measure_list'+itemIndex).children().children('li');
				$.each(divergingchartValueList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				
				$.each(divergingchartParamaterList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});

				if($(_element).find('#divergingchartValueList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#divergingchartValueList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}

				if($(_element).find('#divergingchartParameterList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#divergingchartParameterList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}
				if($(_element).find('#divergingchartSeriesList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#divergingchartSeriesList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' +  + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + +  '</a></li></ul>');
				}
				
				if($(_element).find('#divergingchart_hide_measure_list'+itemIndex).children().children('li').length ==0){
					$(_element).find('#divergingchart_hide_measure_list'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' +  + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + +  '</a></li></ul>');
				}

				break;
			case 'TIME_LINE_CHART':
				var timelinechartValueList = $(_element).find('#timelinechartValueList'+itemIndex).children().children('li');
				var timelinechartParamaterList = $(_element).find('#timelinechartParameterList'+itemIndex).children().children('li');
				var timelinechartSeriesList = $(_element).find('#timelinechartSeriesList'+itemIndex).children().children('li');
				var timelinechartStartDateList = $(_element).find('#timelinechartStartDateList'+itemIndex).children().children('li');
				var timelinechartEndDateList = $(_element).find('#timelinechartEndDateList'+itemIndex).children().children('li');
//				var timelinechartHiddenList = $(_element).find('#timelinechart_hide_measure_list'+itemIndex).children().children('li');
				$.each(timelinechartValueList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
					
				$.each(timelinechartParamaterList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});

				$.each(timelinechartSeriesList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				
				$.each(timelinechartStartDateList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				
				$.each(timelinechartEndDateList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
//
//				$.each(timelinechartHiddenList,function(_i,_ch){
//					if(targetId === $(_ch).attr('data-source-id')){
//						$(_ch).parent().remove();
//					}
//				});
	
				if($(_element).find('#timelinechartValueList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#timelinechartValueList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}

				if($(_element).find('#timelinechartParameterList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#timelinechartParameterList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}

				if($(_element).find('#timelinechartSeriesList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#timelinechartSeriesList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newseries') +  '</a></li></ul>');
				}
				
				if($(_element).find('#timelinechartStartDateList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#timelinechartStartDateList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') +  '</a></li></ul>');
				}
				
				if($(_element).find('#timelinechartEndDateList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#timelinechartEndDateList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') +  '</a></li></ul>');
				}
//
//				if($(_element).find('#timelinechart_hide_measure_list'+itemIndex).children().children('li').length ==0){
//					$(_element).find('#timelinechart_hide_measure_list'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
//				}

				// $(_element).children().removeAttr('data-source-id');
				break;
			case 'ONEWAY_ANOVA': //통계분석
				var onewayAnovaObservedList = $(_element).find('#onewayAnovaObservedList'+itemIndex).children().children('li');
				var onewayAnovaFactorList = $(_element).find('#onewayAnovaFactorList'+itemIndex).children().children('li');
				$.each(onewayAnovaObservedList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});
				
				$.each(onewayAnovaFactorList,function(_i,_ch){
					if(targetId === $(_ch).attr('data-source-id')){
						$(_ch).parent().remove();
					}
				});

				if($(_element).find('#onewayAnovaObservedList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#onewayAnovaObservedList'+itemIndex).append('<ul class="display-unmove unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newdatafiled') + '</a></li></ul>');
				}

				if($(_element).find('#onewayAnovaFactorList'+itemIndex).children().children('li').length ==0){
					$(_element).find('#onewayAnovaFactorList'+itemIndex).append('<ul class="display-unmove ui-state-disabled unsortable"><li><a href="#" class="btn neutral">' + gMessage.get('WISE.message.page.widget.drop.newparameter') +  '</a></li></ul>');
				}

				break;
			}
			if(targetId === $(_element).children().attr('data-source-id')){
				$(_element).children().removeAttr('data-source-id');
				deletecheck = true;
			}
			$.each(gDashboard.itemGenerateManager.dxItemBasten,function(_i,_item){
				if(_item.ComponentName === itemId && deletecheck == true){
					_item.dragNdropController.toggleDroppableOptions(_item);
					_item.dataSourceId = undefined;
					var temphtml = $('#'+_item.ComponentName+"_item").parent();
					 $('#'+_item.ComponentName+"_item").remove();
					 /* DOGFOOT ktkang KERIS portal에서 메인화면에 X축 잘리는 오류 수정  20200228 */
					 temphtml.append('<div class="lm_content cont_box_cont" id="'+_item.ComponentName+"_item"+'" style="width: 100%; height: 98%;"></div>');
					 $('#'+_item.ComponentName).on('click',function(){
						gDashboard.fieldManager = _item.fieldManager;
						gDashboard.itemGenerateManager.focusItem(_item, _item);
						gDashboard.fieldChooser.resetAnalysisFieldArea(_item);
					});
					_item.dxItem=undefined;
					return false;
				}
			});
			// gDashboard.query();
		}
	};
};

