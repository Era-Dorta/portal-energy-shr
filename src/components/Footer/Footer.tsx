import Button from '@components/@shared/atoms/Button'
import Container from '@components/@shared/atoms/Container'
import Logo from '@components/@shared/atoms/Logo'
import { useMarketMetadata } from '@context/MarketMetadata'
import React, { ReactElement } from 'react'
import styles from './Footer.module.css'

export default function Footer(): ReactElement {
  const { siteContent } = useMarketMetadata()
  const { footer } = siteContent

  return (
    <footer className={styles.footer}>
      <div className={styles.topLine}></div>
      <Container className={styles.container}>
        <div className={styles.logo}>
          <Logo />
        </div>
        <div className={styles.content}>
          <div className={styles.partnerTextContainer}>{footer.partner}</div>
          <div className={styles.partnerImageContainer}>
            <div>
              <img src="/images/partners/1-TU-Delft_logo.png" alt="TU Delft" />
            </div>
            <div>
              <img
                src="/images/partners/2-erasmus_uni_logo.png"
                alt="Erasmus University"
              />
            </div>
          </div>
        </div>
        <div className={styles.linkContainer}>
          {footer.links.map((link, index) => (
            <Button
              className={styles.link}
              key={index}
              style="text"
              to={link.link}
            >
              {link.label}
            </Button>
          ))}
        </div>
      </Container>
    </footer>
  )
}
