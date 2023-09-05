import React, { ReactElement, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { OnboardingStep } from '..'
import { getErrorMessage } from '@utils/onboarding'
import StepBody from '../StepBody'
import StepHeader from '../StepHeader'
import { useWeb3 } from '@context/Web3'
import content from '../../../../../content/onboarding/steps/connectAccount.json'
import { LoggerInstance } from '@oceanprotocol/lib'

export default function ConnectAccount(): ReactElement {
  const {
    title,
    subtitle,
    body,
    image,
    buttonLabel,
    buttonSuccess
  }: OnboardingStep = content

  const { accountId, connect, web3Provider, web3Modal, networkId } = useWeb3()
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    if (accountId && web3Modal.getUserOptions()) {
      setCompleted(true)
    } else {
      setCompleted(false)
    }
  }, [accountId])

  const connectAccount = async () => {
    setLoading(true)
    try {
      web3Provider?.logout()
    } catch (error) {}
    try {
      await connect()
    } catch (error) {
      toast.error(
        getErrorMessage({
          accountId,
          web3Provider: !!web3Provider,
          networkId
        })
      )
      LoggerInstance.error(error)
    } finally {
      setLoading(false)
    }
  }

  const actions = [
    {
      buttonLabel,
      buttonAction: async () => await connectAccount(),
      successMessage: buttonSuccess,
      loading,
      completed
    }
  ]

  return (
    <div>
      <StepHeader title={title} subtitle={subtitle} />
      <StepBody body={body} image={image} actions={actions} />
    </div>
  )
}
