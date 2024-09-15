import { ComponentType, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DataTable from "@/components/DataTable";
import Loading from "@/components/Loading";
import { useQuery } from "react-query";
import Filters from "@/components/Filters";
import { DateRange } from "react-day-picker";
import DownloadCSV from "@/components/DownloadCSV";
import { getSalesCoaches } from "@/api/user";
import { useAuth } from "@/context/AuthContext";

interface IColumn {
  header: string;
  accessor: string;
  isRightAligned?: boolean;
  render?: (value: any) => JSX.Element;
}

interface IFilter {
  key: string;
  title: string;
  type: "string" | "number" | "date" | "boolean" | "dateRange" | "select";
  value: string | number | boolean | DateRange | undefined;
  options?: { value: string; label: string }[];
}

interface EntityViewPageProps {
  title: string;
  data: any[];
  columns: IColumn[];
  AddDialogComponent: ComponentType<any>;
  fetchData: () => Promise<any[] | null>;
  filters?: IFilter[];
  onDelete?: (entity: any) => void;
  handleExport: () => void;
  toggleComplete?: boolean;
  togglePaid?: boolean;
  onComplete?: (entity: any) => void;
  onIncomplete?: (entity: any) => void;
  onPaid?: (entity: any) => void;
  onDue?: (entity: any) => void;
  readonly?: boolean;
}

const EntityViewPage = ({
  title,
  data,
  columns,
  AddDialogComponent,
  fetchData,
  filters = [],
  onDelete,
  handleExport,
  toggleComplete,
  togglePaid,
  onComplete,
  onIncomplete,
  onPaid,
  onDue,
  readonly = false,
}: EntityViewPageProps) => {
  const { userToken } = useAuth();

  const [filterValues, setFilterValues] = useState<{
    [key: string]: string | number | boolean | DateRange | undefined;
  }>({});

  useEffect(() => {
    if (filters && filters.length > 0) {
      const initialFilters = filters.reduce((acc, filter) => {
        acc[filter.key] = filter.value;
        return acc;
      }, {} as { [key: string]: string | number | boolean | DateRange | undefined });
      setFilterValues(initialFilters);
    }
  }, [filters]);

  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const { data: fetchedData, isLoading } = useQuery([title], fetchData, {
    refetchOnWindowFocus: false,
  });

  const memoizedData = useMemo(() => fetchedData || data, [fetchedData, data]);

  const { data: salesCoaches } = useQuery("salesCoaches", () =>
    getSalesCoaches({ token: userToken })
  );

  const coachOptions = useMemo(() => {
    if (!salesCoaches) return [];
    return salesCoaches.map((coach) => ({
      value: `${coach.first_name} ${coach.last_name}`,
      label: `${coach.first_name} ${coach.last_name}`,
    }));
  }, [salesCoaches]);

  const updatedFilters: any = useMemo(() => {
    return filters.map((filter) => {
      if (filter.key === "coach_name") {
        return {
          ...filter,
          type: "select",
          options: coachOptions,
        };
      }
      return filter;
    });
  }, [filters, coachOptions]);

  const handleFilterChange = (
    key: string,
    value: string | number | boolean | DateRange | undefined
  ) => {
    setFilterValues((prevFilters) => ({
      ...prevFilters,
      [key]: value === "all" ? undefined : value,
    }));
  };

  const handleClearFilters = () => {
    const clearedFilters = filters.reduce((acc, filter) => {
      acc[filter.key] = filter.type === "select" ? "all" : undefined;
      return acc;
    }, {} as { [key: string]: string | undefined });
    setFilterValues(clearedFilters);
  };

  const handleEdit = (entity: any) => {
    setSelectedEntity(entity);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setSelectedEntity(null);
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  const filteredData = memoizedData.filter((item: any) =>
    Object.entries(filterValues).every(([key, filterValue]) => {
      if (filterValue === undefined || filterValue === "all") return true;

      const itemValue = item[key];

      if (key === "status") {
        return itemValue === filterValue;
      }

      if (key === "date_submitted" && filterValue instanceof Object) {
        const date = new Date(itemValue);
        return (
          (!filterValue.from || date >= filterValue.from) &&
          (!filterValue.to || date <= filterValue.to)
        );
      }

      if (key === "created_at" && filterValue instanceof Object) {
        const date = new Date(itemValue);
        return (
          (!filterValue.from || date >= filterValue.from) &&
          (!filterValue.to || date <= filterValue.to)
        );
      }

      if (typeof filterValue === "string") {
        return itemValue
          .toString()
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      }

      return itemValue === filterValue;
    })
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main className="flex-grow p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-medium">{title}</h1>
        <div className="flex space-x-2">
          <DownloadCSV
            data={filteredData}
            fileName={title.toLowerCase()}
            columns={columns}
          />
          {!readonly && (
            <Button
              type="button"
              onClick={handleAddNew}
              className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center space-x-2 hover:bg-green-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add New</span>
            </Button>
          )}
          <AddDialogComponent
            entity={selectedEntity}
            isOpen={isDialogOpen}
            setIsOpen={setIsDialogOpen}
            isEditMode={isEditMode}
          />
        </div>
      </div>
      <Filters
        filters={updatedFilters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />
      <DataTable
        data={filteredData}
        columns={columns}
        onEdit={handleEdit}
        onDelete={onDelete}
        toggleComplete={toggleComplete}
        onComplete={onComplete}
        onIncomplete={onIncomplete}
        togglePaid={togglePaid}
        onPaid={onPaid}
        onDue={onDue}
        readonly={readonly}
      />
    </main>
  );
};

export default EntityViewPage;
