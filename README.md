# 🧪 An End-to-End Laboratory Report Analysis & Personalized Diet Recommendation System
---

## 📌 Overview
This project is an intelligent healthcare system that analyzes laboratory reports and generates personalized diet recommendations.

It converts unstructured lab reports into:
- 📊 Structured data  
- 💬 Easy-to-understand explanations  
- 🥗 Personalized diet plans  

---

## 🚀 Features
- 📄 Upload lab reports (PDF/Image)  
- 🔍 OCR-based text extraction (PaddleOCR)  
- 🧠 Medical entity extraction (BiLSTM-CRF)  
- 📊 Structured table generation  
- 💬 LLM-based explanation  
- 🥗 Personalized weekly diet plan  
- 📈 BMI & health condition analysis  

---

## 🛠 Tech Stack
| Layer         | Technology                     |
|--------------|------------------------------|
| Frontend     | React.js (Vite), CSS          |
| Backend      | Node.js, Express.js           |
| Database     | MongoDB (if used)             |
| OCR          | PaddleOCR                     |
| ML Model     | BiLSTM-CRF                    |
| Framework    | PyTorch                       |
| LLM          | Groq / HuggingFace            |
| File Upload  | Multer, Cloudinary            |
| Auth         | Passport.js / JWT             |

---

## ⚙️ Installation & Setup
### 🔧 Clone the Repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```
## ▶️ Running the Project
### 🔸 Step 1: Run Frontend
```bash
cd frontend
npm install
npm run dev
```
👉 This starts the frontend (usually on http://localhost:5173)

### 🔸 Step 2: Run Backend

Open a new terminal and run:

```bash
cd backend
npm install
npx nodemon index
```
👉 This starts the backend server (API handling)

## 🔗 How It Works
- 📄 User uploads lab report  
- 🔍 OCR extracts text  
- 🧠 NER model identifies medical entities  
- 📊 Data is converted into structured table  
- 💬 LLM generates explanation  
- 🥗 Diet engine creates personalized plan  

---

## 📊 Results
- 📈 Achieved **0.93 F1-score** in entity extraction  
- ⚡ Handles noisy OCR data effectively  
- 🥗 Generates safe and personalized diet plans  

---

## 📌 Applications
- 🏥 Healthcare support systems  
- 👨‍⚕️ Patient self-analysis tools  
- 📊 Clinical data automation  
- 🥗 Diet recommendation systems  

---

## ⚠️ Limitations
- Not a replacement for doctors  
- Limited to predefined diet rules  
- Supports common lab tests only  

---

## 🔮 Future Enhancements
- 📱 Mobile app integration  
- ⏱ Real-time monitoring  
- 🤖 Advanced AI-based recommendations  
- 🧪 More medical test coverage  

---

## 👩‍💻 Authors
- G. Harshini  
- K. Anjusri  
- B. Naga Roopa Sri  
- B. Jayanthi  

**Guide:** Dr. A. Ramana Lakshmi  

---

## 🙌 Acknowledgement
We thank our faculty and institution for their continuous support.

---

## ⭐ Support
If you like this project, give it a ⭐ on GitHub!
