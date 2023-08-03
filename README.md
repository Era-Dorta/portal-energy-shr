[![banner](https://raw.githubusercontent.com/oceanprotocol/art/master/github/repo-banner%402x.png)](https://oceanprotocol.com)

<h1 align="center">Ocean Marketplace</h1>

[![Build Status](https://github.com/oceanprotocol/market/workflows/CI/badge.svg)](https://github.com/oceanprotocol/market/actions)
[![Netlify Status](https://api.netlify.com/api/v1/badges/c85f4d8b-95e1-4010-95a4-2bacd8b90981/deploy-status)](https://app.netlify.com/sites/market-oceanprotocol/deploys)
[![Maintainability](https://api.codeclimate.com/v1/badges/d114f94f75e6efd2ee71/maintainability)](https://codeclimate.com/repos/5e3933869a31771fd800011c/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/da71759866eb8313d7c2/test_coverage)](https://codeclimate.com/github/oceanprotocol/market/test_coverage)
[![js oceanprotocol](https://img.shields.io/badge/js-oceanprotocol-7b1173.svg)](https://github.com/oceanprotocol/eslint-config-oceanprotocol)

**Table of Contents**

- [🏄 Get Started](#-get-started)
  - [Local components with Barge](#local-components-with-barge)
- [🦑 Environment variables](#-environment-variables)
- [🦀 Data Sources](#-data-sources)
  - [Aquarius](#aquarius)
  - [Ocean Protocol Subgraph](#ocean-protocol-subgraph)
  - [ENS](#ens)
  - [Purgatory](#purgatory)
  - [Network Metadata](#network-metadata)
- [👩‍🎤 Storybook](#-storybook)
- [🤖 Testing](#-testing)
- [✨ Code Style](#-code-style)
- [🛳 Production](#-production)
- [⬆️ Deployment](#️-deployment)
- [💖 Contributing](#-contributing)
- [🍴 Forking](#-forking)
- [💰 Pricing Options](#-pricing-options)
  - [Fixed Pricing](#fixed-pricing)
  - [Free Pricing](#free-pricing)
- [✅ GDPR Compliance](#-gdpr-compliance)
  - [Multi-Language Privacy Policies](#multi-language-privacy-policies)
  - [Privacy Preference Center](#privacy-preference-center)
    - [Privacy Preference Center Styling](#privacy-preference-center-styling)
- [🏛 License](#-license)

## 🏄 Get Started

The app is a React app built with [Next.js](https://nextjs.org) + TypeScript + CSS modules and will connect to Ocean remote components by default.

Prerequisites:

- [Node.js](https://nodejs.org/en/) (required). Check the [.nvmrc](.nvmrc) file to make sure you are using the correct version of Node.js.
- [nvm](https://github.com/nvm-sh/nvm) (recommended). This is the recommend way to manage Node.js versions.
- [Git](https://git-scm.com/) is required to follow the instructions below.

To start local development:

```bash
git clone git@github.com:oceanprotocol/market.git
cd market

# when using nvm to manage Node.js versions
nvm use

npm install
# in case of dependency errors, rather use:
# npm install --legacy-peer-deps
npm start
```

This will start the development server under
`http://localhost:8000`.

### Local components with Barge

If you prefer to connect to locally running components instead of remote connections, you can spin up [`barge`](https://github.com/oceanprotocol/barge) and use a local Ganache network in another terminal before running `npm start`:

```bash
git clone git@github.com:oceanprotocol/barge.git
cd barge

# startup with local Ganache node
./start_ocean.sh
```

Barge will deploy contracts to the local Ganache node which will take some time. At the end the compiled artifacts need to be copied over to this project into `node_modules/@oceanprotocol/contracts/artifacts`. This script will do that for you:

```bash
./scripts/copy-contracts.sh
```

Finally, set environment variables to use this local connection in `.env` in the app:

```bash
# modify env variables
cp .env.example .env

npm start
```

To use the app together with MetaMask, importing one of the accounts auto-generated by the Ganache container is the easiest way to have test ETH available. All of them have 100 ETH by default. Upon start, the `ocean_ganache_1` container will print out the private keys of multiple accounts in its logs. Pick one of them and import into MetaMask.

To fully test all [The Graph](https://thegraph.com) integrations, you have to run your own local Graph node with our [`ocean-subgraph`](https://github.com/oceanprotocol/ocean-subgraph) deployed to it. Barge does not include a local subgraph so by default, the `subgraphUri` is hardcoded to the Goerli subgraph in our [`getDevelopmentConfig` function](https://github.com/oceanprotocol/market/blob/d0b1534d105e5dcb3790c65d4bb04ff1d2dbc575/src/utils/ocean.ts#L31).

> Cleaning all Docker images so they are fetched freshly is often a good idea to make sure no issues are caused by old or stale images: `docker system prune --all --volumes`

## 🦑 Environment variables

The `app.config.js` file is setup to prioritize environment variables for setting each Ocean component endpoint. By setting environment variables, you can easily switch between Ocean networks the app connects to, without directly modifying `app.config.js`.

For local development, you can use a `.env` file:

```bash
# modify env variables, Goerli is enabled by default when using those files
cp .env.example .env
```

## 🦀 Data Sources

All displayed data in the app is presented around the concept of one asset, which is a combination of:

- metadata about an asset
- the actual asset file
- the NFT which represents the asset
- the datatokens representing access rights to the asset file
- financial data connected to these datatokens, either a fixed rate exchange contract or a dispenser for free assets
- calculations and conversions based on financial data
- metadata about publisher accounts

All this data then comes from multiple sources:

### Aquarius

All initial assets and their metadata (DDO) is retrieved client-side on run-time from the [Aquarius](https://github.com/oceanprotocol/aquarius) instance, defined in `app.config.js`. All app calls to Aquarius are done with 2 internal methods which mimic the same methods in ocean.js, but allow us:

- to cancel requests when components get unmounted in combination with [axios](https://github.com/axios/axios)
- hit Aquarius as early as possible without relying on any ocean.js initialization

Aquarius runs Elasticsearch under the hood so its stored metadata can be queried with [Elasticsearch queries](https://www.elastic.co/guide/en/elasticsearch/reference/current/full-text-queries.html) like so:

```tsx
import { QueryResult } from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import { queryMetadata } from '@utils/aquarius'

const queryLatest = {
  query: {
    // https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html
    query_string: { query: `-isInPurgatory:true` }
  },
  sort: { created: 'desc' }
}

function Component() {
  const { appConfig } = useMarketMetadata()
  const [result, setResult] = useState<QueryResult>()

  useEffect(() => {
    if (!appConfig.metadataCacheUri) return
    const source = axios.CancelToken.source()

    async function init() {
      const result = await queryMetadata(query, source.token)
      setResult(result)
    }
    init()

    return () => {
      source.cancel()
    }
  }, [appConfig.metadataCacheUri, query])

  return <div>{result}</div>
}
```

For components within a single asset view the `useAsset()` hook can be used, which in the background gets the respective metadata from Aquarius.

```tsx
import { useAsset } from '@context/Asset'

function Component() {
  const { ddo } = useAsset()
  return <div>{ddo}</div>
}
```

### Ocean Protocol Subgraph

Most financial data in the market is retrieved with GraphQL from [our own subgraph](https://github.com/oceanprotocol/ocean-subgraph), rendered on top of the initial data coming from Aquarius.

The app has [Urql Client](https://formidable.com/open-source/urql/docs/basics/react-preact/) setup to query the respective subgraph based on network. In any component this client can be used like so:

```tsx
import { gql, useQuery } from 'urql'

const query = gql`
  query TopSalesQuery {
    users(first: 20, orderBy: totalSales, orderDirection: desc) {
      id
      totalSales
    }
  }
`

function Component() {
  const { data } = useQuery(query, {}, pollInterval: 5000 })
  return <div>{data}</div>
}
```

### ENS

Publishers can fill their account's [ENS domain](https://ens.domains) profile and when found, it will be displayed in the app.

For this our own [ens-proxy](https://github.com/oceanprotocol/ens-proxy) is used, within the app the utility method `getEnsProfile()` is called as part of the `useProfile()` hook:

```tsx
import { useProfile } from '@context/Profile'

function Component() {
  const { profile } = useProfile()

  return (
    <div>
      {profile.avatar} {profile.name}
    </div>
  )
}
```

### Purgatory

Based on [list-purgatory](https://github.com/oceanprotocol/list-purgatory) some assets get additional data. Within most components this can be done with the internal `useAsset()` hook which fetches data from the [market-purgatory](https://github.com/oceanprotocol/market-purgatory) endpoint in the background.

For asset purgatory:

```tsx
import { useAsset } from '@context/Asset'

function Component() {
  const { isInPurgatory, purgatoryData } = useAsset()
  return isInPurgatory ? <div>{purgatoryData.reason}</div> : null
}
```

For account purgatory:

```tsx
import { useWeb3 } from '@context/Web3'
import { useAccountPurgatory } from '@hooks/useAccountPurgatory'

function Component() {
  const { accountId } = useWeb3()
  const { isInPurgatory, purgatoryData } = useAccountPurgatory(accountId)
  return isInPurgatory ? <div>{purgatoryData.reason}</div> : null
}
```

### Network Metadata

All displayed chain & network metadata is retrieved from `https://chainid.network` on build time and integrated into NEXT's GraphQL layer. This data source is a community-maintained GitHub repository under [ethereum-lists/chains](https://github.com/ethereum-lists/chains).

Within components this metadata can be queried for under `allNetworksMetadataJson`. The `useWeb3()` hook does this in the background to expose the final `networkDisplayName` for use in components:

```tsx
export default function NetworkName(): ReactElement {
  const { networkId, isTestnet } = useWeb3()
  const { networksList } = useNetworkMetadata()
  const networkData = getNetworkDataById(networksList, networkId)
  const networkName = getNetworkDisplayName(networkData)

  return (
    <>
      {networkName} {isTestnet && `(Test)`}
    </>
  )
}
```

## 👩‍🎤 Storybook

Storybook helps us build UI components in isolation from our app's business logic, data, and context. That makes it easy to develop hard-to-reach states and save these UI states as stories to revisit during development, testing, or QA.

To start adding stories, create a `index.stories.tsx` inside the component's folder:

<pre>
src
└─── components
│   └─── @shared
│       └─── <your component>
│            │   index.tsx
│            │   index.module.css
│            │   <b>index.stories.tsx</b>
│            │   index.test.tsx
</pre>

Starting up the Storybook server with this command will make it accessible under `http://localhost:6006`:

```bash
npm run storybook
```

If you want to build a portable static version under `storybook-static/`:

```bash
npm run storybook:build
```

## 🤖 Testing

Test runs utilize [Jest](https://jestjs.io/) as test runner and [Testing Library](https://testing-library.com/docs/react-testing-library/intro) for writing tests.

All created Storybook stories will automatically run as individual tests by using the [StoryShots Addon](https://storybook.js.org/addons/@storybook/addon-storyshots).

Creating Storybook stories for a component will provide good coverage of a component in many cases. Additional tests for dedicated component functionality which can't be done with Storybook are created as usual [Testing Library](https://testing-library.com/docs/react-testing-library/intro) tests, but you can also [import exisiting Storybook stories](https://storybook.js.org/docs/react/writing-tests/importing-stories-in-tests#example-with-testing-library) into those tests.

Executing linting, type checking, and full test run:

```bash
npm test
```

Which is a combination of multiple scripts which can also be run individually:

```bash
npm run lint
npm run type-check
npm run jest
```

A coverage report is automatically shown in console whenever `npm run jest` is called. Generated reports are sent to CodeClimate during CI runs.

During local development you can continuously get coverage report feedback in your console by running Jest in watch mode:

```bash
npm run jest:watch
```

## ✨ Code Style

Code style is automatically enforced through [ESLint](https://eslint.org) & [Prettier](https://prettier.io) rules:

- Git pre-commit hook runs `prettier` on staged files, setup with [Husky](https://typicode.github.io/husky)
- VS Code suggested extensions and settings for auto-formatting on file save
- CI runs a linting & TypeScript typings check as part of `npm test`, and fails if errors are found

For running linting and auto-formatting manually, you can use from the root of the project:

```bash
# linting check
npm run lint

# auto format all files in the project with prettier, taking all configs into account
npm run format
```

## 🛳 Production

To create a production build, run from the root of the project:

```bash
npm run build

# serve production build
npm run serve
```

## ⬆️ Deployment

Every branch or Pull Request is automatically deployed to multiple hosts for redundancy and emergency reasons:

- [Netlify](https://netlify.com)
- [Vercel](https://vercel.com)
- [S3](https://aws.amazon.com/s3/)

A link to a preview deployment will appear under each Pull Request.

The latest deployment of the `main` branch is automatically aliased to `market.oceanprotocol.com`, where the deployment on Netlify is the current live deployment.

## 💖 Contributing

We welcome contributions in form of bug reports, feature requests, code changes, or documentation improvements. Have a look at our contribution documentation for instructions and workflows:

- [**Ways to Contribute →**](https://docs.oceanprotocol.com/concepts/contributing/)
- [Code of Conduct →](https://docs.oceanprotocol.com/concepts/code-of-conduct/)
- [Reporting Vulnerabilities →](https://docs.oceanprotocol.com/concepts/vulnerabilities/)

## 🍴 Forking

We encourage you to fork this repository and create your own data marketplace. When you publish your forked version of this market there are a few elements that you are required to change for copyright reasons:

- The typeface is copyright protected and needs to be changed unless you purchase a license for it.
- The Ocean Protocol logo is a trademark of the Ocean Protocol Foundation and must be removed from forked versions of the market.
- The name "Ocean Market" is also copyright protected and should be changed to the name of your market.

Additionally, we would also advise that you retain the text saying "Powered by Ocean Protocol" on your forked version of the marketplace in order to give credit for the development work done by the Ocean Protocol team.

Everything else is made open according to the apache2 license. We look forward to seeing your data marketplace!

If you are looking to fork Ocean Market and create your own marketplace, you will find the following guides useful in our docs:

- [Forking Ocean Market](https://docs.oceanprotocol.com/building-with-ocean/build-a-marketplace/forking-ocean-market)
- [Customising your Market](https://docs.oceanprotocol.com/building-with-ocean/build-a-marketplace/customising-your-market)
- [Deploying your Market](https://docs.oceanprotocol.com/building-with-ocean/build-a-marketplace/deploying-market)

## 💰 Pricing Options

### Fixed Pricing

To allow publishers to set pricing as "Fixed" you need to add the following environmental variable to your .env file: `NEXT_PUBLIC_ALLOW_FIXED_PRICING="true"` (default).

### Free Pricing

To allow publishers to set pricing as "Free" you need to add the following environmental variable to your .env file: `NEXT_PUBLIC_ALLOW_FREE_PRICING="true"` (default).

This allocates the datatokens to the [dispenser contract](https://github.com/oceanprotocol/contracts/blob/main/contracts/dispenser/Dispenser.sol) which dispenses data tokens to users for free. Publishers in your market will now be able to offer their assets to users for free (excluding gas costs).

## ✅ GDPR Compliance

Ocean Market comes with prebuilt components for you to customize to cover GDPR requirements. Find additional information on how to use them below.

### Multi-Language Privacy Policies

Feel free to adopt our provided privacy policies to your needs. Per default we cover four different languages: English, German, Spanish and French. Please be advised, that you will need to adjust some paragraphs in the policies depending on your market setup (e.g. the use of cookies). You can easily add or remove policies by providing your own markdown files in the `content/pages/privacy` directory. For guidelines on how to format your markdown files refer to our provided policies. The pre-linked content tables for these files are automatically generated.

### Privacy Preference Center

Additionally, Ocean Market provides a privacy preference center for you to use. This feature is disabled per default since we do not use cookies requiring consent on our deployment of the market. However, if you need to add some functionality depending on cookies, you can simply enable this feature by changing the value of the `NEXT_PUBLIC_PRIVACY_PREFERENCE_CENTER` environmental variable to `"true"` in your `.env` file. This will enable a customizable cookie banner stating the use of your individual cookies. The content of this banner can be adjusted within the `content/gdpr.json` file. If no `optionalCookies` are provided, the privacy preference center will be set to a simpler version displaying only the `title`, `text` and `close`-button. This can be used to inform the user about the use of essential cookies, where no consent is needed. The privacy preference center supports two different styling options: `'small'` and `'default'`. Setting the style property to `'small'` will display a smaller cookie banner to the user at first, only showing the default styled privacy preference center upon the user's customization request.

Now your market users will be provided with additional options to toggle the use of your configured cookie consent categories. You can always retrieve the current consent status per category with the provided `useConsent()` hook. See below, how you can set your own custom cookies depending on the market user's consent. Feel free to adjust the provided utility functions for cookie usage provided in the `src/utils/cookies.ts` file to your needs.

```tsx
import { CookieConsentStatus, useConsent } from '@context/CookieConsent'
import { deleteCookie, setCookie } from '@utils/cookies'

// ...

const { cookies, cookieConsentStatus } = useConsent()

cookies.map((cookie) => {
  const consent = cookieConsentStatus[cookie.cookieName]

  switch (consent) {
    case CookieConsentStatus.APPROVED:
      // example logic
      setCookie(`YOUR_COOKIE_NAME`, 'VALUE')
      break

    case CookieConsentStatus.REJECTED:
    case CookieConsentStatus.NOT_AVAILABLE:
    default:
      // example logic
      deleteCookie(`YOUR_COOKIE_NAME`)
      break
  }
})
```

#### Privacy Preference Center Styling

The privacy preference centre has two styling options `default` and `small`. The default view shows all of the customization options on a full-height side banner. When the `small` setting is used, a much smaller banner is shown which only reveals all of the customization options when the user clicks "Customize".

The style can be changed by altering the `style` prop in the `PrivacyPreferenceCenter` component in `src/components/App.tsx`. For example:

```Typescript
<PrivacyPreferenceCenter style="small" />
```

## Security

The portal has two ways of authentication. You can either use an OIDC server for your authentication or use SIOP+OID4VP. Both are available in this version of portal.
There a couple of env variables that you should be aware when you want to configure authentication process in the portal.

### OIDC

The following variables are used in our environment for OIDC authentication. By default, this method of authentication is disabled.

- `NEXT_PUBLIC_AUTH_OIDC_ACTIVATED`: Determines if the OIDC login mechanism is activated for the portal
- `NEXT_PUBLIC_OIDC_MODAL_TAB_NAME`: If OIDC is activated, in the login modal, you'll see OIDC login with tab name that you set here
- `NEXT_PUBLIC_OIDC_CLIENT_ID`: Client Identifier valid at the Authorization Server
- `NEXT_PUBLIC_OIDC_REDIRECT_URI`: Redirection URI to which the response will be sent. This URI MUST exactly match one of the Redirection URI values for the Client pre-registered at the OpenID Provider
- `NEXT_PUBLIC_OIDC_SCOPE`: OpenID Connect requests MUST contain the openid scope value. If the openid scope value is not present, the behavior is entirely unspecified.
- `NEXT_PUBLIC_OIDC_AUTHORITY`: The provider’s endpoint that will perform authentication and authorization.

### SIOP

The following variables are used in our environment for SIOP authentication. By default, this method of authentication is disabled.

- `NEXT_PUBLIC_AUTH_SIOP_ACTIVATED`: Determines if the SIOP login mechanism is activated for the portal
- `NEXT_PUBLIC_OID4VP_AGENT_BASE_URL`: Base URL of the SSI agent capable of OpenID for Verifiable Presentations
- `NEXT_PUBLIC_OID4VP_PRESENTATION_DEF_ID`: Presentation Definition hosted by the SSI agent
- `NEXT_PUBLIC_SSI_QR_CODE_EXPIRES_AFTER_SEC`: Interval in seconds to refresh the QR code
- `NEXT_PUBLIC_OID4VCI_ISSUE_FORM_LINK`: Form where you can request/get a Credential using OpenID for Verifiable Credential issuance
- `NEXT_PUBLIC_DOWNLOAD_SSI_WALLET_LINK`: Page where compliant wallets are listed and can be downloaded

## 🏛 License

```text
Copyright 2022 Ocean Protocol Foundation Ltd.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
