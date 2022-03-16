WISE.libs.Dashboard.item.WaterfallChartGenerator = function() {
	var self = this;

	this.type = 'WATERFALL_CHART';

	this.dashboardid;
	this.itemid;
	this.dxItem;
	this.dataSourceId;
	// this.dataSources; // xml datasources json structure
	this.layoutManager;
	this.isMasterFilterCrossDataSource;
	this.dimensions = [];
	this.measures = [];

	var dataMember;
	var Exprname;
	var FilterArray = [];

	this.WaterfallChart = [];
	this.fieldManager;
	this.currentMeasureName = "";
	this.trackingData = [];
	this.tempTrackingData = [];
	// 20200608 ajkim 텍스트 입력 기능 개발 dogfoot 
	this.memoText = "";
	/* DOGFOOT ktkang 대시보드 주제영역 기능 추가  20200618 */
	this.cubeQuery = "";
	this.showQuery = "";
	
	//팔레트 
	this.customPalette = [];
	this.isCustomPalette = false;
	// 20200825 ajkim 팔레트 데이터 추가 dogfoot
	this.paletteData = [];
	/**
	 * @param _item:
	 *            meta object
	 */
	var CheckCurrentFilter;
	this.getDxItemConfig = function(_item) {

		this.dataSourceConfig = {};
		this.dataSourceConfig.fields = [];

		var count = 0;

//		D = _item.FilterDimensions ? WISE.util.Object
//		.toArray(_item.DataItems.Dimension) : [];

		this.DU = WISE.libs.Dashboard.item.DataUtility;

		this.DI = _item.DataItems;
		this.V = WISE.util.Object.toArray((_item.Values && _item.Values.Value) || []);
		this.A = WISE.util.Object.toArray((_item.Arguments && _item.Arguments.Argument) || []);

		this.measures = [];
		$.each(this.V, function(_i0, _a0) {
			var uniqueName = _a0['UniqueName'];
			var dataMember = self.DU.getDataMember(uniqueName, self.DI);
			self.measures.push(dataMember);
		});
		this.dimensions = [];
		$.each(this.A, function(_i0, _a0) {
			var uniqueName = _a0['UniqueName'];
			var dataMember = self.DU.getDataMember(uniqueName, self.DI);
			self.dimensions.push(dataMember);
		});

		var dxConfigs = {
				dataSource : this.dataSourceConfig,
				dataStructure: 'plain',
				allowExpandAll: true,
				allowFiltering: true,
				allowSorting: true,
				allowSortingBySummary: true,
				size:{
					width : $('#'+self.itemid).width(),
					height : $('#'+self.itemid).height(),
				},
				tooltip: {
					enabled: true,
					zIndex: 21,
					customizeTooltip:function(_pointInfo){
						var text = '<b>' + _pointInfo.node.data.name + '</b>' + '<br/>' +"<b>" +self.currentMeasureName+"</b> : " +WISE.util.Number.unit(_pointInfo.value,'O',0,0);
						ret = {html: text};
						return ret;
					}
				}
		}

		// extend custom-configurations
		var Configurations = _.clone(this.CUSTOMIZED.get('dx'));
		var CustomConfigs = $.extend({}, Configurations);
		$.extend(CustomConfigs, dxConfigs);
		dxConfigs = CustomConfigs;
		return dxConfigs;
	};


	this.setTackingFlag = function(chk)
	{
		this.tracked = chk;
	};

	this.setWaterfallChart = function(){
		this.fieldManager.init();
		gDashboard.itemGenerateManager.getherFields(this.fieldManager, self.type);
		this.WaterfallChart['ComponentName'] = this.ComponentName;
		this.WaterfallChart['Name'] = this.Name;
		this.WaterfallChart['DataSource'] = this.dataSourceId;

		this.WaterfallChart['DataItems'] = this.fieldManager.DataItems;
		this.WaterfallChart['Arguments'] = this.fieldManager.Arguments;
		this.WaterfallChart['Values'] = this.fieldManager.Values;
		
		this.measures = this.fieldManager.measures;
		this.dimensions = this.fieldManager.dimensions;

		this.meta = this.WaterfallChart;
		//초기 팔레트값 설정
		if (!(this.WaterfallChart['Palette'])) {
			this.WaterfallChart['Palette'] = userJsonObject.userPalette ? userJsonObject.userPalette : userJsonObject.defaultPalette;
		}
		
		if (!(this.WaterfallChart['Legend'])) {
			this.WaterfallChart['Legend'] = {
					Visible : true,
					Position : "TopRightVertical"
			}
		}
		
		if (!(this.WaterfallChart.AxisY)) {
			this.WaterfallChart.AxisY = {
				FormatType: 'Number',
				Unit: 'Ones',
				ShowZero: true,
				Visible: true,
				SuffixEnabled: false,
				MeasureFormat: {
					O: '',
					K: '천',
					M: '백만',
					B: '십억'
				},
				Precision: 0,
				Separator: true
			};
		}
		if (this.WaterfallChart.InteractivityOptions) {
			if (!(this.WaterfallChart.InteractivityOptions.MasterFilterMode)) {
				this.WaterfallChart.InteractivityOptions.MasterFilterMode = 'Off';
			}
			if (!(this.WaterfallChart.InteractivityOptions.TargetDimensions)) {
				this.WaterfallChart.InteractivityOptions.TargetDimensions = 'Argument';
			}
			if (!(this.WaterfallChart.InteractivityOptions.IsDrillDownEnabled)) {
				this.WaterfallChart.InteractivityOptions.IsDrillDownEnabled = false;
			}
			if (!(this.WaterfallChart.InteractivityOptions.IgnoreMasterFilters)) {
				this.WaterfallChart.InteractivityOptions.IgnoreMasterFilters = false;
			}
		} else {
			this.WaterfallChart.InteractivityOptions = {
				MasterFilterMode: 'Off',
				TargetDimensions: 'Argument',
				IsDrillDownEnabled: false,
				IgnoreMasterFilters: false
			};
		}
		
		if(!this.WaterfallChart.LayoutOption){
			this.WaterfallChart.LayoutOption = {
					Legend : {
						family: '맑은 고딕',
						color: '#000000',
						size: 12
					},
					AxisX : {
						family: '맑은 고딕',
						color: '#000000',
						size: 12
					},
					AxisY: {
						family: '맑은 고딕',
						color: '#000000',
						size: 12
					}
			}
		}
		
		if(!this.WaterfallChart['ZoomAble']){
			this.WaterfallChart.ZoomAble = 'none'
		}
		
		if (!(this.WaterfallChart['TextFormat'])) {
			this.WaterfallChart['TextFormat'] = 'Argument, Value'
		}
	};

	this.setWaterfallChartforOpen = function(){
		if(typeof this.meta == 'undefined'){
			this.setWaterfallChart();
		}
		else{
			this.WaterfallChart = this.meta;
		}
		if(typeof this.meta.DataSource == 'undefined'){
			this.meta['DataSource'] = 'dataSource1';
		}
		if(this.fieldManager != undefined){
			this.WaterfallChart['DataItems'] = this.meta['DataItems'] = this.fieldManager.DataItems;
			this.WaterfallChart['Arguments'] = this.meta['Arguments'] = this.fieldManager.Arguments;
			this.WaterfallChart['Values'] = this.meta['Values'] = this.fieldManager.Values;
			this.measures = this.fieldManager.measures;
			this.dimensions = this.fieldManager.dimensions;
		}
		
		//팔레트 불러오기
		var page = window.location.pathname.split('/');
		if (!(this.WaterfallChart['Palette'])) {
			this.WaterfallChart['Palette'] = userJsonObject.userPalette ? userJsonObject.userPalette : userJsonObject.defaultPalette;
			
			if(gDashboard != undefined){
				var WaterfallChartOption = typeof gDashboard.structure.MapOption.DASHBOARD_XML == 'undefined' ? '' : WISE.util.Object.toArray(gDashboard.structure.MapOption.DASHBOARD_XML.WATERFALL_CHART_DATA_ELEMENT);
				
				$.each(WaterfallChartOption,function(_i,_WaterfallChartOption){
					var CtrlNM;
					if (page[page.length - 1] === 'viewer.do'){
						CtrlNM = _WaterfallChartOption.CTRL_NM +"_"+WISE.Constants.pid;
					}else{
						CtrlNM = _WaterfallChartOption.CTRL_NM;
					}
					if(self.WaterfallChart.ComponentName == CtrlNM){
						self.WaterfallChart['Palette'] = _WaterfallChartOption.PALETTE_NM;
						return false;
					}
				})
				if(typeof this.meta.ColorSheme != 'undefined'){
					var colorList = WISE.util.Object.toArray(this.meta.ColorSheme.ColorSheme);
					this.WaterfallChart.Palette = new Array();
					var newPalette = [];
					$.each(colorList,function(_i,_list){
						self.WaterfallChart.Palette.push(gDashboard.itemColorManager.getHexColor(_list.Color)); 
						 newPalette[_i] = gDashboard.itemColorManager.getHexColor(_list.Color);
					});
					
					self.customPalette = newPalette;
					self.isCustomPalette = true;
				}
			}
		}
		/*dogfoot Y축 설정 추가 shlim 20200831*/
		if (!(this.WaterfallChart.AxisY)) {
			this.WaterfallChart.AxisY = {
				FormatType: 'Number',
				Unit: 'Ones',
				ShowZero: true,
				Visible: true,
				SuffixEnabled: false,
				MeasureFormat: {
					O: '',
					K: '천',
					M: '백만',
					B: '십억'
				},
				Precision: 0,
				Separator: true
			};
		}
		
		if (!(this.WaterfallChart['Legend'])) {
			this.WaterfallChart['Legend'] = {
					Visible : true,
					Position : "TopRightVertical"
			}
		}
		if (this.WaterfallChart.InteractivityOptions) {
			if (!(this.WaterfallChart.InteractivityOptions.MasterFilterMode)) {
				this.WaterfallChart.InteractivityOptions.MasterFilterMode = 'Off';
			}
			if (!(this.WaterfallChart.InteractivityOptions.TargetDimensions)) {
				this.WaterfallChart.InteractivityOptions.TargetDimensions = 'Argument';
			}
			if (!(this.WaterfallChart.InteractivityOptions.IsDrillDownEnabled)) {
				this.WaterfallChart.InteractivityOptions.IsDrillDownEnabled = false;
			}
			if (!(this.WaterfallChart.InteractivityOptions.IgnoreMasterFilters)) {
				this.WaterfallChart.InteractivityOptions.IgnoreMasterFilters = false;
			}
		} else {
			this.WaterfallChart.InteractivityOptions = {
				MasterFilterMode: 'Off',
				TargetDimensions: 'Argument',
				IsDrillDownEnabled: false,
				IgnoreMasterFilters: false
			};
		}
		if(!this.WaterfallChart.LayoutOption){
			this.WaterfallChart.LayoutOption = {
					Legend : {
						family: '맑은 고딕',
						color: '#000000',
						size: 12
					},
					AxisX : {
						family: '맑은 고딕',
						color: '#000000',
						size: 12
					},
					AxisY: {
						family: '맑은 고딕',
						color: '#000000',
						size: 12
					}
			}
		}
		
		if(!this.WaterfallChart.LayoutOption.AxisY.size){
			this.WaterfallChart.LayoutOption.AxisY.size = 12;
			this.WaterfallChart.LayoutOption.AxisX.size = 12;
			this.WaterfallChart.LayoutOption.Legend.size = 12;
		}
		if(!this.WaterfallChart['ZoomAble']){
			this.WaterfallChart.ZoomAble = 'none'
		}
		
		if (!(this.WaterfallChart['TextFormat'])) {
			this.WaterfallChart['TextFormat'] = 'Argument, Value'
		}
	}
	this.setWaterfallChartForViewer = function(){
		if(typeof this.meta == 'undefined'){
			this.setWaterfallChart();
		}
		else{
			this.WaterfallChart = this.meta;
		}
		if(typeof this.meta.DataSource == 'undefined'){
			this.meta['DataSource'] = 'dataSource1';
		}
		if(this.fieldManager != undefined){
			this.WaterfallChart['DataItems'] = this.meta['DataItems'] = this.fieldManager.DataItems;
			this.WaterfallChart['Arguments'] = this.meta['Arguments'] = this.fieldManager.Arguments;
			this.WaterfallChart['Values'] = this.meta['Values'] = this.fieldManager.Values;
			this.measures = this.fieldManager.measures;
			this.dimensions = this.fieldManager.dimensions;
		}
		
		//팔레트 불러오기
		var page = window.location.pathname.split('/');
		if (!(this.WaterfallChart['Palette'])) {
			this.WaterfallChart['Palette'] = userJsonObject.userPalette ? userJsonObject.userPalette : userJsonObject.defaultPalette;
			
			if(gDashboard != undefined){
				var WaterfallChartOption = typeof gDashboard.structure.MapOption.DASHBOARD_XML == 'undefined' ? '' : WISE.util.Object.toArray(gDashboard.structure.MapOption.DASHBOARD_XML.WATERFALL_CHART_DATA_ELEMENT);
				
				$.each(WaterfallChartOption,function(_i,_WaterfallChartOption){
					var CtrlNM;
//					if (page[page.length - 1] === 'viewer.do'){
//						CtrlNM = _WaterfallChartOption.CTRL_NM +"_"+WISE.Constants.pid;
//					}else{
						CtrlNM = _WaterfallChartOption.CTRL_NM;
//					}
					if(self.WaterfallChart.ComponentName == CtrlNM){
						self.WaterfallChart['Palette'] = _WaterfallChartOption.PALETTE_NM;
						return false;
					}
				})
				if(typeof this.meta.ColorSheme != 'undefined'){
					var colorList = WISE.util.Object.toArray(this.meta.ColorSheme.ColorSheme);
					this.WaterfallChart.Palette = new Array();
					var newPalette = [];
					$.each(colorList,function(_i,_list){
						self.WaterfallChart.Palette.push(gDashboard.itemColorManager.getHexColor(_list.Color)); 
						newPalette[_i] = gDashboard.itemColorManager.getHexColor(_list.Color);
					});
					
					self.customPalette = newPalette;
					self.isCustomPalette = true;
				}
			}
		}
		/*dogfoot Y축 설정 추가 shlim 20200831*/
		if (!(this.WaterfallChart.AxisY)) {
			this.WaterfallChart.AxisY = {
				FormatType: 'Number',
				Unit: 'Ones',
				ShowZero: true,
				Visible: true,
				SuffixEnabled: false,
				MeasureFormat: {
					O: '',
					K: '천',
					M: '백만',
					B: '십억'
				},
				Precision: 0,
				Separator: true
			};
		}
        if (this.WaterfallChart.InteractivityOptions) {
			if (!(this.WaterfallChart.InteractivityOptions.MasterFilterMode)) {
				this.WaterfallChart.InteractivityOptions.MasterFilterMode = 'Off';
			}
			if (!(this.WaterfallChart.InteractivityOptions.TargetDimensions)) {
				this.WaterfallChart.InteractivityOptions.TargetDimensions = 'Argument';
			}
			if (!(this.WaterfallChart.InteractivityOptions.IsDrillDownEnabled)) {
				this.WaterfallChart.InteractivityOptions.IsDrillDownEnabled = false;
			}
			if (!(this.WaterfallChart.InteractivityOptions.IgnoreMasterFilters)) {
				this.WaterfallChart.InteractivityOptions.IgnoreMasterFilters = false;
			}
		} else {
			this.WaterfallChart.InteractivityOptions = {
				MasterFilterMode: 'Off',
				TargetDimensions: 'Argument',
				IsDrillDownEnabled: false,
				IgnoreMasterFilters: false
			};
		}
        if(!this.WaterfallChart.LayoutOption){
			this.WaterfallChart.LayoutOption = {
					Legend : {
						family: '맑은 고딕',
						color: '#000000',
						size: 12
					},
					AxisX : {
						family: '맑은 고딕',
						color: '#000000',
						size: 12
					},
					AxisY: {
						family: '맑은 고딕',
						color: '#000000',
						size: 12
					}
			}
		}
		
		if(!this.WaterfallChart.LayoutOption.AxisY.size){
			this.WaterfallChart.LayoutOption.AxisY.size = 12;
			this.WaterfallChart.LayoutOption.AxisX.size = 12;
			this.WaterfallChart.LayoutOption.Legend.size = 12;
		}
        
        if(!this.WaterfallChart['ZoomAble']){
			this.WaterfallChart.ZoomAble = 'none'
		}
        
        if (!(this.WaterfallChart['Legend'])) {
			this.WaterfallChart['Legend'] = {
					Visible : true,
					Position : "TopRightVertical"
			}
		}
        
        if (!(this.WaterfallChart['TextFormat'])) {
			this.WaterfallChart['TextFormat'] = 'Argument, Value'
		}
	}

	/** @Override */
	this.bindData = function(_data) {
		//2020.02.07 mksong sqllike 적용 dogfoot
//		if (!this.tracked) {
//			this.globalData = _.clone(_data);
//			this.filteredData = _.clone(_data);
//		}
		if ($.type(this.child) === 'object' && this.dxItem) {
			this.dxItem = undefined;
			this.layoutManager.createItemLayer(this.itemid);
		}

		if(this.fieldManager !=null && gDashboard.isNewReport == true){ // 신규 생성
			self.setWaterfallChart();
			gDashboard.itemGenerateManager.addParentItems(self);
			gDashboard.itemGenerateManager.itemCustomize(self,self.WaterfallChart);
			gDashboard.itemGenerateManager.generateItem(self, self.WaterfallChart);
		}else if(this.fieldManager !=null && gDashboard.isNewReport != true){
			gDashboard.itemGenerateManager.getherFields(this.fieldManager, self.type);
			this.setWaterfallChartforOpen();
			gDashboard.itemGenerateManager.addParentItems(self);
			gDashboard.itemGenerateManager.itemCustomize(self,self.WaterfallChart);
			gDashboard.itemGenerateManager.generateItem(self, self.WaterfallChart);
		}
		//d3 뷰어모드 
		else if(self.meta && $.isEmptyObject(self.WaterfallChart)) {
			this.setWaterfallChartForViewer();
			gDashboard.itemGenerateManager.itemCustomize(self,self.WaterfallChart);
			gDashboard.itemGenerateManager.generateItem(self, self.WaterfallChart);
		}else if(self.meta == undefined && gDashboard.reportType == 'AdHoc'){
			this.setWaterfallChartForViewer();
			gDashboard.itemGenerateManager.itemCustomize(self,self.WaterfallChart);
			gDashboard.itemGenerateManager.generateItem(self, self.WaterfallChart);
		}

		var buttonPanelId = this.itemid + '_topicon';
		var topIconPanel = $('#' + buttonPanelId);
		if($('#'+this.itemid + '_tracking_data_container').length == 0){
			var trackingDataContainerId = this.itemid + '_tracking_data_container';
			var trackingDataContainerHtml = '<li id="' + trackingDataContainerId + '" style="font-size: 14px; padding-top: 3px;"></li>';
			topIconPanel.append(trackingDataContainerHtml);
		}

		var dxConfig = this.getDxItemConfig(this.meta);

		this.calculatedFields = [];
		/* DOGFOOT ktkang 사용자 정의 데이터 오류 수정  20200730 */
		this.calculateCaption;
		if(!($.isEmptyObject(gDashboard.customFieldManager.fieldInfo))) {
			var fieldList = gDashboard.customFieldManager.fieldInfo[this.dataSourceId];
			if (fieldList) {
				fieldList.forEach(function(field) {
					$.each(self.measures,function(_i,_measure){
						//2020.04.09 mksong 비정형 사용자정의데이터 오류 수정 dogfoot
						if(_measure != undefined){
							if(field.Name == _measure.name){
								self.calculatedFields.push(_measure);
								self.calculateCaption = _measure.name;
								var tempDataField = gDashboard.customFieldManager.trackingDatafields(field);
								if(tempDataField != undefined && tempDataField.length != 0){
									var tempList = [];
									$.each(tempDataField,function(_ii,_tempDataField){
										var duplicatedCheck = false;
										$.each(self.measures,function(_k, _measure){
											if(_tempDataField == _measure.UNI_NM){
												duplicatedCheck = true;
											}
										});
										if(!duplicatedCheck){
											tempList.push(_tempDataField);
										}
									});
									tempDataField = tempList;
								}
								self.measures.splice(_i,1);
								if(tempDataField != undefined && tempDataField.length != 0){
									$.each(tempDataField, function(_index,_tempDataField){
										var dataMember = {
												UNI_NM: undefined,
												caption: self.calculateCaption,
												captionBySummaryType: "sum_"+_tempDataField,
												currencyCulture: undefined,
												format: "fixedPoint",
												formatType: "Number",
												includeGroupSeparator: true,
												name: _tempDataField,
												nameBySummaryType: "sum("+_tempDataField+")",
												nameBySummaryType2: "sum_"+_tempDataField,
												precision: 0,
												rawCaption: _tempDataField,
												suffix: {
													B: "십억",
													K: "천",
													M: "백만",
													O: ""
												},
												suffixEnabled: false,
												summaryType: "sum",
												type: "measure",
												unit: "Ones",
												tempdata: true
										}
										self.measures.push(dataMember);
									});	
								}
							}
							//2020.04.09 mksong 비정형 사용자정의데이터 오류 수정 끝 dogfoot
						}
					});
					/* DOGFOOT ktkang 사용자 정의 데이터 오류 수정  20200730 */
					$.each(self.dimensions,function(_i,_dimension){
						//2020.04.09 mksong 비정형 사용자정의데이터 오류 수정 dogfoot
						if(_dimension != undefined){
							if(field.Name == _dimension.name){
								self.calculatedFields.push(_dimension);
								self.calculateCaption = _dimension.name;
								var tempDataField = gDashboard.customFieldManager.trackingDatafields(field);
								if(tempDataField != undefined && tempDataField.length != 0){
									var tempList = [];
									$.each(tempDataField,function(_ii,_tempDataField){
										var duplicatedCheck = false;
										$.each(self.dimensions,function(_k, _dimension2){
											if(_tempDataField == _dimension2.UNI_NM){
												duplicatedCheck = true;
											}
										});
										if(!duplicatedCheck){
											tempList.push(_tempDataField);
										}
									});
									tempDataField = tempList;
								}
								self.dimensions.splice(_i,1);
								if(tempDataField != undefined && tempDataField.length != 0){
									$.each(tempDataField, function(_index,_tempDataField){
										var dataMember = {
												UNI_NM: undefined,
												caption: self.calculateCaption,
												captionBySummaryType: _tempDataField,
												currencyCulture: undefined,
												includeGroupSeparator: true,
												name: _tempDataField,
												precision: 0,
												rawCaption: _tempDataField,
												suffixEnabled: false,
												type: "dimension",
												tempdata: true,
												nameBySummaryType: "min("+_tempDataField+")",
												nameBySummaryType2: "min_"+_tempDataField
										}
										self.dimensions.push(dataMember);
									});	
								}
							}
							//2020.04.09 mksong 비정형 사용자정의데이터 오류 수정 끝 dogfoot
						}
					});
				});
			}
		}
		
		var measureKey = this.measures[0];
		self.currentMeasureName = measureKey.caption;
		self.trackingData = [];
		self.tempTrackingData = [];
		
		//2020.11.03 MKSONG 필요한 리소스 동적으로 Import DOGFOOT
		WISE.loadedSourceCheck('d3');
		self.fWaterfallChart(_data, this.measures, this.dimensions, self.deleteDuplecateData(_data,measureKey));
//		dxConfig.dataSource = self.deleteDuplecateData(_data,measureKey);
		$('#' + self.itemid + '_title > .lm_title').text(self.Name);
		
		//2020.02.13 mksong 조회시 그려진 아이템 초기화 되도록 수정 dogfoot
		$('#'+self.itemid).css('display','block');
		this.dxItem = $("#" + this.itemid).dxChart(dxConfig).dxChart("instance");
		
		//2020.02.12 mksong 보고서 아이템 모두 view 했을 때 프로그레스바 사라지도록 수정 dogfoot
		if(self.ComponentName && gDashboard.itemGenerateManager.viewedItemList.indexOf(self.ComponentName) < 0 ){
			gDashboard.itemGenerateManager.viewedItemList.push(self.ComponentName);
		}
		if(gDashboard.itemGenerateManager.dxItemBasten.length == gDashboard.itemGenerateManager.viewedItemList.length){
			gProgressbar.setStopngoProgress(true);
			gProgressbar.hide();
			gDashboard.updateReportLog();
		}
		
//		gDashboard.itemGenerateManager.generateDxItem(self, _data);
		
		gDashboard.itemGenerateManager.renderButtons(self);

	};
						   
	/*this.menuItemGenerate = function(){
		if($('#data').length > 0){
			$('#data').remove();
		}

		$('#menulist').removeClass('col-2');
		$('#menulist').addClass('col-2');
		if($('#data').length == 0){
			$('#menulist').append($('<li id="data" rel="panelDataA-2" class="itemDelete"><a href="#tab4primary" data-toggle="tab">'+ gMessage.get('WISE.message.page.widget.nav.properties') +'</a></li>'));	
		}

		if($('#design').length > 0){
			$('#design').remove();
		}

		if($('#tab5primary').length == 0){
//			$('.menu-comp').append('<div  class="slide-ui"><ul id="tab5primary" class="lnb-lst-tab" style="margin-top:10px;"></ul></div>');
			// 2020.01.16 mksong 영역 크기 조정 dogfoot
			$('.menu-comp.custom-menu').append('<div class="slide-ui responsive itemDelete" style="width:60%;"><a href="#" class="slide-ui-prev">prev</a><a href="#" class="slide-ui-next">next</a><ul id="tab5primary" class="slide-ui-list lnb-lst-tab"></ul></div>');
		}

		$('#tab5primary').empty();
		$('#tab5primary').append('<span class="drag-line"></span>');

		$('#tab4primary').empty();
		if($('#tab4primary').length == 0){
			$('#panelDataA').append($('<div id="tab4primary" class="panelDataA-2 tab-content itemDelete"></div>'));	
		}

		// initialize UI elements
		
		tabUi();
		designMenuUi();
		compMoreMenuUi();
	}*/
	
	this.menuItemGenerate = function(){
		gDashboard.itemGenerateManager.menuItemGenerate(self);
//		if($('#data').length > 0){
//			$('#data').remove();
//		}
//		
//		$('#menulist').removeClass('col-2');
//		$('#menulist').addClass('col-2');
//		if($('#data').length == 0){
//			$('#menulist').append($('<li id="data" rel="panelDataA-2" class="itemDelete"><a href="#tab4primary" data-toggle="tab">'+ gMessage.get('WISE.message.page.widget.nav.properties') +'</a></li>'));	
//		}
//		
//		if($('#design').length > 0){
//			$('#design').remove();
//		}
//		
//		if($('#tab5primary').length == 0){
////			$('.menu-comp').append('<div  class="slide-ui"><ul id="tab5primary" class="lnb-lst-tab" style="margin-top:10px;"></ul></div>');
//			// 2020.01.16 mksong 영역 크기 조정 dogfoot
//			$('.menu-comp.custom-menu').append('<div class="slide-ui responsive itemDelete" style="width:60%;"><a href="#" class="slide-ui-prev">prev</a><a href="#" class="slide-ui-next">next</a><ul id="tab5primary" class="slide-ui-list lnb-lst-tab"></ul></div>');
//		}
//		
//		$('#tab5primary').empty();
//		$('<li class="slide-ui-item"><a id="captionVisible" class="lnb-link more functiondo"><img src="'+WISE.Constants.context+'/resources/main/images/ico_captionView.png" alt=""><span>캡션보기</span></a></li>').appendTo($('#tab5primary'));
//		$('<li class="slide-ui-item"><a id="editName" class="lnb-link more functiondo"><img src="'+WISE.Constants.context+'/resources/main/images/ico_namEdit.png" alt=""><span>이름 편집</span></a></li>').appendTo($('#tab5primary'));
//		$('<li class="slide-ui-item"><a id="editPalette" class="lnb-link more functiondo"><img src="'+WISE.Constants.context+'/resources/main/images/ico_globalColor.png" alt=""><span>팔레트</span></a></li>').appendTo($('#tab5primary'));
//		
//		menuItemSlideUi();
//		//d3 속성 추가
//		
//		$('#tab4primary').empty();
//		if($('#tab4primary').length == 0){
//			$('#panelDataA').append($('<div id="tab4primary" class="panelDataA-2 tab-content itemDelete"></div>'));	
//		}
//		
//		// initialize UI elements
//		
//		tabUi();
//		designMenuUi();
//		compMoreMenuUi();
//		 $('.single-toggle-button').on('click', function(e) {
//	            e.preventDefault();
//	            $(this).toggleClass('on');
//	        });
//	        $('.multi-toggle-button').on('click', function(e) {
//	            e.preventDefault();
//	            var currentlyOn = $(this).parent().parent().find('.multi-toggle-button.on');
//	            if ($(this)[0] !== currentlyOn[0]) {
//	                currentlyOn.removeClass('on');
//	            }
//	            $(this).toggleClass('on');
//			});
//
//			// toggle 'on' status according to chart options
//			if (self.IO) {
//				if (self.IO['MasterFilterMode'] === 'Single') {
//					$('#singleMasterFilter').addClass('on');
//				} else if (self.IO['MasterFilterMode'] === 'Multiple') {
//					$('#multipleMasterFilter').addClass('on');
//				}
//				if (self.IO['IsDrillDownEnabled']) {
//					$('#drillDown').addClass('on');
//				}
//				if (self['isMasterFilterCrossDataSource']) {
//					$('#crossFilter').addClass('on');
//				}
//				if (self.IO['IgnoreMasterFilters']) {
//					$('#ignoreMasterFilter').addClass('on');
//				}
//				if (self.IO['TargetDimensions'] === 'Argument') {
//					$('#targetArgument').addClass('on');
//				} else if (self.IO['TargetDimensions'] === 'Series') {
//					$('#targetSeries').addClass('on');
//				}
//	        }
//			
//			$('<div id="editPopup">').dxPopup({
//	            height: 'auto',
//				width: 500,
//				visible: false,
//				showCloseButton: false
//			}).appendTo('#tab5primary');
//			// settings popover
//			$('<div id="editPopover">').dxPopover({
//				height: 'auto',
//				width: 'auto',
//				position: 'bottom',
//				visible: false
//			}).appendTo('#tab5primary');
//			
//			$('<div id="editPopup2">').dxPopup({
//				height: 'auto',
//				width: 500,
//				visible: false,
//				showCloseButton: false
//			}).appendTo('body');
//			// settings popover
//			$('<div id="editPopover2">').dxPopover({
//				height: 'auto',
//				width: 'auto',
//				position: 'bottom',
//				visible: false
//	        }).appendTo('#tab4primary');
//			
//			$('.functiondo').on('click',function(e){
//				self.functionDo(this.id);	
//			});
	}

	this.clearTrackingConditions = function() {
        if (self.IO && self.IO.MasterFilterMode) {
			if(gDashboard.reportType != 'AdHoc' || !(gDashboard.structure.Layout == 'G' && WISE.Constants.editmode==='viewer')){
				if (self.dxItem){
					d3.selectAll('.bar')
					.style("stroke-width", '')
					.style("stroke", 'none')
					.attr("filter", 'false');
				} 
				self.trackingData = [];
				self.tempTrackingData = [];
				self.selectedPoint = undefined;	
			}
		}
	};
	this.renderButtons = function(_itemid) {
		gDashboard.itemGenerateManager.renderButtons(self);
//		$('#'+_itemid + '_tracking_data_container').empty();
//		if (this.measures && this.measures.length > 1) {
//			var valueListId = _itemid + '_topicon_vl';
//			var popoverid = _itemid + '_topicon_vl_popover';
//
//			var listHtml = '<li><a id="' + valueListId + '" href="#"><img src="' + WISE.Constants.context + '/images/cont_box_icon_layer.png" onMouseOver="this.src=\'' + WISE.Constants.context + '/images/cont_box_icon_layer_.png\'" onMouseOut="this.src=\'' + WISE.Constants.context + '/images/cont_box_icon_layer.png\'" alt="Select Panel" title="Select Panel"></a></li>';
//			$('#' + _itemid + '_tracking_data_container').append(listHtml);
//			if($('#'+this.itemid+'editWaterfallChartPopover').length == 0 ){
//				$('<div id="'+this.itemid+'editWaterfallChartPopover">').dxPopover({
//					height: 'auto',
//					width: 'auto',
//					position: 'bottom',
//					visible: false
//				}).appendTo('#wrapper');
//			}
//			var p = $('#'+this.itemid+'editWaterfallChartPopover').dxPopover('instance');
//
//
//			var temphtml = "<div style='width:150px;'>";
//			temphtml += '<div class="add-item noitem">';
//			$.each(this.measures, function(_i, _vo) {
//				temphtml += '<div class="select-style" data-key="' + (_vo.uniqueName) + '"><span data-key="' + (_vo.uniqueName) + '">' + _vo.caption + '</span></a>';
//			});
//			temphtml += '</div>';
//			temphtml += '</div>'; 
//
//			p.option({
//				target: '#'+valueListId,
//				contentTemplate: function(contentElement) {
//					$(temphtml).appendTo(contentElement);
//					$('.select-style').on('click',function(_e){
//						p.hide();
//						var targetPanelId = _e.target.getAttribute('data-key');
//						var selectedMeasure;
//						$.each(self.measures,function(_i,_mea){
//							if(_mea.uniqueName == targetPanelId){
//								selectedMeasure = _mea;
//								return false;
//							}
//						});
//						$('#' + self.itemid + '_title > .lm_title').text(self.Name);
//						var dxConfig = self.getDxItemConfig(self.meta);
//						self.currentMeasureName = selectedMeasure.caption;
//						dxConfig.dataSource = self.deleteDuplecateData(self.filteredData,selectedMeasure);
//						self.fWaterfallChart(self.filteredData);
////						self.dxItem = $("#" + self.itemid).dxTreeMap(dxConfig).dxTreeMap(
////						"instance");
//					});
//				},
////				visible:false
//			})
//			$('#' + _itemid + '_topicon').off('click').on('click',function(){
//				p.option('visible', !(p.option('visible')));
//			});
//		}
	};
	
	this.deleteDuplecateData = function(_data,MeasureKey){
		self.selectedMeasure = MeasureKey;
		return gDashboard.d3Manager.getDataSource(self, self.type, {'data' : _data, 'measerKey': MeasureKey});
	}
	this.deleteDuplecateData2 = function(_data,MeasureKey){
		self.selectedMeasure = MeasureKey;
		var SQLikeUtil = WISE.libs.Dashboard.Query.likeSql;
		var dataSourceId = this.dataSourceId;		
		/**
		 * 데이터 중복 제거 코드
		 */
		var ValueArray = new Array();
		var FieldArray = new Array();
		var selectArray = new Array();

		var Dimension = WISE.util.Object.toArray(this.meta.DataItems.Dimension);
		var Measure =  WISE.util.Object.toArray(MeasureKey);

		$.each(Dimension,function(_i,_Dim){
			selectArray.push(_Dim.DataMember);
			FieldArray.push(_Dim.DataMember);
		});

		$.each(Measure,function(_i,_Mea){
			selectArray.push('|'+_Mea.summaryType+'|');
			selectArray.push(_Mea.name);
			selectArray.push('|as|');
			selectArray.push(_Mea.captionBySummaryType);			
		})

		var sqlConfig ={};
		 /*dogfoot 데이터 집합이 같을 때만 where 절 추가 shlim 20200619*/
		if(typeof self.dataSourceId != 'undefined' && typeof gDashboard.itemGenerateManager.sqlConfigCurruntId != 'undefined') {
			if(self.dataSourceId ==  gDashboard.itemGenerateManager.sqlConfigCurruntId){
				sqlConfig.Where = gDashboard.itemGenerateManager.sqlConfigWhere;
			}else{
				sqlConfig.Where = [];
			}
		}else{
			sqlConfig.Where = [];
        }
		sqlConfig.Select = selectArray;
		sqlConfig.From = _data;
//		sqlConfig.Where = gDashboard.itemGenerateManager.sqlConfigWhere;
		sqlConfig.GroupBy = FieldArray;
		
		sqlConfig.OrderBy = [];
		$.each(Dimension, function(_i, _d) {
			//2020.02.07 mksong sqllike 적용 dogfoot
			sqlConfig.OrderBy.push(_d.DataMember || _d.sortByMeasure);
		});
		/* DOGFOOT ktkang 대시보드 주제영역 기능 추가  20200618 */
		self.filteredData = SQLikeUtil.doSqlLike(dataSourceId, sqlConfig, self);
		ValueArray.push(self.filteredData);

		var resultArr = new Array();
		self.paletteData = [];
		$.each(ValueArray,function(_i,_e){
			$.each(_e,function(_item,_obj){
				var str = new Array();
				var object = new Object();
				$.each(Dimension,function(_i,_Dim){
					str.push(_obj[_Dim.DataMember]);
				});
				$.each(Measure,function(_i,_Mea){
					object['value'] = _obj[_Mea.summaryType + '_' + _Mea.caption];
				});

				object['name'] = str.join(' - ');
				self.paletteData.push(object['name']);
				resultArr.push(object);
			})
		});
		self.paletteData.push("총계");
		return resultArr;
	};
	/*dogfoot d3 resize시 쿼리 안타도록 수정  shlim 20200909*/
	this.resize = function() {
		if(typeof self.resizeData != 'undefined'){
			//2020.11.03 mksong resource Import 동적 구현 dogfoot
    		WISE.loadedSourceCheck('d3');
			self.fWaterfallChart(self.filteredData, self.measures, self.dimensions, self.resizeData);
			d3.selectAll('.bar[filter="true"]').style("stroke-width", 3).style("stroke", 'blue').attr('filter', "true");
		}
		gProgressbar.hide();
	};
//	this.resize = function() {
//		self.fWaterfallChart(self.filteredData, self.measures, self.dimensions, 
//				self.deleteDuplecateData(self.filteredData,self.measures[0]));
//		
//		d3.selectAll('.bar[filter="true"]').style("stroke-width", 3).style("stroke", 'blue').attr('filter', "true");
//		gProgressbar.hide();
//	};
	

	this.fWaterfallChart = function(jsonData, measures, dimensions, dupleData) {
		if (!dupleData || ($.type(dupleData) === 'array' && dupleData.length === 0)
				|| (dupleData.length == 1 && dupleData[0].value == 0 && dupleData[0].name == "")) {
			$('#'+self.itemid + ' .nodata-layer').remove();
			var nodataHtml = '<div class="nodata-layer" style="z-index:99999999999"></div>';
			$("#" + self.itemid).children().css('display','none');
			$("#" + self.itemid).prepend(nodataHtml);
			if($("#" + self.itemid).height() === 0 || $("#" + self.itemid).width() === 0){
				$("#" + self.itemid).height('100%');
				$("#" + self.itemid).width('100%');
			}
			$("#" + self.itemid).css('display', 'block');

			if(self.ComponentName && gDashboard.itemGenerateManager.viewedItemList.indexOf(self.ComponentName) < 0 ){
				gDashboard.itemGenerateManager.viewedItemList.push(self.ComponentName);
			}

			if(gDashboard.itemGenerateManager.dxItemBasten.length == gDashboard.itemGenerateManager.viewedItemList.length){
				gProgressbar.setStopngoProgress(true);
				gProgressbar.hide();
				gDashboard.updateReportLog();
			}	
			return;
		}else{
			self.resizeData = dupleData;
			$('#'+self.itemid + ' .nodata-layer').remove();
			$("#" + self.itemid).children().css('display','block');
		}
		d4.select("#" + self.itemid).selectAll("svg").remove();
		/*dogfoot d3 차트 툴팁오류수정 shlim 20200701*/
		d4.select("#" + self.itemid).selectAll("div").remove();
		var margin = {top: 20, right: 50, bottom: 80, left: 200};
		 if(self.meta.Legend.Visible){
			if(self.meta.Legend.Position === "TopRightVertical"){
				margin.right = 150;
			}else if(self.meta.Legend.Position === 'TopLeftVertical'){
				margin.left = 250;
			}else if(self.meta.Legend.Position === 'TopCenterHorizontal'){
				margin.top = 50;
			}else{
				margin.bottom = 130;
			}
		}
	    var width = $('#'+self.itemid).width() - margin.left - margin.right,
	    height = $('#'+self.itemid).height() - margin.top - margin.bottom,
	    padding = 0.3;

       
       
		
//		var paletteName = self.WaterfallChart.Palette;
//		var rgb = getPaletteValue(paletteName);
		self.paletteData = [];
		$.each(dupleData, function(i, d){
			self.paletteData.push(d.name);
		})
		self.paletteData.push("Total");
		var rgb = gDashboard.d3Manager.getPalette(self);
		
		var x = d4.scale.ordinal().rangeRoundBands([0, width], padding);

		var y = d4.scale.linear().range([height, 0]);

		var xAxis = d4.svg.axis().scale(x).orient("bottom");

		var yAxis = d4.svg.axis().scale(y).orient("left").tickFormat(function(d) { return dollarFormatter(d); });
		
		var wleng = margin.left;
// 		if(self.meta.Legend.Visible && self.meta.Legend.Position.indexOf("Left") > -1)
// 			wleng += (width * 0.1)
		var hleng = margin.top;
		 var scaleK = 0;

	        

		var NumberF = WISE.util.Number,
		labelFormat = 'Number',
		labelUnit = 'O',
		labelPrecision = 0,
		labelSeparator = true,
		labelSuffixEnabled = false,
		labelSuffix = {
			O: '',
			K: '천',
			M: '백만',
			B: '십억'
		};
		var NumericFormat;
		$.each(WISE.util.Object.toArray(self.DI.Measure),function(_i,_val){
			if(self.selectedMeasure[0].uniqueName ===  _val.UniqueName){
				if(_val.NumericFormat){
				    NumericFormat = _val.NumericFormat;	
				}
			}
		});
		if(typeof NumericFormat != 'undefined'){
			labelFormat = NumericFormat.FormatType;
			labelUnit = NumericFormat.Unit;
			labelPrecision = NumericFormat.Precision;
			labelSeparator = NumericFormat.IncludeGroupSeparator;
			labelSuffixEnabled = NumericFormat.SuffixEnabled;
			labelSuffix =NumericFormat.Suffix;
		};

		var svg = d4.select("#" + self.itemid).append("svg:svg")
		.attr("width", $('#'+self.itemid).width())
		.attr("height", $('#'+self.itemid).height() - 50)
		.append("svg:g")
		.attr("transform", "translate(" + wleng + "," + hleng + ")");
        

        var zoomCnt = 0;
		function zoomable(){
			 var zoom = d4.behavior.zoom().on("zoom", function (d,zz) {
				 if(pressKey['z'] || pressKey['Z'])
							d4.select("#" + self.itemid).select('g').attr("transform", function(){

								if(zoomCnt==0){
									d4.event.translate[0] = d4.event.sourceEvent.layerX;
									d4.event.translate[1] = d4.event.sourceEvent.layerY;
									d4.event.scale =1;
								}
								if(d4.event.scale <= 1){
									zoomCnt++;
									d4.event.translate[0] = 0
									d4.event.translate[1] = 0
									d4.event.scale = 1
									zoomable();
									return "translate(" + wleng + "," + hleng + ")scale(" + d4.event.scale + ")"
								}
								if(d4.event.translate[0] ===0 && d4.event.translate[1] ===0){
									d4.event.translate[0] = d4.event.sourceEvent.layerX
									d4.event.translate[1] = d4.event.sourceEvent.layerY
								}
								zoomCnt++
								return "translate(" + d4.event.translate + ")scale(" + d4.event.scale + ")"
							})
						})

			  d4.select('#'+self.itemid).select('svg').call(zoom)
		}
		if(self.meta.ZoomAble != 'none'){
			zoomable();
		}
//		var chart = d4.select("#" + self.itemid)
//	    .attr("width", $('#'+self.itemid).width())
//		.attr("height", $('#'+self.itemid).height())
//	    .append("g")
//	    .attr("transform", "translate(" + width/10 + "," + margin.top + ")");

//		d4.csv("../data/data.csv", type, function(error, data) {

	  // Transform data (i.e., finding cumulative values and total) for easier charting
		var cumulative = 0;
		
		if (isNaN(cumulative)) {
			cumulative = 0;
			self.fWaterfallChart(self.filteredData, self.measures, self.dimensions, 
					self.deleteDuplecateData(self.filteredData,self.measures[0]));
		}
		var data = [];
		for (var i = 0; i < dupleData.length; i++) {
			data.push(dupleData[i]);
			data[i].start = cumulative;
			cumulative += data[i].value;
			data[i].end = cumulative;

			data[i].class = ( data[i].value >= 0 ) ? 'positive' : 'negative'
		}
		data.push({
	    name: 'Total',
	    end: cumulative,
	    start: 0,
	    class: 'total'
		});

		x.domain(data.map(function(d) { return d.name; }));
		y.domain([0, d4.max(data, function(d) { return d.end; })]);

		svg.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(xAxis);

		svg.append("g")
	    .attr("class", "y axis")
	    .call(yAxis);

		var g = svg.selectAll(".bar")
	    .data(data)
	    .enter().append("g")
	    .attr("class", function(d) { return "bar " + d.class })
	    .attr("transform", function(d) { return "translate(" + x(d.name) + ",0)"; })
	    .attr("filter", function(d){
	    	for (var index = 0; index < self.tempTrackingData.length; index++) {
    			var check = 0;
   				$.each(self.dimensions, function(i, dim){
   					if(self.tempTrackingData[index][dim.caption] === d.name.split(" - ")[i])
   						check++;
   				})
   				if(check === self.dimensions.length){
   					return "true";
   				}
   			}
    	  return "false";
		})
	    .on("click", function(d){mouseclick(d,this)})
	    .on("mouseover", function() { 
        	$(this).attr('cursor','pointer');
        });
		
		g.append("text")
	    .attr("x", x.rangeBand() / 2)
	    .attr("y", function(d) { return y(d.end) + 5; })
	    .attr("dy", function(d) { return ((d.class=='negative') ? '-' : '') + ".75em" });
//	    .text(function(d) { return dollarFormatter(d.end - d.start);})
		/*dogfoot d3 차트 툴팁 오류 수정 shlim 20200701*/
//		var tooltip = d4.select("body").append("div")
//	        .attr("class", "toolTip")
//	        .style("display", "none");
		var tooltip = d4.select("#"+this.itemid)
		.append("div")
		.style("opacity", 0)
		.attr("class", "tooltip")
		.style("background-color", "white")
		.style("border", "solid")
		.style("border-width", "2px")
		.style("border-radius", "5px")
		.style("padding", "5px")
// 		.style("position", "absolute")
		.style("font-size", gDashboard.fontManager.getFontSize(12, 'Item'))
		.style("font-family", gDashboard.fontManager.getFontFamily('Item'));

		// Three function that change the tooltip when user hover / move / leave a cell
		var mouseover = function(d) {
			tooltip
			.style("opacity", 1)
			d3.select(this)
			//.style("stroke", "black")
			.style("opacity", 0.8)
		};
		
		var mousemove = function(d) {
			tooltip
			.html(function(){
				var toltipHtml = d.name;
				toltipHtml += " : ";
//				toltipHtml += d.value? d.value:d.end;
				/*dogfoot Y축 설정 추가 shlim 20200831*/
				toltipHtml = textFormat(d);
				return toltipHtml })
			.style("left", (d4.mouse(this)[0] + d4.select(this).node().getBBox().width + "px"))
			.style("top", (d4.mouse(this)[1]) + "px")
		};
		
		var mouseleave = function(d) {
			tooltip
			.style("opacity", 0)
			d3.select(this)
			//.style("stroke", "none")
			.style("opacity", 1)
		};
		var rgbLen = -1;
		g.append("rect")
	    .attr("y", function(d) { return y( Math.max(d.start, d.end) ); })
	    .attr("height", function(d) { return Math.abs( y(d.start) - y(d.end) ); })
	    .attr("width", x.rangeBand())
	    .style("fill", function(d,i) { 
	    	
	    	rgbLen++;
	    	if(rgb[rgbLen] == undefined){
	    		rgbLen = 0;
	    	}

	    	return rgb[rgbLen];
	    })
	    .on("mouseover", mouseover)
        .on("mouseout",  mouseleave)
        .on("mousemove", mousemove);
	    
		
		svg.select(".x.axis")
		  .selectAll("text")
		  .style("font-size",  function(d, i){
			  var fontz = gDashboard.fontManager.getFontSize((width/height) * 10, 'Item');
		  		if(Number(fontz.split('px')[0])>10 + Number(gDashboard.fontManager.getFontSize(0, 'Item').split('px')[0])){
		  			fontz = gDashboard.fontManager.getFontSize(15, 'Item');
		  		}else if(Number(fontz.split('px')[0]) < 5)
		  			fontz = 5;
		  		return fontz;
		 	 }	  	
		  ).style("font-family", gDashboard.fontManager.getFontFamily('Item'))
		svg.select(".y.axis")
		  .selectAll("text")
		  .style("font-size",  function(d, i){
			  var fontz = gDashboard.fontManager.getFontSize((width/height) * 10, 'Item');
		  		if(Number(fontz.split('px')[0])>10 + Number(gDashboard.fontManager.getFontSize(0, 'Item').split('px')[0])){
		  			fontz = gDashboard.fontManager.getFontSize(15, 'Item');
		  		}else if(Number(fontz.split('px')[0]) < 5)
		  			fontz = 5;
		  		return fontz;
		 	 }	  	
		  ).style("font-family", gDashboard.fontManager.getFontFamily('Item'))
		
//		 var legend = svg.append("g")
//		    .attr("class", "legend")
//			//.attr("x", w - 65)
//			//.attr("y", 50)
//		    .attr("height", 100)
//		    .attr("width", 100)
//			.attr('transform', 'translate(10,10)')  

		  if(self.meta.Legend.Visible){
			  var size = 20
			  var xPos = width + 5;

			  if(self.meta.Legend.Position.indexOf("Bottom") > -1){
				  xPos = height+60;
			  }
			  else if(self.meta.Legend.Position === "TopLeftVertical"){
				  xPos = -230
			  }else if(self.meta.Legend.Position.indexOf("Right") === -1){
				  xPos = -30;
			  }

			  var colors = {};
			  var palette = gDashboard.d3Manager.getPalette(self);

			  for(var i = 0; i < self.paletteData.length; i++){
				  colors[self.paletteData[i]] = palette[i%palette.length];
			  }
			  $('#'+self.itemid).css("display", "block");
			  if(self.meta.Legend.Position.indexOf("Center") > -1){
				  var beforeLegend;
				  var beforeTranslateX;
				  var legendWidthArr = [];
				  var endIndex = -1;
				  // Add labels beside legend dots
				  $('#'+self.itemid).css('display', 'block')
				  d3.select("#"+self.itemid + ' svg g').selectAll("mylabels")
				  .data(self.paletteData)
				  .enter()
				  .append("text")
				  .attr("y", xPos+ size*.8)
				  .style("fill",self.meta.LayoutOption.Legend.color)
				  .text(function(d){return d})
				  .style("font-family", self.meta.LayoutOption.Legend.family)
				  .style("font-size", self.meta.LayoutOption.Legend.size+'px')
				  .attr("text-anchor", "left")
				  .style("alignment-baseline", "middle")
				  .attr("x", function(d,i){
					  var translateX, beforeLegendWidth;

					  if(beforeLegend != undefined){

						  beforeLegendWidth = d3.select(beforeLegend).node().getComputedTextLength() + 30;
						  translateX = beforeTranslateX + beforeLegendWidth + 20/2;

						  if(translateX + d3.select(this).node().getComputedTextLength() > $('#'+self.itemid).width() - 75){
							  legendWidthArr.push(2000);
							  if(endIndex === -1){
								  endIndex = i;
								  d3.select(this).text(". . .");
								  return translateX;
							  }

							  return 2000;
						  }

						  if(endIndex != -1)
							  return 2000;
					  }else{
						  beforeTranslateX = 40;
						  translateX = 40;
					  }

					  beforeLegend = this;
					  beforeTranslateX = translateX;
					  legendWidthArr.push(translateX);
					  return translateX; 
				  })

				  d3.select("#"+self.itemid + ' svg g').selectAll("myrect")
				  .data(self.paletteData)
				  .enter()
				  .append("rect")
				  .attr("x", function(d,i){return legendWidthArr[i] - 15})
				  .attr("y", xPos + size *.5)
				  .attr("width", 12)
				  .attr("height", 12)
				  .style("stroke", "none")
				  .style("fill", function(d){ return colors[d]})


			  }else{
//				  d3.select("#"+self.itemid + ' svg').selectAll("myrect")
//				  .data(self.paletteData.slice(0, 10))
//				  .enter()
//				  .append("circle")
//				  .attr("cx", xPos)
//				  .attr("cy", function(d,i){ return 40 + i*(size+5)})
//				  .attr("r", 7)
//				  .style("fill", function(d){ return colors[d]})

//				  // Add labels beside legend dots
//				  d3.select("#"+self.itemid + ' svg').selectAll("mylabels")
//				  .data(self.paletteData.slice(0, 11))
//				  .enter()
//				  .append("text")
//				  .attr("x", xPos+ size*.8)
//				  .attr("y", function(d,i){ return 30 + i * (size + 5) + (size/2)})
//				  .style("fill", function(d){ return self.paletteData.length > 10 && self.paletteData[10] === d ? 'black' : colors[d]})
//				  .text(function(d){ return self.paletteData.length > 10 && self.paletteData[10] === d ? '. . .' : d})
//				  .attr("font-family", gDashboard.fontManager.getFontFamily("Item"))
//				  .attr("font-size", gDashboard.fontManager.getFontSizeNumber(12, "Item"))
//				  .attr("text-anchor", "left")
//				  .style("alignment-baseline", "middle")


				  // Add labels beside legend dots
				  var maxIndex = self.paletteData.length;
				  d3.select("#"+self.itemid + ' svg g').selectAll("mylabels")
				  .data(self.paletteData)
				  .enter()
				  .append("text")
				  .attr("x", xPos+ size*.8)
				  .attr("y", function(d,i){ return 16 + i * (size + 5) + (size/2)})
				  .style("fill", self.meta.LayoutOption.Legend.color)
				  .text(function(d, i){ 
					  if(16 + (i + 1) * (size + 5) + (size/2) > height + 40){
						  if(16 + i * (size + 5) + (size/2) > height + 40)
							  return '';
						  else{
							  if(self.paletteData.length - 1 !== i){
								  maxIndex = i;
								  return '. . .';

							  }
						  }
					  }
					  return (self.paletteData.length === 1 && self.paletteData[0] === "") ? self.measures[0].caption :d}


				  )
				  .attr("font-family", self.meta.LayoutOption.Legend.family)
				  .attr("font-size", self.meta.LayoutOption.Legend.size+'px')
				  .attr("text-anchor", "left")
				  .style("alignment-baseline", "middle")

				  d3.select("#"+self.itemid + ' svg g').selectAll("myrect")
				  .data(self.paletteData.slice(0, maxIndex))
				  .enter()
				  .append("rect")
				  .attr("x", xPos)
				  .attr("y", function(d,i){ return 20 + i*(size+5)})
				  .attr("width", 12)
				  .attr("height", 12)
				  .style("stroke", "none")
				  .style("fill", function(d){ return colors[d]})
			  }
		  }



		g.filter(function(d) { return d.class != "total" }).append("line")
	    .attr("class", "connector")
	    .attr("x1", x.rangeBand() + 5 )
	    .attr("y1", function(d) { return y(d.end) } )
	    .attr("x2", x.rangeBand() / ( 1 - padding) - 5 )
	    .attr("y2", function(d) { return y(d.end) } );

	   
//	});
		/*dogfoot Y축 설정 추가 shlim 20200831*/
		svg.append("text")
		  .attr("transform", "rotate(-90)")
		  .attr("y",(0 - width/5.3))
		  .attr("x",0 - (height / 2))
		  .attr("dy", "1em")
		  .style("font-size",  function(d, i){
			  var fontz = gDashboard.fontManager.getFontSize((width/height) * 10, 'Item');
		  		if(Number(fontz.split('px')[0])>10 + Number(gDashboard.fontManager.getFontSize(0, 'Item').split('px')[0])){
		  			fontz = gDashboard.fontManager.getFontSize(15, 'Item');
		  		}else if(Number(fontz.split('px')[0]) < 5)
		  			fontz = 5;
		  		return fontz;
		 	 }	  	
		  )
		  .style("font-family", gDashboard.fontManager.getFontFamily('Item'))
		  .style("text-anchor", "middle")
		  .text(function(d){
		  	if(self.WaterfallChart.AxisY.Title){
              return self.WaterfallChart.AxisY.Title;
		  	}else{
		  	    return '';	
		  	}
		  	
		  }); 
		
		d3.selectAll("#"+self.itemid+" .x.axis text")
		.style('font-family', self.meta.LayoutOption.AxisX.family)
		.style('fill', self.meta.LayoutOption.AxisX.color)
		.style("font-size", self.meta.LayoutOption.AxisX.size+'px')
		
		d3.selectAll("#"+self.itemid+" .y.axis text")
		.style('font-family', self.meta.LayoutOption.AxisY.family)
		.style('fill', self.meta.LayoutOption.AxisY.color)
		.style("font-size", self.meta.LayoutOption.AxisY.size+'px')
		
		d3.selectAll("#"+self.itemid+" .legend text")
		.style('font-family', self.meta.LayoutOption.Legend.family)
		.style('fill', self.meta.LayoutOption.Legend.color)
		.style("font-size", self.meta.LayoutOption.Legend.size+'px')
		

		function type(d) {
			  d.value = +d.value;
			  return d;
		}

		function dollarFormatter(n) {
			  n = Math.round(n);
			  var result = n;
			  if(self.WaterfallChart.AxisY){
		          var NumericY = self.WaterfallChart.AxisY
		          if(!NumericY.Visible){
		          	  return '';
		          }else{
		              return NumberF.unit(result, NumericY.FormatType, NumericY.Unit, NumericY.Precision, NumericY.Separator, undefined, NumericY.MeasureFormat, NumericY.SuffixEnabled);	
		          }
			  }
		}
		
		function getNumeric(d){
        	return NumberF.unit(d, labelFormat, labelUnit, labelPrecision, labelSeparator, undefined, labelSuffix, labelSuffixEnabled);
        }
        function textFormat(d){
			  var textValue= ""
		
			  switch(self.meta.TextFormat){
				  case 'none': {
					  textValue ="";
					  break;
				  }
				  case 'Argument': {
				  	  textValue = d.name;
					  break;
				  }
				  case 'Value': {
				
				  	  textValue = d.value ? getNumeric(d.value) : getNumeric(d.end)
					  break;
				  }
				  case 'Argument, Value': {
					 
				  	  textValue += ' [ '+ d.name +' : ';
				  	  textValue += d.value ? getNumeric(d.value) : getNumeric(d.end)
				  	  textValue += ' ] ';
				  	  
					  break;
				  }
				  case 'Percent': {
//				  	  var percent = d3v3.format(".1%")
//				  	  var rePer = d.parent != null ? percent(d.value / d.parent.value): percent(1)
//					  textValue = d.data.key+'  :  '+ rePer;
					 
				  	  textValue = d.value ? parseInt((d.value/d3.sum(data, function(_d){return _d.value ? _d.value : 0}))*100) + '%' : parseInt((d.end/d3.sum(data, function(_d){return _d.value ? _d.value : 0}))*100) + '%';
					  break;
				  }
				  case 'Value, Percent': {
					  textValue = d.value ? getNumeric(d.value) : getNumeric(d.end);
					  textValue += '(';
					  textValue += d.value ? parseInt((d.value/d3.sum(data, function(_d){return _d.value ? _d.value : 0}))*100) + '%' : parseInt((d.end/d3.sum(data, function(_d){return _d.value ? _d.value : 0}))*100) + '%';
					  textValue += ')';
					  break;
				  }
				  case 'Argument, Percent': {
					  textValue += ' [ '+ d.name +' : ';
					  textValue += d.value ? parseInt((d.value/d3.sum(data, function(_d){return _d.value ? _d.value : 0}))*100) + '%' : parseInt((d.end/d3.sum(data, function(_d){return _d.value ? _d.value : 0}))*100) + '%';
				  	  textValue += ' ] ';
					  break;
				  }
				  case 'Argument, Value, Percent': {
					  textValue += ' [ '+ d.name +' : ';
					  textValue += d.value ? getNumeric(d.value) : getNumeric(d.end);
					  textValue += '(';
					  textValue += d.value ? parseInt((d.value/d3.sum(data, function(_d){return _d.value ? _d.value : 0}))*100) + '%' : parseInt((d.end/d3.sum(data, function(_d){return _d.value ? _d.value : 0}))*100) + '%';
					  textValue += ')';
				  	  textValue += ' ] ';
					  break;
				  }
				  
			  }
			  return textValue
		  }

		function mouseclick(d,_this){
			
//			var selectKey =[] 
//			selectKey.push(d.name.split('-')[0]);
             switch(self.IO.MasterFilterMode){
				case 'Multiple':
					var inArray = false;
					var selectedData = {};
					if(d3.select(_this).attr("filter") === "true"){
						d3.select(_this)
						.style("stroke-width", '')
						.style("stroke", '')
						.attr("filter", 'false');
						
						for (var index = 0; index < self.tempTrackingData.length; index++) {
							var check = 0;
							$.each(self.dimensions, function(i, dim){
								if(self.tempTrackingData[index][dim.caption] === d.name.split(" - ")[i])
									check++;
							})
							if(check === self.dimensions.length){
								self.tempTrackingData.splice(index, 1);
								index--;
							}
						}
					}else{

						d3.select(_this)
						.style("stroke-width", '3')
						.style("stroke", 'blue')
						.attr("filter", 'true');
						

						tempSelectedData = {}
						$.each(self.dimensions, function(i, dim){
							tempSelectedData[dim.caption] = d.name.split(" - ")[i]
						})
						self.tempTrackingData.push(tempSelectedData);
					}
					self.trackingData = [];
			    	
					$.each(self.dimensions, function(i, dim){
						var unique = self.tempTrackingData.map(function(val, index){
							return val[dim.caption];
						}).filter(function(val, index, arr){
							return arr.indexOf(val) === index;
						});

						for(var j = 0; j < unique.length; j++){
							var selectedData = {};
							selectedData[dim.caption] = unique[j]
							self.trackingData.push(selectedData);
						}
					})
					/*dogfoot 뷰어 마스터필터 선택 시 포커스 아이템설정  shlim 20201118*/
					if(WISE.Constants.editmode === "viewer"){
						gDashboard.itemGenerateManager.focusedItem = self;
					}
					gDashboard.filterData(self.itemid, self.trackingData);
					break;
				case 'Single':

					self.trackingData = [];
                    if(d3.select(_this).attr("filter") === "true"){
						d3.selectAll('.bar')
						.style("stroke-width", '')
						.style("stroke", 'none')
						.attr("filter", 'false');

					}else{
						d3.selectAll('.bar')
						.style("stroke-width", '')
						.style("stroke", '')
						.attr("filter", 'false');

						d3.select(_this)
						.style("stroke-width", '3')
						.style("stroke", 'blue')
						.attr("filter", 'true');
						var selectedData = {};
						var tempSelectedData = {};
						$.each(self.dimensions, function(i, dim){
							var selectedData = {};
							selectedData[dim.caption] = d.name.split(" - ")[i]
							tempSelectedData[dim.caption] = d.name.split(" - ")[i]
							self.trackingData.push(selectedData);
						})

						self.tempTrackingData.push(tempSelectedData);
					}
                    /*dogfoot 뷰어 마스터필터 선택 시 포커스 아이템설정  shlim 20201118*/
					if(WISE.Constants.editmode === "viewer"){
						gDashboard.itemGenerateManager.focusedItem = self;
					}
					gDashboard.filterData(self.itemid, self.trackingData);
					break;
			}
	    }

//		function dollarFormatter(n) {
//		  n = Math.round(n);
//		  var result = n;
//		  if (Math.abs(n) > 1000000) {
//		    result = Math.round(n/1000000) + 'M';
//		  }
//		  return result;
//		}
		
	};
	
	this.functionDo = function(_f) {
		gDashboard.d3Manager.functionDo(_f, self, self.WaterfallChart);
	}
	
	this.functionDo2 = function(_f) {		
		switch(_f) {
			
		/* DESIGN OPTIONS */
		
			// show and hide title bar
			case 'captionVisible': {
				var titleBar = $('#' + self.itemid + '_title');
				if (titleBar.css('display') === 'none') {
					titleBar.css('display', 'block');
					self.WaterfallChart['ShowCaption'] = true;
				} else {
					titleBar.css('display', 'none');
					self.WaterfallChart['ShowCaption'] = false;
				}
				break;
			}
			// edit chart title
			case 'editName': {
				var p = $('#editPopup').dxPopup('instance');
				p.option({
					title: '이름 편집',
					onContentReady: function() {
						gDashboard.fontManager.setFontConfigForEditText('editPopup');
					},
					contentTemplate: function(contentElement) {
						// initialize title input box
						contentElement.append('<p>대시 보드 항목 이름 </p><div id="' + self.itemid + '_titleInput">');
                        var html = '<div class="modal-footer" style="padding-bottom:0px;">';
						html += '<div class="row center">';
						html += '<a id="ok-hide" href="#" class="btn positive ok-hide">확인</a>';
						html += '<a id="close" href="#" class="btn neutral close">취소</a>';
						html += '</div>';
						html += '</div>';
						html += '</div>';
						contentElement.append(html);
                        
                        $('#' + self.itemid + '_titleInput').dxTextBox({
							text: $('#' + self.itemid + '_title').text()
                        });
                                                
                        // confirm and cancel
						$('#ok-hide').on('click', function() {
                            var newName = $('#' + self.itemid + '_titleInput').dxTextBox('instance').option('text');
                            if(newName.trim() == '') {
                            	WISE.alert('아이템 이름에 빈 값을 넣을 수 없습니다.');
                            	$('#' + self.itemid + '_titleInput').dxTextBox('instance').option('value', self.Name);
                            } else {
                            	/* DOGFOOT ktkang 컨테이너 추가시 내부 아이템 이름 변경이 안되는 오류 수정  20191223 */
                            	
//                            	var goldenLayout = gDashboard.goldenLayoutManager;
//                            	goldenLayout.changeTitle(self.itemid, newName, goldenLayout.canvasLayout.root.contentItems);
                            	
                            	var ele = $('#' + self.itemid + '_title');
                            	ele.attr( 'title', newName)
                                ele.find( '.lm_title' ).html(newName);
                            	
                            	self.WaterfallChart['Name'] = newName;
                            	self.Name = newName;
                            	p.hide();
                            }
						});
						$('#close').on('click', function() {
							p.hide();
						});
					}
				});
				// show popup
				p.show();
				break;
			}
			// edit color scheme
			case 'editPalette': {
				if (!(self.dxItem)) {
					break;
				}
				var paletteCollection = ['Bright', 'Harmony Light', 'Ocean', 'Pastel', 'Soft', 'Soft Pastel', 'Vintage', 'Violet', 
					'Carmine', 'Dark Moon', 'Dark Violet', 'Green Mist', 'Soft Blue', 'Material', 'Office'];
				//2020.02.19 MKSONG KERIS 팔레트 이름 한글로 변경 DOGFOOT
				var paletteCollection2 = ['밝음', '발광체', '바다', '파스텔', '부드러움', '연한 파스텔', '나무', '포도', 
					'단색', '우주', '진보라', '안개숲', '연파랑', '기본값', '사무실 테마'];
				var paletteObject = {
						'Bright':'밝음',
						'Harmony Light':'발광체',
						'Ocean':'바다',
						'Pastel':'파스텔',
						'Soft':'부드러움',
						'Soft Pastel':'연한 파스텔',
						'Vintage':'나무',
						'Violet':'포도',
						'Carmine':'단색',
						'Dark Moon':'우주',
						'Dark Violet':'진보라',
						'Green Mist':'안개숲',
						'Soft Blue':'연파랑',
						'Material':'기본값',
						'Office':'사무실 테마',
						'Custom':'사용자 정의 테마',
					};
				var paletteObject2 = {
					'밝음':'Bright',
					'발광체':'Harmony Light',
					'바다':'Ocean',
					'파스텔':'Pastel',
					'부드러움':'Soft',
					'연한 파스텔':'Soft Pastel',
					'나무':'Vintage',
					'포도':'Violet',
					'단색':'Carmine',
					'우주':'Dark Moon',
					'진보라':'Dark Violet',
					'안개숲':'Green Mist',
					'연파랑':'Soft Blue',
					'기본값':'Material',
					'사무실 테마':'Office',
					'사용자 정의 테마':'Custom',
				};
				
				if (self.customPalette.length > 0) {
					paletteCollection.push('Custom');
					paletteCollection2.push('사용자 정의 테마');
				}
				// popup configs
				var p = $('#editPopover').dxPopover('instance');
				var chagePalette = self.WaterfallChart.Palette;
				var firstPalette = self.WaterfallChart.Palette;
				p.option({
                    target: '#editPalette',
                    onContentReady: function() {
						gDashboard.fontManager.setFontConfigForEditText('editPopover');
					},
					contentTemplate: function(contentElement) {
                        // create html layout
                        var html = 	'<div id="' + self.itemid + '_paletteBox"></div>' +
								 	'<div style="padding-bottom:20px;"></div>' +
									'<div class="modal-footer" style="padding-bottom:0px;">' +
										'<div class="row center">' +
											'<a id="save-ok" href="#" class="btn positive ok-hide">확인</a>' +
											'<a id="save-cancel" href="#" class="btn neutral close">취소</a>' +
										'</div>' +
									'</div>';
                        contentElement.append(html);
                        var select = $('#' + self.itemid + '_paletteBox');
                        // palette select
                        var originalPalette = paletteCollection.indexOf(self.WaterfallChart.Palette) != -1
										? self.WaterfallChart.Palette
										: 'Custom';
						select.dxSelectBox({
                            width: 400,
                            items: paletteCollection2,
                            itemTemplate: function(data) {
                                var html = $('<div />');
                                $('<p />').text(data).css({
                                    display: 'inline-block',
                                    float: 'left'
                                }).appendTo(html);
                                var itemPalette = data === '사용자 정의 테마'
										? self.customPalette 
										: DevExpress.viz.getPalette(paletteObject2[data]).simpleSet;
                                for (var i = 5; i >= 0; i--) {
                                    $('<div />').css({
                                        backgroundColor: itemPalette[i],
                                        height: 30,
                                        width: 30,
                                        display: 'inline-block',
                                        float: 'right'
                                    }).appendTo(html);
                                }
                                return html;
                            },
							value: paletteObject[originalPalette],
							onValueChanged: function(e) {
								if (e.value == '사용자 정의 테마') {
                                    self.isCustomPalette = true;
                                    /*self.dxItem.option('palette', self.customPalette);*/
                                	self.resize();
                                    
								} else {
                                    self.isCustomPalette = false;
                                    self.WaterfallChart.Palette = paletteObject2[e.value];
                                    self.resize();
                                    chagePalette = paletteObject2[e.value];
								}
							}
                        });
                        // confirm and cancel
                        $('#save-ok').on('click', function() {
                            self.WaterfallChart.Palette = paletteObject2[select.dxSelectBox('instance').option('value')];
                            chagePalette = paletteObject2[select.dxSelectBox('instance').option('value')];
                            //2020.02.19 MKSONG KERIS 팔레트 이름 한글로 변경 수정 끝 DOGFOOT
                            p.option('visible', false);
                        });
                        $('#save-cancel').on('click', function() {
                        	self.WaterfallChart.Palette = firstPalette;
                            chagePalette = firstPalette;
                            self.resize();
                            p.option('visible', false);
                        });
					},
					onHiding:function(){
						 self.WaterfallChart.Palette = chagePalette;
					}
                });
                p.option('visible', !(p.option('visible')));
				break;
			}
//			case 'editPalette': {
//				var paletteCollection = ['Bright', 'Harmony Light', 'Ocean', 'Pastel', 'Soft', 'Soft Pastel', 'Vintage', 'Violet', 
//					'Carmine', 'Dark Moon', 'Dark Violet', 'Green Mist', 'Soft Blue', 'Material', 'Office', 'Custom'];
//				// popup configs
//				var p = $('#editPopover').dxPopover('instance');
//				var chagePalette = self.WaterfallChart.Palette;
//				var firstPalette = self.WaterfallChart.Palette;
//				p.option({
//                    target: '#editPalette',
//					contentTemplate: function(contentElement) {
//                        // create html layout
//                        $(  "<div id=\"" + self.itemid + "_paletteBox\"></div>" +
//                            "<div class=\"modal-footer\" style=\"padding-top:15px; width:370px;\">" + 
//                            "    <div class=\"row center\">" + 
//		                    "        <a id=\"save_ok\" class=\"btn positive ok-hide\" href=\"#\" >확인</a>" + 
//		                    "        <a id=\"save_cancel\" class=\"btn neutral close\" href=\"#\">취소</a>" + 
//		                    "    </div>" + 
//                            "</div>"
//                        ).appendTo(contentElement);
//                        var select = $('#' + self.itemid + '_paletteBox');
//                        // palette select
//                        var originalPalette = paletteCollection.includes(self.WaterfallChart.Palette) 
//										? self.WaterfallChart.Palette
//										: 'Custom';
//						select.dxSelectBox({
//                            width: 400,
//                            items: paletteCollection,
//                            itemTemplate: function(data) {
//                                var html = $('<div />');
//                                $('<p />').text(data).css({
//                                    display: 'inline-block',
//                                    float: 'left'
//                                }).appendTo(html);
//                                var itemPalette = data === 'Custom'
//										? self.customPalette 
//										: DevExpress.viz.getPalette(data).simpleSet;
//                                for (var i = 5; i >= 0; i--) {
//                                    $('<div />').css({
//                                        backgroundColor: itemPalette[i],
//                                        height: 30,
//                                        width: 30,
//                                        display: 'inline-block',
//                                        float: 'right'
//                                    }).appendTo(html);
//                                }
//                                return html;
//                            },
//							value: originalPalette,
//							onValueChanged: function(e) {
//								if (e.value == 'Custom') {
//                                    self.isCustomPalette = true;
//                                    /*self.dxItem.option('palette', self.customPalette);*/
//                                    self.resize();
//								} else {
//                                    self.isCustomPalette = false;
//                                    /*self.dxItem.option('palette', e.value);*/
//                                    self.WaterfallChart.Palette = e.value;
//                                    self.resize();
//                                    chagePalette = e.value;
//								}
//							}
//                        });
//                        // confirm and cancel
//                        $('#save_ok').on('click', function() {
//                            self.WaterfallChart.Palette = select.dxSelectBox('instance').option('value');
//                            chagePalette = select.dxSelectBox('instance').option('value');
//                            self.resize();
//                            p.option('visible', false);
//                        });
//                        $('#save_cancel').on('click', function() {
//                            self.dxItem.option('palette', self.WaterfallChart.Palette);
//                            chagePalette = firstPalette;
//                            self.WaterfallChart.Palette = firstPalette;
//                            self.resize();
//                            p.option('visible', false);
//                        });
//					},
//					onHiding:function(){
//						 self.WaterfallChart.Palette = chagePalette;
//					}
//                });
//                p.option('visible', !(p.option('visible')));
//				break;
//			}
			default: break;
		}
	}

};


function checkingItem(_data) {
	return !_data.items.length;
};

WISE.libs.Dashboard.WaterfallChartFieldManager = function() {
	var self = this;

	this.initialized = false;
	this.alreadyFindOutMeta = false;

	//검색 - searchDisable
	this.searchDisable = false;
	//검색 - 검색어 완전일치 = true, 부분일치 = false
	this.searchMatchCompletely = true;
	//검색

	this.dataItemNo=0;

	this.meta;
	this.isChange = false; // 사용자가 필드를 변경했는지 여부 체크
	this.columnMeta = {}; // 쿼리된 모든 컬럼정보 저장
	this.isColumnChooser = false;

	this.all = [];
	this.values = [];
	this.arguments = [];
	this.series = [];
//	this.hide_column_list_dim = [];
//	this.hide_column_list_mea = [];

	this.tables = [];

	this.Constants = {
			CUSTOMIZED: '계산된필드',
			DELTA: '변동측정필드',
			UNSELECTED_FIELD: 'UNSELECTED_FIELD'
	}

	this.init = function() {
		this.columnMeta = {};
		this.tables = [];
		this.all = [];
		this.values = [];
		this.arguments = [];

		this.meta = gDashboard.structure.ReportMasterInfo.dataSource;

		this.initialized = true;
	};

	this.setMetaTables = function(tables){
		this.meta.tables = tables;
	}

	this.setDataItemByField = function(_fieldlist){
		this.DataItems = {};
		self.DataItems['Dimension'] = [];
		self.DataItems['Measure'] = [];
//		var NumericFormat = {'ForMatType' : 'Number', 'IncludeGroupSeparator': true, 'Precision': 0, 'Unit': "Ones"};

		for(var i = 0; i < _fieldlist.length; i++){
			if($(_fieldlist[i]).attr('data-field-type') == 'dimension'){
				var dataItem = {'DataMember': {}, 'UniqueName': ""};
				dataItem['Name'] = $(_fieldlist[i]).children().get(0).innerText;
				dataItem['DataMember'] = $(_fieldlist[i]).attr('UNI_NM')
				dataItem['UniqueName'] = $(_fieldlist[i]).attr('dataitem');
				/* DOGFOOT ktkang 대시보드 주제영역 기능 추가  20200618 */
				if(WISE.Context.isCubeReport) {
					dataItem['CubeUniqueName'] = $(_fieldlist[i]).attr('cubeuninm');
				}
				self.DataItems['Dimension'].push(dataItem);
			}  else if($(_fieldlist[i]).attr('data-field-type') == 'measure'){
				var dataItem = {'DataMember': {}, 'UniqueName': ""};
				dataItem['Name'] = $(_fieldlist[i]).children().get(0).innerText;
				dataItem['DataMember'] = $(_fieldlist[i]).attr('UNI_NM')
				dataItem['UniqueName'] = $(_fieldlist[i]).attr('dataitem');
				dataItem['SummaryType'] = $(_fieldlist[i]).find('.on >.summaryType').attr('summarytype');
				/* DOGFOOT ktkang 대시보드 주제영역 기능 추가  20200618 */
				if(WISE.Context.isCubeReport) {
					dataItem['CubeUniqueName'] = $(_fieldlist[i]).attr('cubeuninm');
				}
				dataItem['NumericFormat'] = $(_fieldlist[i]).data('formatOptions');
//				dataItem['NumericFormat'] = NumericFormat;
				self.DataItems['Measure'].push(dataItem);
			}
		}
		return self.DataItems;
	};

	this.setValuesByField = function(_values){
		this.Values = {'Value' : []};
		_.each(_values,function(_v){
			var Value = {'UniqueName' : _v.uniqueName};
			self.Values['Value'].push(Value);
		});
		return self.Values;
	};

	this.setArgumentsByField = function(_argument){
		this.Arguments = {'Argument' : []};
		_.each(_argument,function(_a){
			var Value = {'UniqueName' : _a.uniqueName};
			self.Arguments['Argument'].push(Value);
		});
		return self.Arguments;
	};
};
