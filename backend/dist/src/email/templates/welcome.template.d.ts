export interface WelcomeEmailData {
    username: string;
}
export declare const welcomeEmailTemplate: (data: WelcomeEmailData) => {
    html: string;
    text: string;
};
