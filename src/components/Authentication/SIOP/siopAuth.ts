import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { setAuthState } from '../../../store/actions/authentication.actions'
import { AuthenticationStatus } from '@components/Authentication/authentication.types'

export const useSIOP = () => {
  const dispatch = useDispatch()
  const authenticationState = useSelector(
    (state: RootState) => state.authentication.authenticationStatus
  )

  const logout = () => {
    if (authenticationState !== AuthenticationStatus.NOT_AUTHENTICATED) {
      dispatch(setAuthState(AuthenticationStatus.NOT_AUTHENTICATED))
    }
  }

  return {
    logout,
    isAuthenticated:
      authenticationState !== AuthenticationStatus.NOT_AUTHENTICATED
  }
}
