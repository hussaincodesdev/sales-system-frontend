import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { INewCommission, Commission } from "@/types/commission";
import { createCommission, updateCommission } from "@/api/commission";
import { getCoachAgents, getSalesAgents } from "@/api/user";
import { USER_ROLE } from "@/utils/constants";

interface AddNewCommissionDialogProps {
  entity?: Commission | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isEditMode: boolean;
}

const AddNewCommissionDialog = ({
  entity,
  isOpen,
  setIsOpen,
  isEditMode,
}: AddNewCommissionDialogProps) => {
  const { userToken, userInfo } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<INewCommission>({
    sales_agent_id: 0,
    amount: "",
    commission_status: "due",
  });
  const [error, setError] = useState<string | null>(null);

  const { data: salesAgents } = useQuery(
    "SalesAgents",
    () =>
      userInfo?.role === USER_ROLE.SALES_COACH
        ? getCoachAgents({ token: userToken })
        : getSalesAgents({ token: userToken }),
    {
      enabled: !!userToken && !!userInfo,
    }
  );

  useEffect(() => {
    if (entity) {
      setFormData({
        sales_agent_id: entity.sales_agent_id,
        amount: entity.amount,
        commission_status: entity.commission_status,
      });
    }
  }, [entity]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (name: keyof INewCommission, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "sales_agent_id" ? parseInt(value, 10) : value,
    }));
  };

  const createMutation = useMutation({
    mutationFn: (req: INewCommission) =>
      createCommission({ token: userToken, data: req }),
    onSuccess: (data) => {
      if (data) {
        toast({
          title: "Commission added",
          description: "The commission has been successfully added.",
          variant: "success",
        });
        queryClient.invalidateQueries("Commissions");
        setFormData({
          sales_agent_id: 0,
          amount: "",
          commission_status: "due",
        });
        setIsOpen(false);
      } else {
        toast({
          title: "An error occurred",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    },
  });

  const editMutation = useMutation({
    mutationFn: (req: { data: INewCommission; id: number }) =>
      updateCommission({
        token: userToken,
        data: req.data,
        id: req.id,
      }),
    onSuccess: (data) => {
      if (data) {
        toast({
          title: "Commission updated",
          description: "The commission has been successfully updated.",
          variant: "success",
        });
        queryClient.invalidateQueries("Commissions");
        setFormData({
          sales_agent_id: 0,
          amount: "",
          commission_status: "due",
        });
        setIsOpen(false);
      } else {
        toast({
          title: "An error occurred",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.sales_agent_id || !formData.amount) {
      setError("All fields are required.");
      return;
    }
    setError(null);

    const reqData = {
      ...formData,
      status: formData.commission_status,
    };

    if (isEditMode && entity) {
      console.log("entity", entity);
      editMutation.mutate({ data: reqData, id: entity.id });
    } else {
      createMutation.mutate(reqData);
    }
  };

  const handleDialogClose = (openState: boolean) => {
    if (isOpen !== openState) {
      setIsOpen(openState);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Commission" : "Add New Commission"}
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to {isEditMode ? "edit" : "add"} a
            commission
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <Select
            value={formData.sales_agent_id.toString()}
            onValueChange={(value) =>
              handleSelectChange("sales_agent_id", value)
            }
          >
            <SelectTrigger className="mb-2">
              <SelectValue placeholder="Select Agent" />
            </SelectTrigger>
            <SelectContent>
              {salesAgents?.map((agent) => (
                <SelectItem key={agent.id} value={agent.id.toString()}>
                  {agent.first_name} {agent.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="Amount"
            className="mb-2"
            required
          />
          {isEditMode && (
            <Select
              value={entity ? formData.commission_status : undefined}
              onValueChange={(value) =>
                handleSelectChange("commission_status", value as "due" | "paid")
              }
            >
              <SelectTrigger className="mb-2">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="due">Due</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          )}
          <DialogFooter>
            <Button type="submit" className="bg-blue-500 text-white">
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewCommissionDialog;
