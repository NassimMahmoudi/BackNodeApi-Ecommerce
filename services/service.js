const nodemailer = require('nodemailer');
var inlineBase64 = require('nodemailer-plugin-inline-base64');

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
	var res = res.replace("%urlApp%", html.urlApp);
	
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
module.exports = {
	Send_mail_new_client
};