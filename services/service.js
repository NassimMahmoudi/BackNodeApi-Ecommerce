const nodemailer = require('nodemailer');
var inlineBase64 = require('nodemailer-plugin-inline-base64');
var conversion = require("phantom-html-to-pdf")();
var moment = require("moment");
var fs = require("fs");

async function Send_mail_new_client(from,to,subject,html) {
	//let testAccount = await nodemailer.createTestAccount();
	let transporter = nodemailer.createTransport({
		service:  "gmail",
		auth: {
			user: process.env.EMAIL,
			pass: process.env.PASSWORD
		}
	});
	transporter.use('compile', inlineBase64({cidPrefix: 'somePrefix_'}));
	//console.log(html.content);
	var str = html.content;
	var res = str.replace("%firstname%", html.firstname);
	var res = res.replace("%confirmation_code%", html.confirmation_code);
	
	let info = await transporter.sendMail({
											from: from,
											to: to,
											subject: subject,
											html: res

										}, function (err, info) {
											if(err)
												console.log(err)
											else
												console.log(info);
										});
															   
}
async function report(data,fullname) {
	var timeStamp = new Date().getTime();
	var today = new Date();
	today = moment().format("DD/MM/YYYY hh:mm");
	var content =	"<center><strong><h1>Facture</h1></strong></center>"
					+"<div><div ><img src=\"data:image/png;base64,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 \" style=\"width:auto;height:150px\"></div><h1 style=\"line-height: 100%; float:left;\">Work History Report</h1><h2 style=\"float:right;line-height: 100%;\">Report generated on "+today+" by "+fullname+"</h2></div>" 
					+"</br>"
					+"</br>"
	
					+"<table style=\"font-family: 'Arial';font-size-adjust: 0.58;width:100%; border-color: #ddd;height:100px;border-collapse: collapse;padding:50px 20px;\">"
						+"<tr  style=\"background:#f2f2f2;\" >"
							+"<th style=\"text-align: left;height:70px;\">Commande</th>"
							+"<th>Prodouit</th>"
							+"<th>Quantite</th>"
							+"<th>Total</th>"
							+"<th>Date commande</th>"
						+" </tr>";
	for(var i=0;i<data.length;i++){
		var date_end=data[i].date_end;
		var license_plate=data_report_work.rows[i].license_plate;
		var code_mission=data_report_work.rows[i].code_mission;
		var odometre_start=data_report_work.rows[i].odometre_start;
		var name_m=data_report_work.rows[i].name_m;
		var car_name=data_report_work.rows[i].car_name;
		var date_start=data_report_work.rows[i].date_start;
		var name_deleg_start=data_report_work.rows[i].name_deleg_start;
		var name_deleg_end=data_report_work.rows[i].name_deleg_end;
		var object_mission=data_report_work.rows[i].object_mission;
		var firstname=data_report_work.rows[i].firstname;
		var lastname=data_report_work.rows[i].lastname;
		var date_starte=moment(parseFloat(date_start)).format("DD/MM/YYYY");//moment().format();
		var date_ende=moment(parseFloat(date_end)).format("DD/MM/YYYY");//moment().format();
		content=content+"<tr>"
							+"<td style=\"text-align: left;height:80px;width:14%;\"> "+car_name+"<br>"+license_plate+" </td>"
							+"<td style=\"text-align: center;width:13%;\">&nbsp; "+code_mission+"&nbsp;"+name_m+"</td>"
							+"<td style=\"text-align: center;width:10%;\"> &nbsp;&nbsp; "+firstname+"&nbsp;"+lastname+" </td>"
							+"<td style=\"text-align: center;width:13%;\"> &nbsp;&nbsp;"+date_starte+"</td>"
							+"<td style=\"text-align: center;width:10%;\"> &nbsp;&nbsp;"+date_ende+"</td>"
							+"<td style=\"text-align: center;width:1°%;\"> &nbsp;&nbsp;"+name_deleg_start+"</td>"
							+"<td style=\"text-align: center;width:10%;\"> &nbsp;&nbsp;"+name_deleg_end+"</td>"
							+"<td style=\"text-align: center;width:10%;\"> &nbsp;&nbsp;"+odometre_start+" Km</td>"
							+"<td style=\"text-align: center;width:10%;\"> &nbsp;&nbsp;"+object_mission+"</td>"
						+" </tr>"
				
							
	}
	content=content+" </table>";
	conversion({ 
				html:content,				
				footer: '<div style="float:right"><b>{#pageNum}/{#numPages}</b></div>',
	
	}, function(err, pdf) {
		  var output = fs.createWriteStream('./files/pdf/facture'+timeStamp+'.pdf')
		  pdf.stream.pipe(output);
		 
	});
}
module.exports = {
	Send_mail_new_client,
	report
};