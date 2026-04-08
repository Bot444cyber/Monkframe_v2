import { baseLayout } from './layout';

export function welcomeTemplate(name: string): string {
  const content = `
    <h2>Welcome to Mockupidea, ${name}!</h2>
    <p>We're thrilled to have you join our community of elite designers and developers. Mockupidea is designed to help you build stunning UI/UX solutions with ease.</p>
    
    <p>Here's what you can do next:</p>
    <ul>
      <li>Complete your profile</li>
      <li>Explore our premium UI components</li>
      <li>Start your journey with us.</li>
    </ul>

    <div class="button-container">
      <a href="https://www.mockupidea.com" class="button">Explore Website</a>
    </div>

    <p>If you have any questions, feel free to reply to this email or visit our help center.</p>
    <p>Best regards,<br>The Mockupidea Team</p>
  `;
  return baseLayout('Welcome to Mockupidea', content);
}
