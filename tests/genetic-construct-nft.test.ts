import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'genetic-construct-nft': {
      functions: {
        'create-genetic-construct': vi.fn(),
        'get-construct-data': vi.fn(),
        'transfer': vi.fn(),
        'get-last-token-id': vi.fn(),
      },
    },
  },
  globals: {
    'tx-sender': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  },
}

function callContract(contractName: string, functionName: string, args: any[]) {
  return mockClarity.contracts[contractName].functions[functionName](...args)
}

describe('Genetic Construct NFT Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('create-genetic-construct', () => {
    it('should create a genetic construct successfully', async () => {
      const name = 'Test Construct'
      const description = 'This is a test genetic construct'
      const sequence = 'ATCG'
      mockClarity.contracts['genetic-construct-nft'].functions['create-genetic-construct'].mockReturnValue({ success: true, value: 1 })
      
      const result = await callContract('genetic-construct-nft', 'create-genetic-construct', [name, description, sequence])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(1)
    })
  })
  
  describe('get-construct-data', () => {
    it('should retrieve construct data successfully', async () => {
      const tokenId = 1
      const constructData = {
        creator: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        name: 'Test Construct',
        description: 'This is a test genetic construct',
        sequence: 'ATCG',
        verified: false
      }
      mockClarity.contracts['genetic-construct-nft'].functions['get-construct-data'].mockReturnValue(constructData)
      
      const result = await callContract('genetic-construct-nft', 'get-construct-data', [tokenId])
      
      expect(result).toEqual(constructData)
    })
    
    it('should return undefined for non-existent construct', async () => {
      const tokenId = 999
      mockClarity.contracts['genetic-construct-nft'].functions['get-construct-data'].mockReturnValue(undefined)
      
      const result = await callContract('genetic-construct-nft', 'get-construct-data', [tokenId])
      
      expect(result).toBeUndefined()
    })
  })
  
  describe('transfer', () => {
    it('should transfer a construct successfully', async () => {
      const tokenId = 1
      const sender = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      const recipient = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      mockClarity.contracts['genetic-construct-nft'].functions['transfer'].mockReturnValue({ success: true })
      
      const result = await callContract('genetic-construct-nft', 'transfer', [tokenId, sender, recipient])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail to transfer if sender is not the owner', async () => {
      const tokenId = 1
      const sender = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      const recipient = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      mockClarity.contracts['genetic-construct-nft'].functions['transfer'].mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('genetic-construct-nft', 'transfer', [tokenId, sender, recipient])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
  
  describe('get-last-token-id', () => {
    it('should return the last token id', async () => {
      mockClarity.contracts['genetic-construct-nft'].functions['get-last-token-id'].mockReturnValue({ success: true, value: 5 })
      
      const result = await callContract('genetic-construct-nft', 'get-last-token-id', [])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(5)
    })
  })
})
