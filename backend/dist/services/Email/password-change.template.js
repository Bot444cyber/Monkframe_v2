"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordChangeTemplate = passwordChangeTemplate;
const layout_1 = require("./layout");
function passwordChangeTemplate() {
    const content = `
    <h2>Security Alert: Password Changed</h2>
    <p>This is a confirmation that the password for your Monkframer account has been successfully changed.</p>
    
    <div class="divider"></div>

    <p>Best regards,<br>Monkframer Security Team</p>
  `;
    return (0, layout_1.baseLayout)('Password Changed Successfully', content);
}
