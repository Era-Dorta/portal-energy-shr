import React, { useState } from 'react'
import { Modal, Nav } from 'react-bootstrap'
import SiopTab from './SIOP/SiopTab'
import { AuthorizationResponsePayload } from '@sphereon/did-auth-siop'
import OidcTab from './OIDC/OidcTab'
import {
  oidcModalTabName,
  isOIDCActivated,
  isSiopActivated
} from '../../../app.config'
import { useOidcAuth } from '@components/Authentication/OIDC/oidcAuth'
import { useWeb3 } from '@context/Web3'

interface LoginModalProps {
  onCloseClicked?: () => void
  showModal: boolean
}

const LoginModal = ({ onCloseClicked, showModal }: LoginModalProps) => {
  const [payload, setPayload] = useState<AuthorizationResponsePayload>()
  const web3 = useWeb3()
  const showOIDC = isOIDCActivated
  const showSIOP = isSiopActivated
  const initialTab = showOIDC ? 'oidc' : 'siop'
  const [activeTab, setActiveTab] = useState(initialTab)

  let isOidcAuthenticated: boolean
  if (isOIDCActivated) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { isAuthenticated: oidcAuthenticated } = useOidcAuth(web3)
    isOidcAuthenticated = oidcAuthenticated
  }
  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  const handleClose = () => {
    onCloseClicked?.()
  }

  return (
    <Modal show={showModal && !isOidcAuthenticated} onHide={handleClose}>
      <Modal.Header closeButton onClick={handleClose}>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ height: '100%' }}>
        <Nav variant="tabs" activeKey={activeTab} onSelect={handleTabChange}>
          {showOIDC && (
            <Nav.Item>
              <Nav.Link eventKey="oidc">{oidcModalTabName}</Nav.Link>
            </Nav.Item>
          )}
          {showSIOP && (
            <Nav.Item>
              <Nav.Link eventKey="siop">SIOP</Nav.Link>
            </Nav.Item>
          )}
        </Nav>
        {activeTab === 'siop' && showSIOP && (
          <SiopTab onSignInComplete={setPayload} />
        )}
        {activeTab === 'oidc' && showOIDC && <OidcTab />}
      </Modal.Body>
    </Modal>
  )
}

export default LoginModal
