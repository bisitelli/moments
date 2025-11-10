
export enum FilterTag {
    Location,
    Date,
    Interests
}

// Wraps it into a string
export const FilterTagLabel: Record<FilterTag, string> = {
  [FilterTag.Location]: "Location",
  [FilterTag.Date]: "Date",
  [FilterTag.Interests]: "Interests",
};