import type { Component } from 'vue'
import DateInputDemo from './DateInputDemo.vue'
import DialogDemo from './DialogDemo.vue'
import FormFieldDemo from './FormFieldDemo.vue'
import InputDemo from './InputDemo.vue'
import LayoutPrimitivesDemo from './LayoutPrimitivesDemo.vue'
import OverlayDrawerDemo from './OverlayDrawerDemo.vue'
import PopoverDemo from './PopoverDemo.vue'
import ProgressDemo from './ProgressDemo.vue'
import RadioGroupDemo from './RadioGroupDemo.vue'
import SkeletonDemo from './SkeletonDemo.vue'
import SwitchDemo from './SwitchDemo.vue'
import TooltipDemo from './TooltipDemo.vue'

export const playgroundDemoRegistry: Record<string, Component> = {
  Input: InputDemo,
  DateInput: DateInputDemo,
  Switch: SwitchDemo,
  RadioGroup: RadioGroupDemo,
  FormField: FormFieldDemo,
  Dialog: DialogDemo,
  Drawer: OverlayDrawerDemo,
  Tooltip: TooltipDemo,
  Popover: PopoverDemo,
  Progress: ProgressDemo,
  Skeleton: SkeletonDemo,
  'Layout Primitives': LayoutPrimitivesDemo,
}

export function getPlaygroundDemoComponent(name: string): Component | undefined {
  return playgroundDemoRegistry[name]
}
