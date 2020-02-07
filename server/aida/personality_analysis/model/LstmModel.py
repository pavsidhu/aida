from torch import nn
from transformers import BertModel

from aida.personality_analysis.model.Attention import Attention

device = "cpu"


class LstmModel(nn.Module):
    """LSTM model to predict personality"""

    def __init__(self, emedding_dim=768, hidden_dim=1536, output_dim=1):
        super(LstmModel, self).__init__()

        # Model structure
        self.word_embeddings = BertModel.from_pretrained("bert-base-uncased").to(device)
        self.lstm_1 = nn.LSTM(emedding_dim, hidden_dim, batch_first=True)
        self.attention = Attention(hidden_dim)
        self.output = nn.Sequential(nn.Linear(hidden_dim, output_dim), nn.Sigmoid())

        # Use GPU if available
        self.to(device)

    def forward(self, tokens):
        emeddings = self.word_embeddings(tokens)[0]
        lstm_output = self.lstm_1(emeddings)[0]
        attention_output = self.attention(lstm_output)
        result = self.output(attention_output)

        return result
