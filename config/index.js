module.exports = {
  mongo_uri: process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI : "mongodb://admin:admin@cluster0-shard-00-00-9mqcl.mongodb.net:27017,cluster0-shard-00-01-9mqcl.mongodb.net:27017,cluster0-shard-00-02-9mqcl.mongodb.net:27017/ftam_dev?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin",
  secret: process.env.NODE_ENV === 'production' ? process.env.SECRET : 'secret',
  api_uri: process.env.NODE_ENV === 'production' ? process.env.API_URI : 'http://localhost:3001',
  twilio_sid: process.env.NODE_ENV === 'production' ? process.env.TWILIO_SID : "ACbb15310684598fccc0626c923a8717be",
  twilio_auth_token: process.env.NODE_ENV === 'production' ? process.env.TWILIO_AUTH_TOKEN : "238cfb97f69cdd1122022277dd6395eb",
  twilio_from_number: process.env.NODE_ENV === 'production' ? process.env.TWILIO_FROM_NUMBER : "+14797778337", 
  stripe_secret_key: process.env.NODE_ENV === 'production' ? process.env.STRIPE_PROD_SECRET_KEY : "sk_test_kF73zQL8rKBKruvMVtgUrmoG",
  tax_ava_login_id: process.env.NODE_ENV === 'production' ? process.env.TAX_AVA_LOGIN_ID : "reborntechnologyllc@gmail.com",
  tax_ava_password: process.env.NODE_ENV === 'production' ? process.env.TAX_AVA_PASSWORD : "VirtualGrabby1",
  
  jwtSecret: "MyS3cr3tK3Y",
  jwtSession: {
      session: false
  },
  db: {
		uri: process.env.MONGODB_URI,
		aclCollectionPrefix: 'acl'
	},
	email: {
		apiKey: process.env.SENDGRID_API_KEY,
		sendFrom: process.env.SEND_EMAILS_FROM
	},
	login: {
		maxAttempts: process.env.MAX_LOGIN_ATTEMPTS,
		lockoutHours: process.env.LOGIN_ATTEMPTS_LOCKOUT_HOURS * 60 * 60 * 1000,
		minimumPasswordLength: process.env.MINIMUM_PASSWORD_LENGTH,
		passwordResetTimeLimitInHours: process.env.PASSWORD_RESET_TIME_LIMIT_IN_HOURS,
		passwordHashRounds: parseInt(process.env.PASSWORD_HASH_ROUNDS, 10)
	},
	server: {
		timezone: process.env.TZ
	},
	session: {
		name: process.env.SESSION_NAME,
		secret: process.env.SESSION_SECRET
	}
};
