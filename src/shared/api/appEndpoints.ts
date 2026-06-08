/**
 * Registry of all API endpoints used by the client services.
 */
export const AppEndpoints = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    forgotPassword: '/auth/forgot-password',
    verifyOtp: '/auth/verify-otp',
    resendOtp: '/auth/resend-otp',
  },
  seller: {
    register: '/seller/register',
    status: (applicationId: string) => `/seller/status/${applicationId}`,
  },
} as const;

export default AppEndpoints;
