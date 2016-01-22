import request from 'request';
import path from 'path';

import {apiProtocol, apiHost, apiPath} from './config';


export default function(proxyRequest, proxyResponse){

	var url = apiProtocol + apiHost + path.join(apiPath, proxyRequest.body.apiUrl).replace(/\\/g, "/");
	var method = proxyRequest.body.method;

	var cookies = [];
	cookies.push("ssid="+proxyRequest.body.ssid);
	cookies.push("sessionid="+proxyRequest.body.sessionid);
	cookies.push("csrftoken="+proxyRequest.body.csrftoken);

	var formData = proxyRequest.body;
	delete formData["apiUrl"];
	delete formData["method"];
	delete formData["ssid"];
	delete formData["sessionid"];
	delete formData["csrftoken"];
	if(Object.keys(formData).length == 0) formData = null;

	//console.log("Piping to POST", url);
	//console.log("...with data:", formData);

	var options = {
		url: url,
		formData: formData,
		headers: {
			'Cookie': cookies.join("; ")
		}
	};
	switch(method.toLowerCase()) {
		case "post":
			request.post(options).pipe(proxyResponse);
			break;
		default:
			request.get(options).pipe(proxyResponse);
	}
}
