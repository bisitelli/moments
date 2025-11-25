import DropdownInput from "@/components/shared/drop_down_input";
import { FilterTag, FilterTagLabel } from "@/domain/model/enums/filter_tag";
import React from "react";

interface UseEventFilterProps {
  onClose: () => void;
  onLocationChange: (location: string) => void;
  onDateChange: (date: string) => void;
  onModeChange: (mode: FilterTag) => void;
}

export function useEventFilter({
  onClose,
  onLocationChange,
  onDateChange,
  onModeChange
}: UseEventFilterProps): [string, () => React.ReactNode][] {

  const filterOptions: [string, () => React.ReactNode][] = [
      [
        FilterTagLabel[FilterTag.Location],
        () => (
          <DropdownInput
            label="Introduce a location"
            onSubmit={(value) => {
              const trimmed = value.trim();
              if (!trimmed) return;

              // 1. Update the specific data state
              onLocationChange(trimmed);
              
              // 2. Switch the mode to Location
              onModeChange(FilterTag.Location);
            
              // 3. Close the modal (The useEffect in DiscoverPage will trigger the fetch)
              onClose();
            }}
            onCancel={() => onClose()}
          />
        ),
      ],

      [
        // TODO: Format date & create another component for it
        FilterTagLabel[FilterTag.Date],
          () => (
            <DropdownInput
              label="Enter a date (YYYY-MM-DD)"
              onSubmit={(value) => {
                const trimmed = value.trim();
                if (!trimmed) return;

                // 1. Update the specific data state
                onDateChange(trimmed);

                // 2. Switch the mode to Date
                onModeChange(FilterTag.Date);

                // 3. Close
                onClose();
              }}
              onCancel={() => onClose()}
            />
          ),
      ],
  ];
  return filterOptions;
}