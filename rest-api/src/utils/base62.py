CHARSET_DEFAULT = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
BASE = len(CHARSET_DEFAULT) # 62

def b62_encode(barray, charset=CHARSET_DEFAULT):

    minlen = 1
    n = int.from_bytes(barray, "big")

    chs = []
    while n > 0:
        r = n % BASE
        n //= BASE

        chs.append(charset[r])

    if len(chs) > 0:
        chs.reverse()
    else:
        chs.append("0")

    s = "".join(chs)
    s = charset[0] * max(minlen - len(s), 0) + s
    return s

def b62_decode(encoded, charset=CHARSET_DEFAULT):

    if encoded.startswith("0z"):
        encoded = encoded[2:]

    l, i, v = len(encoded), 0, 0
    for x in encoded:
        v += _value(x, charset=charset) * (BASE ** (l - (i + 1)))
        i += 1

    buf = bytearray()
    while v > 0:
        buf.append(v & 0xFF)
        v //= 256
    buf.reverse()

    return bytes(buf)

def _value(ch, charset):
    """Decodes an individual digit of a base62 encoded string."""

    try:
        return charset.index(ch)
    except ValueError as exc:
        raise ValueError(f"base62: Invalid character ({ch})") from exc