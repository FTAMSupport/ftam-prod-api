module.exports = {
  secret: process.env.NODE_ENV === 'production' ? process.env.SECRET : 'secret',
  api_uri: process.env.NODE_ENV === 'production' ? process.env.API_URI : 'http://localhost:3001',
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
