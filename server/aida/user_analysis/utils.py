from IPython.display import HTML


def progress_bar(value, max=100):
    return HTML(
        """
        <progress value='{value}' max='{max}' style='width: 100%'>
            {value}
        </progress>
    """.format(
            value=value, max=max
        )
    )

