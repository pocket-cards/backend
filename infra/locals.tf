locals {
  # -----------------------------------------------
  # Project Informations
  # -----------------------------------------------
  remote_init = data.terraform_remote_state.initialize.outputs
  remote_unmu = data.terraform_remote_state.unmutable.outputs
  remote_bked = data.terraform_remote_state.backend.outputs

  project_name    = local.remote_init.project_name
  project_name_uc = local.remote_init.project_name_uc
  region          = data.aws_region.this.name
  account_id      = data.aws_caller_identity.this.account_id
  environment     = terraform.workspace
  is_dev          = local.environment == "dev"

  timezone            = "Asia/Tokyo"
  translation_url     = local.remote_init.translation_url
  translation_api_key = local.remote_init.ssm_param_translation_api_key
  ipa_url             = local.remote_init.ipa_url
  ipa_api_key         = local.remote_init.ssm_param_ipa_api_key
  parallelism         = "--parallelism=30"

  # -----------------------------------------------
  # API Gateway
  # -----------------------------------------------
  api_id            = local.remote_bked.api_id
  api_execution_arn = local.remote_bked.api_execution_arn

  # -----------------------------------------------
  # S3 Bucket
  # -----------------------------------------------
  bucket_name_audios    = local.remote_unmu.bucket_name_audios
  bucket_name_images    = local.remote_unmu.bucket_name_images
  bucket_name_logging   = local.remote_unmu.bucket_name_logging
  bucket_name_artifacts = local.remote_init.bucket_name_artifacts

  # -----------------------------------------------
  # DynamoDB
  # -----------------------------------------------
  dynamodb_name_users       = local.remote_unmu.dynamodb_name_users
  dynamodb_name_user_groups = local.remote_unmu.dynamodb_name_user_groups
  dynamodb_name_group_words = local.remote_unmu.dynamodb_name_group_words
  dynamodb_name_words       = local.remote_unmu.dynamodb_name_words
  dynamodb_name_history     = local.remote_unmu.dynamodb_name_history

  # -----------------------------------------------
  # Lambda Layers
  # -----------------------------------------------
  xray   = local.remote_init.layers.xray
  moment = local.remote_init.layers.moment
  lodash = local.remote_init.layers.lodash
  axios  = local.remote_init.layers.axios

  # -----------------------------------------------
  # Lambda
  # -----------------------------------------------
  trigger_principal  = "apigateway.amazonaws.com"
  trigger_source_arn = local.api_execution_arn
  lambda_handler     = "index.handler"
  lambda_runtime     = "nodejs10.x"
  lambda_alias_name  = "v1"

  audio_path_pattern        = "audio"
  lambda_role_prefix        = "${local.project_name_uc}_Lambda"
  lambda_function_prefix    = "${local.project_name_uc}"
  lambda_source_dir_prefix  = "../build"
  lambda_output_path_prefix = "../dist"

  lambda = {
    a001 = {
      function_name      = "${local.lambda_function_prefix}_A001"
      role_name          = "${local.lambda_role_prefix}_A001Role"
      source_dir         = abspath("${local.lambda_source_dir_prefix}/A0_A001")
      source_output_path = abspath("${local.lambda_output_path_prefix}/A0_A001.zip")
    }
    a002 = {
      function_name      = "${local.lambda_function_prefix}_A002"
      role_name          = "${local.lambda_role_prefix}_A002Role"
      source_dir         = abspath("${local.lambda_source_dir_prefix}/A0_A002")
      source_output_path = abspath("${local.lambda_output_path_prefix}/A0_A002.zip")
    }
    a003 = {
      function_name      = "${local.lambda_function_prefix}_A003"
      role_name          = "${local.lambda_role_prefix}_A003Role"
      source_dir         = abspath("${local.lambda_source_dir_prefix}/A0_A003")
      source_output_path = abspath("${local.lambda_output_path_prefix}/A0_A003.zip")
    }
    b001 = {
      function_name      = "${local.lambda_function_prefix}_B001"
      role_name          = "${local.lambda_role_prefix}_B001Role"
      source_dir         = abspath("${local.lambda_source_dir_prefix}/B0_B001")
      source_output_path = abspath("${local.lambda_output_path_prefix}/B0_B001.zip")
    }
    b002 = {
      function_name      = "${local.lambda_function_prefix}_B002"
      role_name          = "${local.lambda_role_prefix}_B002Role"
      source_dir         = abspath("${local.lambda_source_dir_prefix}/B0_B002")
      source_output_path = abspath("${local.lambda_output_path_prefix}/B0_B002.zip")
    }
    b003 = {
      function_name      = "${local.lambda_function_prefix}_B003"
      role_name          = "${local.lambda_role_prefix}_B003Role"
      source_dir         = abspath("${local.lambda_source_dir_prefix}/B0_B003")
      source_output_path = abspath("${local.lambda_output_path_prefix}/B0_B003.zip")
    }
    b004 = {
      function_name      = "${local.lambda_function_prefix}_B004"
      role_name          = "${local.lambda_role_prefix}_B004Role"
      source_dir         = abspath("${local.lambda_source_dir_prefix}/B0_B004")
      source_output_path = abspath("${local.lambda_output_path_prefix}/B0_B004.zip")
    }
    c001 = {
      function_name      = "${local.lambda_function_prefix}_C001"
      role_name          = "${local.lambda_role_prefix}_C001Role"
      source_dir         = abspath("${local.lambda_source_dir_prefix}/C0_C001")
      source_output_path = abspath("${local.lambda_output_path_prefix}/C0_C001.zip")
    }
    c002 = {
      function_name      = "${local.lambda_function_prefix}_C002"
      role_name          = "${local.lambda_role_prefix}_C002Role"
      source_dir         = abspath("${local.lambda_source_dir_prefix}/C0_C002")
      source_output_path = abspath("${local.lambda_output_path_prefix}/C0_C002.zip")
    }
    c003 = {
      function_name      = "${local.lambda_function_prefix}_C003"
      role_name          = "${local.lambda_role_prefix}_C003Role"
      source_dir         = abspath("${local.lambda_source_dir_prefix}/C0_C003")
      source_output_path = abspath("${local.lambda_output_path_prefix}/C0_C003.zip")
    }
    c004 = {
      function_name      = "${local.lambda_function_prefix}_C004"
      role_name          = "${local.lambda_role_prefix}_C004Role"
      source_dir         = abspath("${local.lambda_source_dir_prefix}/C0_C004")
      source_output_path = abspath("${local.lambda_output_path_prefix}/C0_C004.zip")
    }
    c006 = {
      function_name      = "${local.lambda_function_prefix}_C006"
      role_name          = "${local.lambda_role_prefix}_C006Role"
      source_dir         = abspath("${local.lambda_source_dir_prefix}/C0_C006")
      source_output_path = abspath("${local.lambda_output_path_prefix}/C0_C006.zip")
    }
    c007 = {
      function_name      = "${local.lambda_function_prefix}_C007"
      role_name          = "${local.lambda_role_prefix}_C007Role"
      source_dir         = abspath("${local.lambda_source_dir_prefix}/C0_C007")
      source_output_path = abspath("${local.lambda_output_path_prefix}/C0_C007.zip")
    }
    c008 = {
      function_name      = "${local.lambda_function_prefix}_C008"
      role_name          = "${local.lambda_role_prefix}_C008Role"
      source_dir         = abspath("${local.lambda_source_dir_prefix}/C0_C008")
      source_output_path = abspath("${local.lambda_output_path_prefix}/C0_C008.zip")
    }
    d001 = {
      function_name      = "${local.lambda_function_prefix}_D001"
      role_name          = "${local.lambda_role_prefix}_D001Role"
      source_dir         = abspath("${local.lambda_source_dir_prefix}/D0_D001")
      source_output_path = abspath("${local.lambda_output_path_prefix}/D0_D001.zip")
    }
    s001 = {
      function_name      = "${local.lambda_function_prefix}_S001"
      role_name          = "${local.lambda_role_prefix}_S001Role"
      source_dir         = abspath("${local.lambda_source_dir_prefix}/S0_S001")
      source_output_path = abspath("${local.lambda_output_path_prefix}/S0_S001.zip")
    }
  }
}

# -----------------------------------------------
# AWS Region
# -----------------------------------------------
data "aws_region" "this" {}

# -----------------------------------------------
# AWS Account
# -----------------------------------------------
data "aws_caller_identity" "this" {}
