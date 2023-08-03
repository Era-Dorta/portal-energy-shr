import appConfig from '../../app.config'
import {
  AggregationResult,
  formatGraphQLResults,
  getResults,
  GetResultsParams
} from '@components/Search/utils'
import { DDO } from '@oceanprotocol/lib'
import { GraphQLScalarType, Kind, StringValueNode } from 'graphql'

const deprecatedNetworks: number[] = [3, 4]

export const getChainIds = async (): Promise<number[]> => {
  const { chainIds } = appConfig
  return chainIds.filter((id) => !deprecatedNetworks.includes(id))
}

const resolvers = {
  Query: {
    aggregations: async (
      _: never,
      args: { params: GetResultsParams }
    ): Promise<AggregationResult[]> => {
      const result = await getResults(
        {
          ...args.params,
          faceted: true,
          offset: 1
        },
        await getChainIds()
      )

      return formatGraphQLResults(result)
    },
    pagedAssets: async (
      _: never,
      args: { params: GetResultsParams }
    ): Promise<PagedAssets> => {
      const result = await getResults(args.params, await getChainIds())
      return {
        ...result,
        results: result.results.map((a) => {
          return { ...a, context: (a as DDO)['@context'] }
        })
      }
    }
  },
  StringOrStringArray: new GraphQLScalarType({
    name: 'StringOrStringArray',
    description: 'String or String[] types',
    serialize(value) {
      let isOnlyStrings = false
      if (Array.isArray(value)) {
        isOnlyStrings = value.every((s) => typeof s === 'string')
      } else {
        isOnlyStrings = typeof value === 'string'
      }
      if (!isOnlyStrings) {
        throw new Error('Input must be String or String[]')
      }
      return value
    },
    parseValue(value) {
      let isOnlyStrings = false
      if (Array.isArray(value)) {
        isOnlyStrings = value.every((s) => typeof s === 'string')
      } else {
        isOnlyStrings = typeof value === 'string'
      }
      if (!isOnlyStrings) {
        throw new Error('Input must be either a String or a String[]')
      }
      return value
    },
    parseLiteral(ast) {
      switch (ast.kind) {
        case Kind.LIST:
          return ast.values.map((a) => a as StringValueNode).map((a) => a.value)
        case Kind.STRING:
          return ast.value
        default:
          throw new Error('Input must be either a String or a String[]')
      }
    }
  })
}

export default resolvers
