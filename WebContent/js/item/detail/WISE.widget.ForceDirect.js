WISE.libs.Dashboard.item.ForceDirectGenerator = function() {
	var self = this;

	this.type = 'FORCEDIRECT';

	this.dashboardid;
	this.itemid;
	this.dataSourceId;
	// this.dataSources; // xml datasources json structure
	this.layoutManager;
	this.isMasterFilterCrossDataSource;
	this.dimensions = [];
	this.measures = [];
	this.dxItem;
	var dataMember;
	var Exprname;
	var FilterArray = [];

	
	this.customPalette = [];
	this.isCustomPalette = false;
	
	this.ForceDirect = [];
	this.fieldManager;
	this.currentMeasureName = "";
	
	//팔레트 
	this.customPalette = [];
	this.isCustomPalette = false;
	// 20200825 ajkim 팔레트 데이터 추가 dogfoot
	this.paletteData = [];
	// 20200608 ajkim 텍스트 입력 기능 개발 dogfoot 
	this.memoText = "";
	/* DOGFOOT ktkang 대시보드 주제영역 기능 추가  20200618 */
	this.cubeQuery = "";
	this.showQuery = "";
	/**
	 * @param _item:
	 *            meta object
	 */
	
	this.trackingData = [];
	
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

	this.setTackingFlag = function(chk)	{
		this.tracked = chk;
	};

	this.setForceDirect = function(){
		this.fieldManager.init();
		gDashboard.itemGenerateManager.getherFields(this.fieldManager, self.type);
		this.ForceDirect['ComponentName'] = this.ComponentName;
		this.ForceDirect['Name'] = this.Name;
		this.ForceDirect['DataSource'] = this.dataSourceId;

		this.ForceDirect['DataItems'] = this.fieldManager.DataItems;
		this.ForceDirect['Arguments'] = this.fieldManager.Arguments;
		this.ForceDirect['Values'] = this.fieldManager.Values;
		
		this.measures = this.fieldManager.measures;
		this.dimensions = this.fieldManager.dimensions;
		
		this.meta = this.ForceDirect;
		
		//초기 팔레트값 설정
		if (!(this.ForceDirect['Palette'])) {
//			this.Chart['Palette'] = 'Material';
			this.ForceDirect['Palette'] = userJsonObject.userPalette ? userJsonObject.userPalette : userJsonObject.defaultPalette;
		}
		
		if (!(this.ForceDirect['Legend'])) {
			this.ForceDirect['Legend'] = {
					Visible : true,
					Position : "TopLeftHorizontal"
			}
		}
		// 20200901 ajkim 마스터 필터 추가 dogfoot
		if (this.ForceDirect.InteractivityOptions) {
			if (!(this.ForceDirect.InteractivityOptions.MasterFilterMode)) {
				this.ForceDirect.InteractivityOptions.MasterFilterMode = 'Off';
			}
			if (!(this.ForceDirect.InteractivityOptions.TargetDimensions)) {
				this.ForceDirect.InteractivityOptions.TargetDimensions = 'Argument';
			}
			if (!(this.ForceDirect.InteractivityOptions.IgnoreMasterFilters)) {
				this.ForceDirect.InteractivityOptions.IgnoreMasterFilters = false;
			}
		} else {
			this.ForceDirect.InteractivityOptions = {
				MasterFilterMode: 'Off',
				TargetDimensions: 'Argument',
				IgnoreMasterFilters: false
			};
		}
		
		if(!this.ForceDirect.LayoutOption){
			this.ForceDirect.LayoutOption = {
					Label : {
						color: '#000000',
						size: 15,
						family: 'Noto Sans KR'
					},
					Title : {
						color: '#0000ff',
						size: 15,
						family: 'Noto Sans KR'
					},
					Legend : {
						color: '#000000',
						size: 14,
						family: 'Noto Sans KR'
					}
			}
		}
		if(!this.ForceDirect['ZoomAble']){
			this.ForceDirect.ZoomAble = 'none'
		}
	};

	this.setForceDirectforOpen = function(){
		if(typeof this.meta == 'undefined'){
			this.setForceDirect();
		}
		else{
			this.ForceDirect = this.meta;
		}
		if(typeof this.meta.DataSource == 'undefined'){
			this.meta['DataSource'] = 'dataSource1';
		}
		if(this.fieldManager != undefined){
			this.ForceDirect['DataItems'] = this.meta['DataItems'] = this.fieldManager.DataItems;
			this.ForceDirect['Arguments'] = this.meta['Arguments'] = this.fieldManager.Arguments;
			this.ForceDirect['Values'] = this.meta['Values'] = this.fieldManager.Values;
			this.measures = this.fieldManager.measures;
			this.dimensions = this.fieldManager.dimensions;
		}
		
		//팔레트 불러오기
		var page = window.location.pathname.split('/');
		if (!(this.ForceDirect['Palette'])) {
			this.ForceDirect['Palette'] = userJsonObject.userPalette ? userJsonObject.userPalette : userJsonObject.defaultPalette;
			
			if(gDashboard != undefined){
				var ForceDirectOption = typeof gDashboard.structure.MapOption.DASHBOARD_XML == 'undefined' ? '' : WISE.util.Object.toArray(gDashboard.structure.MapOption.DASHBOARD_XML.FORCEDIRECT_DATA_ELEMENT);
				
				$.each(ForceDirectOption,function(_i,_ForceDirectOption){
					var CtrlNM;
					if (page[page.length - 1] === 'viewer.do'){
						CtrlNM = _ForceDirectOption.CTRL_NM +"_"+WISE.Constants.pid;
					}else{
						CtrlNM = _ForceDirectOption.CTRL_NM;
					}
					if(self.ForceDirect.ComponentName == CtrlNM){
						self.ForceDirect['Palette'] = _ForceDirectOption.PALETTE_NM;
						return false;
					}
				})
				if(typeof this.meta.ColorSheme != 'undefined'){
					var colorList = WISE.util.Object.toArray(this.meta.ColorSheme.ColorSheme);
					this.ForceDirect.Palette = new Array();
					var newPalette = [];
					$.each(colorList,function(_i,_list){
						self.ForceDirect.Palette.push(gDashboard.itemColorManager.getHexColor(_list.Color)); 
						 newPalette[_i] = gDashboard.itemColorManager.getHexColor(_list.Color);
					});
					
					self.customPalette = newPalette;
					self.isCustomPalette = true;
				}
			}
		}
		if(!this.ForceDirect.LayoutOption){
			this.ForceDirect.LayoutOption = {
					Label : {
						color: '#000000',
						size: 15,
						family: 'Noto Sans KR'
					},
					Title : {
						color: '#0000ff',
						size: 15,
						family: 'Noto Sans KR'
					},
					Legend : {
						color: '#000000',
						size: 14,
						family: 'Noto Sans KR'
					}
			}
		}
		if(!this.ForceDirect['ZoomAble']){
			this.ForceDirect.ZoomAble = 'none'
		}
		
		if (!(this.ForceDirect['Legend'])) {
			this.ForceDirect['Legend'] = {
					Visible : true,
					Position : "TopLeftHorizontal"
			}
		}
	}
	this.setForceDirectForViewer = function(){
		if(typeof this.meta == 'undefined'){
			this.setForceDirect();
		}
		else{
			this.ForceDirect = this.meta;
		}
		if(typeof this.meta.DataSource == 'undefined'){
			this.meta['DataSource'] = 'dataSource1';
		}
		if(this.fieldManager != undefined){
			this.ForceDirect['DataItems'] = this.meta['DataItems'] = this.fieldManager.DataItems;
			this.ForceDirect['Arguments'] = this.meta['Arguments'] = this.fieldManager.Arguments;
			this.ForceDirect['Values'] = this.meta['Values'] = this.fieldManager.Values;
			this.measures = this.fieldManager.measures;
			this.dimensions = this.fieldManager.dimensions;
		}
		
		//팔레트 불러오기
		var page = window.location.pathname.split('/');
		if (!(this.ForceDirect['Palette'])) {
			this.ForceDirect['Palette'] = userJsonObject.userPalette ? userJsonObject.userPalette : userJsonObject.defaultPalette;
			
			if(gDashboard != undefined){
				var ForceDirectOption = typeof gDashboard.structure.MapOption.DASHBOARD_XML == 'undefined' ? '' : WISE.util.Object.toArray(gDashboard.structure.MapOption.DASHBOARD_XML.FORCEDIRECT_DATA_ELEMENT);
				
				$.each(ForceDirectOption,function(_i,_ForceDirectOption){
					var CtrlNM;
//					if (page[page.length - 1] === 'viewer.do'){
//						CtrlNM = _ForceDirectOption.CTRL_NM +"_"+WISE.Constants.pid;
//					}else{
						CtrlNM = _ForceDirectOption.CTRL_NM;
//					}
					if(self.ForceDirect.ComponentName == CtrlNM){
						self.ForceDirect['Palette'] = _ForceDirectOption.PALETTE_NM;
						return false;
					}
				})
				if(typeof this.meta.ColorSheme != 'undefined'){
					var colorList = WISE.util.Object.toArray(this.meta.ColorSheme.ColorSheme);
					this.ForceDirect.Palette = new Array();
					var newPalette = [];
					$.each(colorList,function(_i,_list){
						self.ForceDirect.Palette.push(gDashboard.itemColorManager.getHexColor(_list.Color)); 
						 newPalette[_i] = gDashboard.itemColorManager.getHexColor(_list.Color);
					});
					
					self.customPalette = newPalette;
					self.isCustomPalette = true;
				}
			}
		}
		
		if (!(this.ForceDirect['Legend'])) {
			this.ForceDirect['Legend'] = {
					Visible : true,
					Position : "TopLeftHorizontal"
			}
		}
		if(!this.ForceDirect.LayoutOption){
			this.ForceDirect.LayoutOption = {
					Label : {
						color: '#000000',
						size: 15,
						family: 'Noto Sans KR'
					},
					Title : {
						color: '#0000ff',
						size: 15,
						family: 'Noto Sans KR'
					},
					Legend : {
						color: '#000000',
						size: 14,
						family: 'Noto Sans KR'
					}
			}
		}
		if(!this.ForceDirect['ZoomAble']){
			this.ForceDirect.ZoomAble = 'none'
		}
	}

	/** @Override */
	this.bindData = function(_data) {
		//2020.02.07 mksong sqllike 적용 dogfoot
		if ($.type(this.child) === 'object' && this.dxItem) {
			this.dxItem = undefined;
			this.layoutManager.createItemLayer(this.itemid);
		}

		if(this.fieldManager !=null && gDashboard.isNewReport == true){ // 신규 생성
			self.setForceDirect();
			gDashboard.itemGenerateManager.addParentItems(self);
			gDashboard.itemGenerateManager.itemCustomize(self,self.ForceDirect);
			gDashboard.itemGenerateManager.generateItem(self, self.ForceDirect);
		}else if(this.fieldManager !=null && gDashboard.isNewReport != true){
			gDashboard.itemGenerateManager.getherFields(this.fieldManager, self.type);
			this.setForceDirectforOpen();
			gDashboard.itemGenerateManager.addParentItems(self);
			gDashboard.itemGenerateManager.itemCustomize(self,self.ForceDirect);
			gDashboard.itemGenerateManager.generateItem(self, self.ForceDirect);
		}
		//d3 뷰어모드 
		else if(self.meta && $.isEmptyObject(self.ForceDirect)) {
			this.setForceDirectForViewer();
			gDashboard.itemGenerateManager.itemCustomize(self,self.ForceDirect);
			gDashboard.itemGenerateManager.generateItem(self, self.ForceDirect);
		}else if(self.meta == undefined && gDashboard.reportType == 'AdHoc'){
			this.setForceDirectForViewer();
			gDashboard.itemGenerateManager.itemCustomize(self,self.ForceDirect);
			gDashboard.itemGenerateManager.generateItem(self, self.ForceDirect);
		}


		var buttonPanelId = this.itemid + '_topicon';
		var topIconPanel = $('#' + buttonPanelId);
		if($('#'+this.itemid + '_tracking_data_container').length == 0){
			var trackingDataContainerId = this.itemid + '_tracking_data_container';
			var trackingDataContainerHtml = '<li id="' + trackingDataContainerId + '" style="font-size: 14px; padding-top: 3px;"></li>';
			topIconPanel.append(trackingDataContainerHtml);
		}

		var dxConfig = this.getDxItemConfig(this.meta);

		var measureKey = [];
		//self.currentMeasureName = measureKey.caption;
		
		//2020.11.03 MKSONG 필요한 리소스 동적으로 Import DOGFOOT
		WISE.loadedSourceCheck('d3');
		self.fForceDirect(_data, this.measures, this.dimensions, self.deleteDuplecateData(_data,measureKey));
//		dxConfig.dataSource = self.deleteDuplecateData(_data,measureKey);
		$('#' + self.itemid + '_title > .lm_title').text(self.Name);
		
		//2020.02.13 mksong 조회시 그려진 아이템 초기화 되도록 수정 dogfoot
		$('#'+self.itemid).css('display','block');
		this.dxItem = $("#" + this.itemid).dxChart(dxConfig).dxChart("instance");
		gDashboard.itemGenerateManager.renderButtons(self);
		//2020.02.12 mksong 보고서 아이템 모두 view 했을 때 프로그레스바 사라지도록 수정 dogfoot
		gDashboard.itemGenerateManager.viewedItemList.push(self.ComponentName);
		if(gDashboard.itemGenerateManager.dxItemBasten.length == gDashboard.itemGenerateManager.viewedItemList.length){
			gProgressbar.setStopngoProgress(true);
			gProgressbar.hide();
			gDashboard.updateReportLog();
		}
	};

	this.menuItemGenerate = function(){
		gDashboard.itemGenerateManager.menuItemGenerate(self);
	}

	this.clearTrackingConditions = function() {
	};
	
	this.renderButtons = function(_itemid) {
		gDashboard.itemGenerateManager.renderButtons(self);
	};
	
	this.deleteDuplecateData = function(_data,MeasureKey){
		return gDashboard.d3Manager.getDataSource(self, self.type, {'data' : _data, 'measerKey': MeasureKey});
	}
	this.deleteDuplecateData2 = function(_data,MeasureKey){
		//2020.02.07 mksong sqllike 적용 dogfoot
		var SQLikeUtil = WISE.libs.Dashboard.Query.likeSql;
		var dataSourceId = this.dataSourceId;
		/**
		 * 데이터 중복 제거 코드
		 */
		var ValueArray = new Array();
		var ValueArray2 = new Array();
		var FieldArray = new Array();
		var selectArray = new Array();

		var Dimension = WISE.util.Object.toArray(this.meta.DataItems.Dimension);
		var Measure =  WISE.util.Object.toArray(MeasureKey);
		
		$.each(this.measures,function(_i,_Mea){
			selectArray.push('|sum|');
			selectArray.push(_Mea.name);
			//2020.02.05 mksong SQLLIKE doSqlLike ForceDirect 적용 dogfoot
			selectArray.push('|as|');
			selectArray.push(_Mea.captionBySummaryType);
		})
		$.each(Dimension,function(_i,_Dim){
			if(_i == 0){
				selectArray.push(_Dim.DataMember);
				FieldArray.push(_Dim.DataMember);
				var sqlConfig ={};
				sqlConfig.Select = selectArray;
				sqlConfig.From = _data;
				sqlConfig.GroupBy = FieldArray;
				/* DOGFOOT ktkang 대시보드 주제영역 기능 추가  20200618 */
				//var queryData = SQLikeUtil.doSqlLike(dataSourceId, sqlConfig, self.cubeQuery);
				//ValueArray.push(queryData);
				self.filteredData = SQLikeUtil.doSqlLike(dataSourceId, sqlConfig, self); 
				self.csvData = self.filterdData;
				ValueArray.push(self.filteredData);				
			}else{
				selectArray.push(_Dim.DataMember);
				FieldArray.push(_Dim.DataMember);
				var sqlConfig ={};
				sqlConfig.Select = selectArray;
				sqlConfig.From = _data;
				sqlConfig.GroupBy = FieldArray;
				/* DOGFOOT ktkang 대시보드 주제영역 기능 추가  20200618 */
				self.filteredData = SQLikeUtil.doSqlLike(dataSourceId, sqlConfig, self); 
				self.csvData = self.filterdData;
				ValueArray2.push(self.filteredData);
			}
		});
		
		$.each(ValueArray[0],function(_i,_val){
			ValueArray[0][_i]["children"]= new Array();
			$.each(ValueArray2[0],function(_j,_val2){
				if(_val[Dimension[0].DataMember] == _val2[Dimension[0].DataMember] ){
					ValueArray[0][_i]["children"].push(_val2);
				}else{
					
				}
			});
		});

		return ValueArray;
	};
	/*dogfoot d3 resize시 쿼리 안타도록 수정  shlim 20200909*/
	this.resize = function() {
		/*dogfoot 고급시각화차트 팔레트 바로 반영되도록 수정 shlim 20200729*/
		if(typeof self.resizeData != 'undefined'){
			//2020.11.03 mksong resource Import 동적 구현 dogfoot
    		WISE.loadedSourceCheck('d3');
		    self.fForceDirect(self.filteredData, self.measures, self.dimensions, 
					self.resizeData);
		}
		gProgressbar.hide();
	};

	this.fForceDirect = function(jsonData, measures, dimensions, dupleData) {
		//2020.05.04 AJKIM 데이터 항목 없을 때 이미지 추가 DOGFOOT
		$('#'+self.itemid + ' .nodata-layer').remove();
		if (!dupleData || ($.type(dupleData[0]) === 'array' && dupleData[0].length === 0)) {
			var nodataHtml = '<div class="nodata-layer" style="z-index:99999999999"></div>';
			$("#" + self.itemid).children().css('display','none');
			$("#" + self.itemid).prepend(nodataHtml);
			$("#" + self.itemid).css('display', 'block');
			gProgressbar.hide();
			if(gDashboard.itemGenerateManager.viewedItemList.indexOf(self.ComponentName) < 0 ){
				gDashboard.itemGenerateManager.viewedItemList.push(self.ComponentName);
			}

			if(gDashboard.itemGenerateManager.dxItemBasten.length == gDashboard.itemGenerateManager.viewedItemList.length){
				gProgressbar.setStopngoProgress(true);
				gProgressbar.hide();	
				gDashboard.updateReportLog();
			}
			return;
		}
		self.resizeData = dupleData;
		$("#" + self.itemid).children().css('display','block');
		   var width = $('#'+self.itemid).width();
		   var height = $('#'+self.itemid).height();
		   var demensionNm =  new Array();
		   var valueName = new Array();

		   $.each(self.measures,function(_i,_val){
			   valueName.push(self.measures[_i].nameBySummaryType);
		   });	
		   self.paletteData = [];
		   if(!self.meta.LayoutOption.Circle){
			   self.meta.LayoutOption.Circle = new Array();
		   }
		   $.each(dimensions,function(_i,_val){
			   demensionNm.push(_val.name);
			   self.paletteData.push(_val.caption);
			   if(self.meta.LayoutOption.Circle.length <= _i){
				   self.meta.LayoutOption.Circle.push(0);
			   }
		   });
		   
		   self.meta.LayoutOption.Circle.splice(self.paletteData.length);

//			var paletteName = self.ForceDirect.Palette;
//			var rgb = getPaletteValue(paletteName);
		    var rgb = gDashboard.d3Manager.getPalette(self);
		   
		   d3.select("#" + self.itemid).selectAll("svg").remove();
		   
		   var svg = d3.select("#" + self.itemid).append("svg:svg")
		        .attr("class", "mainForceDirectSVG")
		        .attr("width", width)
		        .attr("height",height)
				.append("g");

		    var zoomCnt = 0;
			function zoomable(){
				 var zoom = d3.zoom().on("zoom", function (d,zz) {
					 if(pressKey['z'] || pressKey['Z'])
							  d3.select('#'+self.itemid).select('g').attr("transform", function(){ 
									  if(zoomCnt==0){
											d3.event.transform.x = 0
											d3.event.transform.y = 0
											d3.event.transform.k =1;
									  }

									   zoomCnt++
									return d3.event.transform;
								})
							})

				  d3.select('#'+self.itemid).select('svg').call(zoom)
			}
			if(self.meta.ZoomAble != 'none'){
				zoomable();
			}
	
			var dataset = {
				"nodes": [],
				"links": []
			};
			
			var colorIdx = 0;
			for(i in demensionNm) {
				dataset.nodes.push({id: demensionNm[i], num: colorIdx++, size: self.meta.LayoutOption.Circle[i] == 0? 50 : self.meta.LayoutOption.Circle[i]*1 });
			}
			for(i in demensionNm) {
				if(i!=0) dataset.links.push({source: demensionNm[0], target: demensionNm[i]});
			}			
			
			if(dataset.nodes.length>0) {
				dataset.nodes[0].fx = width / 2;
				dataset.nodes[0].fy = height / 2;
				dataset.nodes[0].size = self.meta.LayoutOption.Circle[0] == 0? 70 : self.meta.LayoutOption.Circle[0]*1;
			
				//Create Force Layout
				var simulation = d3.forceSimulation()
					.force("link", d3.forceLink().id(function(d) { return d.id; }).distance(200).strength(1))
				  	.force("charge", d3.forceManyBody().strength(-300).distanceMin(10).distanceMax(200))
				/*			
	                .force("link", d3.forceLink().distance(300).id(function (d) { return d.index }))
	                .force("collide", d3.forceCollide(function (d) { return d.r + 8 }).iterations(16))
	                .force("charge", d3.forceManyBody())
	                .force("center", d3.forceCenter(width / 2, height / 2))
	                .force("y", d3.forceY(0))
	                .force("x", d3.forceX(0));
				*/
			
				//Add links to SVG
				var link = svg.selectAll(".links")
					.data(dataset.links)
	                .enter()
	                .append("line")
					.attr("stroke", "#aaa")
					.attr("stroke-width", 1)
					.attr("class", "links");
								
				//Add nodes to SVG
				var node = svg.selectAll(".nodes")
					.data(dataset.nodes)
					.enter()
					.append("g")
					.attr("class", "nodes")
					.call(d3.drag()
	                    .on("start", dragstarted)
	                    .on("drag", dragged)
						.on("end", dragended));
								
				node.append("circle")
					.attr("r", function(d){ return d.size; })
					.attr("fill", function(d){ return rgb[d.num % rgb.length] });
							
				node.append("text")
				.attr("dx", 0)
				.attr("dy", function(d){ return "-"+(d.size *.5); })
				.style("font-size", self.meta.LayoutOption.Title.size+'px')
				.style("font-family", self.meta.LayoutOption.Title.family)
				.style("fill", self.meta.LayoutOption.Title.color)
				.style("text-anchor", "middle")
				.attr("demension", function(d){ return d.id; })
				.text(function(d){ return d.id; });
					
				node.on("mouseover", function(d) {
					var thisNode = d.id
					link.attr("stroke", function(d) {
						return (d.source.id == thisNode || d.target.id == thisNode) ? '#555' : '#aaa'
					});
					link.attr("stroke-width", function(d) {
						return (d.source.id == thisNode || d.target.id == thisNode) ? 3 : 1
					});
				});
				
				node.on("mouseout", function(d) {
					link.attr("opacity", 1).attr("stroke","#aaa").attr("stroke-width", 1);
				});				
				
				var subItem = self.filteredData;
					
				svg.selectAll("text").each(function() {
					var d3TextItem = d3.select(this);
					for(i in subItem) {
						var word = eval('subItem[i]["'+d3TextItem.attr('demension')+'"]');
						if(word!='') {
							var sameFlag = false;
							d3TextItem.selectAll("tspan").each(function(){
								var d3TspanItem = d3.select(this);
								if(word===d3TspanItem.text()) sameFlag = true;
							});
							if(!sameFlag) {
								d3TextItem.append("tspan")
									.attr("x", 0)
									.attr("dy", 20)
									.style("font-size", self.meta.LayoutOption.Label.size+'px')
									.style("font-family", self.meta.LayoutOption.Label.family)
									.style("fill", self.meta.LayoutOption.Label.color)
									.text(word);
							}
						}
					}
				});						
			
				var ticked = function () {
					link
						.attr("x1", function (d) { return d.source.x; })
						.attr("y1", function (d) { return d.source.y; })
						.attr("x2", function (d) { return d.target.x; })
						.attr("y2", function (d) { return d.target.y; });
					node
						.attr("r", function(d){ return d.size; })
						.attr("cx", function (d) { return d.x; })
						.attr("cy", function (d) { return d.y; })
						.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
				}
			
				simulation
					.nodes(dataset.nodes)
					.on("tick", ticked);
			
				simulation.force("link")
					.links(dataset.links);		
			
				function dragstarted(d) {
					if (!d3.event.active) simulation.alphaTarget(0.3).restart();
					d.fx = d.x;
					d.fy = d.y;
				}
			
				function dragged(d) {
					d.fx = d3.event.x;
					d.fy = d3.event.y;
				}
			
				function dragended(d) {
					if (!d3.event.active) simulation.alphaTarget(0);
					d.fx = null;
					d.fy = null;
				}	
			
				if(self.meta.Legend.Visible){
					var sequentialScale = d3.scaleOrdinal(rgb)
					.domain(demensionNm);
			
					svg.append("g")
						.attr("class", "legendSequential")
						.attr("transform", "translate(10,10)");
				
					var legendSequential = d3.legendColor()
						.shapeWidth(30)
						.cells(demensionNm.length)
						.orient("vertical")
						//.title("범례")
						.titleWidth(100)
						.scale(sequentialScale) 
				
					svg.select(".legendSequential")
						.call(legendSequential);
						
					var cellNo = 0;
					var _y = 0;
					var _x = 0;
					if(self.meta.Legend.Position.indexOf("Bottom") > -1){
						_y = height - 50;
					}
					if(self.meta.Legend.Position.indexOf("Right") > -1){
						_x = width - 160;
					}else if(self.meta.Legend.Position.indexOf("Center") > -1){
						_x = width / 2 - 75;
					}
					svg.select(".legendCells")
						.selectAll(".cell")
						.attr("transform", function(d) { return "translate("+ _x +", " + (_y === 0? 20 * cellNo++ : _y - 20 * cellNo++) + ")"; })
						.selectAll(".label")
						.style("font-size", self.meta.LayoutOption.Legend.size+'px')
						.style("font-family", self.meta.LayoutOption.Legend.family)
						.style("fill", self.meta.LayoutOption.Legend.color)
						.attr("transform", function(d) { return "translate(40, 10)"; });
				}
				
			}
	};
	
	this.functionDo = function(_f) {
		gDashboard.d3Manager.functionDo(_f, self);
	}
	
	this.functionDo2 = function(_f) {		
		switch(_f) {
		/* DESIGN OPTIONS */
			// show and hide title bar
			case 'captionVisible': {
				var titleBar = $('#' + self.itemid + '_title');
				if (titleBar.css('display') === 'none') {
					titleBar.css('display', 'block');
					self.ForceDirect['ShowCaption'] = true;
				} else {
					titleBar.css('display', 'none');
					self.ForceDirect['ShowCaption'] = false;
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
                            	
                            	self.ForceDirect['Name'] = newName;
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
				var chagePalette = self.ForceDirect.Palette;
				var firstPalette = self.ForceDirect.Palette;
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
                        var originalPalette = paletteCollection.indexOf(self.ForceDirect.Palette) != -1
										? self.ForceDirect.Palette
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
//                                    self.dxItem.option('palette', self.customPalette);
                                    self.resize();
								} else {
                                    self.isCustomPalette = false;
                                    /*self.dxItem.option('palette', e.value);*/
                                    self.ForceDirect.Palette = paletteObject2[e.value];
                                    self.resize();
                                    chagePalette = paletteObject2[e.value];
								}
							}
                        });
                        // confirm and cancel
                        $('#save-ok').on('click', function() {
                            self.ForceDirect.Palette = paletteObject2[select.dxSelectBox('instance').option('value')];
                            chagePalette = paletteObject2[select.dxSelectBox('instance').option('value')];
                            //2020.02.19 MKSONG KERIS 팔레트 이름 한글로 변경 수정 끝 DOGFOOT
                            p.option('visible', false);
                        });
                        $('#save-cancel').on('click', function() {
                        	chagePalette = firstPalette;
                        	self.ForceDirect.Palette = firstPalette;
                        	self.resize();
                        	p.option('visible', false);
                        });
					},
					onHiding:function(){
						 self.ForceDirect.Palette = chagePalette;
					}
                });
                p.option('visible', !(p.option('visible')));
				break;
			}
			default: break;
		}
	}
};


function checkingItem(_data) {
	return !_data.items.length;
};
WISE.libs.Dashboard.ForceDirectFieldManager = function() {
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
		var NumericFormat = {'ForMatType' : 'Number', 'IncludeGroupSeparator': true, 'Precision': 0, 'Unit': "Ones"};

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
				/* DOGFOOT ktkang 대시보드 주제영역 기능 추가  20200618 */
				if(WISE.Context.isCubeReport) {
					dataItem['CubeUniqueName'] = $(_fieldlist[i]).attr('cubeuninm');
				}
				dataItem['NumericFormat'] = NumericFormat;
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
