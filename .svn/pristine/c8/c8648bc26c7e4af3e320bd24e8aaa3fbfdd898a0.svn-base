<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ page import="org.apache.commons.lang3.StringUtils" %>
<%@ page import="com.wise.context.config.Configurator"%>
<%@ page import="com.wise.common.util.BrowserUtils"%>
<%@ page import="com.wise.common.util.CoreUtils"%>
<%@ page import="com.wise.common.util.PageUtils"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="s" uri="http://www.springframework.org/security/tags"%>
<%
	request.setCharacterEncoding("utf-8");
	response.setHeader("Cache-Control", "no-store");
	response.setHeader("Cache-Control", "no-cache");
	response.setHeader("Pragma", "no-cache");
	response.setHeader("P3P","CP='CAO PSA CONi OTR OUR DEM ONL'");
	response.setDateHeader("Expires", 0);
	String linkParam = request.getParameter("linkParam");
	String agent = BrowserUtils.getType(request);
	String dxVer = (agent.equals("IE10"))?Configurator.getInstance().getConfig("devextreme.ver.IE10"):Configurator.getInstance().getConfig("devextreme.ver");
	String resourceDebug = (Configurator.getInstance().getConfigBooleanValue("wise.ds.js.resource.debug"))?".debug":"";
	
    // Custom destination URI path to redirect after successful login, but the destination URI path must not be an external URL for security.
    String destination = StringUtils.trimToEmpty(request.getParameter("destination"));
    if (StringUtils.lowerCase(destination).matches("^https?:.*$")) {
        destination = "";
    }
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

    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="title" content="Wise Intelligence" />
	<s:csrfMetaTags/>
	
    <link rel="icon" href="favicon.ico" type="image/x-icon" />
	
</head>
	<script>
		window.location.replace("${pageContext.request.contextPath}" + "/report/"+ "${param.reportId}" + "/viewer.do?USER=" + "${param.USER}" + "&assign_name=bWVpcw==");
	
	</script>

</body>
</html>

