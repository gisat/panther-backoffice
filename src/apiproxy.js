import request from 'request';
import path from 'path';

import {apiProtocol, apiHost, apiPath} from './config';


export default function(proxyRequest, proxyResponse){

	var logLikeCrazy = false;

	if(logLikeCrazy) {
		console.log('');
		console.log('           (   (       (   (       )    )     )  ');
		console.log('     (     )\\ ))\\ )    )\\ ))\\ ) ( /( ( /(  ( /(  ');
		//console.log('     )\\   (()/(()/(   (()/(()/( )\\()))\\()) )\\()) ');
		//console.log('  ((((_)(  /(_))(_))   /(_))(_)|(_)\\((_)\\ ((_)\\  ');
		console.log('   )\\ _ )\\(_))(_))|   (_))(_))   ((_)_((_)_ ((_) ');
		console.log('   (_)_\\(_) _ \\_ _|___| _ \\ _ \\ / _ \\ \\/ | \\ / / ');
		console.log('    / _ \\ |  _/| | ___|  _/   /| (_) >  < \\ V /  ');
		console.log('   /_/ \\_\\|_| |___|   |_| |_|_\\ \\___/_/\\_\\ |_|   ');
		//console.log('      If You see this, something is wrong.');
		//console.log('');
	}


	var url = apiProtocol + apiHost + path.join(apiPath, proxyRequest.body.apiUrl).replace(/\\/g, "/");
	var method = proxyRequest.body.method.toLowerCase();

	var cookies = [];
	cookies.push("ssid="+proxyRequest.body.ssid);
	cookies.push("sessionid="+proxyRequest.body.sessionid);
	cookies.push("csrftoken="+proxyRequest.body.csrftoken);

	var body = proxyRequest.body;

	var options = {
		url: url,
		headers: {
			'Cookie': cookies.join("; ")
		},
		timeout: 2*60*1000
	};
	if(body.hasOwnProperty("formData") && Object.keys(body.formData).length){
		if(logLikeCrazy) console.log("body.formData (", typeof body.formData, ")", body.formData);
		options.formData = body.formData;
		if(options.formData.hasOwnProperty("data") && typeof options.formData.data == "object"){
			options.formData.data = JSON.stringify(options.formData.data);
		}
	}

	if(logLikeCrazy) console.log("  ", method.toUpperCase(), url, "\n-----------\n", options, "\n\n");

	switch(method) {
		case "post":
			request.post(options).pipe(proxyResponse);
			break;
		case "put":
			request.put(options).pipe(proxyResponse);
			break;
		case "delete":
			request.del(options).pipe(proxyResponse);
			break;
		default:
			request.get(options).pipe(proxyResponse);
	}
}
