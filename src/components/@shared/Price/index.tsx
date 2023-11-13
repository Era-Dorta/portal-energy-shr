import React, { ReactElement } from 'react'
import PriceUnit from './PriceUnit'
import { AssetPrice } from '@oceanprotocol/lib'

export default function Price({
  price,
  orderPriceAndFees,
  className,
  size
}: {
  price: AssetPrice
  orderPriceAndFees?: OrderPriceAndFees
  assetId?: string
  className?: string
  size?: 'small' | 'mini' | 'large'
}): ReactElement {
  if (!price && !orderPriceAndFees) return

  return (
    <PriceUnit
      price={Number(orderPriceAndFees?.price) || price?.value}
      symbol={price?.tokenSymbol}
      className={className}
      size={size}
    />
  )
}
