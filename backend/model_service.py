import os, pickle
import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.preprocessing import LabelEncoder
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

MODEL_DIR = "models"
os.makedirs(MODEL_DIR, exist_ok=True)

MODEL_PATH = os.path.join(MODEL_DIR, "chatbot_model.h5")
TOKENIZER_PATH = os.path.join(MODEL_DIR, "tokenizer.pkl")
ENCODER_PATH = os.path.join(MODEL_DIR, "label_encoder.pkl")

MAX_WORDS = 5000
MAX_LEN = 20
EMBED_DIM = 32

def _load_dataset():
    df = pd.read_csv("data/dataset.csv")
    return df["text"].astype(str).tolist(), df["label"].astype(str).tolist()

def _build_and_train():
    texts, labels = _load_dataset()

    encoder = LabelEncoder()
    y = encoder.fit_transform(labels)

    tokenizer = Tokenizer(num_words=MAX_WORDS, oov_token="<OOV>")
    tokenizer.fit_on_texts(texts)
    X = pad_sequences(tokenizer.texts_to_sequences(texts), maxlen=MAX_LEN)

    model = tf.keras.Sequential([
        tf.keras.layers.Embedding(MAX_WORDS, EMBED_DIM, input_length=MAX_LEN),
        tf.keras.layers.GlobalAveragePooling1D(),
        tf.keras.layers.Dense(32, activation="relu"),
        tf.keras.layers.Dense(len(set(y)), activation="softmax")
    ])
    model.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])
    model.fit(X, y, epochs=30, verbose=0)

    model.save(MODEL_PATH)
    pickle.dump(tokenizer, open(TOKENIZER_PATH, "wb"))
    pickle.dump(encoder, open(ENCODER_PATH, "wb"))

    return model, tokenizer, encoder

def _load_or_train():
    if all(os.path.exists(p) for p in [MODEL_PATH, TOKENIZER_PATH, ENCODER_PATH]):
        model = tf.keras.models.load_model(MODEL_PATH)
        tokenizer = pickle.load(open(TOKENIZER_PATH, "rb"))
        encoder = pickle.load(open(ENCODER_PATH, "rb"))
    else:
        model, tokenizer, encoder = _build_and_train()
    return model, tokenizer, encoder

_model, _tokenizer, _encoder = _load_or_train()

def predict_category(text: str) -> str:
    seq = _tokenizer.texts_to_sequences([text])
    pad = pad_sequences(seq, maxlen=MAX_LEN)
    probs = _model.predict(pad, verbose=0)[0]
    return _encoder.inverse_transform([np.argmax(probs)])[0]
