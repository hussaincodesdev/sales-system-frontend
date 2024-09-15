import { useAuth } from "@/context/AuthContext";
import EntityViewPage from "@/components/EntityViewPage";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { User, UserRole } from "@/types/user";
import {
  deleteSalesAgent,
  exportSalesAgent,
  getCoachAgents,
  getSalesAgents,
} from "@/api/user";
import AddNewSalesAgentDialog from "@/components/sales-agents/AddNewSalesAgentDialog";
import useAuthenticatedUserInfo from "@/hooks/useAuthenticatedUserInfo";
import { toast } from "@/components/ui/use-toast";
import { USER_ROLE } from "@/utils/constants";
import { DateRange } from "react-day-picker";
import { formatDate } from "@/utils/formatDateAndTime";

interface IFilter {
  key: string;
  title: string;
  type: "string" | "number" | "date" | "boolean" | "dateRange" | "select";
  value: string | number | boolean | DateRange | undefined;
  options?: { value: string; label: string }[];
}

const SalesAgentsViewPage = ({ role }: { role: UserRole }) => {
  const salesAgentColumns = [
    { header: "First Name", accessor: "first_name" },
    { header: "Last Name", accessor: "last_name" },
    { header: "Email", accessor: "email" },
    { header: "Mobile", accessor: "mobile" },
    {
      header: "Date Joined",
      accessor: "created_at",
      render: (value: string) => <>{formatDate(value)}</>,
    },
    ...(role === "admin" ? [{ header: "Coach", accessor: "coach_name" }] : []),
    {
      header: "Status",
      accessor: "status",
      render: (value: string) =>
        value === "active" ? (
          <span className="text-green-500">Active</span>
        ) : value === "frozen" ? (
          <span className="text-red-500">Frozen</span>
        ) : (
          <span className="text-gray-500">{value}</span>
        ),
    },
  ];

  const { userToken } = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState<User | null>(null);
  const queryClient = useQueryClient();

  const fetchSalesAgents: () => Promise<User[] | null> = () => {
    if (role === USER_ROLE.SALES_COACH) {
      return getCoachAgents({ token: userToken });
    }

    return getSalesAgents({ token: userToken });
  };

  const deleteMutation = useMutation(
    (id: number) => deleteSalesAgent({ token: userToken, id }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("Sales Agents");
        toast({
          title: "Sales Agent deleted successfully",
          description: "The sales agent has been successfully deleted.",
          variant: "success",
        });
        setIsDeleteDialogOpen(false);
      },
    }
  );

  const exportMutation = useMutation(
    () => exportSalesAgent({ token: userToken }),
    {
      onSuccess: async (data) => {
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `sales_agents_export.csv`);

        document.body.appendChild(link);
        link.click();
        link.remove();
      },
    }
  );

  const handleDelete = (user: User) => {
    setEntityToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (entityToDelete) {
      deleteMutation.mutate(entityToDelete.id);
    }
  };

  const handleExport = () => {
    exportMutation.mutate();
  };

  const filters: IFilter[] = [
    {
      key: "first_name",
      title: "First Name",
      type: "string",
      value: undefined,
    },
    {
      key: "last_name",
      title: "Last Name",
      type: "string",
      value: undefined,
    },
    {
      key: "status",
      title: "Status",
      type: "select",
      value: undefined,
      options: [
        { value: "active", label: "Active" },
        { value: "frozen", label: "Frozen" },
      ],
    },
    ...(role === USER_ROLE.ADMIN
      ? [
          {
            key: "coach_name",
            title: "Coach",
            type: "select" as const,
            value: undefined,
          },
        ]
      : []),
    {
      key: "created_at",
      title: "Date Joined",
      type: "dateRange",
      value: undefined,
    },
  ];

  return (
    <>
      <EntityViewPage
        title="Sales Agents"
        data={[]}
        columns={salesAgentColumns}
        AddDialogComponent={AddNewSalesAgentDialog}
        fetchData={fetchSalesAgents}
        onDelete={handleDelete}
        handleExport={handleExport}
        filters={filters}
      />

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
        title="Delete Sales Agent"
        description="Are you sure you want to delete this agent? This action cannot be undone."
      />
    </>
  );
};

export default SalesAgentsViewPage;
