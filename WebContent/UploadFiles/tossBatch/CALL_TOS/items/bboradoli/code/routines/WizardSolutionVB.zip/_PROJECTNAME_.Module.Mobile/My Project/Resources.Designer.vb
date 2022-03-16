);
					argumentDataItemSettingNoTopN(dimension, index, 'forceDirectParameterList', forceDirectNum, cubeUniqueName);
				});
				break;
			case 'FORCEDIRECTEXPAND':

				var forceDirectExpandNum = _itemMeta.ComponentName.replace('forceDirectExpandDashboardItem', '');
				
				/*
				$.each(_itemMeta.measures, function(index, measure) {
						if(typeof gDashboard.structure.MapOption.DASHBOARD_XML.WEB !== 'undefined')
							var dataNumFormat = dataNumFormatSetting(_itemMeta.meta.DataItems.Measure, gDashboard.structure.MapOption.DASHBOARD_XML.WEB.FORCEDIRECTEXPAND_DATA_ELEMENT, measure.uniqueName, 'MEASURES');
						else
							var dataNumFormat = dataNumFormatSettingNoSuffix(_itemMeta.meta.DataItems.Measure, measure.uniqueName);
						var cubeUniqueName = dataCubeUniqueName(_itemMeta.meta.DataItems.Measure, measure.uniqueName);
						measureDataItemSetting(measure, index, 'forceDirectExpandValueList', forceDirectExpandNum, dataNumFormat, true, cubeUniqueName);
				});
				*/
				
				$.each(_itemMeta.dimensions, function(index, dimension) {
					var cubeUniqueName = dataCubeUniqueName(_itemMeta.meta.DataItems.Dimension, dimension.uniqueName);
					argumentDataItemSettingNoTopN(dimension, index, 'forceDirectExpandParameterList', forceDirectExpandNum, cubeUniqueName);
				});
				break;
			/* DOGFOOT syjin 카카오 지도 추가  20200820 */	
			case 'KAKAO_MAP':
				var kakaoMapNum = _itemMeta.ComponentName.replace('kakaoMapDashboardItem', '');
				//2020.09.18 syjin 카카오맵 불러오기 수정 dogfoot
				$.each(_itemMeta.latitudes, function(index, latitude) {
					var cubeUniqueName = dataCubeUniqueName(_itemMeta.meta.DataItems.Dimension, latitude.uniqueName);
					argumentDataItemSettingNoTopN(latitude, index, 'kakaoMapLatitudeList', kakaoMapNum, cubeUniqueName);
				});

				$.each(_itemMeta.longitudes, function(index, longitude) {
					var cubeUniqueName = dataCubeUniqueName(_itemMeta.meta.DataItems.Dimension, longitude.uniqueName);
					argumentDataItemSettingNoTopN(longitude, index, 'kakaoMapLongitudeList', kakaoMapNum, cubeUniqueName);
				});
				
				//2020.09.22 mksong dogfoot 카카오지도 주소필드 추가
				$.each(_itemMeta.addresses, function(index, address) {
					var cubeUniqueName = dataCubeUniqueName(_itemMeta.meta.DataItems.Dimension, address.uniqueName);
					addressFieldDataItemSettingNoTopN(address, index, 'kakaoMapAddressList', kakaoMapNum, cubeUniqueName);
				});
				
				$.each(_itemMeta.markerDimensions, function(index, markerDimension) {
					var cubeUniqueName = dataCubeUniqueName(_itemMeta.meta.DataItems.Dimension, markerDimension.uniqueName);
					argumentDataItemSettingNoTopN(markerDimension, index, 'kakaoMapParameterList', kakaoMapNum, cubeUniqueName);
				});
