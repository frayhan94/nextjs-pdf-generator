# Next.js PDF Generator (App Router)

This app generates a PDF of any public URL using Browserless and Puppeteer, built with the Next.js App Directory.

## 📦 Features

- Input validation: only `url` is accepted
- Custom logic to wait for images
- Efficient streaming (no memory buffer)
- Clean UI to generate and download PDF

## 🛠 Requirement
Node js version 20

## 🛠 Tech Stack

- Next.js (App Router)
- Puppeteer
- Browserless
- TypeScript

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/frayhan94/nextjs-pdf-generator.git
cd nextjs-pdf-generator
npm install
```

### 2. Create .env.local
visit [Browserless](https://browserless.io/) and create an account to get your API key.
Then, create a `.env.local` file in the root directory and add your Browserless API key

```bash
BROWSERLESS_TOKEN=your_browserless_api_key
```


### 3. Run the app

```bash
1. type npm run dev
2. visit http://localhost:3000/
3. Type the URL you want to convert to PDF
4. Click on the "Generate PDF" button
5. The PDF is generated and press button download PDF to save in your local.    
```
