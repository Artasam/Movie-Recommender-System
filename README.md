# 🎬 Movie Recommender System
A sophisticated content-based movie recommendation system that suggests movies similar to your favorites. Built with **Python** and **Streamlit**, this application leverages machine learning techniques to provide high-quality recommendations along with movie posters fetched in real-time.
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=streamlit)](https://movie-recommender-system-ak.streamlit.app/)
![Python](https://img.shields.io/badge/Python-3.8%2B-blue)
![Streamlit](https://img.shields.io/badge/Streamlit-1.22%2B-red)
![Machine Learning](https://img.shields.io/badge/ML-Content--Based-green)
---
## 🔗 Live Demo
You can try out the application live here: **[https://movie-recommender-system-ak.streamlit.app/](https://movie-recommender-system-ak.streamlit.app/)**
---
## 🌟 Features
- **Personalized Recommendations**: Get suggestions based on movie genres, keywords, cast, and crew.
- **Dynamic Poster Fetching**: Integrated with [The Movie Database (TMDB) API](https://www.themoviedb.org/documentation/api) to display high-quality posters.
- **Customizable Output**: Choose how many recommendations you want to see (from 1 to N).
- **Responsive Layout**: Clean and intuitive UI that displays recommendations in a grid format.
## 🛠️ Tech Stack
- **Frontend**: [Streamlit](https://streamlit.io/)
- **Data Analysis**: [Pandas](https://pandas.pydata.org/), [NumPy](https://numpy.org/)
- **Machine Learning**: [Scikit-learn](https://scikit-learn.org/) (Cosine Similarity)
- **API Connectivity**: [Requests](https://requests.readthedocs.io/)
- **Data Persistence**: [Pickle](https://docs.python.org/3/library/pickle.html)
## 🚀 Getting Started
### Prerequisites
Ensure you have Python installed (3.8 or higher is recommended).
### Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/Artasam/Movie-Recommender-System.git
   cd Movie-Recommender-System
   ```
2. **Create a virtual environment** (optional but recommended):
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
### 📦 Data Files
The system relies on pre-processed data stored in pickle files:
- `movies.pkl`: Contains the processed movie database.
- `similarity.pkl`: Contains the cosine similarity matrix (pre-calculated for performance).
*Note: If these files are missing, you may need to run the `Movie recomendation system.ipynb` notebook to regenerate them from the raw `movies.csv` and `credits.csv` files.*
## 🖥️ Usage
To start the application, run the following command in your terminal:
```bash
streamlit run movierec.py
```
Once the server starts, open your browser and navigate to the local URL (usually `http://localhost:8501`).
1. Select a movie from the dropdown menu.
2. Enter the number of recommendations you desire.
3. Click on **"Give Recommendation"**.
## 📊 How it Works
1. **TF-IDF/Count Vectorization**: The system processes movie tags (genres, keywords, overview, etc.) into numerical vectors.
2. **Cosine Similarity**: It calculates the mathematical "distance" (cosine angle) between movies to find the most similar ones.
3. **API Integration**: Once a similar movie is identified, its `movie_id` is used to fetch the latest poster URL from TMDB.
---
## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details (if applicable).
## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Artasam/Movie-Recommender-System/issues).
---
*Made with ❤️ by Artasam*