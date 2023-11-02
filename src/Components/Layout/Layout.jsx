"use client"
import React, { useState, useEffect } from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { languageData } from "@/store/reducer/languageSlice";
import Loader from "../Loader/Loader";
import { settingsData, settingsLoaded, settingsSucess } from "@/store/reducer/settingsSlice";
import under_maintain from '../../../public/under_maintain.svg'
import { translate } from "@/utils";
import Image from "next/image";
import { useRouter } from "next/router";
import { protectedRoutes } from "@/routes/routes";
import { usePathname } from "next/navigation";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import { settingsApi } from "@/hooks/settingsApi";

const Layout = ({ children }) => {
    const [isLoadinggggg, setIsLoading] = useState(true);
    const isLoggedIn = useSelector((state) => state.User_signup);
    const userCurrentId = isLoggedIn && isLoggedIn.data ? isLoggedIn.data.data.id : null;
    const router = useRouter()
    const settingData = useSelector(settingsData);
    const dispatch = useDispatch()


    // api call
    const SetSystemSettingsApi = async () => {
        try {
            const { data } = await settingsApi.getSettingsApi({
                user_id: isLoggedIn ? userCurrentId : "",
            })
            dispatch(settingsSucess(data));
            document.documentElement.style.setProperty('--primary-color', data?.data?.system_color);
            document.documentElement.style.setProperty('--primary-category-background', data?.data?.category_background);
            document.documentElement.style.setProperty('--primary-sell', data?.data?.sell_background);
            return data.data ?? null
        } catch (error) {
            console.log(error)
        }
    }
    // react query
    const { isLoading, data } = useQuery({
        queryKey: ['systemSettingsData',
         isLoggedIn, 
         settingData?.svg_clr, 
         settingData?.subscription, 
         settingsData?.is_premium,
         settingsData?.system_color,
         settingsData?.category_background,
         settingsData?.sell_background,
         settingData?.is_active,
        ],
        queryFn: SetSystemSettingsApi,
        staleTime:0 
    })

    const pathname = usePathname();

    // Check if the current route requires a subscription
    const requiresAuth = protectedRoutes.includes(pathname);

    useEffect(() => {
        authcheck();
    }, [requiresAuth]);

    const authcheck = () => {


        if (requiresAuth && !userCurrentId) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "You have not login. Please Login First",
                allowOutsideClick: false,
                customClass: {
                    confirmButton: 'Swal-confirm-buttons',
                },

            }).then((result) => {
                if (result.isConfirmed) {
                    router.push("/"); // Redirect to the subscription page

                }
            });
        }
    }
    useEffect(() => {
        if (!userCurrentId && window.location.pathname === "/user-register") {
            router.push('/')
        }
    }, [])

    const lang = useSelector(languageData);

    return (
        <div>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    {settingData?.maintenance_mode === '1' ? (
                        <div className='under_maintance'>
                            <div className="col-12 text-center">
                                <div>
                                    <Image loading="lazy" src={under_maintain.src} alt="underMaintance" width={600} height={600} />
                                </div>
                                <div className='no_page_found_text'>
                                    <h3>
                                        {translate("underMaintance")}
                                    </h3>
                                    <span>
                                        {translate("pleaseTryagain")}

                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Header />
                            {children}
                            <Footer />
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Layout;
