import { useAuth } from "@/context/AuthContext";
import EntityViewPage from "@/components/EntityViewPage";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Commission, CommissionStatus } from "@/types/commission";
import {
  deleteCommission,
  exportCommission,
  getAllCommissions,
  getCommissions,
  postMarkCommissionAsDue,
  postMarkCommissionAsPaid,
} from "@/api/commission";
import AddNewCommissionDialog from "@/components/commissions/AddNewCommissionDialog";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { USER_ROLE } from "@/utils/constants";

interface ICommission extends Commission {
  agent_first_name: string;
  agent_last_name: string;
  coach_first_name: string;
  coach_last_name: string;
}

const commissionColumns = [
  { header: "Agent Name", accessor: "agent_name" },
  { header: "Coach Name", accessor: "coach_name" },
  { header: "Amount", accessor: "amount" },
  {
    header: "Status",
    accessor: "commission_status",
    render: (value: CommissionStatus) => {
      return (
        <Badge
          variant={value === "due" ? "secondary" : "default"}
          className="capitalize"
        >
          {value === "due" ? "Due" : "Paid"}
        </Badge>
      );
    },
  },
];

const CommissionsViewPage = () => {
  const { userToken, userInfo } = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState<Commission | null>(null);
  const queryClient = useQueryClient();

  const fetchCommissions = () => {
    if (userInfo?.role === USER_ROLE.ADMIN) {
      return getAllCommissions({ token: userToken });
    }

    return getCommissions({ token: userToken });
  };

  const deleteMutation = useMutation(
    (id: number) => deleteCommission({ token: userToken, id }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("Commissions");
        toast({
          title: "Commission deleted successfully",
          description: "The commission has been successfully deleted.",
          variant: "success",
        });
        setIsDeleteDialogOpen(false);
      },
    }
  );

  const exportMutation = useMutation(
    () => exportCommission({ token: userToken }),
    {
      onSuccess: async (data) => {
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `commissions_export.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      },
    }
  );

  const markCommissionPaid = useMutation(
    (id: number) => postMarkCommissionAsPaid({ token: userToken, id }),
    {
      onSuccess: () => {
        toast({
          title: "Commission marked as paid",
          description: "The commission has been successfully marked as paid.",
          variant: "success",
        });
        queryClient.invalidateQueries("Commissions");
      },
    }
  );

  const markCommissionDue = useMutation(
    (id: number) => postMarkCommissionAsDue({ token: userToken, id }),
    {
      onSuccess: () => {
        toast({
          title: "Commission marked as due",
          description: "The commission has been successfully marked as due.",
          variant: "success",
        });
        queryClient.invalidateQueries("Commissions");
      },
    }
  );

  const handleDelete = (commission: Commission) => {
    setEntityToDelete(commission);
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

  const handlePaid = (commission: Commission) => {
    markCommissionPaid.mutate(commission.id);
  };

  const handleDue = (commission: Commission) => {
    markCommissionDue.mutate(commission.id);
  };

  return (
    <>
      <EntityViewPage
        title="Commissions"
        data={[]}
        columns={commissionColumns}
        AddDialogComponent={AddNewCommissionDialog}
        fetchData={fetchCommissions}
        onDelete={handleDelete}
        handleExport={handleExport}
        togglePaid={true}
        onPaid={handlePaid}
        onDue={handleDue}
      />

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
        title="Delete Commission"
        description="Are you sure you want to delete this commission? This action cannot be undone."
      />
    </>
  );
};

export default CommissionsViewPage;
