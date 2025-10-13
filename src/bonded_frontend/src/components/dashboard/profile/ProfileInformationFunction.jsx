import { useState } from "react";
import { Session } from "../../../routes/SessionProvider";
import logo from '/icons/icon-384x384.png'


export const ProfileInformationFunction = () => {

    const [isPartner, setIsPartner] = useState(false);
    const { userData, partnerData } = Session()

    const defaultUserData = {
        id: 3,
        src: userData?.profile || logo,
        firstname: userData?.firstname,
        middlename: userData?.middlename,
        lastname: userData?.lastname,
        sex: 'Male',
        dateOfBirth: '25.10.1985',
        issuedDate: '10.03.2023',
        expiryDate: '10.03.2033',
        nationality: userData?.nationality,
        primaryresidence: userData?.primary_residence,
        taxableresidence: userData?.primary_residence,
        significantresidence: userData?.primary_residence,
        canisterid: 'rryah-gqaaa-aaaaa-cag',
        typefile: userData?.document_type,
        issuefile: '10 Mar 2023',
        issuefilecountry: 'USA',
    }

    const defaultPartnerData = {
        id: 4,
        src: partnerData?.profile || logo,
        firstname: partnerData?.firstname || partnerData?.email,
        middlename: partnerData?.middlename,
        lastname: partnerData?.lastname,
        sex: 'Female',
        dateOfBirth: '18.06.1988',
        issuedDate: '10.03.2023',
        expiryDate: '10.03.2033',
        nationality: partnerData?.nationality,
        primaryresidence: partnerData?.primary_residence,
        taxableresidence: partnerData?.primary_residence,
        significantresidence: partnerData?.primary_residence,
        canisterid: 'rryah-gqaaa-aaaaa-cag',
        typefile: partnerData?.document_type,
        issuefile: '10 Mar 2023',
        issuefilecountry: 'USA',
    }
    return {
        isPartner,
        setIsPartner,
        defaultUserData,
        defaultPartnerData,
    }
}