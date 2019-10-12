from tools.env_tool import get_env


debug = get_env("DEBUG", bool, True)
port = get_env("PORT", int, 11554)
password = get_env("PASSWORD", str, "123321")
data_folder = get_env("DATA_FOLDER", str, "./data")
