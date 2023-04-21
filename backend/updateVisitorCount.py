import json
import boto3
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ResumeVisitorCount')

def lambda_handler(event, context):
    response = table.update_item(
        Key={
            'id': 'visitor_count'
        },
        UpdateExpression='ADD #count :increment',
        ExpressionAttributeNames={
            '#count': 'count'
        },
        ExpressionAttributeValues={
            ':increment': 1
        },
        ReturnValues='UPDATED_NEW'
    )

    new_count = int(response['Attributes']['count'])  # Convert Decimal to int
    return {
        'statusCode': 200,
        'body': json.dumps({
            'visitorCount': new_count
        }),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }
