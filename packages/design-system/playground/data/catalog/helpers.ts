import type { CatalogCompositionPart, CatalogEvent, CatalogModel, CatalogProp, CatalogSlot } from './types'

export function p(
  name: string,
  type: string,
  defaultValue?: string,
  description?: string,
): CatalogProp {
  return { name, type, default: defaultValue, description }
}

export function m(
  name: string,
  type: string,
  defaultValue?: string,
  description?: string,
): CatalogModel {
  return { name, type, default: defaultValue, description }
}

export function s(name: string, bindings?: string, description?: string): CatalogSlot {
  return { name, bindings, description }
}

export function e(name: string, payload?: string, description?: string): CatalogEvent {
  return { name, payload, description }
}

export function cls(description = 'Additional CSS classes'): CatalogProp {
  return { name: 'class', type: 'string', description }
}

export function c(
  name: string,
  description?: string,
  optional = false,
): CatalogCompositionPart {
  return { name, description, optional }
}
