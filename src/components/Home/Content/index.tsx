import React, { ReactElement } from 'react'
import styles from './index.module.css'
import Checkmark from '@images/checkmark.svg'
import HighlightBox from './HighlightBox'
import content from '../../../../content/pages/home/content.json'
import Container from '@components/@shared/atoms/Container'
import Markdown from '@components/@shared/Markdown'
import Button from '@shared/atoms/Button'

interface HomeContentData {
  teaser: {
    title: string
    text: string
  }
  points: {
    text: string
  }[]
  getInvolved: {
    title: string
    text: string
    buttonLabel: string
    link: string
  }
  firstTimeVisiting: {
    title: string
    text: string
    buttonLabel: string
    link: string
  }
}

export default function HomeContent(): ReactElement {
  const { teaser, points, firstTimeVisiting, getInvolved }: HomeContentData =
    content

  return (
    <Container className={styles.wrapper}>
      <div
        style={{
          display: 'flex',
          gap: '10.5%',
          paddingLeft: '5%'
        }}
      >
        <h2>{teaser.title}</h2>
        <p id={styles['who-is']}>Who is Energy SHR</p>
      </div>
      <div className={styles.container}>
        <div className={styles.teaser}>
          <Markdown text={teaser.text} />
        </div>
        <div className={styles.secondarySection}>
          <div className={styles.points}>
            {points.map((point, i) => (
              <span key={i}>
                <Checkmark className={styles.checkmark} />
                <Markdown className={styles.pointText} text={point.text} />
              </span>
            ))}
          </div>
        </div>
      </div>
      <Button className={styles.learnMore} style="text" arrow to="#">
        Learn more
      </Button>
      <div
        style={{
          width: '56.48%',
          display: 'flex',
          justifyContent: 'space-between',
          paddingLeft: '5%'
        }}
      >
        <HighlightBox
          icon="eye"
          title={getInvolved.title}
          body={getInvolved.text}
          buttonLabel={getInvolved.buttonLabel}
          link={getInvolved.link}
          style={{ background: '#48A4ED' }}
          className={styles.highlightBox}
          button={{ style: 'text', arrow: true }}
        />
        <HighlightBox
          icon="eye"
          title={firstTimeVisiting.title}
          body={firstTimeVisiting.text}
          buttonLabel={firstTimeVisiting.buttonLabel}
          link={firstTimeVisiting.link}
          style={{
            background: '#42DBCA'
          }}
          className={styles.highlightBox}
          button={{ style: 'text', arrow: true }}
        />
      </div>
    </Container>
  )
}
