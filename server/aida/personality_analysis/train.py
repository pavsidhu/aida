import json
import sys

import numpy as np
import pandas
import tensorflow
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.model_selection import train_test_split

ROOT_PATH = "aida/personality_analysis"
sys.path.append(f"{ROOT_PATH}/deepmoji")

from deepmoji.finetuning import finetune
from deepmoji.model_def import deepmoji_architecture, deepmoji_transfer
from deepmoji.sentence_tokenizer import SentenceTokenizer


# Filepaths to required data
VOCAB_PATH = f"{ROOT_PATH}/data/vocabulary.json"
PRETRAINED_PATH = f"{ROOT_PATH}/data/deepmoji_weights.hdf5"
MY_PERSONALITY_PATH = f"{ROOT_PATH}/data/mypersonality.csv"

# Portion of the dataset to use for testing
TEST_SPLIT_SIZE = 0.2

# Portion of the training set to use for validation
VALIDATION_SPLIT_SIZE = 0.1

# Max length of each piece of text in the dataset
MAX_LENGTH = 1

# Size of batches
BATCH_SIZE = 100

TRAITS = ["cEXT", "cNEU", "cAGR", "cCON", "cOPN"]

with open(VOCAB_PATH, "r") as file:
    vocabulary = json.load(file)


def pipeline(trait):
    """Builds a model for a given personality trait"""

    # Load, prepare and split the dataset
    dataset = load_my_personality_dataset(MY_PERSONALITY_PATH, trait)
    (
        train_text,
        train_labels,
        val_text,
        val_labels,
        test_text,
        test_labels,
    ) = prepare_dataset(dataset["STATUS"], dataset[trait])

    # Define model parameters
    number_of_classes = 2
    number_of_tokens = len(vocabulary)

    # Build the pretrained model
    model = deepmoji_transfer(
        nb_classes=number_of_classes, maxlen=MAX_LENGTH, weight_path=PRETRAINED_PATH
    )

    # Finetune the model based on the MyPersonality dataset
    trained_model, _ = finetune(
        model=model,
        texts=np.array([train_text, val_text, test_text]),
        labels=np.array([train_labels, val_labels, test_labels]),
        nb_classes=number_of_classes,
        batch_size=BATCH_SIZE,
        method="chain-thaw",
        verbose=1,
    )

    predict_test_labels = [0 if p < 0.5 else 1 for p in model.predict(test_text)]

    accuracy = accuracy_score(test_labels, predict_test_labels)
    print(f"Accuracy: {accuracy}")

    precision = precision_score(test_labels, predict_test_labels, average=None)
    recall = recall_score(test_labels, predict_test_labels, average=None)
    f1score = f1_score(test_labels, predict_test_labels, average=None)

    for class_number in range(0, number_of_classes):
        print(
            f"""
            Precision: {precision[class_number]}
            Recall: {recall[class_number]}
            F1 Score: {f1score[class_number]}
        """
        )

    model.save(f"{ROOT_PATH}/model/model.h5")


def load_my_personality_dataset(path, trait):
    """Loads the texts and traits from the MyPersonality dataset"""
    data = pandas.read_csv(path, encoding="latin1")

    # Change trait labels to numbers
    data[trait] = data[trait].map({"n": 0, "y": 1})

    return data[["STATUS", trait]]


def prepare_dataset(text, labels):
    """Generates training, validation and test sets"""
    sentence_tokenizer = SentenceTokenizer(vocabulary, MAX_LENGTH)

    # Split dataset into training and test sets
    train_text, test_text, train_labels, test_labels = train_test_split(
        text, labels, test_size=TEST_SPLIT_SIZE, random_state=0
    )

    # Split training into training and validation sets
    train_text, val_text, train_labels, val_labels = train_test_split(
        text, labels, test_size=VALIDATION_SPLIT_SIZE, random_state=0
    )

    # Tokenize sentences
    train_text, _, _ = sentence_tokenizer.tokenize_sentences(train_text)
    val_text, _, _ = sentence_tokenizer.tokenize_sentences(val_text)
    test_text, _, _ = sentence_tokenizer.tokenize_sentences(test_text)

    # Convert labels into numpy arrays
    train_labels = train_labels.to_numpy()
    val_labels = val_labels.to_numpy()
    test_labels = test_labels.to_numpy()

    return (
        train_text,
        train_labels,
        val_text,
        val_labels,
        test_text,
        test_labels,
    )


if __name__ == "__main__":
    pipeline(TRAITS[0])
