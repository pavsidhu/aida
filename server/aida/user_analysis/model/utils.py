import torch
from transformers import AutoModel, AutoTokenizer


model = "roberta-base"

device = "cuda:0" if torch.cuda.is_available() else "cpu"
tokenizer = AutoTokenizer.from_pretrained(model)
embeddings_model = AutoModel.from_pretrained(model).to(device)

MAX_LENGTH = 300


def generate_embeddings(texts):
    """Generates word embeddings from text"""

    embeddings = []
    embeddings_lengths = []

    for i, text in enumerate(texts):
        encoded_text = tokenizer.encode_plus(
            text.lower(),
            add_special_tokens=True,
            max_length=MAX_LENGTH,
            pad_to_max_length=True,
        )
        input_ids = encoded_text["input_ids"]
        attention_mask = encoded_text["attention_mask"]

        input = torch.tensor(input_ids).to(device).unsqueeze(0)
        input_mask = torch.tensor(attention_mask).to(device).unsqueeze(0)

        output = embeddings_model(input, attention_mask=input_mask)[0]
        output = output.squeeze().to("cpu")

        embeddings.append(output)
        embeddings_lengths.append(len(input_ids))

    embeddings = torch.stack(embeddings, dim=0).to(device)
    embeddings_lengths = torch.tensor(embeddings_lengths).to(device)

    return embeddings, embeddings_lengths
