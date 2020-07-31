# module "e001" {
#   source = "github.com/wwalpha/terraform-module-lambda"

#   enable_dummy          = true
#   enable_xray           = true
#   publish               = true
#   function_name         = "${local.project_name_uc}-E001"
#   handler               = local.lambda_handler
#   runtime               = local.lambda_runtime
#   role_name             = "${local.project_name_uc}-E001"
#   layers                = [local.xray]
#   log_retention_in_days = var.lambda_log_retention_in_days
#   timeout               = 5
#   alias_name            = local.alias_name
#   trigger_principal     = "cognito-idp.amazonaws.com"
#   trigger_source_arn    = aws_cognito_user_pool.this.arn

#   variables = {
#     USERS_TABLE       = local.dynamodb_name_users
#     USER_GROUPS_TABLE = local.dynamodb_name_user_groups
#     TZ                = local.timezone
#   }

#   role_policy_json = [
#     data.aws_iam_policy_document.dynamodb_access_policy.json
#   ]
# }

