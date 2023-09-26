import Web3HttpProvider, { HttpProviderOptions } from 'web3-providers-http'
import { JsonRpcPayload, JsonRpcResponse } from 'web3-core-helpers'
import { LoggerInstance } from '@oceanprotocol/lib'
import {
  AuthenticationState,
  AuthenticationStatus
} from '@components/Authentication/authentication.types'

export interface HeadlessProviderOpts extends HttpProviderOptions {
  host: string
}

export function createHeadlessWeb3Provider(opts: HeadlessProviderOpts) {
  if (opts.host === undefined) {
    throw Error('No RPC host provided for headless web3 agent')
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const httpProvider = new Web3HttpProvider(opts.host, {
    ...opts
  })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  httpProvider.requests = async (
    payload: JsonRpcPayload,
    callback?: (error: Error | null, result?: JsonRpcResponse) => void
  ) => {
    LoggerInstance.debug(`HTTP Provider Request: `, payload)
    let res: any
    if (typeof callback !== 'function') {
      callback = (error: Error | null, result?: JsonRpcResponse) => {
        if (error) {
          LoggerInstance.error(error)
          throw error
        }
        res = result
      }
    }
    await httpProvider.send(payload, callback)
    LoggerInstance.debug(`HTTP Provider Response: `, res)
    return res
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  httpProvider.sendAsync = async (
    payload: JsonRpcPayload,
    callback?: (error: Error | null, result?: JsonRpcResponse) => void
  ) => {
    return httpProvider.send(payload, callback)
  }

  return httpProvider
}

/**
 * Simple headless RPC provider resolution based on auth status and env vars.
 * Be aware that the RPC provider itself also has logic to determine whether auth is required and/or
 * which tokens/addresses to serve to an authenticated user.
 *
 * The security of the headless wallet is also not reliant on this URL, the headless wallet is protected by auth typically
 */
export const getHeadlessProviderRpcHost = (opts: {
  authStatus: AuthenticationStatus
}) => {
  let host = process.env.NEXT_PUBLIC_WEB3_HEADLESS_PROVIDER_HOST_ANONYMOUS

  if (opts.authStatus !== AuthenticationStatus.NOT_AUTHENTICATED) {
    console.log(
      `Updating web3 headless provider since we are authenticated`,
      process.env.NEXT_PUBLIC_WEB3_HEADLESS_PROVIDER_HOST_AUTHENTICATED
    )
    host = process.env.NEXT_PUBLIC_WEB3_HEADLESS_PROVIDER_HOST_AUTHENTICATED
  } else {
    console.log(
      `Using anonymous web3 headless provider since we are not authenticated`,
      process.env.NEXT_PUBLIC_WEB3_HEADLESS_PROVIDER_HOST_AUTHENTICATED
    )
  }
  return host
}
