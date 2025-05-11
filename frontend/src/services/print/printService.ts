/**
 * Service for handling print functionality throughout the application
 */

/**
 * Prints content in a new window with custom styling
 * @param content The content to print
 * @param title Optional title for the printed page
 */
export const printContent = (content: string, title: string = 'Print'): void => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 {
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .content {
            white-space: pre-wrap;
          }
          @media print {
            body {
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="content">${content}</div>
      </body>
    </html>
  `;
  
  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Wait for content to load before printing
  setTimeout(() => {
    printWindow.print();
    // Close the window after print dialog is closed (optional)
    // printWindow.onafterprint = () => printWindow.close();
  }, 500);
};
