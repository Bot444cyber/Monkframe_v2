import { baseLayout } from './layout';

export function passwordChangeTemplate(): string {
    const content = `
    <h2>Security Alert: Password Changed</h2>
    <p>This is a confirmation that the password for your Monkframer account has been successfully changed.</p>
    
    <div class="divider"></div>

    <p>Best regards,<br>Monkframer Security Team</p>
  `;
    return baseLayout('Password Changed Successfully', content);
}
