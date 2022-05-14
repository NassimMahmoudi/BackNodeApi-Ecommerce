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
async function report(res,data) {
	var today = new Date();
	today = moment().format("DD/MM/YYYY hh:mm");
	var date_commande=data.date_commande;
	var commande_status=data.status;
	var cin=data.cin;
	var fullname=data.fullname;
	var total=data.total;
	var products=data.products;
	var content =	"<div><img src=\"data:image/png;base64,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 \" style=\" float:right;width:160px;height:80px;\"><br></div>" 
					+"</br>"
					+"</br>"
					+"<br><center><strong><h1>AMADO BILL</h1></strong></center>"
					+"<br>"
					+"<br>"
					+"<br>"
					+"<h4 style=\"float: right; line-height: 100%;\">Report generated on "+today+" by "+fullname+"</h4>"
					+"</br>"
					+"<table style=\"font-family: 'Arial';font-size-adjust: 0.58;width:100%; border: solid 1px;height:100px;border-collapse: collapse;padding:50px 20px;\">"
						+"<tr style=\"border: solid 1px;background:#f2f2f2;\">"
							+"<td style=\"border: solid 1px;text-align: center;height:80px;width:15%;\"colspan=\"1\" style=\"text-align: left;height:70px;\" rowspan=\"2\"><div><div><p>Order date&nbsp;</p></div></div></td>"
							+"<td style=\"border: solid 1px;text-align: center;height:80px;width:15%;\"colspan=\"1\" rowspan=\"2\"><div><div><center><p>&nbsp;&nbsp;Order&nbsp;status&nbsp;&nbsp;</p></center></div></div></td>"
							+"<td style=\"border: solid 1px;text-align: center;height:80px;width:14%;\"colspan=\"1\" rowspan=\"2\"><div><div><center><p>&nbsp;&nbsp;Costumer&nbsp;&nbsp;</p></center></div></div></td>"
							+"<td style=\"border: solid 1px;text-align: center;height:80px;width:14%;\"colspan=\"3\" rowspan=\"1\"><div><div><center><p>&nbsp;&nbsp;Products&nbsp;&nbsp;</p></center></div></div></td>"
							+"<td style=\"border: solid 1px;text-align: center;height:80px;width:14%;\" colspan=\"1\" rowspan=\"2\"><div><div><center><p>&nbsp;&nbsp;Total&nbsp;&nbsp;</p></center></div></div></td>"
						+"</tr>"
						+"<tr style=\"border: solid 1px;background:#f2f2f2;\">"
							+"<td style=\"border: solid 1px;text-align: center;height:80px;width:14%;\"><div><div><center><p>&nbsp;&nbsp;Name&nbsp;&nbsp;</p></center></div></div></td>"
							+"<td style=\"border: solid 1px;text-align: center;height:80px;width:14%;\"><div><div><center><p>&nbsp;&nbsp;Price&nbsp;&nbsp;</p></center></div></div></td>"
							+"<td style=\"border: solid 1px;text-align: center;height:80px;width:14%;\"><div><div><center><p>&nbsp;&nbsp;Quentity&nbsp;&nbsp</p></center></div><div></td>"
						+"</tr>";

		content=content+"<tr style=\"border: solid 1px;\">"
							+"<td style=\"border: solid 1px;text-align: center;height:80px;width:15%;\"> "+date_commande+"</td>"
							+"<td style=\"border: solid 1px;text-align: center;height:80px;width:15%;\"> "+commande_status+"</td>"
							+"<td style=\"border: solid 1px;text-align: center;width:15%;\">&nbsp; "+fullname+"&nbsp;<br> "+cin+"</td>";
		
		content=content+"<td style=\"border: solid 1px;text-align: center;width:14%;\"> &nbsp;&nbsp;"+products[0].name+"</td>"
						+"<td style=\"border: solid 1px;text-align: center;width:14%;\"> &nbsp;&nbsp;"+products[0].price+"</td>"
						+"<td style=\"border: solid 1px;text-align: center;width:14%;\"> &nbsp;&nbsp;"+products[0].quantity+"</td>";
		if(products.length==1){
			content = content + "<td style=\"border: solid 1px;height:80px;text-align: center;width:14%;\"> &nbsp;&nbsp;<strong>"+total+" Dinar </strong></td>"
							+ " </tr>"
						+ " </table>";
		}else{
			let price_prod=products[0].price*products[0].quantity;
			content = content +"<td style=\"border: solid 1px;text-align: center;width:14%;\"><center>"+price_prod+"</center></td>"
							+ "</tr>";
		}							
		for(i=1;i<products.length;i++){
			let price_prod=products[i].price*products[i].quantity;
		content=content + "<tr>"
						+ "<td>&nbsp;&nbsp;</td>"
						+ "<td>&nbsp;&nbsp;</td>"
						+ "<td>&nbsp;&nbsp;</td>"
						+ "<td style=\"height:80px;border: solid 1px;text-align: center;width:14%;\"> &nbsp;&nbsp;"+products[i].name+"</td>"
						+ "<td style=\"height:80px;border: solid 1px;text-align: center;width:14%;\"> &nbsp;&nbsp;"+products[i].price+"</td>"
						+ "<td style=\"height:80px;border: solid 1px;text-align: center;width:14%;\"> &nbsp;&nbsp;"+products[i].quantity+"</td>"
						+ "<td style=\"height:80px;border: solid 1px;text-align: center;width:14%;\">&nbsp;&nbsp;"+price_prod+"&nbsp;&nbsp;</td>"
						+ "</tr>";
		}					
		content=content + "<tr>"
						+ "<td>&nbsp;&nbsp;</td>"
						+ "<td>&nbsp;&nbsp;</td>"
						+ "<td>&nbsp;&nbsp;</td>"
						+ "<td>&nbsp;&nbsp;</td>"
						+ "<td>&nbsp;&nbsp;</td>"
						+ "<td>&nbsp;&nbsp;</td>"
						+ "<td style=\"height:80px;border: solid 1px;text-align: center;width:14%;\"> &nbsp;&nbsp;<strong>"+total+" Dinar </strong></td>"
						+ " </tr>"
						+ " </table>";		
	conversion({ 
				html:content,				
				footer: '<div style="float:right"><b>{#pageNum}/{#numPages}</b></div>',
	
	}, function(err, pdf) {
		  //var output = fs.createWriteStream('./files/bills'+name_file+'.pdf')
		  res.setHeader('content-type', 'application/pdf'); 
		  pdf.stream.pipe(res);
	});
}
module.exports = {
	Send_mail_new_client,
	report
};