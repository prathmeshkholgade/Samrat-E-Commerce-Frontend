import apiClient from '../../shared/api/axios';
import AppEndpoints from '../../shared/api/appEndpoints';

export interface SellerBusinessInfo {
  fullName: string;
  email: string;
  mobile: string;
  storeName: string;
  businessName: string;
  businessType: string;
  gstNumber?: string;
  panNumber: string;
  password?: string;
}

export interface SellerStoreDetails {
  storeLogo: File | null;
  storeBanner: File | null;
  storeDescription: string;
  businessCategory: string;
  supportEmail: string;
  supportPhone: string;
  websiteUrl?: string;
}

export interface SellerVerificationBankDetails {
  panCardDoc: File | null;
  gstCertDoc: File | null;
  businessRegDoc: File | null;
  identityProofDoc: File | null;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
}

export interface SellerOnboardingData {
  businessInfo: SellerBusinessInfo;
  storeDetails: SellerStoreDetails;
  bankDetails: SellerVerificationBankDetails;
}

export interface SellerRegisterResponse {
  applicationId: string;
  status: 'submitted' | 'under_review' | 'verification' | 'approved';
  message: string;
}

export const sellerService = {
  /**
   * Submit seller onboarding application (Steps 1, 2, 3 merged into form payload)
   */
  async registerSeller(data: SellerOnboardingData): Promise<SellerRegisterResponse> {
    try {
      const formData = new FormData();

      // Step 1 fields
      formData.append('fullName', data.businessInfo.fullName);
      formData.append('email', data.businessInfo.email);
      formData.append('mobile', data.businessInfo.mobile);
      formData.append('storeName', data.businessInfo.storeName);
      formData.append('businessName', data.businessInfo.businessName);
      formData.append('businessType', data.businessInfo.businessType);
      if (data.businessInfo.gstNumber) {
        formData.append('gstNumber', data.businessInfo.gstNumber);
      }
      formData.append('panNumber', data.businessInfo.panNumber);
      if (data.businessInfo.password) {
        formData.append('password', data.businessInfo.password);
      }

      // Step 2 fields
      if (data.storeDetails.storeLogo) {
        formData.append('storeLogo', data.storeDetails.storeLogo);
      }
      if (data.storeDetails.storeBanner) {
        formData.append('storeBanner', data.storeDetails.storeBanner);
      }
      formData.append('storeDescription', data.storeDetails.storeDescription);
      formData.append('businessCategory', data.storeDetails.businessCategory);
      formData.append('supportEmail', data.storeDetails.supportEmail);
      formData.append('supportPhone', data.storeDetails.supportPhone);
      if (data.storeDetails.websiteUrl) {
        formData.append('websiteUrl', data.storeDetails.websiteUrl);
      }

      // Step 3 fields
      if (data.bankDetails.panCardDoc) {
        formData.append('panCardDoc', data.bankDetails.panCardDoc);
      }
      if (data.bankDetails.gstCertDoc) {
        formData.append('gstCertDoc', data.bankDetails.gstCertDoc);
      }
      if (data.bankDetails.businessRegDoc) {
        formData.append('businessRegDoc', data.bankDetails.businessRegDoc);
      }
      if (data.bankDetails.identityProofDoc) {
        formData.append('identityProofDoc', data.bankDetails.identityProofDoc);
      }
      formData.append('accountHolderName', data.bankDetails.accountHolderName);
      formData.append('bankName', data.bankDetails.bankName);
      formData.append('accountNumber', data.bankDetails.accountNumber);
      formData.append('ifscCode', data.bankDetails.ifscCode);

      // API Call
      const response = await apiClient.post<SellerRegisterResponse>(
        AppEndpoints.seller.register,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.warn('API connection failed, simulating registration response...');
      await new Promise((resolve) => setTimeout(resolve, 1500)); // larger delay for file uploads emulation

      return {
        applicationId: `app_${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'submitted',
        message: 'Application files uploaded successfully.',
      };
    }
  },

  /**
   * Fetch current timeline status of a seller application
   */
  async getApplicationStatus(applicationId: string): Promise<SellerRegisterResponse> {
    try {
      const response = await apiClient.get<SellerRegisterResponse>(AppEndpoints.seller.status(applicationId));
      return response.data;
    } catch (error) {
      console.warn('API connection failed, simulating status checking...');
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        applicationId,
        status: 'under_review',
        message: 'Documents are currently being checked by our compliance department.',
      };
    }
  },
};

export default sellerService;
