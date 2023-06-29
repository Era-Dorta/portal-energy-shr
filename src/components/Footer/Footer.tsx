import Button from '@components/@shared/atoms/Button'
import Container from '@components/@shared/atoms/Container'
import Logo from '@components/@shared/atoms/Logo'
import React, { ReactElement } from 'react'
import styles from './Footer.module.css'

export default function Footer(): ReactElement {
  return (
    <footer className={styles.footer}>
      <div
        style={{
          height: '2.27rem',
          borderTop: '2px solid black',
          width: '90%',
          marginLeft: '6%'
        }}
      ></div>
      <Container className={styles.container}>
        <div className={styles.logo}>
          <Logo />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignSelf: 'end',
            width: '50rem',
            paddingTop: 'var(--spacer)',
            marginRight: '8rem'
          }}
        >
          <div
            style={{
              color: 'var(--sphereon-black)',
              fontSize: 'var(--font-size-16)',
              fontFamily: 'var(--font-family-sans-serif)',
              fontWeight: 'var(--font-weight-semi-bold-600)',
              height: '3.47rem'
            }}
          >
            Centre for Energy System Intelligence
          </div>
          <div
            style={{
              display: 'flex',
              gap: '4rem'
            }}
          >
            <div>
              <img
                style={{
                  maxWidth: '100%',
                  height: '3.4rem',
                  width: '6.94rem',
                  objectFit: 'contain'
                }}
                src="/images/partners/1-TU-Delft_logo.png"
              />
            </div>
            <div>
              <img
                style={{
                  maxWidth: '100%',
                  height: '4.8rem',
                  width: '5.14rem',
                  objectFit: 'contain'
                }}
                src="/images/partners/2-erasmus_uni_logo.png"
              />
            </div>
          </div>
        </div>
        <div className={styles.links}>
          <Button style="text" to="/about">
            About
          </Button>
          <Button style="text" to="/catalogue">
            Catalogue
          </Button>
          <Button style="text" to="/#">
            Quick start guide
          </Button>
        </div>
      </Container>
    </footer>
  )
}
