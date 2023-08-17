import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AuthenticationStatus } from './authentication.types'
import { logout } from '../../store/actions/authentication.actions'
import { RootState } from '../../store'
import { useSIOP } from '@components/Authentication/SIOP/siopAuth'
import LoginModal from '@components/Authentication/index'
import { isOIDCActivated } from '../../../app.config'
import Button from '@shared/atoms/Button'
import { useOidcAuth } from '@components/Authentication/OIDC/oidcAuth'

export default function Auth({ className }: { className?: string }) {
  const { logout: oidcLogout } = isOIDCActivated
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useOidcAuth()
    : undefined
  const { logout: siopLogout } = useSIOP()
  const dispatch = useDispatch()
  const authenticationState = useSelector(
    (state: RootState) => state.authentication.authenticationStatus
  )

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleLogoutClick = async () => {
    switch (authenticationState) {
      case AuthenticationStatus.OIDC:
        oidcLogout()
        break
      case AuthenticationStatus.SIOP:
        siopLogout()
        dispatch(logout()) // todo: check whether it is needed for SIOP, not needed for OIDC
        break
    }
  }

  const handleLoginClick = () => setIsModalOpen(true)
  const handleModalCloseClick = () => setIsModalOpen(false)

  return (
    <>
      {authenticationState === AuthenticationStatus.NOT_AUTHENTICATED ? (
        <>
          <Button style="text" className={className} onClick={handleLoginClick}>
            Login
          </Button>
          {isModalOpen && (
            <LoginModal
              showModal={true}
              onCloseClicked={handleModalCloseClick}
            />
          )}
        </>
      ) : (
        <Button style="text" className={className} onClick={handleLogoutClick}>
          Logout
        </Button>
      )}
    </>
  )
}
