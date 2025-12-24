'use client'

import { Sheet, SheetContent } from '@/components/ui/sheet'
import { FilterSidebar } from './filter-sidebar'
import { useAppStore } from '@/lib/store'

export function FilterSheet() {
  const isFilterSheetOpen = useAppStore((s) => s.isFilterSheetOpen)
  const setFilterSheetOpen = useAppStore((s) => s.setFilterSheetOpen)

  return (
    <Sheet open={isFilterSheetOpen} onOpenChange={setFilterSheetOpen}>
      <SheetContent side="bottom" className="h-[85vh] p-0 rounded-t-2xl">
        <FilterSidebar
          showCloseButton
          onClose={() => setFilterSheetOpen(false)}
          className="h-full"
        />
      </SheetContent>
    </Sheet>
  )
}

