// src/domain/infrastructure/repository/auth_repository_impl.ts
// Concrete implementation of AuthRepository.
// Keeps business/application logic minimal; delegates transport to the DataSource.

import { AuthDataSource } from "@/domain/datasources/auth/auth_datasource";
import { RefreshTokenRequest } from "@/domain/model/dto/auth/refresh_token_auth_request";
import { TokenRequest } from "@/domain/model/dto/auth/token_request";
import { UserAuthRequest } from "@/domain/model/dto/auth/user_auth_request";
import { UserAuthResponse } from "@/domain/model/dto/auth/user_auth_response";
import { AuthRepository } from "@/domain/repository/auth/auth_repository";


export class AuthRepositoryImpl implements AuthRepository {
  
  constructor(private readonly ds: AuthDataSource) {}

  externalLogin(request: TokenRequest): Promise<UserAuthResponse> {
    return this.ds.googleLogin(request);
  }

  requestLoginEmail(request: UserAuthRequest): Promise<void> {
    return this.ds.login(request);
  }

  verifyEmailCode(
    code: string,
    request: UserAuthRequest
  ): Promise<UserAuthResponse> {
    return this.ds.validateEmailCode(code, request);
  }

  register(request: UserAuthRequest): Promise<void> {
    return this.ds.register(request);
  }

  refreshToken(request: RefreshTokenRequest): Promise<UserAuthResponse> {
    return this.ds.refreshToken(request);
  }

  logout(): Promise<void> {
    return this.ds.logout();
  }
}
