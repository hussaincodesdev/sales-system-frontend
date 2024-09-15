import { useAuth } from "@/context/AuthContext";
import EntityViewPage from "@/components/EntityViewPage";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { User } from "@/types/user";
import {
  deleteSalesCoach,
  exportSalesCoach,
  getSalesCoaches,
} from "@/api/user";
import AddNewSalesCoachDialog from "@/components/sales-coaches/AddNewSalesCoachDialog";

const salesCoachColumns = [
  { header: "First Name", accessor: "first_name" },
  { header: "Last Name", accessor: "last_name" },
  { header: "Email", accessor: "email" },
  { header: "Mobile", accessor: "mobile" },
  {
    header: "Active",
    accessor: "is_active",
    type: "boolean",
    render: (value: boolean) =>
      value ? (
        <span className="text-green-500">Yes</span>
      ) : (
        <span className="text-red-500">No</span>
      ),
  },
];

const SalesCoachesViewPage = () => {
  const { userToken } = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState<User | null>(null);
  const queryClient = useQueryClient();

  const fetchSalesCoaches: () => Promise<User[] | null> = () =>
    getSalesCoaches({ token: userToken });

  const deleteMutation = useMutation(
    (id: number) => deleteSalesCoach({ token: userToken, id }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("Sales Coaches");
        setIsDeleteDialogOpen(false);
      },
    }
  );

  const exportMutation = useMutation(
    () => exportSalesCoach({ token: userToken }),
    {
      onSuccess: async (data) => {
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `sales_coaches_export.csv`);

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

  return (
    <>
      <EntityViewPage
        title="Sales Coaches"
        data={[]}
        columns={salesCoachColumns}
        AddDialogComponent={AddNewSalesCoachDialog}
        fetchData={fetchSalesCoaches}
        onDelete={handleDelete}
        handleExport={handleExport}
      />

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
        title="Delete Sales Coach"
        description="Are you sure you want to delete this coach? This action cannot be undone."
      />
    </>
  );
};

export default SalesCoachesViewPage;
