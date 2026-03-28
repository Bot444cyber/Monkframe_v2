"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.welcomeTemplate = welcomeTemplate;
const layout_1 = require("./layout");
function welcomeTemplate(name) {
    const content = `
    <h2>Welcome to Monkframer, ${name}!</h2>
    <p>We're thrilled to have you join our community of elite designers and developers. Monkframer is designed to help you build stunning UI/UX solutions with ease.</p>
    
    <p>Here's what you can do next:</p>
    <ul>
      <li>Complete your profile</li>
      <li>Explore our premium UI components</li>
      <li>Start your first project</li>
    </ul>

    <div class="button-container">
      <a href="https://monkframer.online/dashboard" class="button">Explore Dashboard</a>
    </div>

    <p>If you have any questions, feel free to reply to this email or visit our help center.</p>
    <p>Best regards,<br>The Monkframer Team</p>
  `;
    return (0, layout_1.baseLayout)('Welcome to Monkframer', content);
}
