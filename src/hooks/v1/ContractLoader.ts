import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'

import { NetworkContext } from 'contexts/networkContext'
import { V1ContractName } from 'models/v1/contracts'
import { V1Contracts } from 'models/v1/contracts'
import { NetworkName } from 'models/network-name'
import { useContext, useEffect, useState } from 'react'

import { readProvider } from 'constants/readProvider'
import { readNetwork } from 'constants/networks'

export function useContractLoader() {
  const [contracts, setContracts] = useState<V1Contracts>()

  const { signingProvider } = useContext(NetworkContext)

  useEffect(() => {
    async function loadContracts() {
      try {
        const network = readNetwork.name

        // Contracts can be used read-only without a signer, but require a signer to create transactions.
        const signerOrProvider = signingProvider?.getSigner() ?? readProvider

        const newContracts = await Promise.all(
          Object.values(V1ContractName).map(contractName => {
            return loadContract(contractName, network, signerOrProvider)
          }),
        )

        const newContractsMap = Object.values(V1ContractName).reduce(
          (accumulator, contractName, idx) => ({
            ...accumulator,
            [contractName]: newContracts[idx],
          }),
          {} as V1Contracts,
        )

        setContracts(newContractsMap)
      } catch (e) {
        console.log('CONTRACT LOADER ERROR:', e)
      }
    }

    loadContracts()
  }, [signingProvider, setContracts])

  return contracts
}

const loadContract = async (
  contractName: keyof typeof V1ContractName,
  network: NetworkName,
  signerOrProvider: JsonRpcSigner | JsonRpcProvider,
): Promise<Contract | undefined> => {
  /**
   * Conditionally load contracts based on configured network.
   * This prevents ABIs for unused networks being added to our JS bundle.
   */
  const _loadContract = () => {
    if (process.env.REACT_APP_INFURA_NETWORK === 'mainnet') {
      return async () =>
        await import(
          `@jbx-protocol/contracts-v1/deployments/mainnet/${contractName}.json`
        )
    } else if (process.env.REACT_APP_INFURA_NETWORK === 'rinkeby') {
      return async () =>
        await import(
          `@jbx-protocol/contracts-v1/deployments/rinkeby/${contractName}.json`
        )
    }
  }

  const contract = await _loadContract()?.()
  return new Contract(contract.address, contract.abi, signerOrProvider)
}
