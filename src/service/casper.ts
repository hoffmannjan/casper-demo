import { CasperClient, CLPublicKey, DeployUtil, Signer } from "casper-js-sdk";
import { BigNumber } from "@ethersproject/bignumber";

import { NATIVE_TRANSFER_PAYMENT_AMOUNT, RPC_API } from "../constants";

export const buildTransferDeploy = ({ networkName, from, to, amount, id, ttl = 1800000 }:
  {
    networkName: string, 
    from: string, 
    to: string, 
    amount: string, 
    id: string, 
    ttl: number 
  } ) => {
  // transfer_id field in the request to tag the transaction and to correlate it to your back-end storage
  const transferId = BigNumber.from(id);

  const fromPublicKey = CLPublicKey.fromHex(from);

  const deployParams = new DeployUtil.DeployParams(
    fromPublicKey,
    networkName,
    ttl
  );

  // we create public key from account-address (in fact it is hex representation of public-key with added prefix)
  const toPublicKey = CLPublicKey.fromHex(to);

  const session = DeployUtil.ExecutableDeployItem.newTransfer(
    amount,
    toPublicKey,
    null,
    id
  );

  // For native transfers payment amount is fixed value stored in const.
  const payment = DeployUtil.standardPayment(NATIVE_TRANSFER_PAYMENT_AMOUNT);

  const deploy = DeployUtil.makeDeploy(deployParams, session, payment);

  const jsonFromDeploy = DeployUtil.deployToJson(deploy);

  return jsonFromDeploy;
}

export const getActivePublicKey = async () => {
  const key = await Signer.getActivePublicKey()
  return key;
};

export const sendTransferDeploy = (deployJson) => {
  const deploy = DeployUtil.deployFromJson(deployJson);
  const client = new CasperClient(RPC_API);
  return client.putDeploy(deploy);
};
