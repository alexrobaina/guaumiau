export interface PasswordResetData {
    resetUrl: string;
}
export declare const passwordResetTemplate: (data: PasswordResetData) => {
    html: string;
    text: string;
};
