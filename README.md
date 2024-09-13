# CertifyNow

CertifyNow is a simple and efficient certificate generation platform. Users can log in, select or upload their own certificate templates, and either manually input certificate details or bulk upload using CSV files. Easily generate, preview, and download personalized certificates with just a few clicks.

## Features

- **User Authentication**: Secure login and registration using Supabase.
- **Template Options**: Choose from pre-built certificate templates or upload your own.
- **Bulk Generation**: Upload CSV files to generate multiple certificates at once.
- **Certificate Preview**: Preview certificates before downloading.
- **Download Options**: Download individual certificates or bulk download as a ZIP file.

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/)
- **Backend**: [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- **Database & Auth**: [Supabase](https://supabase.io/)
- **File Handling**: [papaparse](https://www.papaparse.com/) for CSV handling
- **PDF Generation**: [pdf-lib](https://pdf-lib.js.org/) for dynamic PDF creation
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for UI design