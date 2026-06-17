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
  methods: CatalogComposableMethod[]
}

export interface ComponentCatalogEntry {
  usage: string
  props?: CatalogProp[]
  models?: CatalogModel[]
  slots?: CatalogSlot[]
  events?: CatalogEvent[]
  composable?: CatalogComposable
}
