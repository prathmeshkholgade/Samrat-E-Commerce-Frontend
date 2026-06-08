import React, { createContext, useContext, useState, useEffect } from 'react';
import type { SellerBusinessInfo } from '../../features/seller/service';
import sellerService from '../../features/seller/service';

export interface BusinessInfoState extends Omit<SellerBusinessInfo, 'mobile'> {
  phone: string;
  dialCode: string;
  confirmPassword?: string;
}

export interface StoreDetailsState {
  storeLogo: File | null;
  storeBanner: File | null;
  storeDescription: string;
  businessCategory: string;
  supportEmail: string;
  supportPhone: string;
  supportPhoneDialCode: string;
  websiteUrl?: string;
}

export interface BankDetailsState {
  panCardDoc: File | null;
  gstCertDoc: File | null;
  businessRegDoc: File | null;
  identityProofDoc: File | null;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  acceptTerms: boolean;
}

interface OnboardingContextProps {
  businessInfo: BusinessInfoState;
  setBusinessInfo: React.Dispatch<React.SetStateAction<BusinessInfoState>>;
  storeDetails: StoreDetailsState;
  setStoreDetails: React.Dispatch<React.SetStateAction<StoreDetailsState>>;
  bankDetails: BankDetailsState;
  setBankDetails: React.Dispatch<React.SetStateAction<BankDetailsState>>;
  applicationId: string;
  setApplicationId: (id: string) => void;
  submitApplication: () => Promise<string>;
  clearOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextProps | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try loading initial text states from sessionStorage
  const [businessInfo, setBusinessInfo] = useState<BusinessInfoState>(() => {
    const cached = sessionStorage.getItem('samrat_onboard_business');
    return cached
      ? JSON.parse(cached)
      : {
          fullName: '',
          email: '',
          phone: '',
          dialCode: '+91',
          storeName: '',
          businessName: '',
          businessType: 'Sole Proprietorship',
          gstNumber: '',
          panNumber: '',
          password: '',
          confirmPassword: '',
        };
  });

  const [storeDetails, setStoreDetails] = useState<StoreDetailsState>(() => {
    const cached = sessionStorage.getItem('samrat_onboard_store');
    return cached
      ? JSON.parse(cached)
      : {
          storeLogo: null,
          storeBanner: null,
          storeDescription: '',
          businessCategory: 'Electronics',
          supportEmail: '',
          supportPhone: '',
          supportPhoneDialCode: '+91',
          websiteUrl: '',
        };
  });

  const [bankDetails, setBankDetails] = useState<BankDetailsState>(() => {
    const cached = sessionStorage.getItem('samrat_onboard_bank');
    return cached
      ? JSON.parse(cached)
      : {
          panCardDoc: null,
          gstCertDoc: null,
          businessRegDoc: null,
          identityProofDoc: null,
          accountHolderName: '',
          bankName: '',
          accountNumber: '',
          ifscCode: '',
          acceptTerms: false,
        };
  });

  const [applicationId, setApplicationId] = useState(() => {
    return sessionStorage.getItem('samrat_onboard_appid') || '';
  });

  // Sync state to sessionStorage (excluding Files since files cannot be serialized to JSON)
  useEffect(() => {
    sessionStorage.setItem('samrat_onboard_business', JSON.stringify(businessInfo));
  }, [businessInfo]);

  useEffect(() => {
    // Exclude File references when syncing step 2 to storage
    const { storeLogo, storeBanner, ...textStoreDetails } = storeDetails;
    sessionStorage.setItem('samrat_onboard_store', JSON.stringify({
      ...textStoreDetails,
      storeLogo: null,
      storeBanner: null,
    }));
  }, [storeDetails]);

  useEffect(() => {
    // Exclude File references when syncing step 3 to storage
    const { panCardDoc, gstCertDoc, businessRegDoc, identityProofDoc, ...textBankDetails } = bankDetails;
    sessionStorage.setItem('samrat_onboard_bank', JSON.stringify({
      ...textBankDetails,
      panCardDoc: null,
      gstCertDoc: null,
      businessRegDoc: null,
      identityProofDoc: null,
    }));
  }, [bankDetails]);

  useEffect(() => {
    sessionStorage.setItem('samrat_onboard_appid', applicationId);
  }, [applicationId]);

  const submitApplication = async (): Promise<string> => {
    const payload = {
      businessInfo: {
        fullName: businessInfo.fullName,
        email: businessInfo.email,
        mobile: `${businessInfo.dialCode} ${businessInfo.phone}`,
        storeName: businessInfo.storeName,
        businessName: businessInfo.businessName,
        businessType: businessInfo.businessType,
        gstNumber: businessInfo.gstNumber,
        panNumber: businessInfo.panNumber,
        password: businessInfo.password,
      },
      storeDetails: {
        storeLogo: storeDetails.storeLogo,
        storeBanner: storeDetails.storeBanner,
        storeDescription: storeDetails.storeDescription,
        businessCategory: storeDetails.businessCategory,
        supportEmail: storeDetails.supportEmail,
        supportPhone: `${storeDetails.supportPhoneDialCode} ${storeDetails.supportPhone}`,
        websiteUrl: storeDetails.websiteUrl,
      },
      bankDetails: {
        panCardDoc: bankDetails.panCardDoc,
        gstCertDoc: bankDetails.gstCertDoc,
        businessRegDoc: bankDetails.businessRegDoc,
        identityProofDoc: bankDetails.identityProofDoc,
        accountHolderName: bankDetails.accountHolderName,
        bankName: bankDetails.bankName,
        accountNumber: bankDetails.accountNumber,
        ifscCode: bankDetails.ifscCode,
      },
    };

    const res = await sellerService.registerSeller(payload);
    setApplicationId(res.applicationId);
    return res.applicationId;
  };

  const clearOnboarding = () => {
    sessionStorage.removeItem('samrat_onboard_business');
    sessionStorage.removeItem('samrat_onboard_store');
    sessionStorage.removeItem('samrat_onboard_bank');
    sessionStorage.removeItem('samrat_onboard_appid');
    
    setBusinessInfo({
      fullName: '',
      email: '',
      phone: '',
      dialCode: '+91',
      storeName: '',
      businessName: '',
      businessType: 'Sole Proprietorship',
      gstNumber: '',
      panNumber: '',
      password: '',
      confirmPassword: '',
    });

    setStoreDetails({
      storeLogo: null,
      storeBanner: null,
      storeDescription: '',
      businessCategory: 'Electronics',
      supportEmail: '',
      supportPhone: '',
      supportPhoneDialCode: '+91',
      websiteUrl: '',
    });

    setBankDetails({
      panCardDoc: null,
      gstCertDoc: null,
      businessRegDoc: null,
      identityProofDoc: null,
      accountHolderName: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      acceptTerms: false,
    });
    setApplicationId('');
  };

  return (
    <OnboardingContext.Provider
      value={{
        businessInfo,
        setBusinessInfo,
        storeDetails,
        setStoreDetails,
        bankDetails,
        setBankDetails,
        applicationId,
        setApplicationId,
        submitApplication,
        clearOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
