# -----------------------------------------------
# 画像から単語に変換する: /image2text
# -----------------------------------------------
module "d001" {
  source = "github.com/wwalpha/terraform-module-lambda"

  function_name         = local.lambda.d001.function_name
  alias_name            = local.lambda_alias_name
  handler               = local.lambda_handler
  runtime               = local.lambda_runtime
  role_name             = local.lambda.d001.role_name
  memory_size           = 1024
  log_retention_in_days = var.lambda_log_retention_in_days
  layers                = [local.xray, local.moment]
  source_dir            = local.lambda.d001.source_dir
  source_output_path    = local.lambda.d001.source_output_path
  trigger_principal     = local.api_trigger_principal
  trigger_source_arn    = "${local.api_trigger_source_arn}/*/POST/image2text"

  role_policy_json = [
    file("iam/lambda_policy_s3.json"),
    file("iam/lambda_policy_rekognition.json")
  ]

  variables = {
    EXCLUDE_WORD = "",
    IMAGE_BUCKET = local.bucket_name_images
    TZ           = local.timezone
  }
}
