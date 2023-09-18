import React, { ReactElement } from 'react'
import Page from '@components/@shared/Page'
import OnboardingSection from '@components/@shared/Onboarding'
import { useRouter } from 'next/router'
import QuickstartPage from '@components/Quickstart'

export default function PageQuickstart(): ReactElement {
  const router = useRouter()

  return (
    <Page uri={router.route}>
      <QuickstartPage />
    </Page>
  )
}
