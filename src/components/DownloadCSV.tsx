import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { formatDate } from "@/utils/formatDateAndTime";

interface DownloadCSVProps {
  data: Record<string, any>[];
  fileName: string;
  columns: { header: string; accessor: string; type?: string }[];
}

const DownloadCSV: React.FC<DownloadCSVProps> = ({
  data,
  fileName,
  columns,
}) => {
  const formatValue = (value: any, type?: string): string => {
    if (value === undefined || value === null) return "";

    switch (type) {
      case "date":
        return formatDate(value);
      case "boolean":
        return value ? "Yes" : "No";
      default:
        return String(value);
    }
  };

  const convertToCSV = (objArray: Record<string, any>[]): string => {
    const array =
      typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
    let str = columns.map((col) => col.header).join(",") + "\r\n";

    for (let i = 0; i < array.length; i++) {
      let line = columns
        .map((col) => {
          let value = formatValue(array[i][col.accessor], col.type);
          return `"${value}"`;
        })
        .join(",");
      str += line + "\r\n";
    }
    return str;
  };

  const downloadCSV = (): void => {
    const csvData = new Blob([convertToCSV(data)], { type: "text/csv" });
    const csvURL = URL.createObjectURL(csvData);
    const link = document.createElement("a");
    link.href = csvURL;
    link.download = `${fileName}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      type="button"
      onClick={downloadCSV}
      className="px-4 py-2 bg-gray-800 text-white rounded-lg flex items-center space-x-2"
    >
      <Download className="w-4 h-4" />
      <span>Export</span>
    </Button>
  );
};

export default DownloadCSV;
