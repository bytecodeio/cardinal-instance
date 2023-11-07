import { ExtensionContext } from '@looker/extension-sdk-react';
import React from 'react';
import { useContext } from 'react';
import { LandingPage } from './pages/LandingPage/LandingPage';
import { Main2 } from './Main2';

export const InitialPage = () => {
    const extensionContext = useContext(ExtensionContext)
    const {extensionId} = extensionContext.extensionSDK.lookerHostData

    return (
        <>
            {extensionId.includes('landing-page')?
            <LandingPage />
            :
            <Main2 />
            }
        </>
    )
}