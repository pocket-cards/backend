export default JSON.parse(`
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": [
        "*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "ecs:ListTasks",
        "ecs:DescribeTasks",
        "ec2:DescribeNetworkInterfaces",
        "apigateway:PATCH",
        "apigateway:GET"
      ],
      "Resource": "*"
    }
  ]
}
`);
