import { CasperClient, CLPublicKey, DeployUtil, Signer } from "casper-js-sdk";
import { BigNumber } from "@ethersproject/bignumber";

import { NATIVE_TRANSFER_PAYMENT_AMOUNT, RPC_API } from "../constants";

export const buildTransferDeploy = ({ networkName, fromAddrHex, toAddrHex, amount, id, ttl = 1800000 }:
  {
    networkName: string, // obtained from chainspec
    fromAddrHex: string, // hex representation of senders public key
    toAddrHex: string, // hex representation of receivers public key
    amount: string, // amount of the transfer
    id: string,  // transfer-id which is U64 internaly 
    ttl: number // time to live. default value is  30min
  } ) => {
  // transfer_id field in the request to tag the transaction and to correlate it to your back-end storage
  const transferId = parseInt(id);

  // create public keys from account-address (in fact it is hex representation of public-key with added prefix)
  const fromPublicKey = CLPublicKey.fromHex(fromAddrHex);
  const toPublicKey = CLPublicKey.fromHex(toAddrHex);

  // header creation
  const deployParams = new DeployUtil.DeployParams(
    fromPublicKey,
    networkName,
    ttl
  );

  // session creation
  const session = DeployUtil.ExecutableDeployItem.newTransfer(
    amount,
    toPublicKey,
    null,
    id
  );

  // for native transfers payment amount is fixed value stored in const.
  const payment = DeployUtil.standardPayment(NATIVE_TRANSFER_PAYMENT_AMOUNT);

  // deploy is created here
  const deploy = DeployUtil.makeDeploy(deployParams, session, payment);

  // returning deploy in JSON format
  return DeployUtil.deployToJson(deploy);
}

export const getActivePublicKey = async () => await Signer.getActivePublicKey()

export const sendTransferDeploy = (deployJson) => {
  const deploy = DeployUtil.deployFromJson(deployJson);
  const client = new CasperClient(RPC_API);
  return client.putDeploy(deploy);
};
