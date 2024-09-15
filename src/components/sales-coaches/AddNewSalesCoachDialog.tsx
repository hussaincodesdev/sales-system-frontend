import {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import {useMutation, useQueryClient} from 'react-query';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {useAuth} from '@/context/AuthContext';
import {useToast} from "@/components/ui/use-toast";
import {INewUser, User} from "@/types/user";
import {createSalesCoach, updateSalesCoach} from "@/api/user";
import {Checkbox} from "@/components/ui/checkbox";

interface AddNewSalesCoachDialogProps {
    entity?: User | null;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    isEditMode: boolean;
}

const AddNewSalesCoachDialog = ({entity, isOpen, setIsOpen, isEditMode}: AddNewSalesCoachDialogProps) => {
    const {userToken} = useAuth();
    const {toast} = useToast();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState<INewUser>({
        first_name: '',
        last_name: '',
        mobile: '',
        email: '',
        password: '',
        is_active: false
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (entity) {
            setFormData({
                first_name: entity.first_name,
                last_name: entity.last_name,
                mobile: entity.mobile,
                email: entity.email,
                password: '',
                is_active: entity.is_active
            });
        }
    }, [entity]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prevData => ({...prevData, [name]: value}));
    };

    const createMutation = useMutation({
        mutationFn: (req: INewUser) => createSalesCoach({token: userToken, data: req}),
        onSuccess: (data) => {
            if (data) {
                toast({
                    title: "Sales coach added",
                    description: "The sales coach has been successfully added.",
                    variant: "success"
                });
                queryClient.invalidateQueries('Sales Coaches');
                setFormData({
                    first_name: '',
                    last_name: '',
                    mobile: '',
                    email: '',
                    password: '',
                    is_active: false
                });
                setIsOpen(false);
            } else {
                toast({title: "An error occurred", description: "Please try again later.", variant: "destructive"});
            }
        }
    });

    const editMutation = useMutation({
        mutationFn: (req: { data: INewUser, id: number }) => updateSalesCoach({
            token: userToken,
            data: req.data,
            id: req.id
        }),
        onSuccess: (data) => {
            if (data) {
                toast({
                    title: "Sales coach updated",
                    description: "The sales coach has been successfully updated.",
                    variant: "success"
                });
                queryClient.invalidateQueries('Sales Coaches');
                setFormData({
                    first_name: '',
                    last_name: '',
                    mobile: '',
                    email: '',
                    password: '',
                    is_active: false
                });
                setIsOpen(false);
            } else {
                toast({title: "An error occurred", description: "Please try again later.", variant: "destructive"});
            }
        }
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!formData.first_name || !formData.last_name || !formData.mobile || !formData.email) {
            setError('All fields are required.');
            return;
        }
        setError(null);

        const dataToSubmit = { ...formData };
        if (!dataToSubmit.password) {
            delete dataToSubmit.password;
        }

        if (isEditMode && entity) {
            editMutation.mutate({ data: dataToSubmit, id: entity.id });
        } else {
            createMutation.mutate(formData);
        }
    };

    const handleDialogClose = (openState: boolean) => {
        if (isOpen !== openState) {
            setIsOpen(openState);
        }
    };

    const handleCheckboxChange = (checked: boolean | "indeterminate") => {
        setFormData(prevData => ({
            ...prevData,
            is_active: checked === true
        }));
    };


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "Edit Sales Coach" : "Add New Sales Coach"}</DialogTitle>
                    <DialogDescription>Fill in the details below to {isEditMode ? "edit" : "add"} a sales
                        coach</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    {error && <p className="text-red-500 mb-2 col-span-2">{error}</p>}
                    <Input name="first_name" value={formData.first_name} onChange={handleInputChange}
                           placeholder="First Name" className="mb-2" required/>
                    <Input name="last_name" value={formData.last_name} onChange={handleInputChange}
                           placeholder="Last Name" className="mb-2" required/>
                    <Input name="email" value={formData.email} onChange={handleInputChange} placeholder="Email"
                           className="mb-2" type="email" required/>
                    <Input name="mobile" value={formData.mobile} onChange={handleInputChange} placeholder="Mobile"
                           className="mb-2" required/>
                    <Input
                        name="password"
                        value={formData.password || ''}
                        onChange={handleInputChange}
                        placeholder={isEditMode ? "Password (leave blank to keep unchanged)" : "Password"}
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
                        <Button type="submit" className="bg-blue-500 text-white">Submit</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddNewSalesCoachDialog;