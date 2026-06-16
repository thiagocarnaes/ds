import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { cn } from '@/lib/utils'

describe('utils', () => {
  it('merges tailwind classes', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })
})
