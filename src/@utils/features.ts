import { LoggerInstance } from '@oceanprotocol/lib'

/**
 * Checks whether a feature is explicitly disabled. First checks a list of disabled features, which overrides the list of enabled features.
 *
 * Use full to disable standard/pre-existing features of the portal
 *
 * @param feature
 */
export function isFeatureDisabled(feature: Feature) {
  const disabledFeatures =
    process.env.NEXT_PUBLIC_FEATURES_DISABLED?.split(',') ?? []
  return disabledFeatures
    .map((val) => val.toLowerCase().trim())
    .some((val) => feature.startsWith(val))
}

/**
 * Checks whether a feature is enabled. First checks a list of disabled features, which overrides the list of enabled features.
 *
 * @param feature
 */
export function isFeatureEnabled(feature: Feature) {
  const disabled = isFeatureDisabled(feature)
  if (disabled) {
    LoggerInstance.log('Feature explicitly disabled: ', feature)
    return false
  }

  const enabledFeatures =
    process.env.NEXT_PUBLIC_FEATURES_ENABLED?.split(',') ?? []
  return enabledFeatures
    .map((val) => val.toLowerCase().trim())
    .some((val) => feature.startsWith(val))
}

export type Feature =
  | '/ui/menu/wallet'
  | '/ui/menu/prefs'
  | '/ui/web3/first-time'
  | '/ui/publish/wallet'
  | '/ui/publish/pii-checkbox'
  | '/ui/publish/pricing/fees'
  | '/ui/publish/pricing/paid'
  | '/ui/publish/self-description'
  | '/ui/publish/provider-url'
  | '/ui/asset/wallet'
  | '/ui/asset/edit-auth-only'
  | '/web3/wallet-selection'
  | '/web3/headless'
