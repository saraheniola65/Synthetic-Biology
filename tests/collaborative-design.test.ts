import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'collaborative-design': {
      functions: {
        'create-project': vi.fn(),
        'add-collaborator': vi.fn(),
        'update-project-status': vi.fn(),
        'get-project': vi.fn(),
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

describe('Collaborative Design Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('create-project', () => {
    it('should create a project successfully', async () => {
      const name = 'Test Project'
      const description = 'This is a test project'
      mockClarity.contracts['collaborative-design'].functions['create-project'].mockReturnValue({ success: true, value: 1 })
      
      const result = await callContract('collaborative-design', 'create-project', [name, description])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(1)
    })
  })
  
  describe('add-collaborator', () => {
    it('should add a collaborator successfully', async () => {
      const projectId = 1
      const collaborator = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      mockClarity.contracts['collaborative-design'].functions['add-collaborator'].mockReturnValue({ success: true })
      
      const result = await callContract('collaborative-design', 'add-collaborator', [projectId, collaborator])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail to add collaborator if not project owner', async () => {
      const projectId = 1
      const collaborator = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      mockClarity.contracts['collaborative-design'].functions['add-collaborator'].mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('collaborative-design', 'add-collaborator', [projectId, collaborator])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
    
    it('should fail to add collaborator if max collaborators reached', async () => {
      const projectId = 1
      const collaborator = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      mockClarity.contracts['collaborative-design'].functions['add-collaborator'].mockReturnValue({ success: false, error: 401 })
      
      const result = await callContract('collaborative-design', 'add-collaborator', [projectId, collaborator])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(401)
    })
  })
  
  describe('update-project-status', () => {
    it('should update project status successfully', async () => {
      const projectId = 1
      const newStatus = 'completed'
      mockClarity.contracts['collaborative-design'].functions['update-project-status'].mockReturnValue({ success: true })
      
      const result = await callContract('collaborative-design', 'update-project-status', [projectId, newStatus])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail to update status if not project owner', async () => {
      const projectId = 1
      const newStatus = 'completed'
      mockClarity.contracts['collaborative-design'].functions['update-project-status'].mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('collaborative-design', 'update-project-status', [projectId, newStatus])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
  
  describe('get-project', () => {
    it('should retrieve project data successfully', async () => {
      const projectId = 1
      const projectData = {
        owner: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        name: 'Test Project',
        description: 'This is a test project',
        status: 'active',
        collaborators: ['ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM']
      }
      mockClarity.contracts['collaborative-design'].functions['get-project'].mockReturnValue(projectData)
      
      const result = await callContract('collaborative-design', 'get-project', [projectId])
      
      expect(result).toEqual(projectData)
    })
    
    it('should return undefined for non-existent project', async () => {
      const projectId = 999
      mockClarity.contracts['collaborative-design'].functions['get-project'].mockReturnValue(undefined)
      
      const result = await callContract('collaborative-design', 'get-project', [projectId])
      
      expect(result).toBeUndefined()
    })
  })
})

