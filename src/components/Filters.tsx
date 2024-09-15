import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { X } from "lucide-react";

interface IFilter {
  key: string;
  title: string;
  type: "string" | "number" | "date" | "boolean" | "dateRange" | "select";
  value: string | number | boolean | DateRange | undefined;
  options?: { value: string; label: string }[];
}

interface FiltersProps {
  title?: string;
  filters: IFilter[];
  filterValues: {
    [key: string]: string | number | boolean | DateRange | undefined;
  };
  onFilterChange: (
    key: string,
    value: string | number | boolean | DateRange | undefined
  ) => void;
  onClearFilters: () => void;
}

const Filters = ({
  title,
  filters,
  filterValues,
  onFilterChange,
  onClearFilters,
}: FiltersProps) => {
  const hasActiveFilters = Object.values(filterValues).some(
    (value) => value !== undefined && value !== "all"
  );

  return (
    <div className="mb-4">
      {title && <h2 className="text-xl font-semibold mb-3">{title}</h2>}
      <div className="flex justify-between items-end">
        <div className="flex flex-wrap gap-4 items-end">
          {filters.map((filter) => (
            <div key={filter.key} className="flex flex-col">
              <label className="text-sm font-medium mb-1">{filter.title}</label>
              {filter.type === "string" && (
                <Input
                  type="text"
                  placeholder={`Filter by ${filter.title}`}
                  value={(filterValues[filter.key] as string) || ""}
                  onChange={(e) => onFilterChange(filter.key, e.target.value)}
                  className="w-[200px]"
                />
              )}
              {filter.type === "number" && (
                <Input
                  type="number"
                  placeholder={`Filter by ${filter.title}`}
                  value={(filterValues[filter.key] as number) || ""}
                  onChange={(e) =>
                    onFilterChange(filter.key, Number(e.target.value))
                  }
                  className="w-[200px]"
                />
              )}
              {filter.type === "boolean" && (
                <Select
                  value={String(filterValues[filter.key] ?? "all")}
                  onValueChange={(value) =>
                    onFilterChange(
                      filter.key,
                      value === "all" ? undefined : value === "true"
                    )
                  }
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder={`Filter by ${filter.title}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {filter.options ? (
                      filter.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))
                    ) : (
                      <>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              )}
              {filter.type === "dateRange" && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-[300px] justify-start text-left font-normal ${
                        !filterValues[filter.key] && "text-muted-foreground"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filterValues[filter.key] ? (
                        formatDateRange(filterValues[filter.key] as DateRange)
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={
                        (filterValues[filter.key] as DateRange)?.from
                      }
                      selected={filterValues[filter.key] as DateRange}
                      onSelect={(range) => onFilterChange(filter.key, range)}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              )}
              {filter.type === "select" && (
                <Select
                  value={filterValues[filter.key]?.toString() || "all"}
                  onValueChange={(value) =>
                    onFilterChange(
                      filter.key,
                      value === "all" ? undefined : value
                    )
                  }
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder={`Filter by ${filter.title}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {filter.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ))}
        </div>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="flex items-center ml-4"
          >
            <X className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};

function formatDateRange(range: DateRange | undefined) {
  if (!range) return "";
  const { from, to } = range;
  if (from && to) {
    return `${format(from, "LLL dd, y")} - ${format(to, "LLL dd, y")}`;
  }
  if (from) {
    return `From ${format(from, "LLL dd, y")}`;
  }
  if (to) {
    return `To ${format(to, "LLL dd, y")}`;
  }
  return "";
}

export default Filters;
