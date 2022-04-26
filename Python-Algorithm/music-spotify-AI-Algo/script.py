import joblib
model_knn = joblib.load("model_knn.sav")
song_features_df = joblib.load("song_features_df.sav")

def letsRecommend(song_id:str, numOfRec:int):
    val =1
    try:
        song_features_df.loc[song_id]
    except:
        val = 0
    if not val:
        return []

    # Getting euclidean distance based on cosine metric and indices of respective neighbors which are nearest
    distances, indices = model_knn.kneighbors(song_features_df.loc[song_id].values.reshape(1,-1), n_neighbors=(numOfRec+1))


    ans = []

    # Here we are getting 3 recommendations
    # .flatten() returns a copy of the array collapsed into one dimension (row major).
    for i in range(0, len(distances.flatten())):
        if i == 0:
            pass
        else:
            ans.append(song_features_df.index[indices.flatten()[i]])
    return ans