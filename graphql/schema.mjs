const schema = `
type Query {
    aggregations(params: Params): [Aggregation]
    pagedAssets(params: Params): PagedAssets
}

scalar StringOrStringArray

input Range {
  operation: String
  value: Int
}

input Term {
  value: StringOrStringArray
}

input Filter {
  category: String
  location: String
  range: [Range]
  term: Term
}

input Params {
  text: String
  page: Int
  offset: Int
  sort: String
  sortDirection: String
  filters: [Filter]
  faceted: Boolean
}

type OutputRange {
  operation: String
  value: Int
}

type OutputTerm {
  value: String
}

type OutputFilter {
  category: String
  location: String
  range: [OutputRange]
  term: OutputTerm
}

type Keyword {
    label: String
    location: String
    filter: OutputFilter
    count: Int
}

type Aggregation {
  category: String
  keywords: [Keyword]
}

type Container {
  entrypoint: String
  image: String
  tag: String
  checksum: String
}

type MetadataAlgorithm {
    language: String
    version: String
    rawcode: String
    container: Container
}

type ServiceSD {
  url: String
  isVerified: Boolean
}

type TermsAndConditions {
   url: StringOrStringArray
}

type GaiaXInformation {
  containsPII: Boolean
  serviceSD: ServiceSD
  termsAndConditions: [TermsAndConditions]
}

type AdditionalInformation {
  gaiaXInformation: GaiaXInformation
  geoJson: String
  termsAndConditions: Boolean
}

type Metadata {
  created: String
  updated: String
  name: String
  description: String
  type: String
  author: String
  license: String
  links: [String]
  tags: [String]
  categories: [String]
  copyrightHolder: String
  contentLanguage: String
  algorithm: MetadataAlgorithm
  additionalInformation: AdditionalInformation
}

type PublisherTrustedAlgorithm {
  did: String
  filesChecksum: String
  containerSectionChecksum: String
}

type ServiceComputeOptions {
  allowRawAlgorithm: Boolean
  allowNetworkAccess: Boolean
  publisherTrustedAlgorithmPublishers: [String]
  publisherTrustedAlgorithms: [PublisherTrustedAlgorithm]
}

type Service {
  id: String
  files: String
  datatokenAddress: String
  serviceEndpoint: String
  timeout: Int
  name: String
  description: String
  compute: ServiceComputeOptions
  additionalInformation: AdditionalInformation
}

type Credential {
  type: String!
  values: [String]!
}

type Credentials {
  allow: [Credential]!
  deny: [Credential]!
}

type Event {
  txid: String
  block: Int
  from: String
  contract: String
  datetime: String
}

type Asset {
    context: [String]
    id: String
    version: String
    nftAddress: String
    chainId: Int
    metadata: Metadata
    services: [Service]
    credentials: Credentials
    event: Event
}

type AssetNft {
  address: String
  name: String
  symbol: String
  owner: String
  state: Int
  created: String
  tokenURI: String
}

type AssetDataToken {
  address: String
  name: String
  symbol: String
  serviceId: String
}

type AssetPrice {
  value: Int
  tokenSymbol: String
  tokenAddress: String
}

type Stats {
  orders: Int
  price: AssetPrice
  allocated: Int
}

type Purgatory {
  state: Boolean
  reason: String
}

extend type Asset {
  nft: AssetNft
  datatokens: [AssetDataToken]
  event: Event
  stats: Stats
  purgatory: Purgatory
}

type PagedAssets {
  results: [Asset]
  page: Int
  totalPages: Int
  totalResults: Int
}
`
export default schema
