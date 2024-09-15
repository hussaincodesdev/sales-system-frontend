import React, {useEffect, useState} from 'react';
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {useAuth} from "@/context/AuthContext";
import {getProfileData, updateProfileData} from "@/api/user";
import Loading from '@/components/Loading';
import {toast} from "@/components/ui/use-toast";

const ProfileView = () => {
    const queryClient = useQueryClient();
    const {userToken} = useAuth();

    const {data, isLoading} = useQuery('profile', () => getProfileData({token: userToken}), {
        refetchOnWindowFocus: false,
    }) as { data: any, isLoading: boolean };

    const mutation = useMutation((data) => updateProfileData({token: userToken, data}), {
        onSuccess: () => {
            queryClient.invalidateQueries('profile');
            toast({
                title: "Success",
                description: "Profile updated successfully",
                variant: "success"
            });
        },
        onError: (error) => {
            console.error(error);
            toast({
                title: "An error occurred",
                description: "Please check your details and try again.",
                variant: "destructive"
            });
        }
    });

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [iban, setIban] = useState('');

    useEffect(() => {
        if (data) {
            setFirstName(data.first_name);
            setLastName(data.last_name);
            setEmail(data.email);
            setMobile(data.mobile);
            setBankName(data.bank_details?.bank_name || '');
            setAccountNumber(data.bank_details?.account_number || '');
            setIban(data.bank_details?.iban || '');
        }
    }, [data]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const userData: any = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            mobile: mobile,
            bank_details: {
                bank_name: bankName,
                account_number: accountNumber,
                iban: iban,
            },
        };
        mutation.mutate(userData);
    };

    if (isLoading) {
        return <Loading/>;
    }

    return (
        <div className="flex flex-col h-screen">
            <form className="flex-1 space-y-6 px-4 py-8" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="first-name">First Name</Label>
                            <Input
                                id="first-name"
                                placeholder="Enter your first name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="last-name">Last Name</Label>
                            <Input
                                id="last-name"
                                placeholder="Enter your last name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mobile">Mobile</Label>
                            <Input
                                id="mobile"
                                placeholder="Enter your mobile number"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <h2 className="text-lg font-bold">Bank Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="bank-name">Bank Name</Label>
                            <Input
                                id="bank-name"
                                placeholder="Enter your bank name"
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="account-number">Account Number</Label>
                            <Input
                                id="account-number"
                                placeholder="Enter your account number"
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="iban">IBAN</Label>
                            <Input
                                id="iban"
                                placeholder="Enter your IBAN"
                                value={iban}
                                onChange={(e) => setIban(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <Button type="submit" className="bg-gray-800 text-white w-full">
                    Save Changes
                </Button>
            </form>
        </div>
    );
};

export default ProfileView;