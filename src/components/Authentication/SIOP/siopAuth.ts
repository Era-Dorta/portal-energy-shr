import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { setAuthState } from '../../../store/actions/authentication.actions'
import { AuthenticationStatus } from '@components/Authentication/authentication.types'
import { Web3ProviderValue } from '@context/Web3'

export const useSIOP = (web3: Web3ProviderValue) => {
  const dispatch = useDispatch()
  const authenticationState = useSelector(
    (state: RootState) => state.authentication.authenticationStatus
  )

  const logout = () => {
    if (authenticationState !== AuthenticationStatus.NOT_AUTHENTICATED) {
      dispatch(setAuthState(AuthenticationStatus.NOT_AUTHENTICATED))
      web3.connect(true)
    }
  }

  return {
    logout,
    isAuthenticated:
      authenticationState !== AuthenticationStatus.NOT_AUTHENTICATED
  }
}
