import torch


class Attention(torch.nn.Module):
    """An attention layer used by the LSTM"""

    def __init__(self, attention_size):
        super(Attention, self).__init__()
        self.attention = self.generate_attention_vector(attention_size, 1)

    def generate_attention_vector(self, *size):
        out = torch.FloatTensor(*size).to("cuda:0")
        torch.nn.init.xavier_normal_(out)
        return out

    def forward(self, x_in):
        attention_score = torch.matmul(x_in, self.attention).squeeze()
        attention_score = torch.nn.functional.softmax(attention_score).view(
            x_in.size(0), x_in.size(1), 1
        )
        scored_x = x_in * attention_score

        condensed_x = torch.sum(scored_x, dim=1)

        return condensed_x
