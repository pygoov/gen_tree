import os


def get_env(key: str, _type: type, default=None):
    val = os.getenv(key, None)

    if _type is not None and isinstance(_type, type) and val is not None:
        if _type in (int, float, str):
            try:
                # print('val', key,  val, _type, _type(val))
                val = _type(val)
            except TypeError:
                raise TypeError('Env "{}" is not type "{}"'.format(
                    key,
                    _type
                ))
        elif _type is bool:
            val = val.lower().strip() in ['true', '1', 'yes', 'y']
        else:
            raise Exception('Type "{}" is not supported!'.format(_type))
    else:
        val = default

    return val
