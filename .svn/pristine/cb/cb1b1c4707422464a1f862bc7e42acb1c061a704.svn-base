package com.wise.common.web.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

/**
 * A filter implementation which delegates the calls to the filter bean
 * found in the spring web application context by the {@code beanName} init parameter.
 */
public class DelegatingBeanFilter implements Filter {

    private static final Logger log = LoggerFactory.getLogger(DelegatingBeanFilter.class);

    private FilterConfig filterConfig;
    private String beanName;
    private volatile Filter delegateFilterBean;

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        this.filterConfig = filterConfig;
        beanName = StringUtils.trimToNull(filterConfig.getInitParameter("beanName"));
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain)
            throws IOException, ServletException {
        Filter filterBean = delegateFilterBean;

        if (filterBean == null && beanName != null) {
            synchronized (this) {
                filterBean = delegateFilterBean;

                if (filterBean == null) {
                    try {
                        final WebApplicationContext appContext = getWebApplicationContext(
                                request.getServletContext());
                        filterBean = (Filter) appContext.getBean(beanName);
                        filterBean.init(filterConfig);
                        delegateFilterBean = filterBean;
                    }
                    catch (Exception e) {
                        log.error("No filter bean found to delegate. beanName: {}", beanName, e);
                    }
                }
            }
        }

        if (delegateFilterBean == null) {
            throw new ServletException("No delegating filter bean.");
        }

        delegateFilterBean.doFilter(request, response, filterChain);
    }

    @Override
    public void destroy() {
        if (delegateFilterBean != null) {
            delegateFilterBean.destroy();
            delegateFilterBean = null;
        }
    }

    private WebApplicationContext getWebApplicationContext(final ServletContext servletContext) {
        return WebApplicationContextUtils.findWebApplicationContext(servletContext);
    }
}
