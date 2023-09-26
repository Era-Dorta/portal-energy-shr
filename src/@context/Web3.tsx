import React, {
  createContext,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'
import Web3 from 'web3'
import Web3Modal, { getProviderInfo, IProviderInfo } from 'web3modal'
import {
  infuraProjectId as infuraId,
  isOIDCActivated,
  isSiopActivated
} from '../../app.config'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { LoggerInstance } from '@oceanprotocol/lib'
import { isBrowser } from '@utils/index'
import useNetworkMetadata, {
  getNetworkDataById,
  getNetworkDisplayName,
  getNetworkType,
  NetworkType
} from '../@hooks/useNetworkMetadata'
import { useMarketMetadata } from './MarketMetadata'
import { getTokenBalance } from '@utils/web3'
import { getOpcsApprovedTokens } from '@utils/subgraph'
import { isFeatureDisabled, isFeatureEnabled } from '@utils/features'
import { provider as Web3CoreProvider } from 'web3-core'
import {
  createHeadlessWeb3Provider,
  getHeadlessProviderRpcHost
} from '../Provider'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { AuthenticationStatus } from '@components/Authentication/authentication.types'

LoggerInstance.setLevel(3)

export interface Web3ProviderValue {
  isOnlyWeb3Auth: boolean
  isWeb3HeadlessOnly: boolean
  isWeb2Authenticated: boolean
  web3: Web3
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  web3Provider: any
  web3Modal: Web3Modal
  web3ProviderInfo: IProviderInfo
  accountId: string
  balance: UserBalance
  networkId: number
  chainId: number
  networkDisplayName: string
  networkData: EthereumListsChain
  block: number
  isTestnet: boolean
  web3Loading: boolean
  isSupportedOceanNetwork: boolean
  approvedBaseTokens: TokenInfo[]
  connect: (disconnect?: boolean) => Promise<void>
  logout: () => Promise<void>
}

const web3ModalTheme = {
  background: 'var(--background-body)',
  main: 'var(--font-color-heading)',
  secondary: 'var(--brand-grey-light)',
  border: 'var(--border-color)',
  hover: 'var(--background-highlight)'
}

const refreshInterval = 20000 // 20 sec.

const Web3Context = createContext({} as Web3ProviderValue)

function Web3Provider({ children }: { children: ReactNode }): ReactElement {
  // const { oidcUser } = useOidcAuth()
  const { networksList } = useNetworkMetadata()
  const { appConfig } = useMarketMetadata()

  const [web3, setWeb3] = useState<Web3>()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [web3Provider, setWeb3Provider] = useState<any>()

  const [web3Modal, setWeb3Modal] = useState<Web3Modal>()
  const [web3ProviderInfo, setWeb3ProviderInfo] = useState<IProviderInfo>()
  const [networkId, setNetworkId] = useState<number>()
  const [chainId, setChainId] = useState<number>()
  const [accountId, setAccountId] = useState<string>()
  const [networkDisplayName, setNetworkDisplayName] = useState<string>()
  const [networkData, setNetworkData] = useState<EthereumListsChain>()
  const [block, setBlock] = useState<number>()
  const [isTestnet, setIsTestnet] = useState<boolean>()
  const [web3Loading, setWeb3Loading] = useState<boolean>(true)
  const [balance, setBalance] = useState<UserBalance>({})
  const [isSupportedOceanNetwork, setIsSupportedOceanNetwork] = useState(true)
  const [approvedBaseTokens, setApprovedBaseTokens] = useState<TokenInfo[]>()
  const [isWeb2Authenticated, setIsWeb2Authenticated] = useState(false)

  const isWeb3HeadlessOnly =
    isFeatureEnabled('/web3/headless') &&
    isFeatureDisabled('/web3/wallet-selection')

  const isOnlyWeb3Auth = !isOIDCActivated && !isSiopActivated
  // LoggerInstance.log('[web3] Is only web3 auth', onlyWeb3)
  const hasWalletSelection = isFeatureEnabled('/web3/wallet-selection')

  const authenticationStatus = useSelector(
    (state: RootState) => state.authentication.authenticationStatus
  )

  /* console.log(`/web/headles enabled: ${isFeatureEnabled('/web3/headless')}`)
  console.log(
    `/web/wallet-selection disabled: ${isFeatureDisabled(
      '/web3/wallet-selection'
    )}`
  ) */
  const connector = (_: any, opts?: any) => {
    /*    console.log(
      `====================AUTHSTATE CONNECTOR: ${JSON.stringify(
        authenticationStatus
      )}`
    ) */
    const host = getHeadlessProviderRpcHost({
      authStatus: authenticationStatus
    })

    if (isWeb3HeadlessOnly && !host) {
      toast.error('Please login first.')
    }

    return createHeadlessWeb3Provider({ ...opts, host })
  }

  const createWeb3ModalOpts = () => {
    const headlessProviderOptions = isFeatureEnabled('/web3/headless')
      ? {
          'custom-sphereon': {
            package: true, // Needed to make it show up, because of the brittle web3Model logic
            display: {
              name:
                process.env.NEXT_PUBLIC_WEB3_HEADLESS_PROVIDER_NAME ??
                'Sphereon',
              logo:
                process.env.NEXT_PUBLIC_WEB3_HEADLESS_PROVIDER_LOGO ??
                '/images/sphereon-logo.jpg',
              description:
                process.env.NEXT_PUBLIC_WEB3_HEADLESS_PROVIDER_DESCRIPTION ??
                'Sphereon wallet. No plugins required!'
            },
            connector: async (f: any, opts?: any) => connector(f, opts)
          }
        }
      : {}

    const providerOptions = isBrowser
      ? {
          ...headlessProviderOptions,
          walletconnect: {
            package: WalletConnectProvider,
            options: {
              infuraId,
              rpc: {
                137: 'https://polygon-rpc.com',
                80001: 'https://rpc-mumbai.matic.today'
              }
            }
          }
        }
      : {}
    const web3ModalOpts = {
      cacheProvider: true,
      providerOptions,
      theme: web3ModalTheme
    }
    return web3ModalOpts
  }

  // LoggerInstance.log('[web3] has wallet selection', hasWalletSelection)

  function isSphereonProvider(provider: any) {
    const isSphereonAgent =
      typeof provider === 'object' &&
      ('httpAgent' in provider || 'httpsAgent' in provider) &&
      (provider.host ===
        process.env.NEXT_PUBLIC_WEB3_HEADLESS_PROVIDER_HOST_AUTHENTICATED ||
        provider.host ===
          process.env.NEXT_PUBLIC_WEB3_HEADLESS_PROVIDER_HOST_ANONYMOUS)
    LoggerInstance.log('[web3] Is sphereon agent: ', isSphereonAgent)
    return isSphereonAgent
  }

  // -----------------------------------
  // Logout helper
  // -----------------------------------
  async function logout() {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    if ((web3?.currentProvider as any)?.close) {
      await (web3.currentProvider as any).close()
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */

    web3Modal.clearCachedProvider()
  }

  // -----------------------------------
  // Helper: connect to web3
  // -----------------------------------
  const connect = useCallback(
    async (disconnect?: boolean) => {
      if (disconnect && web3Modal && web3) {
        try {
          logout()
        } catch (error) {}
      }
      if (!web3Modal) {
        setWeb3Loading(false)
        return
      }
      try {
        setWeb3Loading(true)
        LoggerInstance.log('[web3] Connecting Web3...')

        let provider: Web3CoreProvider | undefined = web3Provider
        if (hasWalletSelection) {
          provider = await web3Modal?.connect()
        } else if (isWeb3HeadlessOnly) {
          LoggerInstance.log('[web3] Connecting Web3 headless provider ...')
          provider = await web3Modal.connectTo('custom-sphereon')
          LoggerInstance.log('[web3] Web3 headless provider connected')
        }
        if (!provider && !hasWalletSelection) {
          toast.error(
            'Could not get the provider and wallet selection is not enabled. Contact support please'
          )
          return
        } else if (
          provider &&
          isSphereonProvider(provider) &&
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          !provider.isConnected
        ) {
          try {
            await new Web3(provider).eth.requestAccounts()
          } catch (error) {
            LoggerInstance.log(`ERROR:`, error)
            toast.error(
              'Could not connect to the web3 provider. Please connect with another wallet'
            )
            await logout()
            return
          }
        }
        setWeb3Provider(provider)

        const web3 = new Web3(provider)
        setWeb3(web3)
        LoggerInstance.log('[web3] Web3 created.', web3)

        const accountId = (await web3.eth.getAccounts())[0]
        setAccountId(accountId)
        LoggerInstance.log('[web3] account id', accountId)

        const networkId = await web3.eth.net.getId()
        setNetworkId(networkId)
        LoggerInstance.log('[web3] network id ', networkId)

        const chainId = await web3.eth.getChainId()
        setChainId(chainId)
        LoggerInstance.log('[web3] chain id ', chainId)
      } catch (error) {
        LoggerInstance.error('[web3] Error:::: ', error.message, error)
      } finally {
        setWeb3Loading(false)
      }
    },
    [web3Modal]
  )

  // -----------------------------------
  // Helper: Get approved base tokens list
  // -----------------------------------
  const getApprovedBaseTokens = useCallback(async (chainId: number) => {
    try {
      const approvedTokensList = await getOpcsApprovedTokens(chainId)
      setApprovedBaseTokens(approvedTokensList)
      LoggerInstance.log('[web3] Approved baseTokens', approvedTokensList)
    } catch (error) {
      LoggerInstance.error('[web3] Error: ', error.message)
    }
  }, [])

  // -----------------------------------
  // Helper: Get user balance
  // -----------------------------------
  const getUserBalance = useCallback(async () => {
    if (!accountId || !networkId || !web3 || !networkData) {
      return
    }

    try {
      const userBalance = web3.utils.fromWei(
        await web3.eth.getBalance(accountId, 'latest')
      )
      const userToken = networkData.nativeCurrency.symbol.toLowerCase()
      const newBalance: UserBalance = { [userToken]: userBalance }

      if (approvedBaseTokens?.length > 0) {
        await Promise.all(
          approvedBaseTokens.map(async (token) => {
            const { address, decimals, symbol } = token
            const tokenBalance = await getTokenBalance(
              accountId,
              decimals,
              address,
              web3
            )
            newBalance[symbol.toLocaleLowerCase()] = tokenBalance
          })
        )
      }
      setBalance(newBalance)
    } catch (error) {
      LoggerInstance.error('[web3] Error: ', error.message, error)
    }
  }, [accountId, approvedBaseTokens, networkId, web3, networkData])

  async function init() {
    // note: needs artificial await here so the log message is reached and output
    const web3ModalOpts = createWeb3ModalOpts()
    const web3ModalInstance = await new Web3Modal(web3ModalOpts)
    setWeb3Modal(web3ModalInstance)
    LoggerInstance.log('[web3] Web3Modal instance created.', web3ModalInstance)
  }
  // -----------------------------------
  // Create initial Web3Modal instance
  // -----------------------------------
  useEffect(() => {
    if (web3Modal) {
      setWeb3Loading(false)
      return
    }

    init()
  }, [connect, web3Modal])

  // -----------------------------------
  // Reconnect automatically for returning users
  // -----------------------------------
  useEffect(() => {
    if (!web3Modal?.cachedProvider) return

    // else if (isSphereonProvider(web3Provider)) return

    async function connectCached() {
      if (!web3Modal?.cachedProvider) return
      // else if (isSphereonProvider(web3Provider)) return
      LoggerInstance.log(
        '[web3] Connecting to cached provider: ',
        web3Modal.cachedProvider
      )
      await connect()
    }

    connectCached()
  }, [connect, web3Modal])

  // -----------------------------------
  // Get and set approved base tokens list
  // -----------------------------------
  useEffect(() => {
    if (web3Loading) return
    getApprovedBaseTokens(chainId || 1)
  }, [chainId, getApprovedBaseTokens, web3Loading])

  // -----------------------------------
  // Get and set user balance
  // -----------------------------------
  useEffect(() => {
    getUserBalance()

    // init periodic refresh of wallet balance
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const balanceInterval = setInterval(() => getUserBalance(), refreshInterval)

    return () => {
      clearTimeout(balanceInterval)
    }
  }, [getUserBalance])

  // -----------------------------------
  // Get and set network metadata
  // -----------------------------------
  useEffect(() => {
    if (!networkId) return
    const networkData = getNetworkDataById(networksList, networkId)
    setNetworkData(networkData)
    LoggerInstance.log(
      networkData
        ? `[web3] Network metadata found.`
        : `[web3] No network metadata found.`,
      networkData
    )

    // Construct network display name
    const networkDisplayName = getNetworkDisplayName(networkData)
    setNetworkDisplayName(networkDisplayName)

    setIsTestnet(getNetworkType(networkData) !== NetworkType.Mainnet)

    LoggerInstance.log(
      `[web3] Network display name set to: ${networkDisplayName}`
    )
  }, [networkId, networksList])

  // -----------------------------------
  // Get and set latest head block
  // -----------------------------------
  useEffect(() => {
    if (!web3 || !web3Provider) return

    async function getBlock() {
      const block = await web3.eth.getBlockNumber()
      setBlock(block)
      LoggerInstance.log('[web3] Head block: ', block)
    }

    getBlock()
  }, [web3, networkId])

  // -----------------------------------
  // Get and set web3 provider info
  // -----------------------------------
  // Workaround cause getInjectedProviderName() always returns `MetaMask`
  // https://github.com/oceanprotocol/market/issues/332
  useEffect(() => {
    if (!web3Provider) return

    const providerInfo = getProviderInfo(web3Provider)
    setWeb3ProviderInfo(providerInfo)
  }, [web3Provider])

  // -----------------------------------
  // Get valid Networks and set isSupportedOceanNetwork
  // -----------------------------------

  useEffect(() => {
    if (appConfig.chainIdsSupported.includes(networkId)) {
      setIsSupportedOceanNetwork(true)
    } else {
      setIsSupportedOceanNetwork(false)
    }
  }, [networkId, appConfig.chainIdsSupported])

  useEffect(() => {
    const isAuthenticated =
      authenticationStatus !== AuthenticationStatus.NOT_AUTHENTICATED
    /* console.log(
      `#### IS AUTHENTICATED: ${isAuthenticated}. WAS AUTH: ${isWeb2Authenticated}`
    ) */
    if (isAuthenticated !== isWeb2Authenticated) {
      if (isWeb3HeadlessOnly) {
        init()
        /* web3Modal
          ?.connectTo('custom-sphereon')
          .then((provider) => setWeb3Provider(provider))
          .then(() => init()) */
      }
      setIsWeb2Authenticated(isAuthenticated)
    }
  }, [isWeb3HeadlessOnly, connector])

  // -----------------------------------
  // Check user network against asset network
  // -----------------------------------
  useEffect(() => {
    if (isWeb3HeadlessOnly) {
      LoggerInstance.log(
        `[web3] Will connect to web3 provider since we are in headless only mode. Auth status ${authenticationStatus}`
      )
      if (authenticationStatus !== AuthenticationStatus.NOT_AUTHENTICATED) {
        try {
          // This is a web3 logout. Used to change from anon to priviledged web3 account
          logout()
        } catch (e) {
          LoggerInstance.log(
            '[web3] Error calling logout on oidc user change: ',
            e
          )
        }
      }
      LoggerInstance.log(
        '[web3] Connecting to web3 provider, given we are in headless only mode'
      )
      connect(true)
    }
  }, [isWeb3HeadlessOnly, connect])

  // -----------------------------------
  // Handle change events
  // -----------------------------------

  async function handleChainChanged(chainId: string) {
    LoggerInstance.log('[web3] Chain changed', chainId)
    const networkId = await web3.eth.net.getId()
    setChainId(Number(chainId))
    setNetworkId(Number(networkId))
  }

  async function handleNetworkChanged(networkId: string) {
    LoggerInstance.log('[web3] Network changed', networkId)
    const chainId = await web3.eth.getChainId()
    setNetworkId(Number(networkId))
    setChainId(Number(chainId))
  }

  async function handleAccountsChanged(accounts: string[]) {
    LoggerInstance.log('[web3] Account changed', accounts[0])
    setAccountId(accounts[0])
  }

  useEffect(() => {
    // todo Probably wise to only disable in case the wallet selection is anything but the headless provider

    if (
      !web3Provider ||
      !web3 ||
      isWeb3HeadlessOnly ||
      isSphereonProvider(web3Provider)
    )
      return
    web3Provider.on('chainChanged', handleChainChanged)
    web3Provider.on('networkChanged', handleNetworkChanged)
    web3Provider.on('accountsChanged', handleAccountsChanged)

    return () => {
      web3Provider.removeListener('chainChanged', handleChainChanged)
      web3Provider.removeListener('networkChanged', handleNetworkChanged)
      web3Provider.removeListener('accountsChanged', handleAccountsChanged)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3Provider, web3])

  return (
    <Web3Context.Provider
      value={{
        web3,
        web3Provider,
        web3Modal,
        web3ProviderInfo,
        isOnlyWeb3Auth,
        isWeb3HeadlessOnly,
        isWeb2Authenticated,
        accountId,
        balance,
        networkId,
        chainId,
        networkDisplayName,
        networkData,
        block,
        isTestnet,
        web3Loading,
        isSupportedOceanNetwork,
        approvedBaseTokens,
        connect,
        logout
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

// Helper hook to access the provider values
const useWeb3 = (): Web3ProviderValue => useContext(Web3Context)

export { Web3Provider, useWeb3, Web3Context }
export default Web3Provider
