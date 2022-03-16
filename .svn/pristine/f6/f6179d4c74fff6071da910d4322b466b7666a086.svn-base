package com.wise.sso.filter;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.GenericFilterBean;

import com.wise.authn.User;
import com.wise.sso.util.SpringSecurityUtils;

/**
 * WISE Preauthorization filter which checks if the User object attribute in the HttpSession, and sets
 * {@code SecurityContext} for the user if the user was already authenticated.
 */
public class WisePreauthorizationFilter extends GenericFilterBean {

    private static Logger log = LoggerFactory.getLogger(WisePreauthorizationFilter.class);

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        // If authenticated already by Spring Security, skip it.
        if (SpringSecurityUtils.isAuthenticated()) {
            chain.doFilter(request, response);
            return;
        }

        SecurityContext oldSecurityContext = SecurityContextHolder.getContext();
        SecurityContext newSecurityContext = null;

        try {
            final User user = SpringSecurityUtils.getUserFromSession((HttpServletRequest) request);

            if (user != null && !user.isByPassed()) {
                newSecurityContext = SpringSecurityUtils.createSecurityContextFromUser(user);
            }

            if (newSecurityContext != null) {
                SecurityContextHolder.setContext(newSecurityContext);
            }

            chain.doFilter(request, response);
        }
        finally {
            if (newSecurityContext != null) {
                SecurityContextHolder.setContext(oldSecurityContext);
            }
        }
    }
}
