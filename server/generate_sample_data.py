from os import environ
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from app.models import *
from solana.keypair import Keypair
from mimesis import Finance, Datetime
from random import choice, choices

# Actual Solana wallet addresses of real donation recipients
RECIPIENT_TO_KEY = {
	'Aid for Ukraine': '66pJhhESDjdeBBDdkKmxYYd7q6GUggYPWjxpMKNX39KV',
	'FTX Foundation': '4yvyBWD8BNZdVtEZnUGHPjb1crohSRia1CJ9jfZr6H1E'
}

# To demo login with Solana wallet adaptor, replace demo keys with
# wallet addresses you have access to
RECIPIENT_DEMO_KEY = environ.get('RECIPIENT_DEMO_KEY', 'PnENxubNFCZBPQR3nD4rJWcDwZ1d2FqGRMSWzwPpAnK')
MERCHANT_DEMO_KEY = environ.get('MERCHANT_DEMO_KEY', '35pQAYGCE95rnzJvYFtxGhpnDpMoZKzk6f5DxJhGszE9')
CONSUMER_DEMO_KEY = environ.get('CONSUMER_DEMO_KEY', '9qZTcVj5h6TPQy3nyhHg9UWf9aSkfWYVTH5Yx1NGCzKp')

# Connect to db
SQLALCHEMY_DATABASE_URI = environ['DATABASE_URI']
engine = create_engine(SQLALCHEMY_DATABASE_URI)


with Session(engine) as session:
	# Generate sample recipients
	RECIPIENT_DUMMY_KEY = 'sample_recipient_public_key'
	DEMO_RECIPIENT_KEYS = [RECIPIENT_DEMO_KEY] + list(RECIPIENT_TO_KEY.values()) + [RECIPIENT_DUMMY_KEY]

	sample_recipient = Recipient(
		public_key=RECIPIENT_TO_KEY['FTX Foundation'],
		name="FTX Foundation",
		description=("FTX was founded with the goal of donating to the world's "
					 "most effective charities. FTX, its affiliates, and its employees "
					 "have donated over $10m to help save lives, prevent suffering, "
					 "and ensure a brighter future. "
					 "More details at: https://ftx.com/foundation")
	)

	session.add(sample_recipient)
	session.commit()

	sample_recipient = Recipient(
		public_key=RECIPIENT_TO_KEY['Aid for Ukraine'],
		name="Aid for Ukraine",
		description=('Aid For Ukraine is cooperating with the cryptocurrency exchange '
			'FTX which converts crypto funds received into fiat and sends the donations '
			'to the National Bank of Ukraine. This marks the first-ever instance of a '
			'cryptocurrency exchange directly cooperating with a public financial entity '
			'to provide a conduit for crypto donations. '
			'More details at: https://donate.thedigital.gov.ua')
	)

	session.add(sample_recipient)
	session.commit()

	sample_recipient = Recipient(
		public_key=RECIPIENT_DUMMY_KEY,
		name="Sam's Hip Surgery Drive",
		description=("Sam is a longtime friend and a great member of our community. "
					 "Unfortunately, he recently got into a car accident and will be going into "
					 "hip surgery next month. 100% of proceeds will go towards helping pay "
					 "for his operation.")
	)

	session.add(sample_recipient)
	session.commit()

	dummy_recipient = Recipient(
		public_key=RECIPIENT_DEMO_KEY,
		name="Fremont High School Book Drive",
		description=('Fremont High School is a public school in Sunnyvale, California that is part '
					 'of Fremont Union High School District. It serves 2,123 students in 9 - 12 '
					 'with a student/teacher ratio of 22.6:1.')
	)

	session.add(dummy_recipient)
	session.commit()

	# Generate sample merchants for demo
	DEMO_MERCHANT_KEYS = [MERCHANT_DEMO_KEY] + [str(Keypair().public_key) for _ in range(4)]

	for key in DEMO_MERCHANT_KEYS:
		dummy_merchant = Merchant(
			public_key=key,
			name=Finance().company()
		)

		session.add(dummy_merchant)
		session.commit()

	# Generate sample consumers for demo
	DEMO_CONSUMER_KEYS = [CONSUMER_DEMO_KEY] + [str(Keypair().public_key) for _ in range(99)]

	for key in DEMO_CONSUMER_KEYS:
		dummy_consumer = Consumer(
			public_key=key,
		)

		session.add(dummy_consumer)
		session.commit()

	# Generate sample random donations for demo
	for consumer_key in DEMO_CONSUMER_KEYS:
		for _ in range(100):
			donation_type = choice(['input', 'fixed', 'roundup'])
			if donation_type == 'input':
				donation_amount = choice(range(10, 1001))
			elif donation_type == 'fixed':
				donation_amount = choice([100, 300, 500])
			elif donation_type == 'roundup':
				donation_amount = choice(range(10, 101))
			purchase_amount = choice(range(101, 10001))

			dummy_donation = MarkedDonation(
				reference=str(Keypair().public_key),
				donation_type=donation_type,
				donation_amount=donation_amount,
				purchase_total=purchase_amount,
				transaction_total=donation_amount + purchase_amount,
				merchant_public_key=choice(DEMO_MERCHANT_KEYS),
				consumer_public_key=choice(DEMO_CONSUMER_KEYS),
				recipient_public_key=choices(DEMO_RECIPIENT_KEYS, weights=(24, 46, 10, 20), k=1)[0],
				logged_at=Datetime().datetime(start=2022, end=2022)
			)

			session.add(dummy_donation)
			session.commit()

