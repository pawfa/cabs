resource "aws_kms_key" "kmsKey" {
  description             = "KMS key 1"
}

resource "aws_kms_alias" "myKmsKey" {
  name          = "alias/myKmsKey"
  target_key_id = aws_kms_key.kmsKey.key_id
  depends_on = [aws_kms_key.kmsKey]
}

data "aws_kms_alias" "s3kmskey" {
  name = "alias/myKmsKey"
  depends_on = [aws_kms_alias.myKmsKey]
}