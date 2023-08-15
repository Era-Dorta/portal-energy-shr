export enum AuthenticationStatus {
  NOT_AUTHENTICATED = 'NOT_AUTHENTICATED',
  SIOP = 'SIOP',
  OIDC = 'OIDC'
}

export interface AuthenticationState {
  authenticationStatus: AuthenticationStatus
}
