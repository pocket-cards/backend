# --------------------------------------------------------------------------------
# Send notification to slack when build Success / Failed
# --------------------------------------------------------------------------------
module "m001" {
  source = "github.com/wwalpha/terraform-module-lambda"

  function_name         = local.lambda.m001.function_name
  alias_name            = local.lambda_alias_name
  handler               = local.lambda_handler
  runtime               = local.lambda_runtime
  memory_size           = 128
  role_name             = local.lambda.m001.role_name
  role_policy_json      = [file("iam/lambda_policy_ssm.json")]
  xray_enabled          = true
  log_retention_in_days = var.lambda_log_retention_in_days
  source_dir            = local.lambda.m001.source_dir
  source_output_path    = local.lambda.m001.source_output_path

  variables = {
    SLACK_URL_KEY = "${local.slack_url}"
  }

  layers = [local.xray, local.axios, local.moment]
}

# --------------------------------------------------------------------------------
# CodeBuild state change to failed
# --------------------------------------------------------------------------------
module "m002" {
  source = "github.com/wwalpha/terraform-module-lambda"

  function_name         = local.lambda.m002.function_name
  alias_name            = local.lambda_alias_name
  handler               = local.lambda_handler
  runtime               = local.lambda_runtime
  memory_size           = 128
  role_name             = local.lambda.m002.role_name
  role_policy_json      = [file("iam/lambda_policy_lambda.json")]
  xray_enabled          = true
  log_retention_in_days = var.lambda_log_retention_in_days
  source_dir            = local.lambda.m002.source_dir
  source_output_path    = local.lambda.m002.source_output_path
  trigger_principal     = local.sns_trigger_principal
  trigger_source_arn    = local.notify_trigger_source_arn

  variables = {
    CALL_SLACK_FUNCTION = local.lambda.m001.function_name
  }

  layers = [local.xray, local.axios, local.moment]
}

# --------------------------------------------------------------------------------
# CodePipeline state change to success
# --------------------------------------------------------------------------------
module "m003" {
  source = "github.com/wwalpha/terraform-module-lambda"

  function_name         = local.lambda.m003.function_name
  alias_name            = local.lambda_alias_name
  handler               = local.lambda_handler
  runtime               = local.lambda_runtime
  memory_size           = 128
  role_name             = local.lambda.m003.role_name
  role_policy_json      = [file("iam/lambda_policy_lambda.json")]
  xray_enabled          = true
  log_retention_in_days = var.lambda_log_retention_in_days
  source_dir            = local.lambda.m003.source_dir
  source_output_path    = local.lambda.m003.source_output_path

  variables = {
    CALL_SLACK_FUNCTION = local.lambda.m001.function_name
  }

  layers = [local.xray, local.axios, local.moment]
}
