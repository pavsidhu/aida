import torch
from torch import nn, optim, tensor
from torch.nn.utils.rnn import pack_padded_sequence, pad_packed_sequence, pad_sequence

from .Attention import Attention


class LstmModel(nn.Module):
    """LSTM model to predict personality"""

    def __init__(
        self,
        dropout_input=0,
        dropout_output=0,
        hidden_dim=192,
        embedding_dim=768,
        output_dim=1,
    ):
        super(LstmModel, self).__init__()

        attention_size = hidden_dim * 4 + embedding_dim

        # Model structure
        self.dropout_1 = nn.Dropout(p=dropout_input)
        self.lstm_1 = nn.LSTM(
            embedding_dim, hidden_dim, bidirectional=True, batch_first=True
        )
        self.lstm_2 = nn.LSTM(
            hidden_dim * 2, hidden_dim, bidirectional=True, batch_first=True
        )
        self.attention = Attention(attention_size)
        self.dropout_2 = nn.Dropout(p=dropout_output)
        self.output = nn.Sequential(nn.Linear(attention_size, output_dim), nn.Sigmoid())

    def forward(self, embeddings, embeddings_lengths):
        dropout_embeddings = self.dropout_1(embeddings)

        # Pack embeddings for efficency before sending to the LSTM layer
        packed_embeddings = pack_padded_sequence(
            embeddings, embeddings_lengths, batch_first=True
        )

        lstm_1_output, _ = self.lstm_1(packed_embeddings)
        lstm_2_output, _ = self.lstm_2(lstm_1_output)

        # Unpack embeddings for use by the attention layer
        padded_lstm_1_output, _ = pad_packed_sequence(lstm_1_output, batch_first=True)
        padded_lstm_2_output, _ = pad_packed_sequence(lstm_2_output, batch_first=True)

        # Create input for the attention layer of the embeddings and all the LSTM output
        padded_lstm_output = torch.cat(
            (padded_lstm_1_output, padded_lstm_2_output, embeddings), dim=2
        )

        attention_output = self.attention(padded_lstm_output)

        dropout_output = self.dropout_2(attention_output)

        result = self.output(dropout_output).squeeze()

        return result
