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
      "Sid": "VisualEditor0",
      "Effect": "Allow",
      "Action": [
          "ecs:UpdateService",
          "ecs:ListTasks",
          "ecs:StopTask"
      ],
      "Resource": "*"
    }
  ]
}
`);
