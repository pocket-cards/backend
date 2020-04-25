# -----------------------------------------------
# グループ登録: /groups
# -----------------------------------------------
# module "b001" {
#   source = "github.com/wwalpha/terraform-module-lambda"

#   function_name         = local.lambda.b001.function_name
#   alias_name            = local.lambda_alias_name
#   handler               = local.lambda_handler
#   runtime               = local.lambda_runtime
#   memory_size           = 512
#   role_name             = local.lambda.b001.role_name
#   role_policy_json      = [file("iam/lambda_policy_dynamodb.json")]
#   log_retention_in_days = var.lambda_log_retention_in_days
#   source_dir            = local.lambda.b001.source_dir
#   source_output_path    = local.lambda.b001.source_output_path

#   variables = {
#     TABLE_HISTORY     = local.dynamodb_name_history
#     TABLE_GROUPS = local.dynamodb_name_user_groups
#     TABLE_WORDS = local.dynamodb_name_group_words
#     TZ                = local.timezone
#   }

#   layers = [local.xray, local.moment, local.lodash]
# }

# -----------------------------------------------
# グループ情報取得: /groups/{groupId}
# -----------------------------------------------
module "b002" {
  source = "github.com/wwalpha/terraform-module-lambda"

  function_name         = local.lambda.b002.function_name
  alias_name            = local.lambda_alias_name
  handler               = local.lambda_handler
  runtime               = local.lambda_runtime
  role_name             = local.lambda.b002.role_name
  log_retention_in_days = var.lambda_log_retention_in_days
  source_dir            = local.lambda.b002.source_dir
  source_output_path    = local.lambda.b002.source_output_path
  trigger_principal     = local.api_trigger_principal
  trigger_source_arn    = "${local.api_trigger_source_arn}/*/GET/groups"

  role_policy_json      = [file("iam/lambda_policy_dynamodb.json")]
}

# -----------------------------------------------
# グループ情報変更: /groups/{groupId}
# -----------------------------------------------
# module "b003" {
#   source = "github.com/wwalpha/terraform-module-lambda"

#   function_name         = local.lambda.b003.function_name
#   alias_name            = local.lambda_alias_name
#   handler               = local.lambda_handler
#   runtime               = local.lambda_runtime
#   role_name             = local.lambda.b003.role_name
#   log_retention_in_days = var.lambda_log_retention_in_days
#   source_dir            = local.lambda.b003.source_dir
#   source_output_path    = local.lambda.b003.source_output_path
#   role_policy_json      = [file("iam/lambda_policy_dynamodb.json")]
# }

# -----------------------------------------------
# グループ情報削除: /groups/{groupId}
# -----------------------------------------------
# module "b004" {
#   source = "github.com/wwalpha/terraform-module-lambda"

#   function_name         = local.lambda.b004.function_name
#   alias_name            = local.lambda_alias_name
#   handler               = local.lambda_handler
#   runtime               = local.lambda_runtime
#   role_name             = local.lambda.b004.role_name
#   log_retention_in_days = var.lambda_log_retention_in_days
#   source_dir            = local.lambda.b004.source_dir
#   source_output_path    = local.lambda.b004.source_output_path
#   role_policy_json      = [file("iam/lambda_policy_dynamodb.json")]
# }
