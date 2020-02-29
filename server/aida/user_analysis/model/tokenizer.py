import torch
from torch.nn.utils.rnn import pad_sequence
from transformers import BertTokenizer

tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")


def tokenize(texts):
    """tokenizes user chat messages and tweets"""

    tokens = [
        torch.tensor(tokenizer.encode(text.lower(), add_special_tokens=True))
        for text in texts
    ]
    padded_tokens = pad_sequence(tokens, batch_first=True, padding_value=0)

    return padded_tokens
