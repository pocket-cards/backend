# --------------------------------------------------------------------------------
# ユーザ履歴集計取得: GET /history
# --------------------------------------------------------------------------------
module "a002" {
  source = "github.com/wwalpha/terraform-module-lambda"

  function_name         = local.lambda.a002.function_name
  alias_name            = local.lambda_alias_name
  handler               = local.lambda_handler
  runtime               = local.lambda_runtime
  memory_size           = 512
  role_name             = local.lambda.a002.role_name
  role_policy_json      = [file("iam/lambda_policy_dynamodb.json")]
  log_retention_in_days = var.lambda_log_retention_in_days
  source_dir            = local.lambda.a002.source_dir
  source_output_path    = local.lambda.a002.source_output_path
  trigger_principal     = local.api_trigger_principal
  trigger_source_arn    = "${local.api_trigger_source_arn}/*/GET/history"

  variables = {
    TABLE_HISTORY     = local.dynamodb_name_history
    TABLE_GROUPS = local.dynamodb_name_user_groups
    TABLE_WORDS = local.dynamodb_name_group_words
    TZ                = local.timezone
  }

  layers = [local.xray, local.moment, local.lodash, local.dbhelper]
}

