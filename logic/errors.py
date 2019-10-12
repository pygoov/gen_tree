# --------- SERVER ERRORS ---------


class BadRequest(Exception):
    response_code = 400


class FileFormatNotValid(BadRequest):
    def __init__(self):
        super().__init__('Filename format not valid')


class FileNotFound(BadRequest):
    response_code = 404

    def __init__(self, filename):
        super().__init__('Filename "{}" not found'.format(filename))


class UnauthorizedError(BadRequest):
    response_code = 401

    def __init__(self):
        super().__init__("Unauthorized")
