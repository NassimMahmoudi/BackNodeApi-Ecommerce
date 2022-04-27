const nodemailer = require('nodemailer');
async function Send_mail_new_client(from,to,subject,html) {
	//let testAccount = await nodemailer.createTestAccount();
	let transporter = nodemailer.createTransport({
		service:  "gmail",
		auth: {
			user: process.env.EMAIL,
			pass: process.env.PASSWORD
		}
	});
	//console.log(html.content);
	var str = html.content;
	var res = str.replace("%client_name%", html.firstname);
	var res = res.replace("%urlApp%", html.urlApp);
	var res = res.replace("%email%", html.email);
	var res = res.replace("%password%", html.password);
	
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