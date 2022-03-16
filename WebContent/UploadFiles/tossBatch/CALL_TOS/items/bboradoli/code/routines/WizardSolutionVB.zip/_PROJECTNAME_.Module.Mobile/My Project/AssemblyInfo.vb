.MapOption.DASHBOARD_XML.WEB !== 'undefined')
						var dataNumFormat = dataNumFormatSetting(_itemMeta.meta.DataItems.Measure, gDashboard.structure.MapOption.DASHBOARD_XML.WEB.CALENDAR_VIEW_CHART_DATA_ELEMENT, measure.uniqueName, 'MEASURES');
					else
						var dataNumFormat = dataNumFormatSettingNoSuffix(_itemMeta.meta.DataItems.Measure, measure.uniqueName);
					var cubeUniqueName = dataCubeUniqueName(_itemMeta.meta.DataItems.Measure, measure.uniqueName);
					measureDataItemSetting(measure, index, 'collapsibletreechartValueList', collapsibletreechartNum, dataNumFormat, true, cubeUniqueName);
				});
				
				$.each(_itemMeta.dimensions, function(index, dimension) {
					var cubeUniqueName = dataCubeUniqueName(_itemMeta.meta.DataItems.Dimension, dimension.uniqueName);
					argumentDataItemSettingNoTopN(dimension, index, 'collapsibletreechartParameterList', collapsibletreechartNum, cubeUniqueName);
				});
				break;
			case 'RANGE_BAR_CHART':
				
				var rangebarchartNum = _itemMet