import React from "react";
// ** Next Import
import { Html, Head, Main, NextScript } from "next/document";
const CustomDocument = () => {
    return (
        <Html>
            <Head>
                <link rel="stylesheet" href="https://unpkg.com/aos@next/dist/aos.css" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css" />
                <link rel="stylesheet" href="/css/react-spring-lightbox.css" />
                <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"></script>
                <script async defer src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API}&libraries=places&loading=async`}></script>  
                 
            </Head>
            
            <body>
            <Main />
                <NextScript />
                <script src="https://unpkg.com/aos@next/dist/aos.js"></script>
            </body>
        </Html>
    );
};
export default CustomDocument;
