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
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { INewUser, User } from "@/types/user";
import {
  createSalesAgent,
  getSalesCoaches,
  updateSalesAgent,
} from "@/api/user";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { USER_ROLE } from "@/utils/constants";

interface AddNewSalesAgentDialogProps {
  entity?: (User & { coach_id: number }) | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isEditMode: boolean;
}

type INewSalesCoach = INewUser & { coach_id: number };

const AddNewSalesAgentDialog = ({
  entity,
  isOpen,
  setIsOpen,
  isEditMode,
}: AddNewSalesAgentDialogProps) => {
  const { userInfo } = useAuth();
  const { userToken } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [coaches_options, setCoachesOptions] = useState<any[]>([]);

  const { data: sales_coaches, isLoading } = useQuery(
    "Sales Coaches",
    () => getSalesCoaches({ token: userToken }) as any,
    {
      refetchOnWindowFocus: false,
      select: (data: any[]) =>
        data.map((coach) => ({
          label: `${coach.first_name} ${coach.last_name}`,
          value: coach.id,
        })),
    }
  ) as { data: any; isLoading: boolean };

  useEffect(() => {
    if (sales_coaches) {
      setCoachesOptions(sales_coaches);
    }
  }, [sales_coaches]);

  const [formData, setFormData] = useState<INewSalesCoach>({
    first_name: "",
    last_name: "",
    mobile: "",
    email: "",
    password: "",
    is_active: false,
    coach_id: 0,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (entity) {
      setFormData({
        first_name: entity.first_name,
        last_name: entity.last_name,
        mobile: entity.mobile,
        email: entity.email,
        password: "",
        is_active: entity.is_active,
        coach_id:
          userInfo?.role === USER_ROLE.SALES_COACH
            ? userInfo.id
            : entity.coach_id,
      });
    }
  }, [entity, userInfo]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prevData) => ({ ...prevData, coach_id: parseInt(value) }));
  };

  const createMutation = useMutation({
    mutationFn: (req: INewSalesCoach) =>
      createSalesAgent({ token: userToken, data: req }),
    onSuccess: (data) => {
      if (data) {
        toast({
          title: "Sales agent added",
          description: "The sales agent has been successfully added.",
          variant: "success",
        });
        queryClient.invalidateQueries("Sales Agents");
        setFormData({
          first_name: "",
          last_name: "",
          mobile: "",
          email: "",
          password: "",
          is_active: false,
          coach_id: 0,
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
    mutationFn: (req: { data: INewSalesCoach; id: number }) =>
      updateSalesAgent({
        token: userToken,
        data: req.data,
        id: req.id,
      }),
    onSuccess: (data) => {
      if (data) {
        toast({
          title: "Sales agent updated",
          description: "The sales agent has been successfully updated.",
          variant: "success",
        });
        queryClient.invalidateQueries("Sales Agents");
        setFormData({
          first_name: "",
          last_name: "",
          mobile: "",
          email: "",
          password: "",
          is_active: false,
          coach_id: 0,
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
    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.mobile ||
      !formData.email
    ) {
      setError("All fields are required.");
      return;
    }
    setError(null);

    const dataToSubmit = { ...formData };
    if (!dataToSubmit.password) {
      delete dataToSubmit.password;
    }

    if (userInfo && userInfo.role === USER_ROLE.SALES_COACH) {
      dataToSubmit.coach_id = userInfo.id;
    }

    if (isEditMode && entity) {
      editMutation.mutate({ data: dataToSubmit, id: entity.id });
    } else {
      createMutation.mutate(dataToSubmit);
    }
  };

  const handleDialogClose = (openState: boolean) => {
    if (isOpen !== openState) {
      setIsOpen(openState);
    }
  };

  const handleCheckboxChange = (checked: boolean | "indeterminate") => {
    setFormData((prevData) => ({
      ...prevData,
      is_active: checked === true,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Sales Agent" : "Add New Sales Agent"}
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to {isEditMode ? "edit" : "add"} a sales
            agent
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {error && <p className="text-red-500 mb-2 col-span-2">{error}</p>}
          <Input
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            placeholder="First Name"
            className="mb-2"
            required
          />
          <Input
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            placeholder="Last Name"
            className="mb-2"
            required
          />
          <Input
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="mb-2"
            type="email"
            required
          />
          <Input
            name="mobile"
            value={formData.mobile}
            onChange={handleInputChange}
            placeholder="Mobile"
            className="mb-2"
            required
          />
          {userInfo && userInfo.role === USER_ROLE.ADMIN && (
            <div className="mb-2 col-span-2">
              <Select
                value={formData.coach_id ? formData.coach_id.toString() : ""}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger className="mb-2">
                  <SelectValue placeholder="Select Coach" />
                </SelectTrigger>
                <SelectContent>
                  {coaches_options.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value.toString()}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Input
            name="password"
            value={formData.password || ""}
            onChange={handleInputChange}
            placeholder={
              isEditMode
                ? "Password (leave blank to keep unchanged)"
                : "Password"
            }
            className="mb-2 col-span-2"
            type="password"
          />

          {isEditMode && (
            <div className="flex items-center mb-2 col-span-2">
              <Checkbox
                name="is_active"
                checked={formData.is_active}
                onCheckedChange={handleCheckboxChange}
              />
              <label className="ml-2">Active</label>
            </div>
          )}
          <DialogFooter className="col-span-2">
            <Button type="submit" className="bg-blue-500 text-white">
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewSalesAgentDialog;
