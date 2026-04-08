/**
 * Base professional layout for Mockupidea emails.
 * Uses a Zinc/Dark aesthetic with high-fidelity styling.
 */
export function baseLayout(title: string, content: string): string {
    const logoBase64 = 'PHN2ZyB3aWR0aD0iNzciIGhlaWdodD0iNTkiIHZpZXdCb3g9IjAgMCA3NyA1OSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTc2LjkgMzguNUM3Ni45IDQ0LjQgNzUuNiA1MCA3My4yIDU1QzcyLjcgNTYgNzIuMiA1NyA3MS43IDU3LjlINjQuNUw1Mi4zIDM1LjZDNTIuMSAzNS4yIDUxLjUgMzUuMiA1MS4yIDM1LjZMMzkgNTcuOUMzOSA1Ny45IDM5IDU3LjkgMzkgNThIMzguMUMzOC4xIDU4IDM4LjEgNTggMzguMSA1Ny45TDI1LjcgMzUuN0MyNS41IDM1LjMgMjQuOSAzNS4zIDI0LjYgMzUuN0wxMi42IDU4LjFINS41QzQuOSA1Ny4xIDQuNDAwMDIgNTYuMSAzLjgwMDAyIDU1LjFDMS40MDAwMiA1MC4xIDAgNDQuNCAwIDM4LjVDMCAxNy4yIDE3LjMgMCAzOC41IDBDNTkuNyAwIDc3IDE3LjIgNzcgMzguNUg3Ni45WiIgZmlsbD0idXJsKCNwYWludDBfbGluZWFyXzI4XzE4KSIvPgo8cGF0aCBkPSJNNzYuMTk5OSA1Ny45SDcxLjY5OTlINjQuNDk5OUw1Mi4yOTk5IDM1LjZDNTIuME95OSAzNS4yIDUxLjQ5OTkgMzUuMiA1MS4xOTk5IDM1LjZMMzguOTk5OSA1Ny45QzM4Ljk5OTkgNTcuOSAzOC45OTk5IDU3LjkgMzguOTk5OSA1OEgzOC4wOTk5QzM4Ljk5OTkgNTggMzguMDk5OSA1OCAzOC4wOTk5IDU3LjlMMjUuNjk5OSAzNS43QzI1LjQ5OTkgMzUuMyAyNC44OTk5IDM1LjMgMjQuNTk5OSAzNS43TDEyLjU5OTkgNTguMUg1LjQ5OTg4SDAuODk5OTAyQzAuODk5OTAyIDU4IDAuOTk5ODkgNTcuOSAxLjE5OTg5IDU3LjhMMi42OTk4OSA1Ni45QzIuNzk5ODkgNTYuOSAyLjg5OTkgNTYuOCAyLjg5OTkgNTYuN0wzLjg5OTkgNTVMMjMuOTk5OSAxOS4xQzI0LjE5OTkgMTguNyAyNC43OTk5IDE4LjcgMjQuOTk5OSAxOS4xTDM3Ljk5OTkgNDAuOUMzOC4xOTk5IDQxLjMgMzguNzk5OSA0MS4zIDM4Ljk5OTkgNDAuOUw1MS43OTk5IDE5QzUxLjk5OTkgMTguNiA1Mi41OTk5IDE4LjYgNTIuNzk5OSAxOUw3My4yOTk5IDU0LjlMNzQuMTk5OSA1Ni40Qzc0LjE5OTkgNTYuNCA3NC4yOTk5IDU2LjYgNzQuMzk5OSA1Ni42TDc1Ljk5OTkgNTcuNEM3Ni4wOTk5IDU3LjQgNzYuMTk5OSA1Ny42IDc2LjI5OTkgNTcuN0w3Ni4xOTk5IDU3LjlaIiBmaWxsPSIjNDQ0NDQ0Ii8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMjhfMTgiIHgxPSIzOC40IiB5MT0iLTE3IiB4Mj0iMzguNCIgeTI9IjgzLjEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iI0ZGQTcyNiIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGQjhDMDAiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K';
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        /* Base styles */
        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f8fafc;
            color: #18181b;
            -webkit-font-smoothing: antialiased;
        }

        .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #f8fafc;
            padding-bottom: 40px;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            margin-top: 40px;
            border: 1px solid #e4e4e7;
        }

        /* Header */
        .header {
            background-color: #ffffff;
            padding: 32px;
            text-align: center;
            border-bottom: 1px solid #f4f4f5;
        }

        .header img {
            height: 48px;
            margin-bottom: 12px;
        }

        .header h1 {
            color: #09090b;
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: -0.025em;
            text-transform: uppercase;
        }

        .header p {
            color: #71717a;
            margin: 8px 0 0 0;
            font-size: 14px;
        }

        /* Content */
        .content {
            padding: 40px 32px;
            line-height: 1.6;
        }

        .content h2 {
            margin-top: 0;
            font-size: 20px;
            font-weight: 600;
            color: #09090b;
        }

        .content p {
            margin-bottom: 24px;
            color: #3f3f46;
        }

        /* Button */
        .button-container {
            text-align: center;
            margin: 32px 0;
        }

        .button {
            display: inline-block;
            background-color: #09090b;
            color: #ffffff !important;
            padding: 12px 24px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 500;
            font-size: 14px;
            transition: opacity 0.2s;
        }

        /* Footer */
        .footer {
            padding: 32px;
            text-align: center;
            font-size: 12px;
            color: #71717a;
            background-color: #fafafa;
            border-top: 1px solid #f4f4f5;
        }

        .footer a {
            color: #09090b;
            text-decoration: underline;
        }

        /* Utils */
        .code-box {
            background-color: #f4f4f5;
            border: 1px solid #e4e4e7;
            padding: 16px;
            border-radius: 8px;
            text-align: center;
            font-family: 'Courier New', Courier, monospace;
            font-size: 32px;
            font-weight: 700;
            letter-spacing: 8px;
            color: #09090b;
            margin: 24px 0;
        }

        .divider {
            height: 1px;
            background-color: #e4e4e7;
            margin: 24px 0;
        }

        @media only screen and (max-width: 600px) {
            .container {
                margin-top: 20px;
                border-radius: 0;
                width: 100% !important;
            }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <img src="data:image/svg+xml;base64,${logoBase64}" alt="Mockupidea Logo">
                <h1>Mockupidea</h1>
                <p>Curated Design Assets & Templates</p>
            </div>
            
            <div class="content">
                ${content}
            </div>

            <div class="footer">
                &copy; ${new Date().getFullYear()} Mockupidea. All rights reserved.<br>
                Premium Digital Assets Platform.<br>
                <br>
                You received this email because you are a registered user of Mockupidea.<br>
                <a href="#">Privacy Policy</a> • <a href="#">Terms of Service</a>
            </div>
        </div>
    </div>
</body>
</html>
  `;
}
