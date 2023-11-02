import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { RiCloseCircleLine } from "react-icons/ri";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import OTPModal from "../OTPModal/OTPModal";
import { toast } from "react-hot-toast";
import { translate } from "@/utils";
import { useSelector } from "react-redux";
import { Fcmtoken, settingsData } from "@/store/reducer/settingsSlice";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import FirebaseData from "@/utils/Firebase";
import { signupLoaded } from "@/store/reducer/authSlice";
import { useRouter } from "next/router";
import { PhoneNumberUtil } from "google-libphonenumber";
import Swal from "sweetalert2";

const LoginModal = ({ isOpen, onClose }) => {
    const SettingsData = useSelector(settingsData);
    const isDemo = SettingsData?.demo_mode;
    // const isDemo = isDemoMode();
    const DemoNumber = "+919764318246"
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [phonenum, setPhonenum] = useState();
    const [value, setValue] = useState(isDemo ? DemoNumber : "");
    const phoneUtil = PhoneNumberUtil.getInstance(); // Create an instance of PhoneNumberUtil

    const onSignUp = (e) => {
        e.preventDefault();
        if (!value) {
            toast.error(translate("enterPhoneNumber"));
        } else {
            try {
                // Parse the phone number
                const phoneNumber = phoneUtil.parseAndKeepRawInput(value, 'ZZ');

                // Check if the parsed phone number is valid
                if (phoneUtil.isValidNumber(phoneNumber)) {
                    // Phone number is valid, proceed to OTP modal
                    setPhonenum(value);
                    onClose();
                    setShowOtpModal(true);
                    if (isDemo) {
                        setValue(DemoNumber)
                    } else {
                        setValue("");
                    }
                } else {
                    toast.error(translate("validPhonenum"));
                }
            } catch (error) {
                // Handle parsing errors
                console.error("Error parsing phone number:", error);
                toast.error("Error parsing phone number. Please try again.");
            }
        }
    };

    const navigate = useRouter();
    const { authentication } = FirebaseData()
    const FcmToken = useSelector(Fcmtoken)





    const handleGoogleSignup = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const response = await signInWithPopup(authentication, provider);

            signupLoaded(
                response?.user?.displayName,
                response?.user?.email,
                "",
                "0",
                "",
                response?.user?.uid,
                "",
                response?.user?.photoURL,
                FcmToken,
                (res) => {
                    let signupData = res.data;

                    // Check if any of the required fields is empty
                    if (!res.error) {
                        if (signupData.mobile === "") {
                            navigate.push("/user-register");
                            onClose();
                        } else {
                            toast.success(res.message);
                            onClose();
                        }
                    }
                },
                (err) => {
                    if (err === 'Account Deactivated by Administrative please connect to them') {
                        onClose(); // Close the modal
                        Swal.fire({
                            title: "Opps!",
                            text: "Account Deactivated by Administrative please connect to them",
                            icon: "warning",
                            showCancelButton: false,
                            customClass: {
                                confirmButton: 'Swal-confirm-buttons',
                                cancelButton: "Swal-cancel-buttons"
                            },
                            confirmButtonText: "Ok",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                navigate.push("/contact-us");
                            }
                        });

                    }
                }
            );
        } catch (error) {
            console.error(error);
            toast.error(translate("popupCancel"));
        }
    };

    const handlOTPModalClose = () => {
        setShowOtpModal(false);
        window.recaptchaVerifier = null;
    };

    return (
        <>
            <Modal show={isOpen} onHide={onClose} size="md" aria-labelledby="contained-modal-title-vcenter" centered className="login-modal">
                <Modal.Header>
                    <Modal.Title>{translate("login&Regiser")}</Modal.Title>
                    <RiCloseCircleLine className="close-icon" size={40} onClick={onClose} />
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="modal-body-heading">
                            <h4>{translate("enterMobile")}</h4>
                            <span>{translate("sendCode")}</span>
                        </div>
                        <div className="mobile-number">
                            <label htmlFor="phone">{translate("phoneNumber")}</label>
                            <PhoneInput defaultCountry={process.env.NEXT_PUBLIC_DEFAULT_COUNTRY} disabledCountryCode="true" value={value} onChange={setValue} className="custom-phone-input" />
                        </div>
                        <div className="continue">
                            <button type="submit" className="continue-button" onClick={onSignUp}>
                                {translate("continue")}
                            </button>
                        </div>
                    </form>
                    <div className="or_devider">
                        <hr />
                        <span>{translate("or")}</span>
                        <hr />
                    </div>
                    <div className="google_signup" onClick={handleGoogleSignup}>
                        <button className="google_signup_button">
                            <div className="google_icon">
                                <FcGoogle size={25} />
                            </div>
                            <span className="google_text">
                                {translate("CWG")}
                            </span>
                        </button>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <span>
                        {translate("byclick")} <a href="/terms-and-condition">{translate("terms&condition")}</a> <span className="mx-1"> {translate("and")} </span> <a href="/privacy-policy"> {translate("privacyPolicy")} </a>
                    </span>
                </Modal.Footer>
            </Modal>

            {showOtpModal && <OTPModal isOpen={true} onClose={handlOTPModalClose} phonenum={phonenum} setPhonenum={setPhonenum} />}
        </>
    );
};

export default LoginModal;
