from app import db
from datetime import datetime, timedelta
from uuid import uuid4
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Session
from sqlalchemy import func
from constants import *
try:
	from zoneinfo import ZoneInfo
except ImportError:
	from backports.zoneinfo import ZoneInfo


class Merchant(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	public_key = db.Column(db.String(64))
	name = db.Column(db.String(300))
	donation_configs = db.Column(JSONB)
	created_at = db.Column(db.DateTime, default=datetime.utcnow)

	def get_dashboard_data(self, output_timezone):
		session = Session.object_session(self)

		# Fetch donations
		donations_with_recipients = session.query(MarkedDonation, Recipient)\
			.join(Recipient, MarkedDonation.recipient_public_key == Recipient.public_key)\
			.filter(MarkedDonation.merchant_public_key == self.public_key)\
			.order_by(MarkedDonation.logged_at.desc())\
			.all()
		donations_list = []
		total_donation_amount = 0
		total_donors = 0

		for donation, recipient in donations_with_recipients:
			logged_at_utc = donation.logged_at.replace(tzinfo=ZoneInfo('UTC'))
			logged_at_local = logged_at_utc.astimezone(ZoneInfo(output_timezone))
			date_text = logged_at_local.strftime('%b %-d, %Y %-I:%M %p')

			donations_list.append(
				{
					"donation_amount": donation.donation_amount,
					"recipient_name": recipient.name,
					"donation_type": donation.donation_type,
					"reference": donation.reference,
					"solscan_url": SOLSCAN_TX_BASE_URL + donation.reference,
					"date_time": date_text
				}
			)

			total_donation_amount += donation.donation_amount
			total_donors += 1

		# Compute analytics metrics
		donations_by_recipient = session.query(Recipient.name, func.sum(MarkedDonation.donation_amount)) \
			.join(Recipient, MarkedDonation.recipient_public_key == Recipient.public_key) \
			.filter(MarkedDonation.merchant_public_key == self.public_key) \
			.group_by(Recipient.name)\
			.all()

		donations_by_type = session.query(MarkedDonation.donation_type, func.sum(MarkedDonation.donation_amount)) \
			.filter(MarkedDonation.merchant_public_key == self.public_key) \
			.group_by(MarkedDonation.donation_type)\
			.all()

		donation_volume_daily = session.query(func.date(func.timezone(output_timezone, func.timezone('UTC', MarkedDonation.logged_at))), func.sum(MarkedDonation.donation_amount)) \
			.filter(MarkedDonation.merchant_public_key == self.public_key) \
			.group_by(func.date(func.timezone(output_timezone, func.timezone('UTC', MarkedDonation.logged_at)))) \
			.all()

		donation_volume_daily.sort(key=lambda x: x[0])

		# Fill in dates with zero donations
		if len(donation_volume_daily) > 0:
			first_date = datetime.strptime(str(donation_volume_daily[0][0]), '%Y-%m-%d')
			last_date = datetime.strptime(str(donation_volume_daily[-1][0]), '%Y-%m-%d')
			date_delta = last_date - first_date
			date_range = [first_date + timedelta(days=i) for i in range(date_delta.days+1)]

			donation_volume_daily_dict = {datetime.strftime(date, '%Y-%m-%d'): 0 for date in date_range}
			for d, v in donation_volume_daily:
				donation_volume_daily_dict[str(d)] = v

		analytics_dict = {
			"total_donation_amount": total_donation_amount,
			"total_donors": total_donors,
			"donation_volume_by_recipient": [dict(recipient_name=name, value=value) for name, value in donations_by_recipient],
			"donation_volume_by_type": [dict(type=type, value=value) for type, value in donations_by_type],
			"donation_volume_daily": [dict(date=date, value=value) for date, value in donation_volume_daily_dict.items()]
		}

		# Fetch all available recipients
		recipients_list = db.session.query(Recipient).all()

		# Fetch donation configs
		configs = self.donation_configs
		if configs:
			# Fetch updated recipient data
			if configs.get('active_config'):
				for option in configs['active_config']['options']:
					recipient = db.session.query(Recipient)\
						.filter_by(public_key=option['recipient']['public_key'])\
						.first()
					option['recipient'] = recipient.to_dict()

			if configs.get('inactive_configs'):
				for config in configs['inactive_configs']:
					for option in config['options']:
						recipient = db.session.query(Recipient) \
							.filter_by(public_key=option['recipient']['public_key']) \
							.first()
						option['recipient'] = recipient.to_dict()

		else:
			configs = {}

		return {
			"output_timezone": output_timezone,
			"donations": donations_list,
			"analytics": analytics_dict,
			"available_recipients": [recipient.to_dict() for recipient in recipients_list],
			"configs": configs
		}


class Recipient(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	public_key = db.Column(db.String(64))
	name = db.Column(db.String(300))
	description = db.Column(db.String(1000))
	created_at = db.Column(db.DateTime, default=datetime.utcnow)

	def to_dict(self):
		data = {
			'public_key': self.public_key,
			'name': self.name,
			'description': self.description,
		}

		return data

	def get_dashboard_data(self, output_timezone):
		session = Session.object_session(self)

		# Fetch donations
		donations_with_merchants = session.query(MarkedDonation, Merchant)\
			.join(Merchant, MarkedDonation.merchant_public_key == Merchant.public_key)\
			.filter(MarkedDonation.recipient_public_key == self.public_key)\
			.order_by(MarkedDonation.logged_at.desc())\
			.all()
		donations_list = []
		total_donation_amount = 0
		total_donors = 0

		for donation, merchant in donations_with_merchants:
			logged_at_utc = donation.logged_at.replace(tzinfo=ZoneInfo('UTC'))
			logged_at_local = logged_at_utc.astimezone(ZoneInfo(output_timezone))
			date_text = logged_at_local.strftime('%b %-d, %Y %-I:%M %p')

			donations_list.append(
				{
					"donation_amount": donation.donation_amount,
					"merchant_name": merchant.name,
					"donation_type": donation.donation_type,
					"reference": donation.reference,
					"solscan_url": SOLSCAN_TX_BASE_URL + donation.reference,
					"date_time": date_text
				}
			)

			total_donation_amount += donation.donation_amount
			total_donors += 1

		# Compute analytics metrics
		donations_by_merchant = session.query(Merchant.name, func.sum(MarkedDonation.donation_amount)) \
			.join(Merchant, MarkedDonation.merchant_public_key == Merchant.public_key) \
			.filter(MarkedDonation.recipient_public_key == self.public_key) \
			.group_by(Merchant.name)\
			.all()

		donations_by_type = session.query(MarkedDonation.donation_type, func.sum(MarkedDonation.donation_amount)) \
			.filter(MarkedDonation.recipient_public_key == self.public_key) \
			.group_by(MarkedDonation.donation_type)\
			.all()

		donations_by_consumer = session.query(MarkedDonation.consumer_public_key, func.sum(MarkedDonation.donation_amount)) \
			.filter(MarkedDonation.recipient_public_key == self.public_key) \
			.group_by(MarkedDonation.consumer_public_key) \
			.order_by(func.sum(MarkedDonation.donation_amount).desc()) \
			.limit(10)

		donation_volume_daily = session.query(func.date(func.timezone(output_timezone, func.timezone('UTC', MarkedDonation.logged_at))), func.sum(MarkedDonation.donation_amount)) \
			.filter(MarkedDonation.recipient_public_key == self.public_key) \
			.group_by(func.date(func.timezone(output_timezone, func.timezone('UTC', MarkedDonation.logged_at)))) \
			.all()

		donation_volume_daily.sort(key=lambda x: x[0])

		# Fill in dates with zero donations
		if len(donation_volume_daily) > 0:
			first_date = datetime.strptime(str(donation_volume_daily[0][0]), '%Y-%m-%d')
			last_date = datetime.strptime(str(donation_volume_daily[-1][0]), '%Y-%m-%d')
			date_delta = last_date - first_date
			date_range = [first_date + timedelta(days=i) for i in range(date_delta.days+1)]

			donation_volume_daily_dict = {datetime.strftime(date, '%Y-%m-%d'): 0 for date in date_range}
			for d, v in donation_volume_daily:
				donation_volume_daily_dict[str(d)] = v

		analytics_dict = {
			"total_donation_amount": total_donation_amount,
			"total_donors": total_donors,
			"donation_volume_by_merchant": [dict(merchant_name=name, value=value) for name, value in donations_by_merchant],
			"donation_volume_by_type": [dict(type=type, value=value) for type, value in donations_by_type],
			"donation_volume_by_top_donors": [dict(public_key=public_key, value=value) for public_key, value in donations_by_consumer],
			"donation_volume_daily": [dict(date=date, value=value) for date, value in donation_volume_daily_dict.items()]
		}

		return {
			"output_timezone": output_timezone,
			"donations": donations_list,
			"analytics": analytics_dict
		}


class SplitTransactionRequest(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	uuid = db.Column(UUID(as_uuid=True), default=uuid4)
	spl_token = db.Column(db.String(64))
	recipient_public_key = db.Column(db.String(64))
	merchant_public_key = db.Column(db.String(64))
	merchant_amount = db.Column(db.Integer)
	recipient_amount = db.Column(db.Integer)
	reference = db.Column(db.String(64))
	created_at = db.Column(db.DateTime, default=datetime.utcnow)


class MarkedDonation(db.Model):
	id = db.Column(db.BigInteger, primary_key=True)
	uuid = db.Column(UUID(as_uuid=True), default=uuid4)
	reference = db.Column(db.String(64))
	merchant_transaction_id = db.Column(db.String(64))
	donation_type = db.Column(db.String(64))
	donation_amount = db.Column(db.Integer)
	purchase_total = db.Column(db.Integer)
	transaction_total = db.Column(db.Integer)
	merchant_public_key = db.Column(db.String(64))
	consumer_public_key = db.Column(db.String(64))
	recipient_public_key = db.Column(db.String(64))
	logged_at = db.Column(db.DateTime, default=datetime.utcnow)

	def to_dict(self):
		return {c.name: str(getattr(self, c.name)) for c in self.__table__.columns if c.name != "id"}

class Consumer(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	public_key = db.Column(db.String(64))
	created_at = db.Column(db.DateTime, default=datetime.utcnow)

	def get_dashboard_data(self, output_timezone):
		session = Session.object_session(self)

		# Fetch donations
		donations_with_metadata = session.query(MarkedDonation, Merchant, Recipient)\
			.join(Merchant, MarkedDonation.merchant_public_key == Merchant.public_key) \
			.join(Recipient, MarkedDonation.recipient_public_key == Recipient.public_key) \
			.filter(MarkedDonation.consumer_public_key == self.public_key)\
			.order_by(MarkedDonation.logged_at.desc())\
			.all()
		donations_list = []
		total_donation_amount = 0
		donation_amount_ytd = 0

		for donation, merchant, recipient in donations_with_metadata:
			logged_at_utc = donation.logged_at.replace(tzinfo=ZoneInfo('UTC'))
			logged_at_local = logged_at_utc.astimezone(ZoneInfo(output_timezone))
			date_text = logged_at_local.strftime('%b %-d, %Y %-I:%M %p')

			donations_list.append(
				{
					"donation_amount": donation.donation_amount,
					"recipient_name": recipient.name,
					"merchant_name": merchant.name,
					"donation_type": donation.donation_type,
					"reference": donation.reference,
					"solscan_url": SOLSCAN_TX_BASE_URL + donation.reference,
					"date_time": date_text
				}
			)

			total_donation_amount += donation.donation_amount
			if logged_at_local >= datetime(datetime.now().year,1,1).astimezone(ZoneInfo(output_timezone)):
				donation_amount_ytd += donation.donation_amount

		analytics_dict = {
			"total_donation_amount": total_donation_amount,
			"donation_amount_ytd": donation_amount_ytd
		}

		return {
			"output_timezone": output_timezone,
			"donations": donations_list,
			"analytics": analytics_dict
		}