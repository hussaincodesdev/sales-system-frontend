"use client";

import Navbar from "@/components/Navbar";
import {ReactNode} from "react";


const PageLayout = ({
                        children,
                    }: Readonly<{
    children: ReactNode;
}>) => {
    return (
        <div>
            <Navbar/>
            {children}
        </div>
    );
}

export default PageLayout;