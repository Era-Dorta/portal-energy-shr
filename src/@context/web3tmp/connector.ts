import {
  IAbstractConnectorOptions,
  IProviderDisplay,
  IProviderInfo
} from 'web3modal'
import { HttpProvider } from 'web3-core'
import sphereonLogo from './sphereon.svg'
export interface ISphereonAgentOptions extends IAbstractConnectorOptions {
  host?: string
}

const connectToSphereonAgent = async (
  provider: HttpProvider,
  opts?: ISphereonAgentOptions
) => {
  try {
    const options = opts || ({} as ISphereonAgentOptions)
    const provider = new HttpProvider(
      opts.host ?? 'http://localhost:5001/web3/rpc',
      {
        withCredentials: true
      }
    )

    console.log(provider)
    return provider
  } catch (e) {
    console.log(e)
    throw e
  }
}

export const SPHEREONAUTH: IProviderDisplay = {
  // id: 'sphereon',
  name: 'Sphereon',
  logo: sphereonLogo
  // type: 'web',
  // check: 'isSphereon'
}

export default connectToSphereonAgent
