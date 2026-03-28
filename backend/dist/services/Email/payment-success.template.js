"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentSuccessTemplate = paymentSuccessTemplate;
const layout_1 = require("./layout");
function paymentSuccessTemplate(details) {
    const content = `
    <h2>Payment Successful</h2>
    <p>Thank you for your purchase! Your payment has been processed successfully and your account has been updated.</p>
    
    <div style="background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 8px; padding: 24px; margin: 24px 0;">
        <h3 style="margin-top: 0; font-size: 16px; color: #09090b;">Transaction Summary</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
                <td style="padding: 8px 0; color: #71717a;">Order ID</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 500;">${details.orderId}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #71717a;">Plan</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 500;">${details.planName}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #71717a;">Date</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 500;">${details.date}</td>
            </tr>
            <tr style="border-top: 1px solid #e4e4e7;">
                <td style="padding: 12px 0 0 0; font-weight: 600; color: #09090b;">Total Paid</td>
                <td style="padding: 12px 0 0 0; text-align: right; font-weight: 700; color: #09090b; font-size: 18px;">${details.amount}</td>
            </tr>
        </table>
    </div>

    <div class="button-container">
      <a href="https://monkframer.online/billing" class="button">View Invoice in Dashboard</a>
    </div>

    <p>Your subscription is now active. You have full access to all features included in the <strong>${details.planName}</strong> plan.</p>
    
    <p>If you have any questions regarding this transaction, please contact our billing department.</p>
    <p>Cheers,<br>The Monkframer Team</p>
  `;
    return (0, layout_1.baseLayout)('Payment Receipt | Monkframer', content);
}
