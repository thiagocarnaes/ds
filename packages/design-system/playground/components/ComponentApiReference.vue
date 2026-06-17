<script setup lang="ts">
import type {
  CatalogEvent,
  CatalogModel,
  CatalogProp,
  CatalogSlot,
  ComponentCatalogEntry,
} from '../data/catalog/types'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'

defineProps<{ entry: ComponentCatalogEntry }>()

const { t } = usePlaygroundLocale()

function hasRows<T>(rows: T[] | undefined): rows is T[] {
  return Boolean(rows?.length)
}
</script>

<template>
  <div class="space-y-5">
    <section v-if="entry.composable">
      <h5 class="pg-text-muted mb-2 font-mono text-[10px] uppercase tracking-wider">
        {{ t('componentCatalog.composableHeading', { name: entry.composable.name }) }}
      </h5>
      <p v-if="entry.composable.description" class="pg-text-subtle mb-3 text-xs leading-relaxed">
        {{ entry.composable.description }}
      </p>
      <div class="overflow-x-auto rounded-lg border" style="border-color: var(--pg-border)">
        <table class="w-full min-w-[28rem] text-left text-xs">
          <thead class="pg-playground-row">
            <tr>
              <th class="px-3 py-2 font-mono font-medium">{{ t('componentCatalog.colName') }}</th>
              <th class="px-3 py-2 font-mono font-medium">{{ t('componentCatalog.colSignature') }}</th>
              <th class="px-3 py-2 font-mono font-medium">{{ t('componentCatalog.colDescription') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in entry.composable.methods"
              :key="row.name"
              class="border-t"
              style="border-color: var(--pg-border)"
            >
              <td class="px-3 py-2 font-mono text-primary">{{ row.name }}</td>
              <td class="pg-text-subtle px-3 py-2 font-mono">{{ row.signature }}</td>
              <td class="pg-text-subtle px-3 py-2">{{ row.description ?? '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section v-if="hasRows(entry.models)">
      <h5 class="pg-text-muted mb-2 font-mono text-[10px] uppercase tracking-wider">
        {{ t('componentCatalog.modelsHeading') }}
      </h5>
      <div class="overflow-x-auto rounded-lg border" style="border-color: var(--pg-border)">
        <table class="w-full min-w-[32rem] text-left text-xs">
          <thead class="pg-playground-row">
            <tr>
              <th class="px-3 py-2 font-mono font-medium">{{ t('componentCatalog.colName') }}</th>
              <th class="px-3 py-2 font-mono font-medium">{{ t('componentCatalog.colType') }}</th>
              <th class="px-3 py-2 font-mono font-medium">{{ t('componentCatalog.colDefault') }}</th>
              <th class="px-3 py-2 font-mono font-medium">{{ t('componentCatalog.colDescription') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in entry.models"
              :key="row.name"
              class="border-t"
              style="border-color: var(--pg-border)"
            >
              <td class="px-3 py-2 font-mono text-primary">{{ row.name }}</td>
              <td class="pg-text-subtle px-3 py-2 font-mono">{{ row.type }}</td>
              <td class="pg-text-muted px-3 py-2 font-mono">{{ row.default ?? '—' }}</td>
              <td class="pg-text-subtle px-3 py-2">{{ row.description ?? '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section v-if="hasRows(entry.props)">
      <h5 class="pg-text-muted mb-2 font-mono text-[10px] uppercase tracking-wider">
        {{ t('componentCatalog.propsHeading') }}
      </h5>
      <div class="overflow-x-auto rounded-lg border" style="border-color: var(--pg-border)">
        <table class="w-full min-w-[32rem] text-left text-xs">
          <thead class="pg-playground-row">
            <tr>
              <th class="px-3 py-2 font-mono font-medium">{{ t('componentCatalog.colName') }}</th>
              <th class="px-3 py-2 font-mono font-medium">{{ t('componentCatalog.colType') }}</th>
              <th class="px-3 py-2 font-mono font-medium">{{ t('componentCatalog.colDefault') }}</th>
              <th class="px-3 py-2 font-mono font-medium">{{ t('componentCatalog.colDescription') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in entry.props"
              :key="row.name"
              class="border-t"
              style="border-color: var(--pg-border)"
            >
              <td class="px-3 py-2 font-mono text-primary">{{ row.name }}</td>
              <td class="pg-text-subtle px-3 py-2 font-mono">{{ row.type }}</td>
              <td class="pg-text-muted px-3 py-2 font-mono">{{ row.default ?? '—' }}</td>
              <td class="pg-text-subtle px-3 py-2">{{ row.description ?? '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section v-if="hasRows(entry.slots)">
      <h5 class="pg-text-muted mb-2 font-mono text-[10px] uppercase tracking-wider">
        {{ t('componentCatalog.slotsHeading') }}
      </h5>
      <div class="overflow-x-auto rounded-lg border" style="border-color: var(--pg-border)">
        <table class="w-full min-w-[28rem] text-left text-xs">
          <thead class="pg-playground-row">
            <tr>
              <th class="px-3 py-2 font-mono font-medium">{{ t('componentCatalog.colName') }}</th>
              <th class="px-3 py-2 font-mono font-medium">{{ t('componentCatalog.colBindings') }}</th>
              <th class="px-3 py-2 font-mono font-medium">{{ t('componentCatalog.colDescription') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in entry.slots"
              :key="row.name"
              class="border-t"
              style="border-color: var(--pg-border)"
            >
              <td class="px-3 py-2 font-mono text-primary">{{ row.name }}</td>
              <td class="pg-text-subtle px-3 py-2 font-mono">{{ row.bindings ?? '—' }}</td>
              <td class="pg-text-subtle px-3 py-2">{{ row.description ?? '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section v-if="hasRows(entry.events)">
      <h5 class="pg-text-muted mb-2 font-mono text-[10px] uppercase tracking-wider">
        {{ t('componentCatalog.eventsHeading') }}
      </h5>
      <div class="overflow-x-auto rounded-lg border" style="border-color: var(--pg-border)">
        <table class="w-full min-w-[28rem] text-left text-xs">
          <thead class="pg-playground-row">
            <tr>
              <th class="px-3 py-2 font-mono font-medium">{{ t('componentCatalog.colName') }}</th>
              <th class="px-3 py-2 font-mono font-medium">{{ t('componentCatalog.colPayload') }}</th>
              <th class="px-3 py-2 font-mono font-medium">{{ t('componentCatalog.colDescription') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in entry.events"
              :key="row.name"
              class="border-t"
              style="border-color: var(--pg-border)"
            >
              <td class="px-3 py-2 font-mono text-primary">{{ row.name }}</td>
              <td class="pg-text-subtle px-3 py-2 font-mono">{{ row.payload ?? '—' }}</td>
              <td class="pg-text-subtle px-3 py-2">{{ row.description ?? '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
