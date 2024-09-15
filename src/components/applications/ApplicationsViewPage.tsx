import { useAuth } from "@/context/AuthContext";
import EntityViewPage from "@/components/EntityViewPage";
import { Application } from "@/types/application";
import {
  getApplications,
  deleteApplication,
  exportApplication,
  getAllApplications,
  getCoachApplications,
  exportCoachApplications,
  exportAllApplications,
  postMarkApplicationCompleted,
  postMarkApplicationIncomplete,
} from "@/api/application";
import { formatDate } from "@/utils/formatDateAndTime";
import AddNewApplicationDialog from "@/components/applications/AddNewApplicationDialog";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { UserRole } from "@/types/user";
import { USER_ROLE } from "@/utils/constants";
import { DateRange } from "react-day-picker";
import { toast } from "@/components/ui/use-toast";

interface IFilter {
  key: string;
  title: string;
  type: "string" | "number" | "date" | "boolean" | "dateRange" | "select";
  value: string | number | boolean | DateRange | undefined;
  options?: { value: string; label: string }[];
}

const ApplicationsViewPage = ({ role }: { role: UserRole }) => {
  const { userToken, userInfo } = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState<Application | null>(
    null
  );
  const queryClient = useQueryClient();

  const fetchApplications: () => Promise<Application[] | null> = () => {
    if (role === USER_ROLE.ADMIN) {
      return getAllApplications({ token: userToken });
    } else if (role === USER_ROLE.SALES_COACH) {
      return getCoachApplications({ token: userToken });
    }
    return getApplications({ token: userToken });
  };

  const deleteMutation = useMutation(
    (id: number) => deleteApplication({ token: userToken, id }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("Applications");
        setIsDeleteDialogOpen(false);
      },
    }
  );

  const exportMutation = useMutation(
    () =>
      userInfo?.role === USER_ROLE.SALES_COACH
        ? exportCoachApplications({ token: userToken })
        : userInfo?.role === USER_ROLE.ADMIN
        ? exportAllApplications({ token: userToken })
        : exportApplication({ token: userToken }),
    {
      onSuccess: async (data) => {
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `application_export.csv`);

        document.body.appendChild(link);
        link.click();
        link.remove();
      },
    }
  );

  const markApplicationCompleted = useMutation(
    (id: number) => postMarkApplicationCompleted({ token: userToken, id }),
    {
      onSuccess: () => {
        toast({
          title: "Application marked as completed",
          description:
            "The application has been successfully marked as completed.",
          variant: "success",
        });
        queryClient.invalidateQueries("Applications");
      },
    }
  );

  const markApplicationIncomplete = useMutation(
    (id: number) => postMarkApplicationIncomplete({ token: userToken, id }),
    {
      onSuccess: () => {
        toast({
          title: "Application marked as incomplete",
          description:
            "The application has been successfully marked as incomplete.",
          variant: "success",
        });
        queryClient.invalidateQueries("Applications");
      },
    }
  );

  const handleDelete = (application: Application) => {
    setEntityToDelete(application);
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

  const handleMarkAsCompleted = (application: Application) => {
    markApplicationCompleted.mutate(application.id);
  };

  const handleMarkAsIncomplete = (application: Application) => {
    markApplicationIncomplete.mutate(application.id);
  };

  const applicationColumns = [
    { header: "First Name", accessor: "first_name" },
    { header: "Last Name", accessor: "last_name" },
    { header: "Mobile", accessor: "mobile" },
    { header: "CPR", accessor: "cpr" },
    {
      header: "Submitted Date",
      accessor: "date_submitted",
      type: "date",
      render: (value: string) => <>{formatDate(value)}</>,
    },
    {
      header: "Completed",
      accessor: "application_status",
      render: (value: string) => (
        <span
          className={
            value === "completed"
              ? "text-green-600 bg-green-100 px-2 py-1 rounded w-16 text-center"
              : "text-red-600 bg-red-100 px-2 py-1 rounded w-16 text-center"
          }
        >
          {value === "completed" ? "Yes" : "No"}
        </span>
      ),
    },
  ];

  if (role === USER_ROLE.ADMIN || role === USER_ROLE.SALES_COACH) {
    applicationColumns.push({
      header: "Sales Agent",
      accessor: "sales_agent_name",
    });
  }

  const filters: IFilter[] = [
    {
      key: "application_status",
      title: "Completed",
      type: "select",
      value: undefined,
      options: [
        { value: "completed", label: "Completed" },
        { value: "incomplete", label: "Not Completed" },
      ],
    },
    {
      key: "date_submitted",
      title: "Date Submitted",
      type: "dateRange",
      value: undefined,
    },
  ];

  return (
    <>
      <EntityViewPage
        title="Applications"
        data={[]}
        columns={applicationColumns}
        AddDialogComponent={AddNewApplicationDialog}
        fetchData={fetchApplications}
        onDelete={handleDelete}
        handleExport={handleExport}
        readonly={role === USER_ROLE.ADMIN || role === USER_ROLE.SALES_COACH}
        filters={filters}
        toggleComplete={true}
        onComplete={handleMarkAsCompleted}
        onIncomplete={handleMarkAsIncomplete}
      />

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
        title="Delete Application"
        description="Are you sure you want to delete this application? This action cannot be undone."
      />
    </>
  );
};

export default ApplicationsViewPage;
