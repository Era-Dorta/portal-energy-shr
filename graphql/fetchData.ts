import axios, { CancelToken } from 'axios'
import pagedAssetsQuery from './queries/getResults'
import { AggregationResult, GetResultsParams } from '@components/Search/utils'
import aggregationQuery from './queries/getAggregations'

export const getPagedAssets = async (
  params: GetResultsParams,
  cancelToken?: CancelToken
): Promise<PagedAssets> => {
  const config = {
    method: 'post',
    url: 'http://localhost:8000/api/graphql',
    headers: {
      'Content-Type': 'application/json'
    },
    data: JSON.stringify({
      query: pagedAssetsQuery,
      variables: { params }
    }),
    cancelToken
  }
  const result = (await axios(config)).data // Retrieve data object from Axios
  return result?.data?.pagedAssets
}

export const getAggregations = async (
  params: GetResultsParams,
  cancelToken?: CancelToken
): Promise<AggregationResult[]> => {
  const config = {
    method: 'post',
    url: 'http://localhost:8000/api/graphql',
    headers: {
      'Content-Type': 'application/json'
    },
    data: JSON.stringify({
      query: aggregationQuery,
      variables: { params }
    }),
    cancelToken
  }
  const result = (await axios(config)).data // Retrieve data object from Axios
  return result?.data?.aggregations
}
