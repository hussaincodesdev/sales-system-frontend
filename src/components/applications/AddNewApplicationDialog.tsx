import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Application,
  ApplicationStatus,
  INewApplication,
} from "@/types/application";
import { createApplication, updateApplication } from "@/api/application";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface AddNewApplicationDialogProps {
  entity?: Application | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isEditMode: boolean;
}

const AddNewApplicationDialog = ({
  entity,
  isOpen,
  setIsOpen,
  isEditMode,
}: AddNewApplicationDialogProps) => {
  const { userToken } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<INewApplication>({
    first_name: "",
    last_name: "",
    mobile: "",
    cpr: "",
    application_status: "incomplete",
    date_submitted: new Date().toISOString(),
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (entity) {
      console.log("Editing application:", entity);
      setFormData({
        first_name: entity.first_name,
        last_name: entity.last_name,
        mobile: entity.mobile,
        cpr: entity.cpr,
        application_status: entity.application_status,
        date_submitted: entity.date_submitted,
      });
    }
  }, [entity]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (value: ApplicationStatus) => {
    setFormData((prevData) => ({ ...prevData, application_status: value }));
  };

  const createMutation = useMutation({
    mutationFn: (req: INewApplication) =>
      createApplication({ token: userToken, application: req }),
    onSuccess: (data) => {
      if (data) {
        toast({
          title: "Application added",
          description: "The application has been successfully added.",
          variant: "success",
        });
        queryClient.invalidateQueries("Applications");
        setFormData({
          first_name: "",
          last_name: "",
          mobile: "",
          cpr: "",
          application_status: "incomplete",
          date_submitted: new Date().toISOString(),
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
    mutationFn: (req: { application: INewApplication; id: number }) =>
      updateApplication({
        token: userToken,
        application: req.application,
        id: req.id,
      }),
    onSuccess: (data) => {
      if (data) {
        toast({
          title: "Application updated",
          description: "The application has been successfully updated.",
          variant: "success",
        });
        queryClient.invalidateQueries("Applications");
        setFormData({
          first_name: "",
          last_name: "",
          mobile: "",
          cpr: "",
          application_status: "incomplete",
          date_submitted: new Date().toISOString(),
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
      !formData.cpr
    ) {
      setError("All fields are required.");
      return;
    }
    setError(null);
    if (isEditMode && entity) {
      editMutation.mutate({ application: formData, id: entity.id });
    } else {
      createMutation.mutate(formData);
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
            {isEditMode ? "Edit Application" : "Add New Application"}
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to {isEditMode ? "edit" : "add"} an
            application
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 mb-2">{error}</p>}
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
            name="mobile"
            value={formData.mobile}
            onChange={handleInputChange}
            placeholder="Mobile"
            className="mb-2"
            required
          />
          <Input
            name="cpr"
            value={formData.cpr}
            onChange={handleInputChange}
            placeholder="CPR"
            className="mb-2"
            required
          />
          {/* {isEditMode && (
            <Select
              value={formData.application_status}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger className="mb-2">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="incomplete">Incomplete</SelectItem>
              </SelectContent>
            </Select>
          )} */}
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

export default AddNewApplicationDialog;
