import { getStack, output } from '@pulumi/pulumi';
import { getRegion, getCallerIdentity } from '@pulumi/aws';

// Stack Name
export const STACK_NAME = getStack();
// Environment: dev / prod
export const ENVIRONMENT = STACK_NAME.split('-')[0];
// Default Region
export const DEFAULT_REGION = output(getRegion(undefined, { async: true })).name;
// AWS Account ID
export const ACCOUNT_ID = output(getCallerIdentity({ async: true })).accountId;
