/** Project Name */
export const PROJECT_NAME_UC = 'PocketCards';
export const PROJECT_NAME = 'pocket-cards';

export const LAMBDA_CODE = `
exports.handler = async (event) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };
  return response;
};
`;
