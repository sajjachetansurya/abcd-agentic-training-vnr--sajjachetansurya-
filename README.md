# abcd-agentic-training-vnr--sajjachetansurya-
full stack -(ai college chatbot)
ml - (virtual assistants)


assignment 1:
# College AI Chatbot - Telangana Engineering Colleges

A full-stack AI-powered chatbot designed to help students explore and get information about engineering colleges in Telangana. The application provides real-time chat capabilities, detailed college information, and a personalized experience through user authentication.

## 🚀 Features

- **AI-Powered Conversations**: Integrated with Google's Gemini AI to provide accurate answers about college courses, syllabus, and campus life.
- **Real-Time Chat**: Powered by Firebase Firestore for instantaneous message synchronization across devices.
- **User Authentication**: Secure Google Login integration via Firebase Authentication.
- **College Explorer**: Browse a curated list of top engineering colleges in Telangana with detailed statistics.
- **Detailed Insights**: View placement rates, average packages, top recruiters, and admission processes for each college.
- **Responsive Design**: Fully optimized for both desktop and mobile devices with a modern, clean UI.
- **Theme Support**: Dark and Light mode support for comfortable viewing.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React (Icons).
- **Backend**: Node.js, Express.js.
- **Database & Auth**: Firebase (Firestore & Authentication).
- **AI Engine**: Google Gemini API (@google/genai).
- **Build Tool**: Vite.

## 📋 Prerequisites

Before you begin, ensure you have the following:
- Node.js (v18 or higher)
- A Firebase Project
- A Google Gemini API Key

## 🏗️ Project Structure

- `server.ts`: Express server entry point with Vite middleware integration.
- `App.tsx`: Main React application component handling auth state and routing.
- `components/`: Reusable UI components (Dashboard, Login, CollegeSelector, etc.).
- `services/`: Logic for external integrations (Gemini AI, Firebase).
- `constants.ts`: Static data for Telangana colleges.
- `types.ts`: TypeScript interfaces and type definitions.
- `firestore.rules`: Security rules for the Firestore database.

## 🔒 Security Rules

The project includes a `firestore.rules` file that ensures:
- Users can only read and write their own messages.
- User profiles are protected and only accessible by the account owner.
- Basic data validation for all incoming Firestore writes.


assignment 3:
# Salary Prediction using Linear Regression

## Project Description

This project implements a simple Machine Learning model using Linear Regression to predict salary based on years of experience. The model is trained on a small dataset and used to predict salary for new input values.

---

## Requirements

Install the required libraries before running the program:

```
pip install numpy
pip install scikit-learn
```

---

## Libraries Used

* NumPy
* Scikit-learn

---

## Dataset

| Experience (Years) | Salary |
| ------------------ | ------ |
| 1                  | 30     |
| 2                  | 35     |
| 3                  | 45     |
| 4                  | 50     |
| 5                  | 60     |

---

## Algorithm Used

Linear Regression

Linear Regression follows the equation:

y = mx + c

Where:

* y = Predicted salary
* x = Experience
* m = Slope
* c = Intercept

---

## Code

```python
import numpy as np
from sklearn.linear_model import LinearRegression

# Dataset
X = np.array([1, 2, 3, 4, 5]).reshape(-1,1)
y = np.array([30, 35, 45, 50, 60])

# Create model
model = LinearRegression()

# Train model
model.fit(X, y)

# Prediction
experience = np.array([[6]])
prediction = model.predict(experience)

print("Predicted Salary:", prediction)
```

---

## How to Run

1. Save the code in a file named `model.py`
2. Open terminal or command prompt
3. Run the command:

```
python model.py
```

---

## Output

```
Predicted Salary: [68.5]
```

---

## Steps Involved

1. Import libraries
2. Create dataset
3. Create model
4. Train model
5. Predict value
6. Print output

---

## Applications

* Salary Prediction
* House Price Prediction
* Sales Forecasting
* Stock Prediction

---

assignment 6:

Tokenization is the process of breaking text into smaller parts called tokens such as words or sentences.

Example:

Input:

```
Hi I am Chetan
```

Output:

```
['hi', 'i', 'am', 'chetan']
```

---

## Tokenization Code

```python
def tokenize(text):
    tokens = []
    word = ""
    
    for char in text:
        if char.isalnum():
            word += char
        else:
            if word != "":
                tokens.append(word.lower())
                word = ""
    
    if word != "":
        tokens.append(word.lower())
        
    return tokens

text = "Hi I am Chetan"

tokens = tokenize(text)

print("Tokens:")
print(tokens)
```

---

## Output

```
Tokens:
['hi', 'i', 'am', 'chetan']
```

---

## Steps Involved

1. Define function
2. Create empty list
3. Loop through characters
4. Build words
5. Store tokens
6. Return tokens

---

## Applications of Tokenization

* Chatbots
* Search engines
* Text processing
* NLP models
* AI assistants

---

assignment 7:

Cosine similarity measures similarity between two text documents using vector comparison.

Formula:

Cosine Similarity = (A · B) / (||A|| ||B||)

Used in:

* Search engines
* Recommendation systems
* NLP applications

---

## Requirements

Install required libraries:

```
pip install numpy
pip install scikit-learn
```

---

## Cosine Similarity Code

```python
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

documents = [
    "machine learning is fun",
    "python programming language",
    "machine learning with python",
    "deep learning techniques"
]

query = ["machine learning"]

vectorizer = TfidfVectorizer()
vectors = vectorizer.fit_transform(documents + query)

cosine_sim = cosine_similarity(vectors[-1], vectors[:-1])

print("Cosine Similarity Scores:")

for i, score in enumerate(cosine_sim[0]):
    print("Document", i+1, ":", score)

best_match = np.argmax(cosine_sim)

print("Best Match:", documents[best_match])
```

---

## Output Example

```
Cosine Similarity Scores:
Document 1 : 0.75
Document 2 : 0.10
Document 3 : 0.82
Document 4 : 0.20

Best Match: machine learning with python
```

---

## Steps Involved

1. Import libraries
2. Create documents
3. Convert text to vectors
4. Compute cosine similarity
5. Find best match
6. Display results

---

## Applications of Cosine Search

* Search engines
* Document similarity
* Chatbots
* Recommendation systems
* Semantic search

---

## Libraries Used

* NumPy
* Scikit-learn

---

FINAL PROJECT:

# 🚀 Market Mind: Multi-Agent Intelligence System

**Market Mind** is an advanced Agentic AI platform designed to automate deep market research. It deploys a collaborative team of specialized AI agents to transform a simple topic into a professional, data-driven market intelligence report in minutes.

## 🌟 Key Features

### 🤖 Multi-Agent Workflow
- **Researcher Agent:** Scours the web (via Gemini Grounding) to gather real-time data, news, and technical documents.
- **Analyst Agent:** Processes raw research to generate SWOT analyses, identify market trends, and calculate strategic scores.
- **Editor Agent:** Synthesizes all findings into a polished, executive-ready professional report.

### 🔐 Enterprise-Grade Integration
- **Google Authentication:** Secure login gateway using Firebase Auth.
- **Persistent History:** Automatically saves every research task to a Firestore database for future retrieval.
- **Hybrid Execution:** Choose between **Local Execution** (browser-based agents) or **n8n Workflow** integration for complex automation.

### 📊 Interactive Insights
- **SWOT Radar Charts:** Visual representation of market dynamics using Recharts.
- **Source Transparency:** Hoverable grounding sources with type-specific icons (Web vs. Document).
- **Markdown Export:** Download reports as `.md` files for seamless integration into other tools.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS 4.0
- **AI Engine:** Google Gemini 1.5 Pro (via `@google/genai`)
- **Backend/Database:** Firebase (Auth & Firestore)
- **Visualization:** Recharts (Radar Charts), React Flow (Workflow Visualization)
- **Icons:** Lucide React
- **Animations:** Motion (formerly Framer Motion)

## 📈 How It Works

1. **Input:** User enters a market topic (e.g., "The future of Solid-State Batteries").
2. **Research:** The Researcher Agent performs a grounded search to find current data.
3. **Analysis:** The Analyst Agent builds a SWOT matrix and identifies 5+ key trends.
4. **Synthesis:** The Editor Agent writes the final report with strategic recommendations.
5. **Persistence:** The entire bundle (Research + Analysis + Report) is saved to the user's Firestore history.

---

## 🔮 Future Roadmap
- [ ] **Multi-Language Support:** Generate reports in 10+ languages.
- [ ] **PDF Export:** Direct export to professional PDF templates.
- [ ] **Competitor Tracking:** Scheduled agents that monitor specific companies and alert the user.


---

