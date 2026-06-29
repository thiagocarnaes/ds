<script setup lang="ts">
import { useRouter } from 'vue-router'
import PlaygroundHero from '../components/PlaygroundHero.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import HomeQuickNavSection from '../components/HomeQuickNavSection.vue'
import HomePurposeSection from '../components/HomePurposeSection.vue'
import HomePrinciplesSection from '../components/HomePrinciplesSection.vue'
import HomeQuickStartSection from '../components/HomeQuickStartSection.vue'
import HomeChangelogSection from '../components/HomeChangelogSection.vue'

const router = useRouter()
</script>

<template>
  <PlaygroundHero :full-landing="true" />

  <HomeQuickNavSection />
  <HomePurposeSection />
  <HomePrinciplesSection />
  <HomeQuickStartSection @docs="router.push('/docs')" />
  <HomeChangelogSection />
</template>
