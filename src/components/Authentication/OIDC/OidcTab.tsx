import React from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import { oidcLoginTabButton, oidcLoginTabTitle } from '../../../../app.config'
import Link from 'next/link'

const OidcTab: React.FC = () => {
  return (
    <div
      style={{
        height: '450px'
      }}
    >
      <Row>
        <Col
          className="left-column"
          style={{
            width: '540px',
            backgroundColor: '#EBEBEB',
            height: '450px',
            padding: '40px'
          }}
        >
          <h5 style={{ marginTop: 20, color: '#303030' }}>
            {oidcLoginTabTitle}
          </h5>

          <h6 style={{ marginTop: 50, color: '#303030' }}>
            If you are a member of an Education or Research institute, you can
            use your institute&lsquo;s credentials. Otherwise you can create an{' '}
            <Link
              style={{ color: '#48a4ed' }}
              href="https://login.eduid.nl/request/0971cff8-0b24-4428-8dcc-5dd54a85cc85"
              target={'_blank'}
            >
              EduID_NL
            </Link>{' '}
            account. For this last option you will be asked to install an App on
            your mobile device. This App is needed to complete the creation of
            the EduID_NL account.
          </h6>
          <h6 style={{ marginTop: 30, color: '#303030' }}>
            To use this platform you must be a member of the EnergySHR
            collaboration. Join the collaboration{' '}
            <Link
              style={{ color: '#48a4ed' }}
              href="https://sram.surf.nl/registration?collaboration=7f888309-8cca-4d91-aaf6-578cc98e3dd5"
              target={'_blank'}
            >
              here
            </Link>
            .
          </h6>
          <h6 style={{ marginTop: 30, color: '#303030' }}>
            When you are a member of the EnergySHR collaboration you can use
            your institute&lsquo;s (or EduID_NL as institute) credentials to
            login.
          </h6>
        </Col>
        <Col
          style={{ width: '540px', height: '450px' }}
          className="d-flex justify-content-center align-items-center"
        >
          <Button
            variant="primary"
            href={'/authentication/login'}
            style={{
              marginTop: '240px',
              borderRadius: '9px',
              backgroundColor: '#48A4ED',
              width: '60%'
            }}
          >
            {oidcLoginTabButton}
          </Button>
        </Col>
      </Row>
    </div>
  )
}

export default OidcTab
