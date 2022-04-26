import numpy as np
import pandas as pd
from pymongo import MongoClient
import math
from scipy.sparse import csr_matrix
from sklearn.neighbors import NearestNeighbors
from dotenv import load_dotenv
import os
import ast
import joblib



load_dotenv()

POP_THRES = int(os.environ.get("POP_THRES"))
DB = os.environ.get("DB")
COLLECTION = os.environ.get("COLLECTION")
QUERRY = os.environ.get("QUERRY")
QUERRY = ast.literal_eval(QUERRY)
HOST = os.environ.get("HOST")
PORT = int(os.environ.get("PORT"))
USR = os.environ.get("USR")
PASSWORD = os.environ.get("PASSWORD")


#https://newbedev.com/how-to-import-data-from-mongodb-to-pandas used to help import data from Mongodb to panda and inserting
#variables defined above for connecting and only reading from mongodb.
def _connect_mongo(host, port, username, password, db):

    if username and password:
        mongo_uri = 'mongodb://%s:%s/%s' % (host, port, db)
        conn = MongoClient(mongo_uri)
    else:
        conn = MongoClient(host, port)


    return conn[db]


def read_mongo(db, collection, query=[], host='localhost', port=27017, username=None, password=None, no_id=True):

    db = _connect_mongo(host=host, port=port, username=username, password=password, db=db)

    cursor = db[collection].aggregate(query)

    df =  pd.DataFrame(list(cursor))

    if no_id:
        del df['_id']

    return df


df = read_mongo(db= DB,collection= COLLECTION , query=QUERRY, host=HOST, port=PORT, username=USR, password=PASSWORD)

def convertToNumber (s):
    return int.from_bytes(s.encode(), 'little')

def convertFromNumber (n):
    return n.to_bytes(math.ceil(n.bit_length() / 8), 'little').decode()


myArr = []
for i in range(len(df["likes"])):
    for j in range(len(df["likes"][i])):
        # these are USRID, SONGID, LIKE, DISLIKE, SKIPPED, #NUMPLAYLISTS
        myArr.append([convertToNumber(str(df["likes"][i][j]["user"])), df["likes"][i][j]["item_id"], df["likes"][i][j]["like"], df["likes"][i][j]["dislike"], bool(len(df["likes"][i][j]["isInPlaylist"]))])
        

structured_df = pd.DataFrame(myArr, columns=['user_id', 'song', 'liked', 'disliked', 'addedToPlaylist'])
structured_df = structured_df.replace(True, 1);
structured_df = structured_df.replace(False, 0);
sentiment_df = structured_df.sample(len(structured_df)).reset_index(drop=True)
sentiment_df['sentiment'] = sentiment_df['liked'] + sentiment_df['addedToPlaylist']
sentiment_df[(sentiment_df['disliked']==1) & (sentiment_df['addedToPlaylist']==1)]['sentiment'] = 0
sentiment_df = sentiment_df[['user_id', 'song', 'sentiment']]


combine_song_sentiment = sentiment_df.dropna(axis=0, subset=['song'])
song_sentimentCount = (combine_song_sentiment.groupby(by=['song'])['sentiment'].count().reset_index().rename(columns={'sentiment':'popularity'}))[['song','popularity']]
sentiment_with_popularity = combine_song_sentiment.merge(song_sentimentCount, left_on = 'song', right_on='song', how= 'left')


sentiment_with_popularity['popularity'].apply(np.ceil)
song_sentimentCount['popularity'].apply(np.ceil)

# popularity_threshold = 3
popular_song_sentiment = sentiment_with_popularity.query('popularity >= @POP_THRES')

song_sentimentCount[song_sentimentCount['popularity']>=POP_THRES]

song_features_df=popular_song_sentiment.pivot_table(index='song',columns='user_id',values='sentiment').fillna(0)

# To convert pivot table to array matrix
song_features_df_matrix = csr_matrix(song_features_df.values)

# this is not K - Nearest Neighbors classifier or regressor. It's NearestNeighbors
# Generally, we use KNN to find similar vectors based on euclidean distance, but here we use the distance metric as cosine score
model_knn = NearestNeighbors(metric = 'cosine')
model_knn.fit(song_features_df_matrix)


# Saving song_features_df
filename = 'song_features_df.sav'
joblib.dump(song_features_df, filename)


# Saving model
filename = 'model_knn.sav'
joblib.dump(model_knn, filename)