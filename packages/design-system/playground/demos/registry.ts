import type { Component } from 'vue'
import AvatarDemo from './AvatarDemo.vue'
import BadgeDemo from './BadgeDemo.vue'
import CheckboxDemo from './CheckboxDemo.vue'
import DataTableDemo from './DataTableDemo.vue'
import DateInputDemo from './DateInputDemo.vue'
import DialogDemo from './DialogDemo.vue'
import FormFieldDemo from './FormFieldDemo.vue'
import InputDemo from './InputDemo.vue'
import LayoutDemo from './LayoutDemo.vue'
import LayoutPrimitivesDemo from './LayoutPrimitivesDemo.vue'
import LozengeDemo from './LozengeDemo.vue'
import ModalDemo from './ModalDemo.vue'
import OverlayDrawerDemo from './OverlayDrawerDemo.vue'
import PaginationDemo from './PaginationDemo.vue'
import PopoverDemo from './PopoverDemo.vue'
import ProgressDemo from './ProgressDemo.vue'
import RadioGroupDemo from './RadioGroupDemo.vue'
import SkeletonDemo from './SkeletonDemo.vue'
import SpinnerDemo from './SpinnerDemo.vue'
import SwitchDemo from './SwitchDemo.vue'
import TabsDemo from './TabsDemo.vue'
import ToggleDemo from './ToggleDemo.vue'
import TooltipDemo from './TooltipDemo.vue'

export const playgroundDemoRegistry: Record<string, Component> = {
  Input: InputDemo,
  Badge: BadgeDemo,
  Avatar: AvatarDemo,
  Tabs: TabsDemo,
  Pagination: PaginationDemo,
  DataTable: DataTableDemo,
  Layout: LayoutDemo,
  Lozenge: LozengeDemo,
  Checkbox: CheckboxDemo,
  DateInput: DateInputDemo,
  Switch: SwitchDemo,
  Toggle: ToggleDemo,
  RadioGroup: RadioGroupDemo,
  FormField: FormFieldDemo,
  Dialog: DialogDemo,
  Modal: ModalDemo,
  Drawer: OverlayDrawerDemo,
  Tooltip: TooltipDemo,
  Popover: PopoverDemo,
  Progress: ProgressDemo,
  Skeleton: SkeletonDemo,
  Spinner: SpinnerDemo,
  'Layout Primitives': LayoutPrimitivesDemo,
}

export function getPlaygroundDemoComponent(name: string): Component | undefined {
  return playgroundDemoRegistry[name]
}
