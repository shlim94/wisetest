package com.wise.sso.util;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import com.wise.authn.User;
import com.wise.context.config.Configurator;

public final class SpringSecurityUtils {

    private SpringSecurityUtils() {
    }

    /**
     * Return true if there is a {@code SecurityContext} in the context and it is authenticated already.
     * 
     * @return true if there is a {@code SecurityContext} in the context and it is authenticated already
     */
    public static boolean isAuthenticated() {
        SecurityContext securityContext = SecurityContextHolder.getContext();

        if (securityContext != null) {
            final Authentication authentication = securityContext.getAuthentication();

            if (authentication != null && authentication.isAuthenticated()) {
                return true;
            }
        }

        return false;
    }

    /**
     * Return the {@code User} object from the HttpSession if the user was already authenticated by WI.
     * 
     * @param request servlet request
     * @return the {@code User} object from the HttpSession if the user was already authenticated by WI
     */
    public static User getUserFromSession(final HttpServletRequest request) {
        final HttpSession session = request.getSession(false);

        if (session == null) {
            return null;
        }

        final String authnKey = Configurator.getInstance().getConfig("wise.ds.authentication.key",
                "USER");
        final String sessionUserKey = Configurator.Constants.SESSION_USER_PREFIX + authnKey;

        return (User) session.getAttribute(sessionUserKey);
    }

    /**
     * Create a Spring {@code SecurityContext} from the WI's {@code User}.
     * 
     * @param a Spring {@code SecurityContext} from the WI's {@code User}
     */
    public static SecurityContext createSecurityContextFromUser(final User user) {
        if (user == null) {
            throw new IllegalArgumentException("User is null");
        }

        final SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        final List<GrantedAuthority> authorities = new ArrayList<>();

        if (user.getGRP_ID() == 1000 || "ADMIN".equals(user.getRUN_MODE())) {
            authorities.add(new SimpleGrantedAuthority("ROLE_admin"));
        }

        final UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                user.getUSER_ID(), "", authorities);
        securityContext.setAuthentication(authentication);

        return securityContext;
    }
}
