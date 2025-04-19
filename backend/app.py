from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from pymongo import MongoClient
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import time
from bson import ObjectId

app = Flask(__name__)  # ✅
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

# --- 🔗 Connexion MongoDB ---
MONGO_URI = "mongodb+srv://aymanraisse7:QQjjz29Hu8RWqXEh@cluster0.945tp.mongodb.net/Products?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URI)
db = client["Products"]
collection = db["products"]

# --- 🔁 Modèle TF-IDF en cache ---
products_df = None
cosine_sim = None
last_refreshed = 0
MODEL_REFRESH_INTERVAL = 600  # secondes

# --- 🛠️ Chargement des produits ---
def load_products_from_db():
    products = list(collection.find())
    
    print(f"[DEBUG] Produits récupérés : {len(products)}")

    if products:
        print("[DEBUG] Exemple de produit :", products[0])
    else:
        print("[ALERTE] Aucun produit trouvé dans MongoDB ❌")

    for product in products:
        product["product_id"] = str(product["_id"])
        
    return products

# --- 🔁 Création du modèle de similarité ---
def build_similarity_model():
    global last_refreshed, products_df, cosine_sim
    current_time = time.time()

    if current_time - last_refreshed > MODEL_REFRESH_INTERVAL:
        products = load_products_from_db()
        df = pd.DataFrame(products)

        # Vérifie si les colonnes existent
        if 'category' not in df.columns or 'description' not in df.columns:
            raise ValueError("Les colonnes 'category' ou 'description' sont absentes des données MongoDB.")

        df["combined"] = df["category"].fillna("") + " " + df["description"].fillna("")

        tfidf = TfidfVectorizer(stop_words="english")
        tfidf_matrix = tfidf.fit_transform(df["combined"])
        cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
        products_df = df
        last_refreshed = current_time
        print("[INFO] Modèle actualisé.")
    else:
        print("[INFO] Utilisation du modèle en cache.")

    return products_df, cosine_sim


# Initialiser le modèle une première fois
products_df, cosine_sim = build_similarity_model()

# --- 🧠 Fonction de recommandation par catégorie ---
def get_similar_products_by_category(category, current_id=None, num=10):
    try:
        category_products = products_df[products_df["category"] == category]

        if current_id:
            category_products = category_products[category_products["product_id"] != current_id]

        if category_products.empty:
            return []

        top_products = category_products.head(num)
        similar_products = top_products.to_dict(orient="records")

        # Add the full image URL to each recommended product
        for product in similar_products:
            product["_id"] = str(product["_id"])  # Convert _id to string
            # Construct full image URL if available
            product["image"] = f"http://localhost:5000{product['image']}"  # Full URL for image

        return similar_products
    except Exception as e:
        return []

 
# --- 📡 Endpoint API /recommendations ---
@app.route("/recommendations", methods=["POST"])
def recommend():
    data = request.get_json()
    category = data.get("category")
    current_id = data.get("product_id")  # Optionally exclude the current product

    if not category:
        return jsonify({"error": "category is required"}), 400

    global products_df, cosine_sim
    products_df, cosine_sim = build_similarity_model()

    results = get_similar_products_by_category(category, current_id=current_id)

    return jsonify(results)

# --- 🚀 Lancer le serveur Flask ---
if __name__ == "__main__":  # ✅
    app.run(debug=True, port=5001)
