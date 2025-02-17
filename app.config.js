const { getDefaultChainIds, getSupportedChainIds } = require('./chains.config')

module.exports = {
  // URI of single metadata cache instance for all networks.
  // While ocean.js includes this value for each network as part of its ConfigHelper,
  // it is assumed to be the same for all networks.
  // In components can be accessed with the useMarketMetadata hook:
  // const { appConfig } = useMarketMetadata()
  // return appConfig.metadataCacheUri
  metadataCacheUri: process.env.NEXT_PUBLIC_METADATA_CACHE_URI,

  complianceUri: process.env.NEXT_PUBLIC_COMPLIANCE_URI,

  complianceApiVersion: process.env.NEXT_PUBLIC_COMPLIANCE_API_VERSION,

  // List of chainIds which metadata cache queries will return by default.
  // This preselects the Chains user preferences.
  chainIds: getDefaultChainIds(),

  // List of all supported chainIds. Used to populate the Chains user preferences list.
  chainIdsSupported: getSupportedChainIds(),

  infuraProjectId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,

  defaultDatatokenTemplateIndex: Number(
    process.env.NEXT_PUBLIC_DEFAULT_DATATOKEN_TEMPLATE_INDEX
  ),
  // The ETH address the marketplace fee will be sent to.
  marketFeeAddress: process.env.NEXT_PUBLIC_MARKET_FEE_ADDRESS,
  // publisher market fee that is taken upon ordering an asset, it is an absolute value, it is declared on erc20 creation
  publisherMarketOrderFee: process.env.NEXT_PUBLIC_PUBLISHER_MARKET_ORDER_FEE,
  // fee recieved by the publisher market when a dt is bought from a fixed rate exchange, percent
  publisherMarketFixedSwapFee:
    process.env.NEXT_PUBLIC_PUBLISHER_MARKET_FIXED_SWAP_FEE,

  // consume market fee that is taken upon ordering an asset, it is an absolute value, it is specified on order
  consumeMarketOrderFee: process.env.NEXT_PUBLIC_CONSUME_MARKET_ORDER_FEE,
  // fee recieved by the consume market when a dt is bought from a fixed rate exchange, percent
  consumeMarketFixedSwapFee:
    process.env.NEXT_PUBLIC_CONSUME_MARKET_FIXED_SWAP_FEE,

  // Config for https://github.com/oceanprotocol/use-dark-mode
  darkModeConfig: {
    classNameDark: 'dark',
    classNameLight: 'light',
    storageKey: 'oceanDarkMode'
  },

  // Used to show or hide the fixed, dynamic or free price options
  // tab to publishers during the price creation.
  allowFixedPricing: process.env.NEXT_PUBLIC_ALLOW_FIXED_PRICING,
  allowDynamicPricing: process.env.NEXT_PUBLIC_ALLOW_DYNAMIC_PRICING,
  allowFreePricing: process.env.NEXT_PUBLIC_ALLOW_FREE_PRICING,

  // Set the default privacy policy to initially display
  // this should be the slug of your default policy markdown file
  defaultPrivacyPolicySlug: process.env.NEXT_PUBLIC_DEFAULT_PRIVACY_POLICY_SLUG,

  // This enables / disables the use of a GDPR compliant
  // privacy preference center to manage cookies on the market
  // If set to true a gdpr.json file inside the content directory
  // is used to create and show a privacy preference center / cookie banner
  // To learn more about how to configure and use this, please refer to the readme
  privacyPreferenceCenter: process.env.NEXT_PUBLIC_PRIVACY_PREFERENCE_CENTER,

  // Default terms to be used for service offerings made on this marketplace
  defaultAccessTerms: process.env.NEXT_PUBLIC_DEFAULT_ACCESS_TERMS,

  // Purgatory URI, leave as an empty string to disable the API call
  purgatoryUrl: process.env.NEXT_PUBLIC_PURGATORY_URI,

  // Authentication part 1: OIDC
  isOIDCActivated:
    process.env.NEXT_PUBLIC_AUTH_OIDC_ACTIVATED?.toLowerCase() === 'true',
  oidcModalTabName: process.env.NEXT_PUBLIC_OIDC_MODAL_TAB_NAME ?? 'OIDC',
  oidcLoginTabTitle:
    process.env.NEXT_PUBLIC_OIDC_LOGIN_TAB_TITLE ?? 'For the first time access',
  oidcLoginTabButton:
    process.env.NEXT_PUBLIC_OIDC_LOGIN_TAB_BUTTON ?? 'your account',
  oidcBackendUrl:
    process.env.NEXT_PUBLIC_OIDC_BACKEND_URL ?? 'http://localhost:3001',

  web3RpcBasePath: process.env.WEB3_RPC_BASE_PATH ?? '/web3/rpc',
  web3RpcUrl: process.env.WEB3_RPC_URL ?? 'http://127.0.0.1:2999',

  // Authentication part 2: SIOP
  isSiopActivated: process.env.NEXT_PUBLIC_AUTH_SIOP_ACTIVATED === 'true',
  // Base URL of the SSI agent capable of OpenID for Verifiable Presentations
  siopAgentBaseURL: process.env.NEXT_PUBLIC_OID4VP_AGENT_BASE_URL,
  // Presentation Definition hosted by the SSI agent
  siopPresentationDefID: process.env.NEXT_PUBLIC_OID4VP_PRESENTATION_DEF_ID,
  // Interval in seconds to refresh the QR code
  siopQRCodeExpiresAfterSec:
    process.env.NEXT_PUBLIC_SSI_QR_CODE_EXPIRES_AFTER_SEC,
  // Form where you can request/get a Credential using OpenID for Verifiable Credential issuance
  siopIssueFormLink: process.env.NEXT_PUBLIC_OID4VCI_ISSUE_FORM_LINK,
  siopCredentialName: process.env.NEXT_PUBLIC_OID4VP_CREDENTIAL_NAME ?? 'Guest',
  // Page where compliant wallets are listed and can be downloaded
  siopDownloadSSIWalletLink: process.env.NEXT_PUBLIC_DOWNLOAD_SSI_WALLET_LINK
}
