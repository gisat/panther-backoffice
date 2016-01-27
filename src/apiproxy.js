import request from 'request';
import path from 'path';

import {apiProtocol, apiHost, apiPath} from './config';


export default function(proxyRequest, proxyResponse){

	var url = apiProtocol + apiHost + path.join(apiPath, proxyRequest.body.apiUrl).replace(/\\/g, "/");
	var method = proxyRequest.body.method.toLowerCase();

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

	var options = {
		url: url,
		headers: {
			'Cookie': cookies.join("; ")
		}
	};
	if(Object.keys(formData).length){
		options.formData = formData;
	}
	switch(method) {
		case "post":
			request.post(options).pipe(proxyResponse);
			break;
		default:
			request.get(options).pipe(proxyResponse);
	}
}
