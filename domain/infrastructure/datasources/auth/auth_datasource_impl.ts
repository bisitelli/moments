// src/domain/infrastructure/datasource/auth_remote_data_source.ts
// Remote implementation of AuthDataSource using the project's ApiService.
// This layer is responsible for building endpoints and passing the correct auth flag.
// Do not add domain logic here.

import { ApiService } from "../../../services/api_service";
import { RefreshTokenRequest } from "../../../model/dto/auth/refresh_token_auth_request";
import { UserAuthRequest } from "../../../model/dto/auth/user_auth_request";
import { UserAuthResponse } from "../../../model/dto/auth/user_auth_response";
import { AuthDataSource } from "@/domain/datasources/auth/auth_datasource";

export class AuthDataSourceImpl implements AuthDataSource {
  constructor(private readonly api: ApiService) {}

  login(request: UserAuthRequest): Promise<string> {
    // Public endpoint: do not attach Authorization header.
    return this.api.post<string>("/auth/login", request, /* auth */ false);
  }

  validateEmailCode(
    verificationCode: string,
    request: UserAuthRequest
  ): Promise<UserAuthResponse> {
    // Controller expects query param + request body.
    const endpoint = `/auth/validate-code?verificationCode=${encodeURIComponent(
      verificationCode
    )}`;
    return this.api.post<UserAuthResponse>(endpoint, request, /* auth */ false);
  }

  register(request: UserAuthRequest): Promise<void> {
    // Public endpoint.
    return this.api.post<void>("/auth/register", request, /* auth */ false);
  }

  refreshToken(request: RefreshTokenRequest): Promise<UserAuthResponse> {
    // Refresh typically does not use the current access token.
    return this.api.post<UserAuthResponse>(
      "/auth/refresh-token",
      request,
      /* auth */ false
    );
  }

  logout(): Promise<void> {
    // Protected endpoint: attach Authorization header.
    return this.api.post<void>("/auth/logout", {}, /* auth */ true);
  }
}
