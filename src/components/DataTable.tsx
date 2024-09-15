import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Check,
  Edit,
  MoreVertical,
  Trash2,
  X,
} from "lucide-react";

interface Column {
  header: string;
  accessor: string;
  isRightAligned?: boolean;
  render?: (value: any) => JSX.Element;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  onEdit: (row: any) => void;
  onDelete?: (row: any) => void;
  toggleComplete?: boolean;
  togglePaid?: boolean;
  onPaid?: (entity: any) => void;
  onDue?: (entity: any) => void;
  onComplete?: (entity: any) => void;
  onIncomplete?: (entity: any) => void;
  readonly?: boolean;
}

const DataTable = ({
  data,
  columns,
  onEdit,
  onDelete,
  toggleComplete,
  togglePaid,
  onPaid,
  onDue,
  onComplete,
  onIncomplete,
  readonly,
}: DataTableProps) => {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertTriangle className="w-16 h-16 text-gray-500 mb-4" />
        <span className="text-xl text-gray-500">No data available</span>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead
                key={index}
                className={column.isRightAligned ? "text-right" : ""}
              >
                {column.header}
              </TableHead>
            ))}
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column, colIndex) => (
                <TableCell
                  key={colIndex}
                  className={column.isRightAligned ? "text-right" : ""}
                >
                  {column.render
                    ? column.render(row[column.accessor])
                    : row[column.accessor]}
                </TableCell>
              ))}
              {!readonly && (
                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        className="px-2 py-1 bg-transparent hover:bg-transparent"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      {togglePaid &&
                        onDue &&
                        row.commission_status === "paid" && (
                          <div
                            className="flex items-center space-x-2 p-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => onDue(row)}
                          >
                            <X className="w-4 h-4" />
                            <span>Mark as Due</span>
                          </div>
                        )}
                      {togglePaid &&
                        onPaid &&
                        row.commission_status === "due" && (
                          <div
                            className="flex items-center space-x-2 p-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => onPaid(row)}
                          >
                            <Check className="w-4 h-4" />
                            <span>Mark as Paid</span>
                          </div>
                        )}
                      {toggleComplete &&
                        onComplete &&
                        row.application_status === "incomplete" && (
                          <div
                            className="flex items-center space-x-2 p-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => onComplete(row)}
                          >
                            <Check className="w-4 h-4" />
                            <span>Mark as Completed</span>
                          </div>
                        )}
                      {toggleComplete &&
                        onIncomplete &&
                        row.application_status === "completed" && (
                          <div
                            className="flex items-center space-x-2 p-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => onIncomplete(row)}
                          >
                            <X className="w-4 h-4" />
                            <span>Mark as Incomplete</span>
                          </div>
                        )}
                      <div
                        className="flex items-center space-x-2 p-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => onEdit(row)}
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </div>
                      {onDelete && (
                        <div
                          className="flex items-center space-x-2 p-2 cursor-pointer hover:bg-gray-100"
                          onClick={() => onDelete(row)}
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
