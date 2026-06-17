export interface CatalogProp {
  name: string
  type: string
  default?: string
  description?: string
}

export interface CatalogSlot {
  name: string
  bindings?: string
  description?: string
}

export interface CatalogModel {
  name: string
  type: string
  default?: string
  description?: string
}

export interface CatalogEvent {
  name: string
  payload?: string
  description?: string
}

export interface CatalogComposableMethod {
  name: string
  signature: string
  description?: string
}

export interface CatalogComposable {
  name: string
  description?: string
  /** Options object accepted by composable methods (e.g. ShowToastOptions). */
  optionsName?: string
  options?: CatalogProp[]
  methods: CatalogComposableMethod[]
}

export interface CatalogCompositionPart {
  name: string
  optional?: boolean
  description?: string
}

export interface CatalogComposition {
  description?: string
  parts: CatalogCompositionPart[]
}

export interface ComponentCatalogEntry {
  usage: string
  props?: CatalogProp[]
  models?: CatalogModel[]
  slots?: CatalogSlot[]
  events?: CatalogEvent[]
  composable?: CatalogComposable
  composition?: CatalogComposition
}
