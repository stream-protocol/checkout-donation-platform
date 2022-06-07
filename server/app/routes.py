from flask import *
from app import app
from app.models import *
from math import ceil

from spl.token.constants import TOKEN_PROGRAM_ID
from spl.token.instructions import transfer_checked, TransferCheckedParams, get_associated_token_address

from solana.keypair import Keypair
from solana.transaction import Transaction
from solana.publickey import PublicKey

from urllib.parse import quote
from constants import *

@app.route('/', methods=["GET"])
def index():
	return "Welcome!"

@app.route('/api/merchants/<public_key>/donation-configs', methods=["GET", "PUT"])
def merchant_info(public_key):
	if request.method == "GET":
		if public_key is None:
			return {"message": "No public_key provided"}, 400
		merchant = db.session.query(Merchant).filter_by(public_key=public_key).first()

		if merchant is None:
			return {"message": "Merchant does not exist for provided public_key"}, 404

		configs_template = merchant.donation_configs
		if not configs_template:
			return {}, 200

		return configs_template, 200

	elif request.method == "PUT":
		if public_key is None:
			return {"message": "No public_key provided"}, 400

		merchant = db.session.query(Merchant).filter_by(public_key=public_key).first()

		if merchant is None:
			return {"message": "Merchant does not exist for provided public_key"}, 404
		if merchant is not None:
			if request.json.get('donation_configs') is not None:
				merchant.donation_configs = request.json['donation_configs']
				db.session.commit()
				return {}, 200
			else:
				return {"message": "No donation_configs provided"}, 400

@app.route('/api/merchants/<public_key>/donation-configs/active', methods=["GET"])
def get_active_donation_config(public_key):
	if request.method == "GET":
		if public_key is None:
			return {"message": "No public_key provided"}, 400
		merchant = db.session.query(Merchant).filter_by(public_key=public_key).first()

		if merchant is None:
			return {"message": "Merchant does not exist for provided public_key"}, 404

		configs_template = merchant.donation_configs
		if not configs_template:
			return {}, 200

		if 'active_config' in configs_template.keys():
			for option in configs_template['active_config']['options']:
				# Update donation amount, purchase amount, and total amount as necessary
				purchase_amount = request.args.get('purchase_amount')
				if purchase_amount:
					purchase_amount = int(purchase_amount)
					option['purchase_cents'] = purchase_amount

					if option['type'] == 'roundup':
						transaction_amount = ceil(purchase_amount / 100) * 100
						option['transaction_cents'] = transaction_amount
						option['donation_cents'] = transaction_amount - purchase_amount
					elif option['type'] in {'fixed', 'input'}:
						option['transaction_cents'] = purchase_amount + option['donation_cents']

				# Load refreshed recipient object
				recipient = db.session.query(Recipient).filter_by(public_key=option['recipient']['public_key']).first()
				if recipient is not None:
					option['recipient'] = recipient.to_dict()

					# Create donation_transfer_request object
					donation_recipient = option['recipient']['public_key']
					amount = option['donation_cents'] * 0.01
					spl_token = USDC_SPL_ADDRESS
					reference = str(Keypair().public_key)
					label = quote('Confirm donation to {}'.format(recipient.name))
					message = quote('Donation of {} to {}'.format(str(amount) + ' USDC', recipient.name))

					option['donation_transfer_request'] = {
						'recipient': donation_recipient,
						'amount': amount,
						'spl_token': spl_token,
						'reference': reference,
						'label': label,
						'message': message
					}

					option['donation_transfer_request']['url'] = \
						'solana:' + donation_recipient \
						+ '?amount=' + str(amount) \
						+ '&spl-token=' + spl_token \
						+ '&label=' + label \
						+ '&message=' + message \
						+ '&reference=' + reference

					# Create donation_transaction_request object
					split_transaction_request = SplitTransactionRequest(
						spl_token=spl_token,
						recipient_public_key=donation_recipient,
						merchant_public_key=public_key,
						merchant_amount=option['purchase_cents'],
						recipient_amount=option['donation_cents'],
						reference=reference
					)

					db.session.add(split_transaction_request)
					db.session.commit()

					link = app.config["APP_BASE_URL"] + url_for('create_interactive_transaction', uuid=split_transaction_request.uuid)
					label = quote('Confirm purchase including donation to {}').format(recipient.name)
					message = quote('Your purchase includes a {} donation to {}'.format(str(amount) + ' USDC', recipient.name))

					option['donation_transaction_request'] = {
						'link': link,
						'label': label,
						'message': message
					}

					option['donation_transaction_request']['url'] = \
						'solana:' + link \
						+ '&label=' + label \
						+ '&message=' + message
				else:
					return {"message": "No recipient found for active config"}, 400

		return configs_template['active_config'], 200

@app.route('/api/interactive-transactions', methods=["POST"])
def create_interactive_transaction():
	if request.method == "POST":
		uuid = request.args.get('uuid')
		if not uuid:
			return {"message": "Required param uuid not provided"}, 400

		body = request.get_json()
		if not body:
			return {"message": "Request body not provided"}, 400

		account = body.get('account')
		if not account:
			return {"message": "account not in request body"}, 400

		split_transaction_request = db.session.query(SplitTransactionRequest).filter_by(uuid=uuid).first()
		if split_transaction_request:
			# Create Solana transaction with 2 transfers to merchant and recipient respectively
			transaction = Transaction()
			transaction.add(
				transfer_checked(
					TransferCheckedParams(
						program_id=TOKEN_PROGRAM_ID,
						source=get_associated_token_address(PublicKey(account), PublicKey(split_transaction_request.spl_token)),
						mint=PublicKey(split_transaction_request.spl_token),
						dest=get_associated_token_address(PublicKey(split_transaction_request.merchant_public_key), PublicKey(split_transaction_request.spl_token)),
						owner=PublicKey(account),
						amount=split_transaction_request.merchant_amount * 10000,
					 	decimals=6,
						signers=[]
					)
				)
			)
			transaction.add(
				transfer_checked(
					TransferCheckedParams(
						program_id=TOKEN_PROGRAM_ID,
						source=get_associated_token_address(PublicKey(account), PublicKey(split_transaction_request.spl_token)),
						mint=PublicKey(split_transaction_request.spl_token),
						dest=get_associated_token_address(PublicKey(split_transaction_request.recipient_public_key), PublicKey(split_transaction_request.spl_token)),
						owner=PublicKey(account),
						amount=split_transaction_request.recipient_amount * 10000,
					 	decimals=6,
						signers=[]
					)
				)
			)

			return {"transaction": transaction.serialize()}, 201

		return {"message": "Link with provided uuid not found"}, 404

@app.route('/api/marked-donations/<uuid>', methods=["GET"])
def get_marked_donation(uuid):
	if request.method == "GET":
		marked_donation = db.session.query(MarkedDonation).filter_by(uuid=uuid).first()
		if marked_donation:
			return jsonify(marked_donation.to_dict()), 200

		return {"message": "Donation with provided uuid not found"}, 404

@app.route('/api/marked-donations', methods=["POST"])
def mark_donation_complete():
	if request.method == "POST":
		body = request.get_json()

		if body:
			merchant_public_key = body.get('merchant_public_key')
			consumer_public_key = body.get('consumer_public_key')
			merchant_transaction_id = body.get('merchant_transaction_id')
			selected_donation_option = body.get('selected_donation_option')

			if merchant_public_key and selected_donation_option:
				marked_donation = MarkedDonation(
					reference=selected_donation_option['donation_transfer']['reference'],
					merchant_transaction_id=merchant_transaction_id,
					donation_type=selected_donation_option['type'],
					donation_amount=selected_donation_option['donation_cents'],
					purchase_total=selected_donation_option['purchase_cents'],
					transaction_total=selected_donation_option['transaction_cents'],
					merchant_public_key=merchant_public_key,
					consumer_public_key=consumer_public_key,
					recipient_public_key=selected_donation_option['recipient']['public_key']
				)
				db.session.add(marked_donation)
				db.session.commit()

				response = jsonify(marked_donation.to_dict())
				response.status_code = 201
				response.headers['Location'] = app.config["APP_BASE_URL"] + url_for('get_marked_donation', uuid=marked_donation.uuid)
				return response

			elif not merchant_public_key:
				return {"message": "No merchant_public_key provided"}, 400
			else:
				return {"message": "No selected_donation_option provided"}, 400

		return {"message": "No JSON body provided"}, 400

@app.route('/api/merchants/<public_key>/dashboard', methods=["GET"])
def get_merchant_dashboard_data(public_key):
	if request.method == "GET":
		output_timezone = request.args.get("output_timezone", "America/Los_Angeles")

		if public_key is None:
			return {"message": "No public_key provided"}, 400
		merchant = db.session.query(Merchant).filter_by(public_key=public_key).first()

		if merchant is None:
			return {"message": "Merchant does not exist for provided public_key"}, 404

		# Compute dashboard JSON
		dashboard_json = merchant.get_dashboard_data(output_timezone)

		return dashboard_json, 200

@app.route('/api/recipients/<public_key>/dashboard', methods=["GET"])
def get_recipient_dashboard_data(public_key):
	if request.method == "GET":
		output_timezone = request.args.get("output_timezone", "America/Los_Angeles")

		if public_key is None:
			return {"message": "No public_key provided"}, 400
		recipient = db.session.query(Recipient).filter_by(public_key=public_key).first()

		if recipient is None:
			return {"message": "Recipient does not exist for provided public_key"}, 404

		# Compute dashboard JSON
		dashboard_json = recipient.get_dashboard_data(output_timezone)

		return dashboard_json, 200

@app.route('/api/consumers/<public_key>/dashboard', methods=["GET"])
def get_consumer_dashboard_data(public_key):
	if request.method == "GET":
		output_timezone = request.args.get("output_timezone", "America/Los_Angeles")

		if public_key is None:
			return {"message": "No public_key provided"}, 400
		consumer = db.session.query(Consumer).filter_by(public_key=public_key).first()

		if consumer is None:
			return {"message": "Consumer does not exist for provided public_key"}, 404

		# Compute dashboard JSON
		dashboard_json = consumer.get_dashboard_data(output_timezone)

		return dashboard_json, 200