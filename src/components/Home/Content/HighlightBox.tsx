import React, { CSSProperties, ReactElement } from 'react'
import styles from './HighlightBox.module.css'
import Eye from '@images/eye.svg'
import Catalogue from '@images/catalogueIcon.svg'
import Markdown from '@components/@shared/Markdown'
import Button, { ButtonProps } from '@components/@shared/atoms/Button'

const icons = {
  eye: <Eye />,
  catalogue: <Catalogue />
}

export default function HighlightBox({
  icon,
  title,
  body,
  buttonLabel,
  link,
  style,
  className,
  button,
  text
}: {
  icon: keyof typeof icons
  title: string
  body: string
  buttonLabel: string
  link: string
  style?: CSSProperties
  className?: string
  button?: ButtonProps
  text?: {
    className?: string
  }
}): ReactElement {
  return (
    <div style={style} className={`${styles.container} ${className}`}>
      <span className={styles.heading}>
        <span className={styles.icon}>{icons[icon]}</span>
        <h3>{title}</h3>
      </span>
      <Markdown {...text} text={body} />
      <Button {...button} to={link}>
        {buttonLabel}
      </Button>
    </div>
  )
}
