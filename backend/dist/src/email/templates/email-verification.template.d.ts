export interface EmailVerificationData {
    username: string;
    verificationUrl: string;
}
export declare const emailVerificationTemplate: (data: EmailVerificationData) => {
    html: string;
    text: string;
};
