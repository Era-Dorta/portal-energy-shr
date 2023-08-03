const pagedAssetsQuery = `
  query Query($params: Params) {
    pagedAssets(params: $params) {
      page
      totalPages
      totalResults
      results {
        purgatory {
          state
          reason
        }
        version
        stats {
          orders
          price {
            value
            tokenSymbol
            tokenAddress
          }
          allocated
        }
        services {
          timeout
          name
          serviceEndpoint
          id
          files
          description
          datatokenAddress
          additionalInformation {
            gaiaXInformation {
              containsPII
              serviceSD {
                url
                isVerified
              }
              termsAndConditions {
                url
              }
            }
            geoJson
            termsAndConditions
          }
          compute {
            allowRawAlgorithm
            allowNetworkAccess
            publisherTrustedAlgorithmPublishers
            publisherTrustedAlgorithms {
              did
              filesChecksum
              containerSectionChecksum
            }
          }
        }
        nftAddress
        nft {
          address
          name
          symbol
          owner
          state
          created
          tokenURI
        }
        chainId
        context
        credentials {
          allow {
            type
            values
          }
          deny {
            type
            values
          }
        }
        id
        event {
          txid
          block
          from
          contract
          datetime
        }
        datatokens {
          address
          name
          symbol
          serviceId
        }
        metadata {
          additionalInformation {
            gaiaXInformation {
              containsPII
              serviceSD {
                url
                isVerified
              }
              termsAndConditions {
                url
              }
            }
            geoJson
            termsAndConditions
          }
          algorithm {
            language
            version
            rawcode
            container {
              entrypoint
              image
              tag
              checksum
            }
          }
          updated
          type
          tags
          name
          links
          license
          description
          created
          copyrightHolder
          contentLanguage
          categories
          author
        }
      }
    }
  }
`

export default pagedAssetsQuery
