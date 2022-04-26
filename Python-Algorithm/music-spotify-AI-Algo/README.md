
- Goal

This recommendation engine is an unsupervised machine learning model (Nearest Neighbors). When a song data is given as an input to the model, it tries to find the songs having almost similar user sentiment and popularity. The technical metric used for training and evaluation is cosine similarity.

- Requirements needed

To run the script, you must create a .env file with the following: 

- `POP_THRES` : Popularity threshold found through statistical analysis | Integer
- `DB` : MongoDB database name | String
- `COLLECTION` : Collection name | String
- `QUERRY` : The querry to fetch the user data must be single line | List of JSON objects
- `HOST` : IP address | String
- `PORT` : port number | String
- `USR` : Username | String
- `PASSWORD` : Password | String


For installing dependencies ( > Python 3.8) on a linux machine :
- `python3 -m pip3 install -r requirements.txt`


How to run algorithms: 

- The model.py python script trains the recommendation engine and saves the model in the same directory
- The script.py python script acts as a helper function while calling the recommendation API
- The recommendationAPI is the FastAPI recommendation engine

To start the FastAPI server :

*Make sure that all the requirements are properly installed*
Open command line in the working directory 
 `uvicorn recommendationAPI:app --reload`


NOTE:

This recommendation system works only for songs having popularity above the popularity threshold.
As of now, since we do not have much data, I've kept the thresold as 0. But as data comes in, the popularity threshold must be chosen after proper statistical hypothesis testing.