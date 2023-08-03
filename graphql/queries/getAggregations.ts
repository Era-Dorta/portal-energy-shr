const aggregationQuery = `
query getAggregations($params: Params) {
    aggregations(params: $params) {
        category
        keywords {
            label
            location
            filter {
               category
               location
               range {
                   value
                   operation
                }
                term {
                   value
                }
            }
            count
        }
    }
}
`
export default aggregationQuery
