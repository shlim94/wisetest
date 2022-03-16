/** DataUtility */
WISE.libs.Dashboard.item.WpConnectionUtility = {
	getPopupWpConntion: function(_self){
		var self = _self;
		
		var p = $('#editPopup').dxPopup('instance');
		p.option({
			title: '변동 측정값',
			width: 1200,
			onContentReady: function() {
				gDashboard.fontManager.setFontConfigForOption('editPopup');
			},
			contentTemplate: function(contentElement) {
				// initialize title input box

				var deltahtml = "<div class=\"modal-body\" style='height:87%'>\r\n" +
				"                        <div class=\"row\" style='height:100%'>\r\n" +
				"                            <div class=\"column\" style='width:60%'>\r\n" +
				"                                <div class=\"modal-article\" style=\"margin-top:0px;\">\r\n" +
				"                                   <div class=\"modal-tit\">\r\n" +
				"                                   	<span>변동 측정값 목록</span>\r\n" +
				'										<div id="'+self.itemid+'_saveField" style="float:right">'+
				'											<a><img src="' + WISE.Constants.context + '/resources/main/images/ico_zoom.png" style="height:25px; width:25px;"/></a>'+
				"										</div>"+
				"                                   </div>\r\n" +
				"									<div id=\"" + self.itemid + "_deltaValueList\" />\r\n" +
				"                                </div>\r\n" +
				"                            </div>\r\n" +
				"							 <div class=\"column\" style='width:60%'>\r\n" +
				"                                <div class=\"modal-article\" style=\"margin-top:0px;\">\r\n" +
				"                                   <div class=\"modal-tit\">\r\n" +
				"                                   <span>변동 측정값 정보</span>\r\n" +
				"                                   </div>\r\n" +
				"									<div id=\""+self.itemid+"_deltaValueInfo\"/>\r\n" +
				"									<div style='text-align: right;font-size: 0.75em;'><br>변동 측정값을 적용하면 차트는 그리드와 연결되어,<br>그리드 속성의 '차트 표시 여부' 기능이 작동하지 않습니다.</div>\r\n" +
				"                                </div>\r\n" +
//				"								<div class=\"modal-footer\" style='padding-top:15px;padding-bottom:5px;'>"+
//				"									<div class='row center'>"+
//				"										<a id=\""+self.itemid+"_deltaValueSave\" class=\"btn positive ok-hide\" href='#'>저장</a>\r\n" +
//				"										<a id=\""+self.itemid+"_deltaValueDelete\" class=\"btn neutral close\" href='#'>삭제</a>\r\n" +
//				"									</div>"+
//				"								</div>"+
				"                            </div>\r\n" +
				"                        </div>\r\n" + //row 끝
				"                    </div>\r\n" + //modal-body 끝
				"                    <div class=\"modal-footer\" style=\"padding-top:15px;\">\r\n" +
				"                        <div class=\"row center\">\r\n" +
				"                            <a id='"+self.itemid+"_deltaValueOK' class=\"btn positive ok-hide\" href='#'>확인</a>\r\n" +
				"                            <a id='"+self.itemid+"_deltaValueCancel' class='btn neutral close' href='#'>취소</a>\r\n" +
				"                        </div>\r\n" +
				"                    </div>\r\n" +
				"                </div>";

				contentElement.append(deltahtml);
				var fieldItems = new Array();
				$.each(self.DI.Measure,function(_i,_fields){
					fieldItems.push(_fields.DataMember);
				});


				$('#' + self.itemid + '_deltaValueList').dxDataGrid({
					columns:[
						{
							caption: "필드명",
							dataField: "FLD_NM"
						},
						{
							caption: "변동 측정값 항목 명",
							dataField: "CAPTION"
						},
						{
							caption: "기준 항목 명",
							dataField : "BASE_FLD_NM"
						},
						{
							caption: "변동 측정값 유형",
//							dataField : "DELTA_VALUE_TYPE",
							calculateCellValue: function(data){
								var type = "";
								switch(data.DELTA_VALUE_TYPE){
									case 'Absolute Variation': // 변화량
										type = '변화량'; break;
									case 'Percent Variation': // 변화비율
										type = '변화비율'; break;
									case 'Percent Of Column': // 열기준비율
										type = '열 기준 비율'; break;
									case 'Percent Of Row': // 행기준비율
										type = '행 기준 비율'; break;
									case 'Percent Of Column GrandTotal': // 열 총합계 기준비율
										type = '열 총합계 기준 비율'; break;
									case 'Percent Of Row GrandTotal': // 행 총합계 기준비율
										type = '행 총합계 기준 비율'; break;
									case 'Percent Of GrandTotal': // 총합계 기준비율
										type = '총 합계 기준 비율'; break;
									case 'Rank Row Largest To Smallest':
										type = '행 기준 순위(Largest->Smallest)'; break;
									case 'Rank Row Smallest To Largest':
										type = '행 기준 순위(Smallest->Largest)'; break;
									case 'Rank Column Largest To Smallest':
										type = '열 기준 순위(Largest->Smallest)'; break;
									case 'Rank Column Smallest To Largest':
										type = '열 기준 순위(Smallest->Largest)'; break;
								}
								return type
							}
						},
					],
					columnAutoWidth: true,
					dataSource:self.deltaItems,
//					selection:{
//						mode:'single',
//					},
					editing: {
						mode: 'row',
						allowDeleting: true,
						useIcons: true,
						texts: {
							confirmDeleteMessage: ''
						}
					},
					onSelectionChanged: function (selectedItems) {
						if(selectedItems.selectedRowsData.length !=0){
//							var indexId = selectedItems.selectedRowsData[0]['ID'];
//							$.each(self.deltaItems,function(_i,_deltaItem){
//								if()
//							})
							$('#'+self.itemid+'_deltaValueInfo').dxForm('updateData',selectedItems.selectedRowsData[0]);
//							var form = $('#'+self.itemid+'_deltaValueInfo').dxForm('instance');
//							form.option("formData", self.deltaItems[indexId]);
						}else{
							$('#' + self.itemid + '_deltaValueInfo').dxForm('resetValues');
						}
					},
					onRowClick: function(e) {
						if (e.isSelected) {
							e.component.deselectRows([e.key]);
						} else {
							e.component.selectRows([e.key]);
						}
					}
				});
				$('#'+self.itemid+'_deltaValueInfo').dxForm({
					formData:{
						'ID':'',
						'FLD_NM':'',
						'CAPTION':'',
						'BASE_FLD_NM':'',
						'DELTA_VALUE_TYPE':''
					},
					items:[
						{
							dataField:"ID",
							visible:false,
						},
						{
				            dataField: "FLD_NM",
				            editorOptions: {
				                disabled: true
				            },
				            label:{
				        		text:'필드 명'
				        	}
				        },
				        {
				        	dataField:"CAPTION",
			        		validationRules: [{
				                 type: "required",
				                 message: "데이터 캡션 값을 입력해주세요"
				             }],
				             label:{
				        		text:'항목 명'
				        	 }
				        },
						{
				        	 dataField: "BASE_FLD_NM",
				             editorType: "dxSelectBox",
				             editorOptions: {
				                 items: fieldItems,
				                 value: ""
				             },
				             validationRules: [{
				                 type: "required",
				                 message: "BASE_FLD_NM is required"
				             }],
				             label:{
				        		text:'기준 데이터 항목'
				        	 }
						},
						{
				        	 dataField: "DELTA_VALUE_TYPE",
				             editorType: "dxSelectBox",
				             editorOptions: {
				                 items: self.deltaTypes,
//				                 dataSource: new DevExpress.data.ArrayStore({
//				                     data: self.deltaTypes,
//				                     key: "value"
//				                 }),
				                 value: "",
			                	 displayExpr:"caption",
					             valueExpr:"value",
				             },
				             validationRules: [{
				                 type: "required",
				                 message: "DELTA_VALUE_TYPE is required"
				             }],
				             label:{
					        	text:'변동측정값 유형'
				             }
						}
					]
				});
				$('#'+self.itemid+'_saveField').on('click',function(){
					var formData = $('#'+self.itemid+'_deltaValueInfo').dxForm('instance').option("formData");
					formData = JSON.parse(JSON.stringify(formData));
					var itemLength = self.deltaItemlength;
					if(formData.BASE_FLD_NM != "" && formData.CAPTION != "" &&  formData.DELTA_VALUE_TYPE != ""){
						if($.isNumeric(formData.CAPTION) == true){
							WISE.alert("변동 측정값의 항목은 숫자로만 작성하여 적용할 수 없습니다!");
							return false;
						}
						if(formData.DELTA_VALUE_TYPE == "Rank Row Smallest To Largest" || formData.DELTA_VALUE_TYPE == 'Rank Row Largest To Smallest'){
							if(self.Pivot.Columns.Column.length == 0){
								WISE.alert("행 기준 순위는 비교 대상 열이 없으면 측정할 수 없습니다!");
								return false;
							}
						}
						else if(formData.DELTA_VALUE_TYPE == "Rank Column Smallest To Largest" || formData.DELTA_VALUE_TYPE == "Rank Column Largest To Smallest" ){
							if(self.Pivot.Rows.Row.length == 0){
								WISE.alert("열 기준 순위는 비교 대상 행이 없으면 측정할 수 없습니다!");
								return false;
							}
						}
						else if(formData.DELTA_VALUE_TYPE == 'Absolute Variation'){
							if(self.Pivot.Columns.Column.length == 0){
								WISE.alert("열에 분석할 대상이 없는경우 변화량을 책정할 수 없습니다!");
								return false;
							}
						}
						else if( formData.DELTA_VALUE_TYPE =='Percent Variation'){
							if(self.Pivot.Columns.Column.length == 0){
								WISE.alert("열에 분석할 대상이 없는경우 변화 비율을 책정할 수 없습니다!");
								return false;
							}
						}
						if(formData.FLD_NM  == ""){
							formData.ID = itemLength+1;
							formData.FLD_NM = 'DELTA_FIELD_'+(itemLength + 1);
							formData.BASE_UNI_NM = formData.BASE_FLD_NM;
							var formDataNoLink = JSON.parse(JSON.stringify(formData));
							$.merge(self.deltaItems,[formDataNoLink]);
							$('#' + self.itemid + '_deltaValueList').dxDataGrid('clearSelection');
							$('#' + self.itemid + '_deltaValueList').dxDataGrid('refresh');
							$('#' + self.itemid + '_deltaValueInfo').dxForm('resetValues');
							self.deltaItemlength++;
						}else{
							$.each(self.deltaItems,function(_i,_deltaItem){
								if(formData.FLD_NM == _deltaItem.FLD_NM){
									_deltaItem.CAPTION = formData.CAPTION;
									_deltaItem.BASE_FLD_NM = formData.BASE_FLD_NM;
									_deltaItem.BASE_UNI_NM = formData.BASE_FLD_NM;
									_deltaItem.DELTA_VALUE_TYPE = formData.DELTA_VALUE_TYPE;
									return false;
								}
							})

							$('#' + self.itemid + '_deltaValueList').dxDataGrid('clearSelection');
							$('#' + self.itemid + '_deltaValueList').dxDataGrid('refresh');
							$('#' + self.itemid + '_deltaValueInfo').dxForm('resetValues');
						}
					}
					else{
						WISE.alert("* 표시된 항목은 필수 사항입니다.");
					}
				});
				$('#'+self.itemid+'_deltaValueOK').dxButton({
					text:"확인",
					onClick:function(){
						var formData = $('#'+self.itemid+'_deltaValueInfo').dxForm('instance').option("formData");
						formData = JSON.parse(JSON.stringify(formData));
						var itemLength = self.deltaItemlength;
						if(formData.BASE_FLD_NM != null){
							if(formData.BASE_FLD_NM != "" && formData.CAPTION != "" &&  formData.DELTA_VALUE_TYPE != ""){
								if($.isNumeric(formData.CAPTION) == true){
									WISE.alert("변동 측정값의 항목은 숫자로만 작성하여 적용할 수 없습니다!");
									return false;
								}
								if(formData.DELTA_VALUE_TYPE == "Rank Row Smallest To Largest" || formData.DELTA_VALUE_TYPE == 'Rank Row Largest To Smallest'){
									if(self.Pivot.Columns.Column.length == 0){
										WISE.alert("행 기준 순위는 비교 대상 열이 없으면 측정할 수 없습니다!");
										return false;
									}
								}
								else if(formData.DELTA_VALUE_TYPE == "Rank Column Smallest To Largest" || formData.DELTA_VALUE_TYPE == "Rank Column Largest To Smallest" ){
									if(self.Pivot.Rows.Row.length == 0){
										WISE.alert("열 기준 순위는 비교 대상 행이 없으면 측정할 수 없습니다!");
										return false;
									}
								}
								else if(formData.DELTA_VALUE_TYPE == 'Absolute Variation'){
									if(self.Pivot.Columns.Column.length == 0){
										WISE.alert("열에 분석할 대상이 없는경우 변화량을 책정할 수 없습니다!");
										return false;
									}
								}
								else if( formData.DELTA_VALUE_TYPE =='Percent Variation'){
									if(self.Pivot.Columns.Column.length == 0){
										WISE.alert("열에 분석할 대상이 없는경우 변화 비율을 책정할 수 없습니다!");
										return false;
									}
								}
								if(formData.FLD_NM  == ""){
									formData.ID = itemLength+1;
									formData.FLD_NM = 'DELTA_FIELD_'+itemLength;
									formData.BASE_UNI_NM = formData.BASE_FLD_NM;
									var formDataNoLink = JSON.parse(JSON.stringify(formData));
									$.merge(self.deltaItems,[formDataNoLink]);
									$('#' + self.itemid + '_deltaValueList').dxDataGrid('clearSelection');
									$('#' + self.itemid + '_deltaValueList').dxDataGrid('refresh');
									$('#' + self.itemid + '_deltaValueInfo').dxForm('resetValues');
									self.deltaItemlength++;
								}else{
									$.each(self.deltaItems,function(_i,_deltaItem){
										if(formData.FLD_NM == _deltaItem.FLD_NM){
											_deltaItem.CAPTION = formData.CAPTION;
											_deltaItem.BASE_FLD_NM = formData.BASE_FLD_NM;
											_deltaItem.BASE_UNI_NM = formData.BASE_FLD_NM;
											_deltaItem.DELTA_VALUE_TYPE = formData.DELTA_VALUE_TYPE;
											return false;
										}
									})

									$('#' + self.itemid + '_deltaValueList').dxDataGrid('clearSelection');
									$('#' + self.itemid + '_deltaValueList').dxDataGrid('refresh');
									$('#' + self.itemid + '_deltaValueInfo').dxForm('resetValues');
								}
								$('#' + self.itemid + '_deltaValueList').dxDataGrid('refresh');
								//2020.02.17 mksong 옵션 사용한 바인드일 때 프로그레스 하이드 되도록 수정 dogfoot
								self.functionBinddata = true;
								self.bindData(self.globalData,true);
								p.hide();

							}
							else{
								if(self.deltaItemlength==0){
									var isAnything = false;
									$.each(_.keys(formData), function(_index,_key){
										if(formData[_key] != ""){
											isAnything = true;
										}
									});
									if(isAnything){
										WISE.alert("* 표시된 항목은 필수 사항입니다.");
									}else{
										p.hide();
									}
								}
								else{
//									self.bindData(self.globalData,true);
									/* DOGFOOT ktkang 주제영역 데이터 변동측정값 기능 수정  20191212 */
									if(WISE.Context.isCubeReport) {
										gDashboard.queryByGeneratingSql = true;
									}

									gDashboard.query();
									p.hide();
								}
							}
						}else{
//							self.bindData(self.globalData,true);
							if(WISE.Context.isCubeReport) {
								gDashboard.queryByGeneratingSql = true;
							}

							gDashboard.query();
							p.hide();
						}
					}
				});
				$('#'+self.itemid+'_deltaValueCancel').dxButton({
					text:"취소",
					onClick:function(){
						p.hide();
					}
				});
			}
		});
		
		return {
			popup : p,
			self : self
		};
	}
}