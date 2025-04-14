package com.hotel.webapp.service.admin;

import com.hotel.webapp.dto.admin.request.AuthReq;
import com.hotel.webapp.dto.admin.response.AuthResponse;
import com.hotel.webapp.entity.User;
import com.hotel.webapp.exception.AppException;
import com.hotel.webapp.exception.ErrorCode;
import com.hotel.webapp.repository.MapUserRoleRepository;
import com.hotel.webapp.repository.RoleRepository;
import com.hotel.webapp.repository.UserRepository;
import com.hotel.webapp.service.admin.interfaces.AuthService;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthServiceImpl implements AuthService {
  private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);
  UserRepository userRepository;
  MapUserRoleRepository userRoleRepository;
  RoleRepository roleRepository;
  PasswordEncoder passwordEncoder;

  @NonFinal
  @Value("${jwt.signerKey}")
  protected String SIGNER_KEY;

  @Override
  public AuthResponse authenticate(AuthReq authReq) {
    var user = userRepository.findByEmail(authReq.getEmail())
                             .orElseThrow(() -> new AppException(ErrorCode.USER_NOTFOUND));
    boolean authenticated = passwordEncoder.matches(authReq.getPassword(), user.getPassword());

    if (!authenticated) {
      throw new AppException(ErrorCode.AUTHENTICATION_FAILED);
    }

    var token = generateToken(user, 24);

    String refreshToken = "";

    if (authReq.isRemember()) refreshToken = generateToken(user, 7 * 24);

    if (refreshToken != null && !refreshToken.isEmpty()) {
      user.setRefreshToken(refreshToken);
    }

    userRepository.save(user);

    return AuthResponse.builder().token(token).refreshToken(refreshToken).build();
  }

  @Override
  public int getAuthLogin() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    var username = auth.getName();
    User user = userRepository.findByEmail(username).orElseThrow(() -> new AppException(ErrorCode.USER_NOTFOUND));
    return user.getId();
  }

  private String generateToken(User user, int expiration) {
    var userRoles = userRoleRepository.findAllByUserId(user.getId());

    List<String> roles =
          userRoles.stream().map(ur -> roleRepository.findById(ur.getRoleId())
                                                     .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOTFOUND))
                                                     .getName()).toList();

    String roleString = String.join(",", roles);
    JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

    JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
          .subject(user.getEmail())
          .issuer("Phoebe dev")
          .issueTime(new Date())
          .expirationTime(new Date(Instant.now().plus(expiration, ChronoUnit.HOURS).toEpochMilli()))
          .claim("userId", user.getId())
          .claim("scope", roleString)
          .build();

    Payload payload = new Payload(jwtClaimsSet.toJSONObject());

    JWSObject jwsObject = new JWSObject(header, payload);

    try {
      jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
      return jwsObject.serialize();
    } catch (JOSEException e) {
      log.error("Cannot create token");
      throw new RuntimeException(e);
    }
  }
}
