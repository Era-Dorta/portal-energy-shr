import { AuthenticationStatus } from '@components/Authentication/authentication.types'

export interface OidcAddressClaim {
  formatted?: string
  street_address?: string
  locality?: string
  region?: string
  postal_code?: string
  country?: string
}
export interface OidcUserInfo {
  sub: string
  name?: string
  given_name?: string
  family_name?: string
  middle_name?: string
  nickname?: string
  preferred_username?: string
  profile?: string
  picture?: string
  website?: string
  email?: string
  email_verified?: boolean
  gender?: string
  birthdate?: string
  zoneinfo?: string
  locale?: string
  phone_number?: string
  phone_number_verified?: boolean
  address?: OidcAddressClaim
  updated_at?: number
  groups?: string[]
}

export type OidcUser<T extends OidcUserInfo = OidcUserInfo> = {
  user: T
  status: AuthenticationStatus
}
