import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.neighbors import NearestNeighbors

class MatchEngine:
    def __init__(self, df: pd.DataFrame):
        self.df = df.copy()
        self.model = None
        self.preprocessor = None
        
        if not self.df.empty:
            self._train_model()

    def _train_model(self):
        # Define features for the ML model
        self.categorical_features = ['Vibe', 'Religiosity', 'Smoking', 'Diet', 'Comm_Style', 'City']
        self.text_features = 'Hobbies'
        
        # Clean data safely
        for col in self.categorical_features:
            self.df[col] = self.df[col].fillna("Unknown")
        self.df[self.text_features] = self.df[self.text_features].fillna("")

        # Create preprocessor pipeline
        self.preprocessor = ColumnTransformer(
            transformers=[
                ('cat', OneHotEncoder(handle_unknown='ignore'), self.categorical_features),
                ('text', TfidfVectorizer(stop_words='english'), self.text_features)
            ],
            remainder='drop'
        )

        # Transform data into high-dimensional space
        X = self.preprocessor.fit_transform(self.df)
        
        # Fit NearestNeighbors using Cosine Distance
        self.model = NearestNeighbors(n_neighbors=50, metric='cosine', algorithm='brute')
        self.model.fit(X)

    def find_matches(self, user_profile: dict) -> list:
        if self.df.empty or self.model is None:
            return []
            
        user_df = pd.DataFrame([user_profile])
        
        for col in self.categorical_features:
            if col not in user_df.columns:
                user_df[col] = "Unknown"
        if self.text_features not in user_df.columns:
            user_df[self.text_features] = ""
            
        user_vector = self.preprocessor.transform(user_df)
        distances, indices = self.model.kneighbors(user_vector)
        
        matches = self.df.iloc[indices[0]].copy()
        similarity_scores = (1 - distances[0]) * 100
        matches['Compatibility_Score'] = np.round(similarity_scores, 1)
        
        # Strict Filtering: Only show people looking for the same Goal
        user_goal = user_profile.get('Goal', 'Both')
        if user_goal != 'Both':
            matches = matches[(matches['Goal'] == user_goal) | (matches['Goal'] == 'Both')]
            
        # Strict City Filtering
        if user_profile.get('strict_city') and user_profile.get('City'):
            matches = matches[matches['City'] == user_profile['City']]
            
        matches = matches.head(10).fillna("")
        return matches.to_dict(orient="records")
        
    def get_stats(self) -> dict:
        if self.df.empty:
            return {}
            
        # Calculate Hobbies percentages
        hobbies_series = self.df['Hobbies'].dropna().astype(str)
        # Split comma separated hobbies and explode
        all_hobbies = hobbies_series.str.split(',').explode().str.strip()
        all_hobbies = all_hobbies[all_hobbies != ""]
        
        hobby_counts = all_hobbies.value_counts()
        total_people = len(self.df)
        
        hobby_percentages = (hobby_counts / total_people * 100).round(1).head(10).to_dict()
        
        # Vibe percentages
        vibe_counts = self.df['Vibe'].value_counts()
        vibe_percentages = (vibe_counts / total_people * 100).round(1).head(5).to_dict()
        
        return {
            "total_users": total_people,
            "top_hobbies": hobby_percentages,
            "top_vibes": vibe_percentages
        }
