const {awsCredentials} = require('../bin/credentials')
const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, QueryCommand, ScanCommand, GetCommand, PutCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { unmarshall } = require("@aws-sdk/util-dynamodb");

const marshallOptions = { convertEmptyValues: false, removeUndefinedValues: false, convertClassInstanceToMap: false };
const unmarshallOptions = { wrapNumbers: false };
const translateConfig = { marshallOptions, unmarshallOptions };

const ddbClient = new DynamoDB(awsCredentials);
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, translateConfig);


/**
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/interfaces/scancommandinput.html
 * @param {object} params                                                   our required parameters
 * @param {string} params.TableName                                         a string value (required)
 * @returns {Promise}                     
 */
module.exports.Scan = (params) => new Promise((resolve) => {
    var retry = 1;
    var response = { success: false, status: 'unknown', count: 0, data: [] };
    const run = async (params) => {
        try {
            var r = await ddbDocClient.send(new ScanCommand(params));
            r.Items.forEach(x => {
                response.data.push(x);
            });
            if (r.LastEvaluatedKey) {
                params.ExclusiveStartKey = r.LastEvaluatedKey;
                run(params);
            } else {
                response.success = true;
                response.status = 'success';
                response.count = response.data.length;
                resolve(response);
            }
        } catch (e) {
            console.log('i have an error', e);
            if (e.message.toLowerCase() === 'request limit exceeded.') {
                retry = retry + 1;
                if (retry <= 100) {
                    setTimeout(() => { run(params), retry * 10 });
                }
            } else {
                console.log({ awsClass: "dynamoDB", awsMethod: "scan", params: JSON.stringify(params), type: 'Error', message: e.message, retry: retry });
                response.success = false;
                response.status = 'failure';
                response.message = e.message;
                resolve(response);
            }
        }
    }
    run(params);
});

/**
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/interfaces/querycommandinput.html
 * @param {object} params                                                       our required parameters
 * @param {string} params.TableName                                             a string value (required)
 * @param {object} params.KeyConditions                                         a string value (required)
 * @param {object} params.HashKey                                               a string value (required)
 * @param {object} params.HashKey.ComparisonOperator                            Must be EQ
 * @param {string[]} params.HashKey.AttributeValueList                          list of string values
 * @param {object} params.RangeKey                                              a string value (required)
 * @param {object} params.RangeKey.ComparisonOperator                           (EQ | LE | LT | GE | GT | BEGINS_WITH | BETWEEN)
 * @param {string[]} params.RangeKey.AttributeValueList                         list of string values
 * @returns {Promise}                     
 */
module.exports.Query = (params) => new Promise(async (resolve) => {
    var retry = 1;
    var response = { success: false, status: 'unknown', count: 0, data: [] };
    const run = async (params) => {
        try {
            var r = await ddbDocClient.send(new QueryCommand(params));
            r.Items.forEach(x => {
                response.data.push(x);
            });
            if (r.LastEvaluatedKey) {
                params.ExclusiveStartKey = r.LastEvaluatedKey;
                run(params);
            } else {
                response.success = true;
                response.status = 'success';
                response.count = response.data.length;
                resolve(response);
            }
        } catch (e) {
            console.log('i have an error', e);
            if (e.message.toLowerCase() === 'request limit exceeded.') {
                retry = retry + 1;
                if (retry <= 100) {
                    setTimeout(() => { run(params), retry * 10 });
                }
            } else {
                console.log({ awsClass: "dynamoDB", awsMethod: "query", params: JSON.stringify(params), type: 'Error', message: e.message, retry: retry });
                response.success = false;
                response.status = 'failure';
                response.message = e.message;
                resolve(response);
            }
        }
    }
    run(params);
});

/**
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/interfaces/getitemcommandinput.html
 * @param {object} params                                                       our required parameters
 * @param {string} params.TableName                                             the name of dynamoDB table (required)
 * @param {object} params.Key                                                   the hashkey and range key (if exists) that make primary key
 * @param {string} params.Key.HashKey                                           a string value (required)
 * @param {string} params.Key.RangeKey                                          a string value (required)
 * @returns {Promise}                     
 */
module.exports.GetItem = (params) => new Promise(async (resolve) => {
    var response = { success: false, status: 'unknown', data: {} };
    try {
        var r = await ddbDocClient.send(new GetCommand(params));
        response.success = true;
        response.status = 'success';
        response.data = r.Item;
        resolve(response);
    } catch (e) {
        console.log({ awsClass: "dynamoDB", awsMethod: "get", params: JSON.stringify(params), type: 'Error', message: e.message });
        response.success = false;
        response.status = 'failure';
        response.message = e.message;
        resolve(response);
    }
});

/**
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/interfaces/putitemcommandinput.html
 * @param {object} params                                                       our required parameters
 * @param {string} params.TableName                                             a string value (required)
 * @param {object} params.Item                                                  Our document Item object
 * @returns {Promise}                     
 */
module.exports.PutItem = (params) => new Promise(async (resolve) => {
    var response = { success: false, status: 'unknown' };
    try {
        var r = await ddbDocClient.send(new PutCommand(params));
        response.success = true;
        response.status = 'success';
        resolve(response);
    } catch (e) {
        console.log({ awsClass: "dynamoDB", awsMethod: "put", params: JSON.stringify(params), type: 'Error', message: e.message });
        response.success = false;
        response.status = 'failure';
        response.message = e.message;
        resolve(response);
    }
});

/**
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/interfaces/putitemcommandinput.html
 * @param {object} params                                                       our required parameters
 * @param {string} params.TableName                                             the name of dynamoDB table (required)
 * @param {object} params.Key                                                   the hashkey and range key (if exists) that make primary key
 * @param {string} params.Key.HashKey                                           a string value (required)
 * @param {string} params.Key.RangeKey                                          a string value (required)
 * @param {object} params.AttributeUpdates                                      our update object
 * @param {object} params.AttributeUpdates.attributeName                        the name of the attribute we want to update
 * @param {string} params.AttributeUpdates.attributeName.Action                 the action to preform 'put'
 * @param {string} params.AttributeUpdates.attributeName.Value                  what the attribute to be
 * @returns {Promise}                     
 */
module.exports.UpdateItem = (params) => new Promise(async (resolve) => {
    var response = { success: false, status: 'unknown' };
    try {
        var r = await ddbDocClient.send(new UpdateCommand(params));
        response.success = true;
        response.status = 'success';
        resolve(response);
    } catch (error) {
        console.log({ awsClass: "dynamoDB", awsMethod: "update", params: JSON.stringify(params), type: 'Error', message: e.message });
        response.success = false;
        response.status = 'failure';
        response.message = e.message;
        resolve(response);
    }
});
