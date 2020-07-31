# -----------------------------------------------
# 単語一括登録: /groups/{groupId}/words
# -----------------------------------------------
module "c001" {
  source = "github.com/wwalpha/terraform-module-lambda"

  function_name         = local.lambda.c001.function_name
  alias_name            = local.lambda_alias_name
  handler               = local.lambda_handler
  runtime               = local.lambda_runtime
  role_name             = local.lambda.c001.role_name
  memory_size           = 1024
  log_retention_in_days = var.lambda_log_retention_in_days
  source_dir            = local.lambda.c001.source_dir
  source_output_path    = local.lambda.c001.source_output_path
  trigger_principal     = local.api_trigger_principal
  trigger_source_arn    = "${local.api_trigger_source_arn}/*/POST/groups/*/words"

  variables = {
    TABLE_WORD_MASTER         = local.dynamodb_name_words
    TABLE_WORDS   = local.dynamodb_name_group_words
    IPA_URL             = local.ipa_url
    IPA_API_KEY         = local.ipa_api_key
    MP3_BUCKET          = local.bucket_name_audios
    PATH_PATTERN        = local.audio_path_pattern
    TRANSLATION_URL     = local.translation_url
    TRANSLATION_API_KEY = local.translation_api_key
    TZ                  = local.timezone
  }
  role_policy_json = [
    file("iam/lambda_policy_dynamodb.json"),
    file("iam/lambda_policy_s3.json"),
    file("iam/lambda_policy_polly.json"),
    file("iam/lambda_policy_ssm.json")
  ]
  layers = [
    local.xray, local.axios, local.moment, local.dbhelper
  ]
}

# -----------------------------------------------
# 単語一覧取得: /groups/{groupId}/words
# -----------------------------------------------
module "c002" {
  source = "github.com/wwalpha/terraform-module-lambda"

  function_name         = local.lambda.c002.function_name
  alias_name            = local.lambda_alias_name
  handler               = local.lambda_handler
  runtime               = local.lambda_runtime
  role_name             = local.lambda.c002.role_name
  log_retention_in_days = var.lambda_log_retention_in_days
  source_dir            = local.lambda.c002.source_dir
  source_output_path    = local.lambda.c002.source_output_path
  trigger_principal     = local.api_trigger_principal
  trigger_source_arn    = "${local.api_trigger_source_arn}/*/GET/groups/*/words"

  variables = {
    TZ = local.timezone
  }

  role_policy_json = [
    file("iam/lambda_policy_dynamodb.json"),
  ]

  layers = [
    local.xray, local.dbhelper
  ]
}


# -----------------------------------------------
# 単語情報取得: /groups/{groupId}/words/{word} 
# -----------------------------------------------
# module "c003" {
#   source                = "github.com/wwalpha/terraform-module-lambda"

#   function_name         = local.lambda.c003.function_name
#   alias_name            = local.lambda_alias_name
#   handler               = local.lambda_handler
#   runtime               = local.lambda_runtime
#   role_name             = local.lambda.c003.role_name
#   log_retention_in_days = var.lambda_log_retention_in_days
#   source_dir            = local.lambda.c003.source_dir
#   source_output_path    = local.lambda.c003.source_output_path

#   variables = {
#     TZ = local.timezone
#   }
#   role_policy_json = [
#     file("iam/lambda_policy_dynamodb.json"),
#   ]
#   layers = [
#     local.xray
#   ]
# }

# -----------------------------------------------
# 単語情報更新: /groups/{groupId}/words/{word} 
# -----------------------------------------------
module "c004" {
  source = "github.com/wwalpha/terraform-module-lambda"

  function_name         = local.lambda.c004.function_name
  alias_name            = local.lambda_alias_name
  handler               = local.lambda_handler
  runtime               = local.lambda_runtime
  role_name             = local.lambda.c004.role_name
  log_retention_in_days = var.lambda_log_retention_in_days
  source_dir            = local.lambda.c004.source_dir
  source_output_path    = local.lambda.c004.source_output_path
  trigger_principal     = local.api_trigger_principal
  trigger_source_arn    = "${local.api_trigger_source_arn}/*/PUT/groups/*/words/*"

  variables = {
    TABLE_WORDS = local.dynamodb_name_group_words
    TABLE_HISTORY     = local.dynamodb_name_history
    TABLE_GROUPS = local.dynamodb_name_user_groups
    TZ                = local.timezone
  }

  role_policy_json = [
    file("iam/lambda_policy_dynamodb.json"),
  ]

  layers = [
    local.xray, local.moment, local.dbhelper
  ]
}

# -----------------------------------------------
# 新規学習モード単語一覧: /groups/{groupId}/new
# -----------------------------------------------
module "c006" {
  source = "github.com/wwalpha/terraform-module-lambda"

  function_name         = local.lambda.c006.function_name
  alias_name            = local.lambda_alias_name
  handler               = local.lambda_handler
  runtime               = local.lambda_runtime
  role_name             = local.lambda.c006.role_name
  memory_size           = 512
  log_retention_in_days = var.lambda_log_retention_in_days
  source_dir            = local.lambda.c006.source_dir
  source_output_path    = local.lambda.c006.source_output_path
  trigger_principal     = local.api_trigger_principal
  trigger_source_arn    = "${local.api_trigger_source_arn}/*/GET/groups/*/new"

  variables = {
    WORDS_LIMIT       = 10
    TABLE_WORD_MASTER       = local.dynamodb_name_words
    TABLE_WORDS = local.dynamodb_name_group_words
    TZ                = local.timezone
  }

  role_policy_json = [
    file("iam/lambda_policy_dynamodb.json"),
  ]

  layers = [
    local.xray, local.moment, local.dbhelper
  ]
}

# -----------------------------------------------
# 新規学習モード単語一覧: /groups/{groupId}/test
# -----------------------------------------------
module "c007" {
  source = "github.com/wwalpha/terraform-module-lambda"

  function_name         = local.lambda.c007.function_name
  alias_name            = local.lambda_alias_name
  handler               = local.lambda_handler
  runtime               = local.lambda_runtime
  role_name             = local.lambda.c007.role_name
  log_retention_in_days = var.lambda_log_retention_in_days
  source_dir            = local.lambda.c007.source_dir
  source_output_path    = local.lambda.c007.source_output_path
  trigger_principal     = local.api_trigger_principal
  trigger_source_arn    = "${local.api_trigger_source_arn}/*/GET/groups/*/test"

  variables = {
    WORDS_LIMIT       = 10
    TABLE_WORD_MASTER       = local.dynamodb_name_words
    TABLE_WORDS = local.dynamodb_name_group_words
    TZ                = local.timezone
  }

  role_policy_json = [
    file("iam/lambda_policy_dynamodb.json"),
  ]

  layers = [
    local.xray, local.moment, local.dbhelper
  ]
}

# -----------------------------------------------
# 新規学習モード単語一覧: /groups/{groupId}/review
# -----------------------------------------------
module "c008" {
  source = "github.com/wwalpha/terraform-module-lambda"

  function_name         = local.lambda.c008.function_name
  alias_name            = local.lambda_alias_name
  handler               = local.lambda_handler
  runtime               = local.lambda_runtime
  role_name             = local.lambda.c008.role_name
  log_retention_in_days = var.lambda_log_retention_in_days
  source_dir            = local.lambda.c008.source_dir
  source_output_path    = local.lambda.c008.source_output_path
  trigger_principal     = local.api_trigger_principal
  trigger_source_arn    = "${local.api_trigger_source_arn}/*/GET/groups/*/review"

  variables = {
    WORDS_LIMIT       = 10
    TABLE_WORD_MASTER       = local.dynamodb_name_words
    TABLE_WORDS = local.dynamodb_name_group_words
    TZ                = local.timezone
  }

  role_policy_json = [
    file("iam/lambda_policy_dynamodb.json"),
  ]

  layers = [
    local.xray, local.moment, local.dbhelper
  ]
}
