# module "s001" {
#   source = "github.com/wwalpha/terraform-module-lambda"

#   publish               = true
#   function_name         = local.lambda.s001.function_name
#   alias_name            = local.lambda_alias_name
#   handler               = local.lambda_handler
#   runtime               = local.lambda_runtime
#   role_name             = local.lambda.s001.role_name
#   log_retention_in_days = var.lambda_log_retention_in_days
#   timeout               = 5
#   trigger_principal     = "apigateway.amazonaws.com"
#   trigger_source_arn    = "${local.api_execution_arn}/*/*/*"
#   source_dir            = local.lambda.s001.source_dir
#   source_output_path    = local.lambda.s001.source_output_path

#   role_policy_json = [file("iam/lambda_policy_dynamodb.json")]
# }
