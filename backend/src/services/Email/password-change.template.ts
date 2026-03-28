import { baseLayout } from './layout';

export function passwordChangeTemplate(): string {
    const content = `
    <h2>Security Alert: Password Changed</h2>
    <p>This is a confirmation that the password for your Monkframer account has been successfully changed.</p>
    
    <div class="divider"></div>
    
    <p><strong>Did you make this change?</strong></p>
    <p>If you just changed your password, you can ignore this email. No further action is required.</p>
    
    <p><strong>Didn't make this change?</strong></p>
    <p>If you didn't change your password, please contact our support team immediately or reset your password to secure your account.</p>

    <div class="button-container">
      <a href="https://monkframer.online/forgot-password" class="button">Secure Account</a>
    </div>

    <p>Best regards,<br>Monkframer Security Team</p>
  `;
    return baseLayout('Password Changed Successfully', content);
}
