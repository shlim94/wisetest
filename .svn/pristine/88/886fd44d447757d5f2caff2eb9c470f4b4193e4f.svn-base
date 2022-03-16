<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ page import="com.wise.context.config.Configurator"%>
<%@ page import="com.wise.common.util.BrowserUtils"%>
<%@ page import="com.wise.common.util.CoreUtils"%>
<%@ page import="com.wise.common.util.PageUtils"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="s" uri="http://www.springframework.org/security/tags"%>
<%
	request.setCharacterEncoding("utf-8");
	response.setHeader("P3P","CP='CAO PSA CONi OTR OUR DEM ONL'");
	response.setHeader("Expires", "Sat, 6 May 1995 12:00:00 GMT"); 
	response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
	response.addHeader("Cache-Control", "post-check=0, pre-check=0"); 
	response.setHeader("Pragma", "no-cache");
	String linkParam = request.getParameter("linkParam");
	String agent = BrowserUtils.getType(request);
	String dxVer = (agent.equals("IE10"))?Configurator.getInstance().getConfig("devextreme.ver.IE10"):Configurator.getInstance().getConfig("devextreme.ver");
	String resourceDebug = (Configurator.getInstance().getConfigBooleanValue("wise.ds.js.resource.debug"))?".debug":"";
	String companyname = Configurator.getInstance().getConfig("wise.ds.solution.companyname") != null ? Configurator.getInstance().getConfig("wise.ds.solution.companyname"):"";
	String devVersion[] = dxVer.split("\\.");
	boolean dxTwety = (Integer.parseInt(devVersion[0])>=20);
	boolean minFile = Configurator.getInstance().getConfigBooleanValue("wise.ds.js.resource.scriptcompress");
	//2020.11.04 mksong 로컬에서는  item js 정적 import 하도록 수정 dogfoot
	boolean dynamicImportCheck = Configurator.getInstance().getConfigBooleanValue("wise.ds.js.resource.dynamicimport");
	boolean checkstatic = Configurator.getInstance().getConfigBooleanValue("wise.ds.js.resource.staticwebscript");
%>
<c:set var="domain" value="<%=Configurator.getInstance().getFullDomain(request)%>" />
<c:set var="visibleTitle" value="<%=Configurator.getInstance().getConfigBooleanValue(\"WISE.libs.Dashboard.report.title.visible\")%>" />
<c:choose>
	<c:when test="${visibleTitle}">
		<c:set var="visibleTitleStyle" value="" />
	</c:when>
	<c:otherwise>
		<c:set var="visibleTitleStyle" value="remove-title" />
	</c:otherwise>
</c:choose>
<c:set var="globalizeVer" value="<%=Configurator.getInstance().getConfig(\"globalize.ver\")%>" />
<c:set var="dxChartIntegrated" value="<%=Configurator.getInstance().getConfigBooleanValue(\"devextreme.chart.integrated\")%>" />
<c:set var="dxVer" value="<%=dxVer%>" />
<c:set var="resourceDebug" value="<%=resourceDebug%>" />
<html lang="ko">
<head>
    <title>${mainTitle}</title>

    <meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
	<meta http-equiv="Content-Script-Type" content="text/javascript">
	<meta http-equiv="Content-Style-Type" content="text/css">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="apple-mobile-web-app-title" content="${mainTitle}" />
	<meta name="keywords" content="BIportal">
	<meta name="description" content="BIportal">
	<meta http-equiv="Expires" content="-1"> 
	<meta http-equiv="Pragma" content="no-cache"> 
	<meta http-equiv="Cache-Control" content="No-Cache">
	<s:csrfMetaTags/>
	
    <link rel="icon" href="favicon.ico" type="image/x-icon" />
	
	<!-- DOGFOOT ktkang 라이브러리 변경  20200221 -->
	<script type="text/javascript" src="${pageContext.request.contextPath}/resources/jquery/jquery-3.4.1.min.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/resources/jquery/jquery.cookie.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/resources/dx/${dxVer}/dx.all${resourceDebug}.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/resources/main/js/lib/loadAnimation.js"></script>
    <script type="text/javascript"  src="${pageContext.request.contextPath}/resources/main/js/scripts.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/js/core/WISE.js"></script>
    
    <!-- DOGFOOT MKSONG editmode undefined 오류 수정 20200805 -->
<%--     <script type="text/javascript" src="${pageContext.request.contextPath}/resources/main/js/scripts.js"></script> --%>
<%-- 	<script type="text/javascript" src="${pageContext.request.contextPath}/resources/main/js/lib/jquery.scrollbar.js"></script>
 --%>
	<link rel="shortcut icon" href="${pageContext.request.contextPath}/resources/main/images/logo.png" />
<%-- 	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/resources/dx/${dxVer}/css/dx.common.css" /> --%>
<%-- 	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/resources/dx/${dxVer}/css/dx.light.css" /> --%>
<%--     <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/resources/main/css/style.css" /> --%>
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/resources/dx/${dxVer}/css/dx.common.css" />
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/resources/dx/${dxVer}/css/dx.light.css" />
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/resources/main/css/style.css" />
    
</head>

<body>
	<div class="modal-body" style="height: 100%; overflow: hidden;">
		<div class="row" style="height: 100%">
			<div class="column" style="width: 100%; padding: 0px">
				<div class="modal-article" style="margin-top: 0px;">
					<div class="tab-title rowColumn" style="height: 40px;">
						<ul class="col-2">
							<li rel="panelReportA-1"><a href="#">공용보고서</a></li>
							<li rel="panelReportA-2"><a href="#">개인보고서</a></li>
						</ul>
					</div>
					<div class="panel-inner" style="height: calc(100% - 40px)">
						<div id="panelReportA" class="tab-component">
							<div class="panelReportA-1 tab-content">
								<div id="folder_tree"></div>
							</div>
							<div class="panelReportA-2 tab-content">
								<div id="user_folder_tree"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- #wrap e -->
</body>
</html>

<script type="text/javascript">
	var userJsonObject = JSON.parse('${returnArr}');
	var reportType = 'Editor';
	//2020.03.03 mksong KERIS 출처 내용에 포함 dogfoot
	var srcFolderNm = '${srcFolderNm}';
	var item_type="",report_type="",fld_type="", report_id="";
	var context = "";
	$.ajax({
		type : 'POST',
		async : false,
		url : '${pageContext.request.contextPath}/js/getConstants.do',
		contentType: false,
		processData: false,
		success : function(_data) {
		    if(typeof _data == "string"){
		      _data = JSON.parse(_data);
		    }
			context = _data.context;
		}
	});
	
	tabUi();

	var param = {
		/* DOGFOOT ktkang 개인보고서 기능 추가  20200106 */
		'fld_type':'ALL',
		'user_id': userJsonObject.userId,
		'report_type': 'ALL',
	}; 
	$.ajax({
    	method : 'POST',
        url: context + '/report/getReportList.do',
        dataType: "json",
        data:param,
        success: function(result) {
        	var pubResult = result.pubReport;
        	var userResult = result.userReport;
        	item_type="",report_type="",fld_type="", report_id="";
        	var tempPubResult=[], tempUserResult=[];

        	/* DOGFOOT ktkang 보고서 불러오기 창 닫았다 열면 아이콘 사라지는 버그 수정  20200120 */
        	$.each(pubResult,function(_i,_items){
				switch(_items.TYPE){
				case 'REPORT':
					/*dogfoot 통계 분석 추가 shlim 20201102*/
					if(_items.REPORT_TYPE == 'DashAny' || _items.REPORT_TYPE == 'StaticAnal'){
						_items['icon']= context+'/resources/main/images/ico_squariFied.png';
					}else if(_items.REPORT_TYPE == 'AdHoc'){
						_items['icon']= context+'/resources/main/images/ico_atypical01.png';
					}else if(_items.REPORT_TYPE == 'Spread' || _items.REPORT_TYPE == 'Excel'){
						_items['icon']= context+'/resources/main/images/excelFile_icon.png';
					}else if(_items.REPORT_TYPE == 'DSViewer'){
						_items['icon']= context+'/resources/main/images/ico_data.png';
					}

					break;
				case 'FOLDER':
					_items['icon']= context+'/resources/main/images/ico_load.png';
					break;
				}

				if(reportType == 'Spread' || reportType == 'Excel'){
					if(_items.REPORT_TYPE == 'Spread' || _items.REPORT_TYPE == 'Excel' || _items.TYPE == 'FOLDER'){
						tempPubResult.push(_items);
					}
				}else{
						tempPubResult.push(_items);
				}

			});

        	$.each(userResult,function(_i,_items){
				switch(_items.TYPE){
				case 'REPORT':
					/*dogfoot 통계 분석 추가 shlim 20201102*/
					if(_items.REPORT_TYPE == 'DashAny' || _items.REPORT_TYPE == 'StaticAnal'){
						_items['icon']= context+'/resources/main/images/ico_squariFied.png';
					}else if(_items.REPORT_TYPE == 'AdHoc'){
						_items['icon']= context+'/resources/main/images/ico_atypical01.png';
					}else if(_items.REPORT_TYPE == 'Spread' || _items.REPORT_TYPE == 'Excel'){
						_items['icon']= context+'/resources/main/images/excelFile_icon.png';
					}else if(_items.REPORT_TYPE == 'DSViewer'){
    					_items['icon']= context+'/resources/main/images/ico_data.png';		  
    				}

					break;
				case 'FOLDER':
					_items['icon']= context+'/resources/main/images/ico_load.png';
					break;
				}

				
				tempUserResult.push(_items);
			});

        	pubResult = tempPubResult;
    		userResult = tempUserResult
    		var timeout = '';

        	$('#folder_tree').dxTreeView({
        		dataSource:pubResult,
        		dataStructure:'plain',
        		keyExpr: "uniqueKey",
        		parentIdExpr: "upperKey",
        		rootValue: "F_0",
        		displayExpr: "TEXT",
        		searchEnabled: true,
				searchMode : "contains",
				searchTimeout:undefined,
				searchValue:"",
				/* DOGFOOT 20210422 불러오기 검색 enter로 변경 syjin*/
				searchEditorOptions: { valueChangeEvent: "change" },
				noDataText:"조회된 보고서가 없습니다.",
        		height:"100%",
        		showCloseButton: false,
        		onItemClick:function(_e){
        			report_id = _e.itemData['ID'];
        			item_type = _e.itemData['TYPE'];
        			report_type = _e.itemData['REPORT_TYPE'];
        			fld_type = 'PUBLIC';
        			report_nm = _e.itemData['TEXT'];
        		},
        		onContentReady: function(){
        			$('#folder_tree .dx-texteditor-container').css('height', '35px');
        			/*dogfoot DevExtreme 서치박스 엔터키 입력 안되는 오류로인한 이벤트 분리  shlim 20210518*/
        			$('#folder_tree').find("input").keyup(function(event) {
						if (event.keyCode === 13) {
							$('#folder_tree').find("input").val()
							$('#folder_tree').dxTreeView("instance").option("searchValue",$('#folder_tree').find("input").val());
						}
					});
        		}
        	});

        	$('#user_folder_tree').dxTreeView({
        		dataSource:userResult,
        		dataStructure:'plain',
        		keyExpr: "uniqueKey",
        		parentIdExpr: "upperKey",
        		rootValue: "F_0",
        		displayExpr: "TEXT",
        		searchEnabled: true,
				searchMode : "contains",
				searchTimeout:undefined,
				searchValue:"",
				/* DOGFOOT 20210422 불러오기 검색 enter로 변경 syjin*/
				searchEditorOptions: { valueChangeEvent: "change" },
				noDataText:"조회된 보고서가 없습니다.",
        		height:"100%",
        		showCloseButton: false,
        		onItemClick:function(_e){
        			report_id = _e.itemData['ID'];
        			item_type = _e.itemData['TYPE'];
        			report_type = _e.itemData['REPORT_TYPE'];
        			report_nm = _e.itemData['TEXT'];
        			fld_type = 'USER';
        		},
        		onContentReady: function(){
        			$('#user_folder_tree .dx-texteditor-container').css('height', '35px');
        			/*dogfoot DevExtreme 서치박스 엔터키 입력 안되는 오류로인한 이벤트 분리  shlim 20210518*/
        			$('#user_folder_tree').find("input").keyup(function(event) {
						if (event.keyCode === 13) {
							$('#user_folder_tree').find("input").val()
							$('#user_folder_tree').dxTreeView("instance").option("searchValue",$('#user_folder_tree').find("input").val());
						}
					});
        		}
        	});
        }
    });
	
	var csrfToken = $("meta[name='_csrf']").attr("content");
	var csrfHeader = $("meta[name='_csrf_header']").attr("content");
</script> 


