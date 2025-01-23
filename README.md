# 🛒 Koctas Web Scraper

A powerful **Puppeteer-based web scraper** designed to extract product details from the [Koçtaş](https://www.koctas.com.tr) website. This tool collects data such as product names, prices, categories, URLs, and image sources from the website and saves it in a structured JSON file.

---

## ✨ Features
- 🔗 **Main & Subcategory Extraction**: Automatically navigates through main categories and their subcategories.
- 🛍️ **Product Data Scraping**:
  - Product Name
  - Price
  - URL
  - Image Source
  - Category
- 📑 **Pagination Handling**: Ensures all pages of a category are scraped.
- 💾 **Data Storage**: Saves all scraped information in a JSON file (`koctas_data.json`).
- 🛠️ **Robust Error Handling**: Manages timeouts and other potential issues during scraping.

---

## ⚙️ Prerequisites
Ensure the following are installed on your system:
- [Node.js](https://nodejs.org/) (v16 or higher recommended) 🟢
- [Google Chrome](https://www.google.com/chrome/) or Chromium 🌐

---

## 📥 Installation
1. Clone the repository:
```bash
   git clone https://github.com/yourusername/koctas-web-scraper.git
   cd koctas-web-scraper
```
## 2.Install dependencies:
```bash
npm install puppeteer
```
▶️ Usage
1. > [!WARNING]  
> Puppeteer requires the path to your Chrome executable. For Windows, update the executablePath in the script to the default Chrome location:
> ```bash
>executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
> ```
2.Run the scraper:
```bash
node koctas.js
```
3.Find the scraped product data in koctas_data.json.
📂 File Structure
```bash
.
├── koctas.js          # The main scraping script
├── koctas_data.json   # Output file with scraped data
├── package.json       # Node.js dependencies
└── README.md          # Documentation

```
🛠️ Configuration
This scraper uses Puppeteer with the following setup:

Headless Mode: Enabled for faster performance.
Browser Arguments:
--no-sandbox
--disable-setuid-sandbox
--disable-dev-shm-usage
--disable-gpu
--window-size=1920,1080
--start-maximized
--incognito (private mode for scraping).
Timeout Settings: Adjusted for reliability during navigation and data extraction.
