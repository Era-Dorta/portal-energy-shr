/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from 'react'
import { AuthenticationStatus } from '@components/Authentication/authentication.types'
import { OidcUser, OidcUserInfo } from '@components/Authentication/OIDC/types'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { setAuthState } from '../../../store/actions/authentication.actions'
import { useRouter } from 'next/router'
import { isOIDCActivated } from 'app.config'

export const useOidcAuth = <T extends OidcUserInfo = OidcUserInfo>() => {
  const router = useRouter()

  const logout = () => {
    if (isOIDCActivated) {
      router.push('/authentication/logout')
    }
  }
  if (!isOIDCActivated) {
    return {
      oidcUser: undefined,
      oidcUserLoadingState: AuthenticationStatus.NOT_AUTHENTICATED,
      logout,
      isAuthenticated: false
    }
  }

  const dispatch = useDispatch()
  const authenticationState = useSelector(
    (state: RootState) => state.authentication.authenticationStatus
  )

  const [oidcUser, setOidcUser] = useState<OidcUser<OidcUserInfo>>({
    user: null,
    status: AuthenticationStatus.NOT_AUTHENTICATED
  })

  const [oidcUserId, setOidcUserId] = useState<string>('')

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    console.log(`Querying user ${oidcUserId}, ${oidcUser} from backend....`)

    fetch('/authentication/user', {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    })
      .then((result) => {
        if (!result.ok) {
          if (
            authenticationState === AuthenticationStatus.NOT_AUTHENTICATED &&
            oidcUser === null
          ) {
            console.log(`DOING NOTHING. State didn't change`)
            return
          }
          console.log('No User present or an error occurred.')
          setOidcUser({
            user: null,
            status: AuthenticationStatus.NOT_AUTHENTICATED
          })
          dispatch(setAuthState(AuthenticationStatus.NOT_AUTHENTICATED))
        } else {
          result.json().then((oidc: OidcUserInfo) => {
            if (
              authenticationState !== AuthenticationStatus.NOT_AUTHENTICATED &&
              oidcUser !== null
            ) {
              console.log(
                `DOING NOTHING. State didn't change for ${oidcUserId}, ${JSON.stringify(
                  oidcUser
                )}`
              )
              return
            }
            console.log(`User found. Dispatching authenticated state`)
            if (oidc.name || oidc.email) {
              setOidcUser({ user: oidc, status: AuthenticationStatus.OIDC })
              dispatch(setAuthState(AuthenticationStatus.OIDC))
            } else {
              console.error(
                'User result was successful, but we did not get a user with e-mail address or a name. So not logging in '
              )
            }
          })
        }
      })
      .catch((err) => {
        console.log(`No User present ${err}.`)
        setOidcUser({
          user: null,
          status: AuthenticationStatus.NOT_AUTHENTICATED
        })
        dispatch(setAuthState(AuthenticationStatus.NOT_AUTHENTICATED))
      })

    let isMounted = true

    return () => {
      isMounted = false
    }
  }, [oidcUserId])

  const reloadOidcUser = () => {
    setOidcUserId(oidcUserId + ' ')
  }

  return {
    oidcUser: oidcUser.user,
    oidcUserLoadingState: oidcUser.status,
    reloadOidcUser,
    logout,
    isAuthenticated: authenticationState === AuthenticationStatus.OIDC
  }
}
