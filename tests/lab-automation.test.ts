import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'lab-automation': {
      functions: {
        'create-experiment': vi.fn(),
        'update-experiment-status': vi.fn(),
        'submit-experiment-results': vi.fn(),
        'get-experiment': vi.fn(),
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

describe('Lab Automation Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('create-experiment', () => {
    it('should create an experiment successfully', async () => {
      const constructId = 1
      const protocol = 'Test protocol for experiment'
      mockClarity.contracts['lab-automation'].functions['create-experiment'].mockReturnValue({ success: true, value: 1 })
      
      const result = await callContract('lab-automation', 'create-experiment', [constructId, protocol])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(1)
    })
  })
  
  describe('update-experiment-status', () => {
    it('should update experiment status successfully', async () => {
      const experimentId = 1
      const newStatus = 'in-progress'
      mockClarity.contracts['lab-automation'].functions['update-experiment-status'].mockReturnValue({ success: true })
      
      const result = await callContract('lab-automation', 'update-experiment-status', [experimentId, newStatus])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail to update status if not the researcher', async () => {
      const experimentId = 1
      const newStatus = 'in-progress'
      mockClarity.contracts['lab-automation'].functions['update-experiment-status'].mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('lab-automation', 'update-experiment-status', [experimentId, newStatus])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
  
  describe('submit-experiment-results', () => {
    it('should submit experiment results successfully', async () => {
      const experimentId = 1
      const results = 'Experiment results data'
      mockClarity.contracts['lab-automation'].functions['submit-experiment-results'].mockReturnValue({ success: true })
      
      const result = await callContract('lab-automation', 'submit-experiment-results', [experimentId, results])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail to submit results if not the researcher', async () => {
      const experimentId = 1
      const results = 'Experiment results data'
      mockClarity.contracts['lab-automation'].functions['submit-experiment-results'].mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('lab-automation', 'submit-experiment-results', [experimentId, results])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
  
  describe('get-experiment', () => {
    it('should retrieve experiment data successfully', async () => {
      const experimentId = 1
      const experimentData = {
        construct_id: 1,
        researcher: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        protocol: 'Test protocol for experiment',
        status: 'pending',
        results: null
      }
      mockClarity.contracts['lab-automation'].functions['get-experiment'].mockReturnValue(experimentData)
      
      const result = await callContract('lab-automation', 'get-experiment', [experimentId])
      
      expect(result).toEqual(experimentData)
    })
    
    it('should return undefined for non-existent experiment', async () => {
      const experimentId = 999
      mockClarity.contracts['lab-automation'].functions['get-experiment'].mockReturnValue(undefined)
      
      const result = await callContract('lab-automation', 'get-experiment', [experimentId])
      
      expect(result).toBeUndefined()
    })
  })
})

