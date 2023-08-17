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
            height: '450px'
          }}
        >
          <h5 style={{ marginTop: 60, marginBottom: 25, color: '#303030' }}>
            {oidcLoginTabTitle}
          </h5>

          <h6 style={{ marginTop: 60, color: '#303030' }}>
            To use this platform you must be a member of the EnergySHR
            collaboration.
          </h6>
          <h6>
            Join the collaboration{' '}
            <Link href="https://sram.surf.nl/registration?collaboration=7f888309-8cca-4d91-aaf6-578cc98e3dd5">
              here
            </Link>
            .
          </h6>
          <h6 style={{ marginTop: 25, marginBottom: 25, color: '#303030' }}>
            You can create an EduID if you are not a member of an Education or
            Research institute. See{' '}
            <Link href="https://sram.surf.nl">SRAM</Link> for more information.
          </h6>
          <h6>
            If you are already a member of the EnergySHR collaboration you can
            use your SRAM credentials to login.
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
              marginTop: '200px',
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
