import hashlib


def compute_sha256(content: bytes) -> str:
    return hashlib.sha256(content).hexdigest()


def verify_integrity(content: bytes, expected_hash: str) -> bool:
    return compute_sha256(content) == expected_hash